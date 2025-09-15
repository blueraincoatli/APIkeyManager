import { useState, useRef, useEffect } from "react";
import { ApiKey } from "../../types/apiKey";
import { CopyIcon, CheckIcon } from "../Icon/Icon";
import { useAdaptiveTheme } from "../../hooks/useAdaptiveTheme";

interface SearchResultsProps {
  results: ApiKey[];
  onCopy: (key: ApiKey) => void;
  position: { x: number; y: number };
  providerLabel?: string;
}

export function SearchResults({ results, onCopy, position, providerLabel }: SearchResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const { textColor, backgroundColor } = useAdaptiveTheme();

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
      className="fixed z-40 w-[520px] glass rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
      style={{
        left: position.x,
        top: position.y + 72,
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {providerLabel && (
        <div className="px-4 pt-3">
          <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-white/10 border border-white/20">
            {providerLabel}
          </span>
        </div>
      )}
      <div className="max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="p-6 text-center opacity-70">暂无结果</div>
        ) : (
          <div className="divide-y divide-white/10">
            {results.map((key) => (
              <div
                key={key.id}
                className="px-4 py-3 hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                onClick={() => handleCopy(key)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{key.name}</div>
                    <div className="text-sm opacity-80 font-mono">{formatApiKey(key.keyValue)}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(key);
                    }}
                    aria-label="复制"
                    className="w-9 h-9 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    {copiedId === key.id ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}