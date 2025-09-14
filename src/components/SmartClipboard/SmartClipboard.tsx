import { useState, useEffect } from "react";
import { AnalyzedKey } from "../../types/apiKey";
import { smartClipboardService } from "../../services/smartClipboardService";
import { clipboardService } from "../../services/clipboardService";
import { useClipboard } from "../../hooks/useClipboard";
import { useApiToast } from "../../hooks/useToast";
import { logSecureError, OperationContext } from "../../services/secureLogging";
import { API_CONSTANTS } from "../../constants";

export function SmartClipboard() {
  const [clipboardText, setClipboardText] = useState("");
  const [analyzedKeys, setAnalyzedKeys] = useState<AnalyzedKey[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<boolean | null>(null);
  const { isCopying: isGettingClipboard, copyError: getClipboardError } = useClipboard();
  const toast = useApiToast();

  // 检查Ollama服务状态
  const checkOllama = async () => {
    const status = await smartClipboardService.checkOllamaStatus();
    setOllamaStatus(status);
  };

  // 分析文本
  const analyzeText = async () => {
    if (!clipboardText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const keys = await smartClipboardService.analyzeText(clipboardText);
      setAnalyzedKeys(keys);
    } catch (error) {
      logSecureError(OperationContext.CLIPBOARD_ANALYZE, error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 导入分析的API Key
  const importKeys = async () => {
    if (analyzedKeys.length === 0) return;

    try {
      const success = await smartClipboardService.importAnalyzedKeys(analyzedKeys);
      if (success) {
        toast.showImportSuccess();
        setAnalyzedKeys([]);
        setClipboardText("");
      } else {
        toast.showImportError();
      }
    } catch (error) {
      logSecureError(OperationContext.CLIPBOARD_ANALYZE, error, { operation: 'import_keys' });
      toast.showImportError();
    }
  };

  // 初始化时检查Ollama状态
  useEffect(() => {
    checkOllama();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">智能剪贴板</h2>
      
      {/* Ollama状态 */}
      <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${ollamaStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>
            Ollama服务: {ollamaStatus === null ? '检查中...' : ollamaStatus ? '已连接' : '未连接'}
          </span>
        </div>
        {!ollamaStatus && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            请确保Ollama服务正在运行 (${API_CONSTANTS.ENDPOINTS.OLLAMA})
          </p>
        )}
      </div>
      
      {/* 剪贴板内容输入 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">剪贴板内容</label>
          <button
            onClick={async () => {
              const content = await clipboardService.getClipboardContent();
              setClipboardText(content);
            }}
            disabled={isGettingClipboard}
            className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
          >
            {isGettingClipboard ? '获取中...' : '获取剪贴板内容'}
          </button>
        </div>
        {getClipboardError && (
          <div className="text-red-500 text-sm mb-2">{getClipboardError}</div>
        )}
        <textarea
          value={clipboardText}
          onChange={(e) => setClipboardText(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="粘贴包含API Key的文本内容..."
        />
      </div>
      
      {/* 操作按钮 */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={analyzeText}
          disabled={isAnalyzing || !clipboardText.trim()}
          className={`px-4 py-2 rounded-md ${
            isAnalyzing || !clipboardText.trim()
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isAnalyzing ? '分析中...' : '分析文本'}
        </button>
        
        <button
          onClick={importKeys}
          disabled={analyzedKeys.length === 0}
          className={`px-4 py-2 rounded-md ${
            analyzedKeys.length === 0
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          导入API Keys
        </button>
      </div>
      
      {/* 分析结果 */}
      {analyzedKeys.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">分析结果</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    平台
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    名称
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    API Key
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    分组
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analyzedKeys.map((key, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm">{key.platform}</td>
                    <td className="px-4 py-2 text-sm">{key.name || '-'}</td>
                    <td className="px-4 py-2 text-sm font-mono text-xs truncate max-w-xs">
                      {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                    </td>
                    <td className="px-4 py-2 text-sm">{key.group || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}