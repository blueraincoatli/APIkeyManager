import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { ApiKey } from "../../types/apiKey";
import { CopyIcon, CheckIcon, EditIcon, CloseIcon } from "../Icon/Icon";
import "./SearchResults.css";
import { apiKeyService } from "../../services/apiKeyService";
import { invoke } from "@tauri-apps/api/core";

interface SearchResultsProps {
  results: ApiKey[];
  onCopy: (key: ApiKey) => void;
  onRefresh?: () => void; // 添加刷新回调
  onCopyConfirmed?: () => void; // 复制确认后收起父面板
}

export function SearchResults({
  results,
  onCopy,
  onRefresh,
  onCopyConfirmed,
}: SearchResultsProps) {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editKeyValue, setEditKeyValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);
  const [modalPos, setModalPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null); // 短暂UI反馈
  const clearClipboardTimerRef = useRef<number | null>(null); // 30秒自动清空

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (clearClipboardTimerRef.current) {
        clearTimeout(clearClipboardTimerRef.current);
      }
    };
  }, []);

  // 处理模态框定位
  useEffect(() => {
    if (modalRef.current && modalPos) {
      modalRef.current.style.setProperty("--modal-top", `${modalPos.top}px`);
      modalRef.current.style.setProperty("--modal-left", `${modalPos.left}px`);
    }
  }, [modalPos]);

  const handleCopy = async (key: ApiKey) => {
    try {
      // 通过后端命令复制到系统剪贴板（不在前端日志中打印敏感值）
      const result = await invoke("copy_to_clipboard", {
        content: key.keyValue,
      });

      if (result) {
        // 复制成功 UI 反馈
        setCopiedId(key.id);
        onCopy(key);

        // 2 秒后恢复复制图标
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          setCopiedId(null);
          timeoutRef.current = null;
        }, 2000);

        // 30 秒后自动清空剪贴板
        if (clearClipboardTimerRef.current)
          clearTimeout(clearClipboardTimerRef.current);
        clearClipboardTimerRef.current = window.setTimeout(() => {
          invoke("copy_to_clipboard", { content: "" }).catch(() => {});
          clearClipboardTimerRef.current = null;
        }, 30000);

        // 风险提示模态框
        // 计算模态框相对结果面板的中心位置
        const rect = resultsRef.current?.getBoundingClientRect();
        if (rect) {
          setModalPos({
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
          });
        } else {
          setModalPos({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
          });
        }

        setModal({
          isOpen: true,
          type: "success",
          title: t("searchResults.copySuccess"),
          message: t("searchResults.copySuccessMessage"),
          onConfirm: () => {
            if (onCopyConfirmed) onCopyConfirmed();
            setModal(null);
          },
        });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: t("searchResults.copyFailed"),
          message: t("searchResults.copyFailedMessage"),
        });
      }
    } catch (error) {
      // 仅记录通用错误，不输出任何敏感内容
      console.error("复制失败：", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "复制失败",
        message: "发生未知错误，无法复制到剪贴板",
      });
    }
  };

  const formatApiKey = (keyValue: string) => {
    const prefixLen = 9;
    const suffixLen = 9;
    if (keyValue.length <= prefixLen + suffixLen) return keyValue;
    const prefix = keyValue.substring(0, prefixLen);
    const suffix = keyValue.substring(keyValue.length - suffixLen);
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
        setModal({
          isOpen: true,
          type: "success",
          title: t("searchResults.editSuccess"),
          message: t("searchResults.editSuccessMessage", { name: key.name }),
          onConfirm: () => {
            setModal(null);
            setEditingId(null);
            // 通知父组件刷新数据
            if (onRefresh) {
              onRefresh();
            }
          },
        });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: t("searchResults.editFailed"),
          message:
            result.error?.message || t("searchResults.editFailedMessage"),
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        title: "编辑失败",
        message: "发生未知错误",
      });
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
        setModal({
          isOpen: true,
          type: "success",
          title: t("searchResults.deleteSuccess"),
          message: t("searchResults.deleteSuccessMessage"),
          onConfirm: () => {
            setModal(null);
            setDeletingId(null);
            // 通知父组件刷新数据
            if (onRefresh) {
              onRefresh();
            }
          },
        });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: t("searchResults.deleteFailed"),
          message:
            result.error?.message || t("searchResults.deleteFailedMessage"),
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        title: "删除失败",
        message: "发生未知错误",
      });
      console.error("删除API Key失败:", error);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  return (
    <div ref={resultsRef} className="search-results-container">
      <div className="search-results-list">
        {results.length === 0 ? (
          <div className="search-results-empty">
            <div className="search-results-empty-text">
              {t("searchResults.noResults")}
            </div>
          </div>
        ) : (
          <>
            {results.map((key) => (
              <div key={key.id} className="search-results-item">
                <div className="search-results-item-content">
                  {editingId === key.id ? (
                    // 编辑模式
                    <div className="search-results-edit-form">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="search-results-edit-input"
                        placeholder={t("searchResults.namePlaceholder")}
                      />
                      <input
                        type="text"
                        value={editKeyValue}
                        onChange={(e) => setEditKeyValue(e.target.value)}
                        className="search-results-edit-input"
                        placeholder={t("searchResults.keyPlaceholder")}
                      />
                      <div className="search-results-edit-buttons">
                        <button
                          onClick={() => saveEdit(key)}
                          className="search-results-edit-save-button"
                        >
                          {t("searchResults.save")}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="search-results-edit-cancel-button"
                        >
                          {t("searchResults.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : deletingId === key.id ? (
                    // 删除确认模式
                    <div className="search-results-delete-confirm">
                      <div className="search-results-delete-text">
                        {t("searchResults.confirmDelete")}
                      </div>
                      <div className="search-results-delete-buttons">
                        <button
                          onClick={executeDelete}
                          className="search-results-delete-confirm-button"
                        >
                          {t("searchResults.confirm")}
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="search-results-delete-cancel-button"
                        >
                          {t("searchResults.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 正常显示模式
                    <>
                      <div className="search-results-item-header">
                        <div className="search-results-item-info">
                          <div className="search-results-item-name">
                            <span className="search-results-item-name-text">
                              {key.name}
                            </span>
                            {key.description && (
                              <>
                                <span className="search-results-item-sep">
                                  {" "}
                                  |{" "}
                                </span>
                                <span className="search-results-item-description">
                                  {key.description}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="search-results-item-key">
                            {formatApiKey(key.keyValue)}
                          </div>
                        </div>
                        <div className="search-results-item-right-section">
                          {key.platform && (
                            <div className="search-results-item-provider">
                              <span className="search-results-item-provider-label">
                                {key.platform}
                              </span>
                            </div>
                          )}
                          <div className="search-results-item-actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(key);
                              }}
                              aria-label={t("searchResults.edit")}
                              className="search-results-action-button"
                            >
                              <EditIcon className="search-results-action-icon" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(key.id);
                              }}
                              aria-label={t("searchResults.delete")}
                              className="search-results-action-button"
                            >
                              <CloseIcon className="search-results-action-icon" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(key);
                              }}
                              aria-label={t("searchResults.copy")}
                              className="search-results-action-button"
                            >
                              {copiedId === key.id ? (
                                <CheckIcon className="search-results-action-icon" />
                              ) : (
                                <CopyIcon className="search-results-action-icon" />
                              )}
                            </button>
                          </div>
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

      {/* 模态对话框 */}
      {modal &&
        modal.isOpen &&
        createPortal(
          <div className="search-results-modal-overlay">
            <div
              ref={modalRef}
              className={`search-results-modal-container ${modalPos ? "positioned" : ""}`}
            >
              <div className="search-results-modal-header">
                <div
                  className={`search-results-modal-title ${modal.type === "success" ? "success" : "error"}`}
                >
                  {modal.title}
                </div>
              </div>
              <div className="search-results-modal-body">
                <div className="search-results-modal-message">
                  {modal.message}
                </div>
              </div>
              <div className="search-results-modal-footer">
                <button
                  onClick={() => {
                    if (modal.type === "success" && modal.onConfirm) {
                      modal.onConfirm();
                    } else {
                      setModal(null);
                    }
                  }}
                  className={`search-results-modal-button ${modal.type === "success" ? "success" : "error"}`}
                >
                  {modal.type === "success"
                    ? t("searchResults.confirm")
                    : t("searchResults.close")}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
