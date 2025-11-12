'use client';

import { useState, useRef, useEffect } from 'react';

interface RepoSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (repoUrl: string) => void;
  placeholder?: string;
}

// 预定义的仓库列表
const PREDEFINED_REPOS = [
  {
    name: 'kafka-python',
    fullName: 'dpkp/kafka-python',
    url: 'https://github.com/dpkp/kafka-python',
    description: 'Python client for Apache Kafka'
  },
  {
    name: 'xiangtian-workbench',
    fullName: 'FxRayHughes/xiangtian-workbench',
    url: 'https://github.com/FxRayHughes/xiangtian-workbench',
    description: 'Workbench for data analysis'
  },
  {
    name: 'wumei-smart',
    fullName: 'kerwincui/wumei-smart',
    url: 'https://github.com/kerwincui/wumei-smart',
    description: 'Smart home system'
  },
  {
    name: 'probabilistic-forecasts-attacks',
    fullName: 'eth-sri/probabilistic-forecasts-attacks',
    url: 'https://github.com/eth-sri/probabilistic-forecasts-attacks',
    description: 'Probabilistic forecasts and attacks'
  },
  {
    name: 'VueDjangoAntdProBookShop',
    fullName: 'mtianyan/VueDjangoAntdProBookShop',
    url: 'https://github.com/mtianyan/VueDjangoAntdProBookShop',
    description: 'Book shop with Vue and Django'
  },
  {
    name: 'pytorch',
    fullName: 'pytorch/pytorch',
    url: 'https://github.com/pytorch/pytorch',
    description: 'Tensors and Dynamic neural networks in Python'
  },
  {
    name: 'tensorflow',
    fullName: 'tensorflow/tensorflow',
    url: 'https://github.com/tensorflow/tensorflow',
    description: 'An Open Source Machine Learning Framework for Everyone'
  },
  {
    name: 'DeepSeek-V3',
    fullName: 'deepseek-ai/DeepSeek-V3',
    url: 'https://github.com/deepseek-ai/DeepSeek-V3',
    description: 'DeepSeek V3 Language Model'
  },
  {
    name: 'llama',
    fullName: 'meta-llama/llama',
    url: 'https://github.com/meta-llama/llama',
    description: 'Inference code for LLaMA models'
  },
  {
    name: 'mistral-inference',
    fullName: 'mistralai/mistral-inference',
    url: 'https://github.com/mistralai/mistral-inference',
    description: 'Reference implementation of Mistral AI 7B v0.1'
  }
];

export function RepoSearchInput({
  value,
  onChange,
  onSelect,
  placeholder = "输入仓库名称或 URL (例如: llama)"
}: RepoSearchInputProps) {
  const [suggestions, setSuggestions] = useState<typeof PREDEFINED_REPOS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 过滤建议
  const filterSuggestions = (input: string) => {
    if (!input.trim()) {
      return [];
    }

    const searchTerm = input.toLowerCase();
    return PREDEFINED_REPOS.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm) ||
      repo.fullName.toLowerCase().includes(searchTerm) ||
      repo.description.toLowerCase().includes(searchTerm)
    );
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const filtered = filterSuggestions(newValue);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  // 选择建议
  const handleSelectSuggestion = (repo: typeof PREDEFINED_REPOS[0]) => {
    onChange(repo.url);
    setShowSuggestions(false);
    onSelect?.(repo.url);
  };

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          const filtered = filterSuggestions(value);
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        }}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-300 glow-hover"
      />

      {/* 建议下拉框 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((repo, index) => (
            <button
              key={repo.url}
              type="button"
              onClick={() => handleSelectSuggestion(repo)}
              className="w-full px-4 py-3 text-left hover:bg-[var(--primary)]/10 transition-colors border-b border-[var(--border)] last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-[var(--foreground)]">
                    {repo.fullName}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1">
                    {repo.description}
                  </div>
                </div>
                <div className="text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">
                  点击选择
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 帮助文本 */}
      <div className="mt-2 text-sm text-[var(--muted-foreground)]">
        提示：输入仓库名称如 {'"'}llama{'"'} 会自动提示完整链接
      </div>
    </div>
  );
}