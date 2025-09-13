import { useState, useEffect, useMemo } from 'react';
import { ApiKey } from '../types/apiKey';
import { searchService } from '../services/searchService';

// 自定义Hook用于管理搜索相关的状态和逻辑
export const useSearch = (items: ApiKey[], searchFields: (keyof ApiKey)[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 执行搜索
  const performSearch = async (term: string) => {
    if (term.trim() === '') {
      setSearchResults(items);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      // 如果有搜索服务，使用它
      if (searchService) {
        const results = await searchService.searchKeys(term);
        setSearchResults(results.data);
      } else {
        // 简单的本地搜索实现
        const results = items.filter(item =>
          searchFields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(term.toLowerCase());
          })
        );
        setSearchResults(results);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '搜索过程中发生错误';
      setSearchError(errorMsg);
      setSearchResults(items); // 出错时显示所有项目
    } finally {
      setIsSearching(false);
    }
  };

  // 当搜索词改变时执行搜索
  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, items]);

  // 优化搜索结果
  const filteredItems = useMemo(() => {
    if (searchTerm.trim() === '') {
      return items;
    }
    return searchResults;
  }, [searchTerm, items, searchResults]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    isSearching,
    searchError,
  };
};