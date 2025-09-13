import { useState, useEffect } from "react";
import { ApiKey, Group } from "../../types/apiKey";
import { apiKeyService, groupService } from "../../services/apiKeyService";
import { clipboardService } from "../../services/clipboardService";
import { useApiKeys } from "../../hooks/useApiKey";
import { useClipboard } from "../../hooks/useClipboard";
import { formatDateTime } from "../../utils/helpers";

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

      {/* API Keys列表 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  平台
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  分组
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {selectedGroup ? "该分组下暂无API Keys" : "暂无API Keys"}
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key) => {
                  const group = groups.find(g => g.id === key.groupId);
                  return (
                    <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {key.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {key.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {key.platform || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {group ? group.name : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDateTime(key.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCopyToClipboard(key.keyValue)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            disabled={isCopying}
                          >
                            {isCopying ? '复制中...' : '复制'}
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            编辑
                          </button>
                          <button
                            onClick={() => deleteApiKey(key.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}