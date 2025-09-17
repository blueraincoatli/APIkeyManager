import { useState, useRef, useEffect } from "react";
import { ApiKey } from "../../types/apiKey";
import { CopyIcon, CheckIcon } from "../Icon/Icon";
import "./SearchResults.css";

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
    // Set the position dynamically
    if (resultsRef.current) {
      const x = position.x + (toolbarWidth - 360) / 2;
      const y = position.y + 72;
      resultsRef.current.style.left = `${x}px`;
      resultsRef.current.style.top = `${y}px`;
    }
  }, [position, toolbarWidth]);

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
      className="search-results-container positioned"
    >
      {providerLabel && (
        <div className="search-results-provider-label-container">
          <div className="search-results-provider-label-wrapper">
            <span className="search-results-provider-label">
              {providerLabel}
            </span>
          </div>
        </div>
      )}
      <div className="search-results-list">
        {results.length === 0 ? (
          <div className="search-results-empty">
            <div className="search-results-empty-text">暂无结果</div>
          </div>
        ) : (
          <>
            {results.map((key) => (
              <div
                key={key.id}
                className="search-results-item"
                onClick={() => handleCopy(key)}
              >
                <div className="search-results-item-content">
                  <div className="search-results-item-header">
                    <div className="search-results-item-info">
                      <div className="search-results-item-name">{key.name}</div>
                      <div className="search-results-item-key">{formatApiKey(key.keyValue)}</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(key);
                      }}
                      aria-label="复制"
                      className="search-results-copy-button"
                    >
                      {copiedId === key.id ? <CheckIcon className="search-results-copy-icon" /> : <CopyIcon className="search-results-copy-icon" />}
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