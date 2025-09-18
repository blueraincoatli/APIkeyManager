import { useState, useRef, useEffect } from "react";
import { ApiKey } from "../../types/apiKey";
import { CopyIcon, CheckIcon, EditIcon, CloseIcon } from "../Icon/Icon";
import "./SearchResults.css";
import { apiKeyService } from "../../services/apiKeyService";
import { useApiToast } from "../../hooks/useToast";

interface SearchResultsProps {
  results: ApiKey[];
  onCopy: (key: ApiKey) => void;
  providerLabel?: string;
  onRefresh?: () => void; // 添加刷新回调
}

export function SearchResults({ results, onCopy, providerLabel, onRefresh }: SearchResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editKeyValue, setEditKeyValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const toast = useApiToast();

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

  const startEditing = (key: ApiKey) => {
    setEditingId(key.id);
    setEditName(key.name);
    setEditKeyValue(key.keyValue);
  };

  const saveEdit = async (key: ApiKey) => {
    if (!editingId) return;
    
    const updatedKey: ApiKey = {
      ...key,
      name: editName,
      keyValue: editKeyValue,
      // 保持其他字段不变
      platform: key.platform,
      description: key.description,
      groupId: key.groupId,
      tags: key.tags,
      createdAt: key.createdAt,
      updatedAt: Date.now(),
    };

    try {
      const result = await apiKeyService.editApiKey(updatedKey);
      if (result.success) {
        toast.showEditSuccess();
        setEditingId(null);
        // 通知父组件刷新数据
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.showEditError(result.error?.message);
      }
    } catch (error) {
      toast.showEditError();
      console.error("编辑API Key失败:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };

  const executeDelete = async () => {
    if (!deletingId) return;
    
    try {
      const result = await apiKeyService.deleteApiKey(deletingId);
      if (result.success) {
        toast.showDeleteSuccess();
        // 通知父组件刷新数据
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.showDeleteError(result.error?.message);
      }
    } catch (error) {
      toast.showDeleteError();
      console.error("删除API Key失败:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  return (
    <div
      ref={resultsRef}
      className="search-results-container"
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
              >
                <div className="search-results-item-content">
                  {editingId === key.id ? (
                    // 编辑模式
                    <div className="search-results-edit-form">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="search-results-edit-input"
                        placeholder="名称"
                      />
                      <input
                        type="text"
                        value={editKeyValue}
                        onChange={(e) => setEditKeyValue(e.target.value)}
                        className="search-results-edit-input"
                        placeholder="API Key"
                      />
                      <div className="search-results-edit-buttons">
                        <button 
                          onClick={() => saveEdit(key)}
                          className="search-results-edit-save-button"
                        >
                          保存
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="search-results-edit-cancel-button"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : deletingId === key.id ? (
                    // 删除确认模式
                    <div className="search-results-delete-confirm">
                      <div className="search-results-delete-text">确定要删除吗？</div>
                      <div className="search-results-delete-buttons">
                        <button 
                          onClick={executeDelete}
                          className="search-results-delete-confirm-button"
                        >
                          确定
                        </button>
                        <button 
                          onClick={cancelDelete}
                          className="search-results-delete-cancel-button"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 正常显示模式
                    <>
                      <div className="search-results-item-header">
                        <div className="search-results-item-info">
                          <div className="search-results-item-name">
                            {key.name}
                            {key.description && (
                              <span className="search-results-item-description">
                                {key.description}
                              </span>
                            )}
                          </div>
                          <div className="search-results-item-key">{formatApiKey(key.keyValue)}</div>
                        </div>
                        <div className="search-results-item-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(key);
                            }}
                            aria-label="编辑"
                            className="search-results-action-button"
                          >
                            <EditIcon className="search-results-action-icon" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(key.id);
                            }}
                            aria-label="删除"
                            className="search-results-action-button"
                          >
                            <CloseIcon className="search-results-action-icon" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(key);
                            }}
                            aria-label="复制"
                            className="search-results-action-button"
                          >
                            {copiedId === key.id ? <CheckIcon className="search-results-action-icon" /> : <CopyIcon className="search-results-action-icon" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}