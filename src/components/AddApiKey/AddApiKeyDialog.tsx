import { useMemo, useState } from "react";
import { apiKeyService, batchImportService } from "../../services/apiKeyService";
import { useApiToast } from "../../hooks/useToast";
import { validateApiKeyFormat } from "../../services/inputValidation";
import "./AddApiKeyDialog.css";

// 检测是否在Tauri环境中
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

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
  // 在Tauri环境中直接使用全局API
  tauriDialog = (window as any).__TAURI__.dialog;
  tauriFs = (window as any).__TAURI__.fs;
  tauriPath = (window as any).__TAURI__.path;
  console.log('Tauri plugins available in desktop environment');
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
  position?: { x: number; y: number }; // 可选：面板位置
  toolbarWidth?: number; // 可选：工具栏宽度
}

export function AddApiKeyDialog({ open, onClose, onAdded, position, toolbarWidth }: AddApiKeyDialogProps) {
  const toast = useApiToast();
  const [name, setName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ name?: boolean; key?: boolean }>({});
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ApiKeyTemplate[]>([]);
  const [downloadedFilePath, setDownloadedFilePath] = useState<string | null>(null);
  
  // 计算面板位置类（如果提供了position和toolbarWidth）
  const panelPositionClasses = useMemo(() => {
    if (position && toolbarWidth) {
      const left = position.x + (toolbarWidth - 360) / 2 + 12;
      const top = position.y + 72;
      return `left-${Math.round(left)} top-${Math.round(top)}`;
    }
    return '';
  }, [position, toolbarWidth]);

  // 计算预览窗口位置类（居中于工具栏下方）
  const previewPositionClasses = useMemo(() => {
    if (position && toolbarWidth) {
      const left = position.x + (toolbarWidth - 800) / 2;
      const top = position.y + 72;
      return `left-${Math.round(left)} top-${Math.round(top)}`;
    }
    return '';
  }, [position, toolbarWidth]);
  
  // 表单验证
  const errors = useMemo(() => {
    const errs: { name?: string; key?: string } = {};
    if (!name.trim()) errs.name = "名称不能为空";
    if (!keyValue.trim()) errs.key = "API Key 不能为空";
    else if (!validateApiKeyFormat(keyValue.trim())) errs.key = "API Key 格式不合法";
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
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            // 模拟Excel解析（实际需要使用适当的库如xlsx）
            const mockData: ApiKeyTemplate[] = [
              {
                name: "OpenAI Key",
                keyValue: "sk-xxxx...xxxx",
                platform: "OpenAI",
                description: "用于GPT-4访问"
              },
              {
                name: "Claude Key",
                keyValue: "claude-xxxx...xxxx",
                platform: "Anthropic",
                description: "用于Claude模型"
              }
            ];
            
            // 显示预览
            setPreviewData(mockData);
            setShowPreview(true);
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
        // 模拟Excel解析（实际需要使用适当的库如xlsx）
        const mockData: ApiKeyTemplate[] = [
          {
            name: "OpenAI Key",
            keyValue: "sk-xxxx...xxxx",
            platform: "OpenAI",
            description: "用于GPT-4访问"
          },
          {
            name: "Claude Key",
            keyValue: "claude-xxxx...xxxx",
            platform: "Anthropic",
            description: "用于Claude模型"
          }
        ];
        
        // 显示预览
        setPreviewData(mockData);
        setShowPreview(true);
      }
    } catch (error: any) {
      console.error('文件选择失败:', error);
      // 更准确的错误信息
      if (error.message?.includes('invoke') || error.message?.includes('plugin')) {
        toast.error('Tauri插件未初始化', '请确保在Tauri桌面环境中运行');
      } else {
        toast.error('文件选择失败', error.message || '无法打开文件对话框');
      }
    }
  };

  const handleConfirmImport = async () => {
    try {
      // 使用批量导入服务
      const batchKeys = previewData.map(item => ({
        name: item.name,
        key_value: item.keyValue,
        platform: item.platform,
        description: item.description
      }));

      const result = await batchImportService.importApiKeysBatch(batchKeys);
      
      if (result.success && result.data) {
        toast.success('导入成功', 'API Keys已成功导入');
        setShowPreview(false);
        onAdded?.();
      } else {
        toast.error('导入失败', result.error?.message);
      }
    } catch (error: any) {
      console.error('导入失败:', error);
      toast.error('导入失败', error.message || '导入过程中发生错误');
    }
  };

  // 共享的容器组件
  const DialogContainer = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <div className="add-api-key-dialog-container">
      <div className="add-api-key-dialog-overlay" onClick={onClose} />
      {children}
    </div>
  );

  // 预览窗口组件
  const PreviewWindow = () => (
    <DialogContainer onClose={() => setShowPreview(false)}>
      <div 
        className={`add-api-key-preview-window ${position && toolbarWidth ? 'positioned ' + previewPositionClasses : ''}`}
      >
        <div className="add-api-key-preview-header">
          <h2 className="add-api-key-preview-title">数据预览</h2>
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="add-api-key-preview-close-button"
            aria-label="关闭预览"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="add-api-key-preview-content">
          <div className="add-api-key-preview-table-container">
            <table className="add-api-key-preview-table">
              <thead className="add-api-key-preview-table-header">
                <tr>
                  <th className="add-api-key-preview-table-header-cell">名称</th>
                  <th className="add-api-key-preview-table-header-cell">API Key</th>
                  <th className="add-api-key-preview-table-header-cell">提供商</th>
                  <th className="add-api-key-preview-table-header-cell">描述</th>
                </tr>
              </thead>
              <tbody className="add-api-key-preview-table-body">
                {previewData.map((item, index) => (
                  <tr key={index} className="add-api-key-preview-table-row">
                    <td className="add-api-key-preview-table-cell">{item.name}</td>
                    <td className="add-api-key-preview-table-cell api-key">{item.keyValue}</td>
                    <td className="add-api-key-preview-table-cell">{item.platform}</td>
                    <td className="add-api-key-preview-table-cell">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="add-api-key-preview-footer">
          <div className="add-api-key-preview-button-group">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="add-api-key-button"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              className="add-api-key-button primary"
            >
              确认导入
            </button>
          </div>
        </div>
      </div>
    </DialogContainer>
  );

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
      toast.success('新增成功', name);
      onAdded?.();
      onClose();
      setName(""); setKeyValue(""); setPlatform(""); setDescription("");
    } else {
      toast.error('新增失败', res.error?.message);
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
        // 非Tauri环境下的降级方案
        const response = await fetch('/templates/api_key_template.xlsx');
        if (!response.ok) {
          throw new Error('模板文件下载失败');
        }
        const blob = await response.blob();
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
        // 读取模板文件内容（从public目录）
        const templateContent = await tauriFs.readBinaryFile('templates/api_key_template.xlsx');
        
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
        toast.error('Tauri插件未初始化', '请确保在Tauri桌面环境中运行');
      } else {
        toast.error('下载失败', error.message || '模板下载过程中发生错误');
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
      toast.error('打开文件失败', '无法打开下载的文件');
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
      <DialogContainer onClose={onClose}>
        <div 
          className={`add-api-key-dialog-panel ${position && toolbarWidth ? 'positioned ' + panelPositionClasses : ''}`}
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
        </div>
      </DialogContainer>
      
      {/* 预览窗口 */}
      {showPreview && <PreviewWindow />}
    </>
  );
}

export default AddApiKeyDialog;