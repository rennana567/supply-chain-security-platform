'use client';

import { useRef, useState, useEffect } from 'react';

interface RepoInputProps {
  value: string;
  onChange: (value: string) => void;
  onFileSelect?: (file: File) => void;
  placeholder?: string;
  showFileUpload?: boolean;
  required?: boolean;
  error?: string;
}

// 预定义的仓库URL映射
const REPO_SUGGESTIONS: Record<string, string> = {
  'llama': 'https://github.com/meta-llama/llama',
  'pytorch': 'https://github.com/pytorch/pytorch',
  'tensorflow': 'https://github.com/tensorflow/tensorflow',
  'react': 'https://github.com/facebook/react',
  'vue': 'https://github.com/vuejs/vue',
  'angular': 'https://github.com/angular/angular',
  'node': 'https://github.com/nodejs/node',
  'kubernetes': 'https://github.com/kubernetes/kubernetes',
  'docker': 'https://github.com/docker/docker',
  'vscode': 'https://github.com/microsoft/vscode',
};

export function RepoInput({
  value,
  onChange,
  onFileSelect,
  placeholder = "输入 GitHub / Gitee 仓库 URL",
  showFileUpload = true,
  required = false,
  error
}: RepoInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  // 根据输入内容生成建议
  useEffect(() => {
    if (value.trim() && !value.includes('/')) {
      const matched = Object.keys(REPO_SUGGESTIONS)
        .filter(key => key.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 3);
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(REPO_SUGGESTIONS[suggestion]);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // 延迟隐藏，以便点击建议项
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full px-6 py-4 bg-[var(--input)] border rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-300 glow-hover ${
            error ? 'border-red-500' : 'border-[var(--border)]'
          }`}
        />
        {showFileUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.tar,.tar.gz,.rar"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <button
                type="button"
                onClick={handleFileClick}
                className="px-4 py-2 text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
              >
                {fileName || '或上传压缩包'}
              </button>
            </div>
          </>
        )}

        {/* 自动完成建议 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-[var(--input)] transition-colors border-b border-[var(--border)] last:border-b-0"
              >
                <div className="font-medium text-[var(--foreground)]">{suggestion}</div>
                <div className="text-sm text-[var(--muted-foreground)] truncate">
                  {REPO_SUGGESTIONS[suggestion]}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
      {fileName && (
        <div className="mt-2 text-sm text-[var(--muted-foreground)]">
          已选择: {fileName}
        </div>
      )}
    </div>
  );
}

