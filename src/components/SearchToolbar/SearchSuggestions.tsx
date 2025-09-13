import { useState, useEffect, useRef } from "react";
import { searchOptimizationService } from "../../services/searchOptimizationService";

interface SearchSuggestionsProps {
  keyword: string;
  onSelect: (suggestion: string) => void;
  visible: boolean;
}

export function SearchSuggestions({ keyword, onSelect, visible }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Array<{ text: string; type: string; frequency: number }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 获取搜索建议
  useEffect(() => {
    if (keyword.trim().length > 1) {
      const suggestionList = searchOptimizationService.getSuggestions(keyword, 5);
      setSuggestions(suggestionList.map(s => ({
        text: s.text,
        type: s.type,
        frequency: s.frequency
      })));
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [keyword]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSelect(suggestions[selectedIndex].text);
          }
          break;
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, suggestions, selectedIndex, onSelect]);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!visible || suggestions.length === 0) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'name': return '🏷️';
      case 'platform': return '🔧';
      case 'description': return '📝';
      default: return '💡';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'name': return '名称';
      case 'platform': return '平台';
      case 'description': return '描述';
      default: return '建议';
    }
  };

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-60 overflow-y-auto"
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          搜索建议 ({suggestions.length} 项)
        </div>
      </div>

      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.text}-${suggestion.type}`}
          className={`px-3 py-2 cursor-pointer transition-colors duration-150 ${
            index === selectedIndex
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelect(suggestion.text)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{getTypeIcon(suggestion.type)}</span>
              <span className="text-sm font-medium">{suggestion.text}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getTypeLabel(suggestion.type)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {suggestion.frequency}次
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}