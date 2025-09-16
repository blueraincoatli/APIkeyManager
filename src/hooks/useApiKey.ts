import { useState, useEffect } from 'react';
import { ApiKey, Group } from '../types/apiKey';
import { apiKeyService, groupService } from '../services/apiKeyService';

// 自定义Hook用于管理API Key相关的状态和逻辑
export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取API Keys和分组
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const keysResult = await apiKeyService.listApiKeys();
      const groupsResult = await groupService.listGroups();
      
      if (keysResult.success) {
        setApiKeys(keysResult.data || []);
      } else if (keysResult.error) {
        setError(keysResult.error.message || String(keysResult.error.code));
      }
      
      if (groupsResult.success) {
        setGroups(groupsResult.data || []);
      } else if (groupsResult.error && !error) {
        setError(groupsResult.error.message || String(groupsResult.error.code));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  return {
    apiKeys,
    groups,
    loading,
    error,
    refetch: fetchData,
  };
};
