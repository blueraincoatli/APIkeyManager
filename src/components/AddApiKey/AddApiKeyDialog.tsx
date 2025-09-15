import { useMemo, useState } from "react";
import { apiKeyService } from "../../services/apiKeyService";
import { useToast } from "../../hooks/useToast";
import { validateApiKeyFormat } from "../../services/inputValidation";

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
    // 批量导入功能待实现
    console.log("批量导入功能待实现");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center mb-[16px] justify-center mb-[16px]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="w-[360px] translate-x-[36px]">
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 px-8 py-6"
        >
        <h5 className="text-[18px] mb-8 text-center mb-[16px] text-gray-300 dark:text-white font-normal">新增API Key</h5>
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
            {touched.name && errors.name && (<p className="mt-2 text-[14px] text-red-500 w-[300px]">{errors.name}</p>)}
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
            {touched.key && errors.key && (<p className="mt-2 text-[14px] text-red-500 w-[300px]">{errors.key}</p>)}
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
        <div className="mt-[30px] mb-[30px] flex justify-center mb-[16px]">
        <div className="w-[300px] grid grid-cols-3 gap-3">
          <div className="flex justify-center mb-[16px]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-sm w-full"
            >
              取消
            </button>
          </div>
          <div className="flex justify-center mb-[16px]">
            <button
              type="button"
              onClick={handleBatchImport}
              className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-gray-600/50 transition-all text-gray-700 dark:text-gray-300 font-medium text-sm w-full"
            >
              批量导入
            </button>
          </div>
          <div className="flex justify-center mb-[16px]">
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
        </form>
      </div>
    </div>
  );
}

export default AddApiKeyDialog;




