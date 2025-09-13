import { useState, useEffect } from "react";
import { ApiKey } from "../../types/apiKey";
import { apiKeyService } from "../../services/apiKeyService";
import { useApiKeys } from "../../hooks/useApiKey";
import { useClipboard } from "../../hooks/useClipboard";
import { formatDateTime } from "../../utils/helpers";
import { VirtualList } from "../VirtualScroll/VirtualList";

export function KeyManager() {
  const { apiKeys, groups, loading, refetch } = useApiKeys();
  const { isCopying, copyToClipboard } = useClipboard();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // 初始化时获取数据
  useEffect(() => {
    refetch();
  }, []);

  // 复制API Key到剪贴板
  const handleCopyToClipboard = async (keyValue: string) => {
    const result = await copyToClipboard(keyValue);
    if (result) {
      // 显示成功提示
      alert("已复制到剪贴板");
    } else {
      alert("复制失败");
    }
  };

  // 删除API Key
  const deleteApiKey = async (id: string) => {
    if (window.confirm("确定要删除这个API Key吗？")) {
      const result = await apiKeyService.deleteApiKey(id);
      if (result.success) {
        // 优化：只更新相关数据而不是重新获取所有数据
        refetch();
      } else {
        alert("删除失败: " + (result.error || "未知错误"));
      }
    }
  };

  // 过滤API Keys
  const filteredKeys = selectedGroup
    ? apiKeys.filter(key => key.groupId === selectedGroup)
    : apiKeys;

  // 渲染单个API Key项
  const renderApiKeyItem = (key: ApiKey, index: number) => {
    const group = groups.find(g => g.id === key.groupId);

    return (
      <div className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
        index === 0 ? 'border-t' : ''
      }`}>
        {/* 名称 */}
        <div className="col-span-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {key.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {key.description}
          </div>
        </div>

        {/* 平台 */}
        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
          {key.platform || "-"}
        </div>

        {/* 分组 */}
        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
          {group ? group.name : "-"}
        </div>

        {/* 创建时间 */}
        <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
          {formatDateTime(key.createdAt)}
        </div>

        {/* 操作 */}
        <div className="col-span-3 text-sm font-medium">
          <div className="flex space-x-2">
            <button
              onClick={() => handleCopyToClipboard(key.keyValue)}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded"
              disabled={isCopying}
            >
              {isCopying ? '复制中...' : '复制'}
            </button>
            <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 px-2 py-1 rounded">
              编辑
            </button>
            <button
              onClick={() => deleteApiKey(key.id)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 计算项目高度（大约64px每行）
  const getItemHeight = () => 64;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          添加新Key
        </button>
      </div>

      {/* 分组筛选 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedGroup === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            全部
          </button>
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedGroup === group.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      {/* API Keys列表 - 使用虚拟滚动 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {/* 表头 */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div className="col-span-3">名称</div>
              <div className="col-span-2">平台</div>
              <div className="col-span-2">分组</div>
              <div className="col-span-2">创建时间</div>
              <div className="col-span-3">操作</div>
            </div>
          </div>

          {/* 虚拟滚动列表 */}
          {filteredKeys.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              {selectedGroup ? "该分组下暂无API Keys" : "暂无API Keys"}
            </div>
          ) : (
            <VirtualList
              items={filteredKeys}
              renderItem={renderApiKeyItem}
              itemHeight={getItemHeight}
              containerHeight={600}
              overscan={5}
              className="bg-white dark:bg-gray-800"
            />
          )}
        </div>
      )}
    </div>
  );
}