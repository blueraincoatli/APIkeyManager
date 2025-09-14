import { useMemo, useState } from "react";
import { apiKeyService } from "../../services/apiKeyService";
import { useToast } from "../../hooks/useToast";
import { PROVIDERS } from "../../constants/providers";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[520px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-6"
      >
        <h3 className="text-lg font-semibold mb-4">新增 API Key</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">名称</label>
            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              onBlur={()=>setTouched(prev=>({ ...prev, name: true }))}
              className={`w-full px-3 py-2 rounded-md border bg-white/70 dark:bg-gray-700/70 ${touched.name && errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              required
            />
            {touched.name && errors.name && (<p className="mt-1 text-xs text-red-500">{errors.name}</p>)}
          </div>
          <div>
            <label className="block text-sm mb-1">API Key</label>
            <input
              value={keyValue}
              onChange={(e)=>setKeyValue(e.target.value)}
              onBlur={()=>setTouched(prev=>({ ...prev, key: true }))}
              className={`w-full px-3 py-2 rounded-md border bg-white/70 dark:bg-gray-700/70 font-mono ${touched.key && errors.key ? 'border-red-400 focus:ring-red-400' : ''}`}
              required
            />
            {touched.key && errors.key && (<p className="mt-1 text-xs text-red-500">{errors.key}</p>)}
          </div>
          <div>
            <label className="block text-sm mb-1">提供商</label>
            <select value={platform} onChange={(e)=>setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-white/70 dark:bg-gray-700/70">
              <option value="">未指定</option>
              {PROVIDERS.map(p => (
                <option key={p.id} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">描述</label>
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-white/70 dark:bg-gray-700/70" rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">取消</button>
          <button type="submit" disabled={submitting || !!errors.name || !!errors.key} className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">{submitting? '提交中…':'保存'}</button>
        </div>
      </form>
    </div>
  );
}

export default AddApiKeyDialog;
