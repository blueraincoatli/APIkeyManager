import { useMemo, useState, useEffect } from "react";
import { apiKeyService, batchImportService } from "../../services/apiKeyService";
import { useApiToast } from "../../hooks/useToast";
import { validateApiKeyFormat, normalizeApiKey } from "../../services/inputValidation";
import { parseExcelFile, isValidExcelFile, generateExcelTemplate } from "../../services/excelService";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./AddApiKeyDialog.css";
import "../SearchResults/SearchResults.css"; // 导入SearchResults的CSS以使用模态对话框样式

// 检测是否在Tauri环境中（兼容 v1/v2）
const isTauri = typeof window !== 'undefined' && (
  '__TAURI__' in window ||
  '__TAURI_INTERNALS__' in window ||
  (typeof window !== 'undefined' && window.location?.protocol === 'tauri:')
);

// 条件导入Tauri插件，在非Tauri环境中提供降级方案
let tauriDialog: {
  open: (options: { filters: Array<{ name: string; extensions: string[] }>; multiple?: boolean }) => Promise<string | string[] | null>;
  save: (options: { filters: Array<{ name: string; extensions: string[] }>; defaultPath?: string }) => Promise<string | null>;
} | null = null;
let tauriFs: {
  readBinaryFile: (path: string) => Promise<Uint8Array>;
  writeBinaryFile: (path: string, data: Uint8Array) => Promise<void>;
} | null = null;
let tauriPath: {
  downloadDir: () => Promise<string>;
} | null = null;

if (isTauri) {
  // 在Tauri环境中尽量使用可用的全局API（兼容 v1/v2）
  if ((window as any).__TAURI__) {
    tauriDialog = (window as any).__TAURI__.dialog;
    tauriFs = (window as any).__TAURI__.fs;
    tauriPath = (window as any).__TAURI__.path;
    console.log('Tauri global APIs available in desktop environment');
  } else {
    // v2 场景下没有 __TAURI__，但可以通过 @tauri-apps/api 的模块访问，或直接使用 invoke
    console.log('Tauri v2 detected (no __TAURI__ global). Will use @tauri-apps/api and invoke bridge.');
  }
} else {
  console.warn('Tauri plugins not available, using fallback implementations');
}

// 定义API Key模板类型
interface ApiKeyTemplate {
  name: string;
  keyValue: string;
  platform: string;
  description: string;
}

interface AddApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void; // 可选：回调刷新列表/结果
}

// 模态对话框类型定义
interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onConfirm?: () => void;
}

