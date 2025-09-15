import { useState, useRef, useEffect } from "react";
import { ApiKey } from "../../types/apiKey";
import { CopyIcon, CheckIcon } from "../Icon/Icon";

interface SearchResultsProps {
  results: ApiKey[];
  onCopy: (key: ApiKey) => void;
  position: { x: number; y: number };
  toolbarWidth: number;
  providerLabel?: string;
}

export function SearchResults({ results, onCopy, position, toolbarWidth, providerLabel }: SearchResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (key: ApiKey) => {
    setCopiedId(key.id);
    onCopy(key);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCopiedId(null);
      timeoutRef.current = null;
    }, 2000);
  };

  const formatApiKey = (keyValue: string) => {
    if (keyValue.length <= 10) return keyValue;
    const prefix = keyValue.substring(0, 3);
    const suffix = keyValue.substring(keyValue.length - 3);
    return `${prefix}...${suffix}`;
  };

  return (
    <div
      ref={resultsRef}
      className="fixed z-30 w-[360px] glass rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 dark:border-white/20 border-gray-400"
      style={{
        left: position.x + (toolbarWidth - 360) / 2, // 使360px的面板相对于工具栏居中
        top: position.y + 57, // 在56px高的工具栏下方留出1px间距
      }}
    >
      {providerLabel && (
        <div className="flex justify-center pt-4">
          <div className="w-[300px] flex justify-end items-center" style={{ height: "32px" }}>
            <span className="inline-flex items-center px-4 py-0 text-[10px] rounded-full bg-primary/10 border border-primary/20 text-primary" style={{ height: "18px" }}>
                  {providerLabel}    
            </span>
          </div>
        </div>
      )}
      <div className="max-h-96 overflow-y-auto px-4 py-3">
        {results.length === 0 ? (
          <div className="flex justify-center p-8">
            <div className="text-center opacity-70 text-gray-700 dark:text-gray-100 text-[14px]">暂无结果</div>
          </div>
        ) : (
          <>
            {results.map((key) => (
              <div
                key={key.id}
                className="flex justify-center px-4 py-6 hover:bg-white/10 transition-colors duration-150 cursor-pointer border-b-2 border-white/40 last:border-b-0"
                style={{ height: "60px", marginTop: "8px", marginBottom: "8px" }}
                onClick={() => handleCopy(key)}
              >
                <div className="w-[300px]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-[12px] text-gray-700 dark:text-gray-100">{key.name}</div>
                      <div className="text-[14px] opacity-80 font-mono mt-1 text-gray-700 dark:text-gray-100">{formatApiKey(key.keyValue)}</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(key);
                      }}
                      aria-label="复制"
                      className="w-8 h-8 flex items-center justify-center bg-transparent"
                    >
                      {copiedId === key.id ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}