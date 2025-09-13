import { useState, useRef } from "react";
import { ApiKey } from "../../types/apiKey";
import { clipboardService } from "../../services/clipboardService";
import { useAdaptiveTheme } from "../../hooks/useAdaptiveTheme";

interface SearchResultsProps {
  results: ApiKey[];
  onCopy: (key: ApiKey) => void;
  position: { x: number; y: number };
}

export function SearchResults({ results, onCopy, position }: SearchResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { backgroundColor, textColor, borderColor } = useAdaptiveTheme(resultsRef);

  

  // 处理复制操作
  const handleCopy = async (key: ApiKey) => {
    await clipboardService.copyToClipboard(key.keyValue);
    setCopiedId(key.id);
    onCopy(key);
    
    // 2秒后清除复制状态
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 格式化API密钥显示
  const formatApiKey = (keyValue: string) => {
    if (keyValue.length <= 10) return keyValue;
    const prefix = keyValue.substring(0, 3);
    const suffix = keyValue.substring(keyValue.length - 3);
    return `${prefix}...${suffix}`;
  };

  // 获取平台图标
  const getPlatformIcon = (keyName: string) => {
    const name = keyName.toLowerCase();
    if (name.includes('openai') || name.includes('gpt')) return '🤖';
    if (name.includes('claude') || name.includes('anthropic')) return '🧠';
    if (name.includes('google') || name.includes('gemini')) return '🔍';
    if (name.includes('aws')) return '☁️';
    if (name.includes('azure')) return '💙';
    if (name.includes('github')) return '🐙';
    if (name.includes('gitlab')) return '🦊';
    return '🔑';
  };

  return (
    <div 
      ref={resultsRef}
      className="fixed z-40 w-96 backdrop-blur-2xl rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300"
      style={{
        left: position.x,
        top: position.y + 80, // 显示在工具条下方
        backgroundColor,
        color: textColor,
        borderColor,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* 纸片式标题栏 */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Search Results</h3>
          <span className="text-sm opacity-70">{results.length} found</span>
        </div>
      </div>

      {/* 搜索结果列表 */}
      <div className="max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="p-8 text-center opacity-70">
            <div className="text-4xl mb-2">🔍</div>
            <p>No results found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {results.map((key) => (
              <div 
                key={key.id}
                className="p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                onClick={() => handleCopy(key)}
              >
                {/* 纸片式内容 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">{getPlatformIcon(key.name)}</span>
                      <h4 className="font-medium truncate">{key.name}</h4>
                    </div>
                    <div className="text-sm opacity-80 font-mono bg-white/10 rounded px-2 py-1 inline-block">
                      {formatApiKey(key.keyValue)}
                    </div>
                    {key.description && (
                      <p className="text-xs opacity-60 mt-2 line-clamp-2">
                        {key.description}
                      </p>
                    )}
                  </div>
                  
                  {/* 复制按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(key);
                    }}
                    className="ml-3 w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-white/20 group-hover:border-white/40"
                  >
                    {copiedId === key.id ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-sm">📋</span>
                    )}
                  </button>
                </div>
                
                {/* 纸片装饰效果 */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-30 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      {results.length > 5 && (
        <div className="p-3 text-center text-xs opacity-60 border-t border-white/10 bg-white/5">
          Showing first 5 of {results.length} results
        </div>
      )}
    </div>
  );
}