export function AddApiKeyDialog({ open, onClose, onAdded }: AddApiKeyDialogProps) {
  const toast = useApiToast();
  const [name, setName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ name?: boolean; key?: boolean }>({});
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [downloadedFilePath, setDownloadedFilePath] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  // 创建预览窗口的函数
  const createPreviewWindow = async (data: ApiKeyTemplate[]) => {
    console.log('createPreviewWindow called with data:', data);
    console.log('isTauri:', isTauri);
    console.log('window.__TAURI__:', typeof window !== 'undefined' ? window.__TAURI__ : 'undefined');
    console.log('window.__TAURI_INTERNALS__:', typeof window !== 'undefined' ? window.__TAURI_INTERNALS__ : 'undefined');
    console.log('window object:', typeof window);

    // 更准确的Tauri环境检测 - 检查 __TAURI_INTERNALS__ 或 invoke 函数
    const isActuallyTauri = typeof window !== 'undefined' && (
      (window.__TAURI__ && typeof window.__TAURI__.core !== 'undefined') ||
      (window.__TAURI_INTERNALS__) ||
      (typeof invoke === 'function')
    );

    console.log('isActuallyTauri:', isActuallyTauri);

    if (!isActuallyTauri) {
      console.warn('Not in Tauri environment, cannot create preview window');
      console.log('Available window properties:', typeof window !== 'undefined' ? Object.keys(window).filter(k => k.includes('TAURI') || k.includes('tauri')) : 'no window');

      // 使用统一的模态框样式显示错误
      setModal({
        isOpen: true,
        type: 'error',
        title: '预览功能不可用',
        message: '请在Tauri桌面环境中使用此功能'
      });
      return;
    }

    try {
      const dataJson = JSON.stringify(data);
      console.log('Invoking create_preview_window with data:', dataJson);

      // 使用更安全的invoke调用
      if (typeof invoke === 'function') {
        await invoke('create_preview_window', { previewData: dataJson });
        console.log('create_preview_window invoked successfully');
      } else if (window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke) {
        await window.__TAURI__.core.invoke('create_preview_window', { previewData: dataJson });
        console.log('create_preview_window invoked successfully via window.__TAURI__.core');
      } else {
        throw new Error('Tauri invoke function not available');
      }
    } catch (error) {
      console.error('Failed to create preview window:', error);
      // 使用统一的模态框样式显示错误
      setModal({
        isOpen: true,
        type: 'error',
        title: '无法创建预览窗口',
        message: `错误: ${error}`
      });
    }
  };

  // 监听来自预览窗口的确认导入事件
  useEffect(() => {
    if (!isTauri) return;

    console.log('[BatchImport] attaching confirm-import listener');
    const unlisten = listen('confirm-import', async (event: any) => {
      try {
        let importData: ApiKeyTemplate[] = [];
        const payload = event.payload;
        if (typeof payload === 'string') {
          try {
            importData = JSON.parse(payload);
          } catch (e) {
            console.error('Failed to parse confirm-import payload:', e);
            importData = [] as any;
          }
        } else {
          importData = payload as ApiKeyTemplate[];
        }

        console.log('[BatchImport] confirm-import received, items:', Array.isArray(importData) ? importData.length : 'N/A');

        // 使用批量导入服务
        const batchKeys = importData.map(item => ({
          name: item.name,
          keyValue: item.keyValue,
          platform: item.platform,
          description: item.description
        }));

        const result = await batchImportService.importApiKeysBatch(batchKeys);

        if (result.success && result.data) {
          setModal({
            isOpen: true,
            type: 'success',
            title: '导入成功',
            message: `成功导入 ${result.data.succeeded} 个API Key${result.data.failed > 0 ? `，失败 ${result.data.failed} 个` : ''}`,
            onConfirm: () => {
              setModal(null);
              onAdded?.();
            }
          });
        } else {
          setModal({
            isOpen: true,
            type: 'error',
            title: '导入失败',
            message: result.error?.message || '无法导入API Keys'
          });
        }
      } catch (error: any) {
        console.error('导入失败:', error);
        setModal({
          isOpen: true,
          type: 'error',
          title: '导入失败',
          message: error.message || '导入过程中发生错误'
        });
      }
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [onAdded, toast]);

  // 表单验证
  const errors = useMemo(() => {
    const errs: { name?: string; key?: string } = {};
    if (!name.trim()) errs.name = "名称不能为空";
    const normalized = normalizeApiKey(keyValue);
    if (!normalized) errs.key = "API Key 不能为空";
    else if (!validateApiKeyFormat(normalized)) errs.key = "API Key 格式不合法";
    return errs;
  }, [name, keyValue]);

  const handleFileSelect = async () => {
    try {
      console.log('File select clicked, isTauri:', isTauri, 'tauriDialog:', !!tauriDialog);
      
      if (!isTauri || !tauriDialog) {
        console.log('Using fallback file selection');
        // 非Tauri环境下的降级方案
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls';
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          console.log('File selected:', file?.name, file?.type, file?.size);

          if (file) {
            // 验证文件格式
            if (!isValidExcelFile(file)) {
              console.error('Invalid file format:', file.name, file.type);
              setModal({
                isOpen: true,
                type: 'error',
                title: '文件格式错误',
                message: '请选择Excel文件(.xlsx或.xls)'
              });
              return;
            }

            console.log('File format valid, starting to parse...');

            try {
              // 解析Excel文件
              const parseResult = await parseExcelFile(file);
              console.log('Parse result:', parseResult);

              if (parseResult.success && parseResult.data) {
                console.log('Parsed data:', parseResult.data);

                // 转换数据格式
                const apiKeyData: ApiKeyTemplate[] = parseResult.data.map(item => ({
                  name: item.name,
                  keyValue: item.keyValue,
                  platform: item.platform,
                  description: item.description
                }));

                console.log('Converted data:', apiKeyData);
                console.log('Creating preview window...');

                // 直接创建独立预览窗口
                await createPreviewWindow(apiKeyData);
                console.log('Preview window creation completed');
              } else {
                console.error('Parse failed:', parseResult.error);
                setModal({
                  isOpen: true,
                  type: 'error',
                  title: 'Excel解析失败',
                  message: parseResult.error || '无法解析Excel文件'
                });
              }
            } catch (error: any) {
              console.error('Excel解析错误:', error);
              setModal({
                isOpen: true,
                type: 'error',
                title: 'Excel解析失败',
                message: error.message || '解析过程中发生错误'
              });
            }
          }
        };
        input.click();
        return;
      }

      console.log('Using Tauri file dialog');
      // Tauri环境下的实现
      const filePath = await tauriDialog.open({
        filters: [{
          name: 'Excel Files',
          extensions: ['xlsx', 'xls']
        }],
        multiple: false
      });

      if (filePath && typeof filePath === 'string') {
        console.log('Tauri file selected:', filePath);

        // 验证文件格式
        if (!isValidExcelFile(filePath)) {
          console.error('Invalid file format:', filePath);
          setModal({
            isOpen: true,
            type: 'error',
            title: '文件格式错误',
            message: '请选择Excel文件(.xlsx或.xls)'
          });
          return;
        }

        console.log('File format valid, starting to parse...');

        try {
          // 解析Excel文件
          const parseResult = await parseExcelFile(filePath);
          console.log('Parse result:', parseResult);

          if (parseResult.success && parseResult.data) {
            console.log('Parsed data:', parseResult.data);

            // 转换数据格式
            const apiKeyData: ApiKeyTemplate[] = parseResult.data.map(item => ({
              name: item.name,
              keyValue: item.keyValue,
              platform: item.platform,
              description: item.description
            }));

            console.log('Converted data:', apiKeyData);
            console.log('Creating preview window...');

            // 直接创建独立预览窗口
            await createPreviewWindow(apiKeyData);
            console.log('Preview window creation completed');
          } else {
            console.error('Parse failed:', parseResult.error);
            setModal({
              isOpen: true,
              type: 'error',
              title: 'Excel解析失败',
              message: parseResult.error || '无法解析Excel文件'
            });
          }
        } catch (error: any) {
          console.error('Excel解析错误:', error);
          setModal({
            isOpen: true,
            type: 'error',
            title: 'Excel解析失败',
            message: error.message || '解析过程中发生错误'
          });
        }
      }
    } catch (error: any) {
      console.error('文件选择失败:', error);
      // 更准确的错误信息
      if (error.message?.includes('invoke') || error.message?.includes('plugin')) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Tauri插件未初始化',
          message: '请确保在Tauri桌面环境中运行'
        });
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: '文件选择失败',
          message: error.message || '无法打开文件对话框'
        });
      }
    }
  };



  // 共享的容器组件
  /*
  const DialogContainer = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <div className="add-api-key-dialog-container">
      <div className="add-api-key-dialog-overlay" onClick={onClose} />
      {children}
    </div>
  );

  */



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.name || errors.key) {
      setTouched({ name: true, key: true });
      return;
    }
    setSubmitting(true);
    const res = await apiKeyService.addApiKey({ name, keyValue, platform, description });
    setSubmitting(false);
    if (res.success) {
      setModal({
        isOpen: true,
        type: 'success',
        title: '新增成功',
        message: `${name} 已添加到系统中`,
        onConfirm: () => {
          setModal(null);
          onAdded?.();
          onClose();
          setName(""); setKeyValue(""); setPlatform(""); setDescription("");
        }
      });
    } else {
      setModal({
        isOpen: true,
        type: 'error',
        title: '新增失败',
        message: res.error?.message || '无法添加API Key'
      });
    }
  };

  const handleBatchImport = () => {
    // 切换到批量导入面板
    setShowBatchImport(true);
    // 重置下载文件路径
    setDownloadedFilePath(null);
  };

  const handleBackToSingle = () => {
    // 返回单个添加面板
    setShowBatchImport(false);
    // 清除下载文件路径
    setDownloadedFilePath(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      console.log('Download template clicked, isTauri:', isTauri, 'tauriDialog:', !!tauriDialog);
      
      let filePath: string | null = null;
      let fileName = 'api_key_template.xlsx';
      
      if (!isTauri || !tauriDialog || !tauriFs || !tauriPath) {
        // 非Tauri环境下的降级方案 - 生成Excel模板
        const templateData = generateExcelTemplate();
        const blob = new Blob([templateData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // 在非Tauri环境下，显示下载到浏览器的通知
        toast.success('模板下载成功', '文件已下载到浏览器默认下载位置');
        return;
      }

      // Tauri环境下的实现
      const downloadPath = await tauriPath.downloadDir();
      
      // 弹出保存对话框，让用户选择保存位置
      filePath = await tauriDialog.save({
        filters: [{
          name: 'Excel Files',
          extensions: ['xlsx']
        }],
        defaultPath: `${downloadPath}/${fileName}`
      });
      
      if (filePath) {
        // 生成Excel模板内容
        const templateContent = generateExcelTemplate();

        // 写入到用户选择的位置
        await tauriFs.writeBinaryFile(filePath, templateContent);
        
        // 保存文件路径用于后续打开
        setDownloadedFilePath(filePath);
        
        // 获取文件名用于显示
        const pathParts = filePath.split(/[/\\]/);
        const savedFileName = pathParts[pathParts.length - 1];
        
        // 显示更友好的通知，包含文件打开功能
        toast.success('📁 模板下载成功', `Excel模板文件 "${savedFileName}" 已保存到您的下载文件夹`);
      }
    } catch (error: any) {
      console.error('下载模板失败:', error);
      setDownloadedFilePath(null);
      // 更准确的错误信息
      if (error.message?.includes('invoke') || error.message?.includes('plugin')) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Tauri插件未初始化',
          message: '请确保在Tauri桌面环境中运行'
        });
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: '下载失败',
          message: error.message || '模板下载过程中发生错误'
        });
      }
    }
  };

  // 打开下载的文件
  const handleOpenFile = async (filePath: string) => {
    try {
      // 简单地通知用户文件已保存，不实际打开文件
      toast.info('提示', `文件已保存到: ${filePath}`);
    } catch (error) {
      console.error('打开文件失败:', error);
      setModal({
        isOpen: true,
        type: 'error',
        title: '打开文件失败',
        message: '无法打开下载的文件'
      });
    }
  };

  if (!open) {
    // 清理下载文件路径状态
    if (downloadedFilePath) {
      setDownloadedFilePath(null);
    }
    return null;
  }

  return (
    <>
      <div className="add-api-key-dialog-container">
        <div className="add-api-key-dialog-overlay" onClick={onClose} />
        <div
          className="add-api-key-dialog-panel"
        >
          <form
            onSubmit={handleSubmit}
            className="add-api-key-dialog-form"
          >
            {showBatchImport ? (
            // 批量导入说明面板
            <>
              <h5 className="add-api-key-dialog-title">批量导入API Key</h5>
              <div className="add-api-key-batch-section">
                <div className="add-api-key-batch-info">
                  <p className="add-api-key-batch-info-text">
                    请下载模板文件，按照格式填写API Key信息后上传
                  </p>
                </div>
                
                <div className="add-api-key-batch-buttons">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="add-api-key-file-button primary"
                  >
                    下载模板
                  </button>
                  
                  {/* 下载文件路径显示 */}
                  {downloadedFilePath && (
                    <div className="add-api-key-file-info">
                      <div className="add-api-key-file-info-header">
                        <div className="flex items-center">
                          <span className="text-green-600 dark:text-green-400 mr-2">📁</span>
                          <p className="add-api-key-file-name truncate">
                            {downloadedFilePath.split(/[/\\]/).pop()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenFile(downloadedFilePath)}
                          className="add-api-key-open-file-button"
                        >
                          📋 打开文件
                        </button>
                      </div>
                      <p className="add-api-key-file-status">
                        已保存到下载文件夹
                      </p>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    className="add-api-key-file-button"
                  >
                    选择Excel文件
                  </button>
                </div>
                
                <div className="add-api-key-batch-info">
                  <p className="add-api-key-file-support-info">
                    支持的格式：Excel文件 (.xlsx)<br/>
                    需包含列：名称 | API Key | 提供商 | 描述
                  </p>
                </div>
              </div>
              
              <div className="add-api-key-button-group">
                <div className="add-api-key-button-container two-buttons">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleBackToSingle}
                      className="add-api-key-button"
                    >
                      返回
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={onClose}
                      className="add-api-key-button"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // 单个添加API Key表单
            <>
              <h5 className="add-api-key-dialog-title">新增API Key</h5>
              <div className="add-api-key-form-section">
                <div className="add-api-key-form-group">
                  <label className="add-api-key-form-label">名称</label>
                  <input
                    type="text"
                    placeholder="请输入API Key名称"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    onBlur={()=>setTouched(prev=>({ ...prev, name: true }))}
                    className={`add-api-key-form-input ${touched.name && errors.name ? 'error' : ''}`}
                    required
                  />
                  {touched.name && errors.name && (<p className="add-api-key-form-error">{errors.name}</p>)}
                </div>
                <div className="add-api-key-form-group">
                  <label className="add-api-key-form-label">API Key</label>
                  <input
                    value={keyValue}
                    onChange={(e)=>setKeyValue(e.target.value)}
                    onBlur={()=>setTouched(prev=>({ ...prev, key: true }))}
                    className={`add-api-key-form-input api-key ${touched.key && errors.key ? 'error' : ''}`}
                    placeholder="请输入API Key"
                    required
                  />
                  {touched.key && errors.key && (<p className="add-api-key-form-error">{errors.key}</p>)}
                </div>
                <div className="add-api-key-form-group">
                  <label className="add-api-key-form-label">提供商</label>
                  <input
                    value={platform}
                    onChange={(e)=>setPlatform(e.target.value)}
                    className="add-api-key-form-input"
                    placeholder="如：OpenAI、Claude、Gemini..."
                  />
                </div>
                <div className="add-api-key-form-group">
                  <label className="add-api-key-form-label">描述</label>
                  <input
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    className="add-api-key-form-input"
                    placeholder="可选描述信息..."
                  />
                </div>
              </div>
              <div className="add-api-key-button-group">
                <div className="add-api-key-button-container three-buttons">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={onClose}
                      className="add-api-key-button"
                    >
                      取消
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleBatchImport}
                      className="add-api-key-button"
                    >
                      批量导入
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={submitting || !!errors.name || !!errors.key}
                      className="add-api-key-button primary"
                    >
                      {submitting? '提交中…':'保存'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          </form>
          
          {/* 模态对话框 */}
          {modal && modal.isOpen && (
            <div className="add-api-key-modal-overlay">
              <div className="add-api-key-modal-container">
                <div className="add-api-key-modal-header">
                  <div className={`add-api-key-modal-title ${modal.type === 'success' ? 'success' : 'error'}`}>
                    {modal.title}
                  </div>
                </div>
                <div className="add-api-key-modal-body">
                  <div className="add-api-key-modal-message">
                    {modal.message}
                  </div>
                </div>
                <div className="add-api-key-modal-footer">
                  <button
                    type="button"
                    onClick={() => {
                      if (modal.type === 'success' && modal.onConfirm) {
                        modal.onConfirm();
                      } else {
                        setModal(null);
                      }
                    }}
                    className={`add-api-key-modal-button ${modal.type === 'success' ? 'success' : 'error'}`}
                  >
                    {modal.type === 'success' ? '确定' : '关闭'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}

export default AddApiKeyDialog;
