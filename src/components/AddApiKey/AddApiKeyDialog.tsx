import { useMemo, useState } from "react";
import { apiKeyService } from "../../services/apiKeyService";
import { useToast } from "../../hooks/useToast";
import { validateApiKeyFormat } from "../../services/inputValidation";
import { save, open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { downloadDir } from '@tauri-apps/api/path';

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

export function AddApiKeyDialog({ open, onClose, onAdded }: AddApiKeyDialogProps) {
  const { success, error } = useToast();
  const [name, setName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ name?: boolean; key?: boolean }>({});
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ApiKeyTemplate[]>([]);
  
  const handleFileSelect = async () => {
    try {
      // 使用Tauri的文件对话框，让用户选择文件
      const filePath = await openFileDialog({
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
      toast.error('文件读取失败', error.message || '无法读取所选文件');
    }
  };

  const handleConfirmImport = async () => {
    try {
      // 这里应该实现实际的导入逻辑
      // 目前我们只是模拟导入过程
      for (const item of previewData) {
        await apiKeyService.addApiKey({
          name: item.name,
          keyValue: item.keyValue,
          platform: item.platform,
          description: item.description
        });
      }
      
      toast.success('导入成功', `成功导入 ${previewData.length} 条API Key记录`);
      setShowPreview(false);
      onAdded?.();
    } catch (error: any) {
      console.error('导入失败:', error);
      toast.error('导入失败', error.message || '导入过程中发生错误');
    }
  };

  // 预览窗口组件
  const PreviewWindow = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 预览内容 */}
      <div className="absolute inset-0 bg-black/30" onClick={() => setShowPreview(false)} />
      <div className="relative z-10 w-[800px] max-w-[90vw] h-[600px] max-h-[90vh] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">数据预览</h2>
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="关闭预览"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">API Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">提供商</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">描述</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {previewData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">{item.keyValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-sm"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium text-sm"
            >
              确认导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const errors = useMemo(() => {
    const errs: { name?: string; key?: string } = {};
    if (!name.trim()) errs.name = "名称不能为空";
    if (!keyValue.trim()) errs.key = "API Key 不能为空";
    else if (!validateApiKeyFormat(keyValue.trim())) errs.key = "API Key 格式不合法";
    return errs;
  }, [name, keyValue]);

  if (!open) return null;

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
      success("新增成功", name);
      onAdded?.();
      onClose();
      setName(""); setKeyValue(""); setPlatform(""); setDescription("");
    } else {
      error("新增失败", res.error?.message);
    }
  };

  const handleBatchImport = () => {
    // 切换到批量导入面板
    setShowBatchImport(true);
  };

  const handleBackToSingle = () => {
    // 返回单个添加面板
    setShowBatchImport(false);
  };

  const handleDownloadTemplate = async () => {
    try {
      // 获取下载目录路径
      const downloadPath = await downloadDir();
      
      // 弹出保存对话框，让用户选择保存位置
      const filePath = await save({
        filters: [{
          name: 'Excel Files',
          extensions: ['xlsx']
        }],
        defaultPath: `${downloadPath}/api_key_template.xlsx`
      });
      
      if (filePath) {
        // 使用fetch获取模板文件
        const response = await fetch('/templates/api_key_template.xlsx');
        if (!response.ok) {
          throw new Error('模板文件下载失败');
        }
        const arrayBuffer = await response.arrayBuffer();
        
        // 写入文件
        await writeFile(filePath, new Uint8Array(arrayBuffer));
        
        // 通知用户文件已保存
        toast.success('模板下载成功', `文件已保存到: ${filePath}`);
      }
    } catch (error: any) {
      console.error('下载模板失败:', error);
      toast.error('下载失败', error.message || '模板下载过程中发生错误');
    }
  };

  const toast = useToast();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="w-[360px] translate-x-[36px]">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 px-8 py-6"
        >
        {showBatchImport ? (
          // 批量导入说明面板
          <>
            <h5 className="text-[18px] mb-6 text-center text-gray-300 dark:text-white font-normal">批量导入API Key</h5>
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <p className="text-gray-600 dark:text-gray-300 text-[12px] mb-4">
                  请下载模板文件，按照格式填写API Key信息后上传
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-[300px] px-4 py-2.5 rounded-full border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-all font-medium text-sm mb-[16px]"
                >
                  下载模板
                </button>
                
                <button
                  type="button"
                  onClick={handleFileSelect}
                  className="w-[300px] px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-sm mb-[16px]"
                >
                  选择Excel文件
                </button>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <p className="text-gray-500 dark:text-gray-400 text-[12px]">
                  支持的格式：Excel文件 (.xlsx)<br/>
                  需包含列：名称 | API Key | 提供商 | 描述
                </p>
              </div>
            </div>
            
            <div className="mt-[30px] mb-[30px] flex justify-center">
              <div className="w-[300px] grid grid-cols-2 gap-3">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleBackToSingle}
                    className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-[12px] w-full"
                  >
                    返回
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-[12px] w-full"
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
            <h5 className="text-[18px] mb-8 text-center text-gray-300 dark:text-white font-normal">新增API Key</h5>
            <div>
              <div className="flex flex-col items-center mb-[16px]">
                <label className="block text-[14px] font-medium mb-3 text-gray-700 dark:text-gray-300 w-[300px]">名称</label>
                <input
                  type="text"
                  placeholder="请输入API Key名称"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  onBlur={()=>setTouched(prev=>({ ...prev, name: true }))}
                  className={`w-[300px] px-4 py-2.5 rounded-full border glass-chip focus:outline-none focus:ring-2 transition-all text-sm ${
                    touched.name && errors.name
                      ? 'border-red-400 focus:ring-red-400/50'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500/50 focus:border-blue-500'
                  }`}
                  required
                />
                {touched.name && errors.name && (<p className="mt-2 text-[14px] text-red-500 w-[300px] text-center">{errors.name}</p>)}
              </div>
              <div className="flex flex-col items-center mb-[16px]">
                <label className="block text-[14px] font-medium mb-3 text-gray-700 dark:text-gray-300 w-[300px]">API Key</label>
                <input
                  value={keyValue}
                  onChange={(e)=>setKeyValue(e.target.value)}
                  onBlur={()=>setTouched(prev=>({ ...prev, key: true }))}
                  className={`w-[300px] px-4 py-2.5 rounded-full border glass-chip font-mono focus:outline-none focus:ring-2 transition-all text-sm ${
                    touched.key && errors.key
                      ? 'border-red-400 focus:ring-red-400/50'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500/50 focus:border-blue-500'
                  }`}
                  placeholder="请输入API Key"
                  required
                />
                {touched.key && errors.key && (<p className="mt-2 text-[14px] text-red-500 w-[300px] text-center">{errors.key}</p>)}
              </div>
              <div className="flex flex-col items-center mb-[16px]">
                <label className="block text-[14px] font-medium mb-3 text-gray-700 dark:text-gray-300 w-[300px]">提供商</label>
                <input
                  value={platform}
                  onChange={(e)=>setPlatform(e.target.value)}
                  className="w-[300px] px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 glass-chip focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                  placeholder="如：OpenAI、Claude、Gemini..."
                />
              </div>
              <div className="flex flex-col items-center mb-[16px]">
                <label className="block text-[14px] font-medium mb-3 text-gray-700 dark:text-gray-300 w-[300px]">描述</label>
                <input
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                  className="w-[300px] px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 glass-chip focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                  placeholder="可选描述信息..."
                />
              </div>
            </div>
            <div className="mt-[30px] mb-[30px] flex justify-center">
              <div className="w-[300px] grid grid-cols-3 gap-3">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-sm w-full"
                  >
                    取消
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleBatchImport}
                    className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-sm w-full"
                  >
                    批量导入
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting || !!errors.name || !!errors.key}
                    className="px-4 py-2.5 rounded-full border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 disabled:opacity-60 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 disabled:hover:bg-transparent transition-all font-medium text-sm w-full"
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
      
      {/* 预览窗口 */}
      {showPreview && <PreviewWindow />}
    </div>
  );
}

export default AddApiKeyDialog;




