'use client';

import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 主加载动画 */}
      <div className="relative">
        {/* 外圈旋转 */}
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* 内圈旋转 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>

        {/* 中心点 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
      </div>

      {/* 加载文本 */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">供应链安全平台</h2>
        <p className="text-gray-600 animate-pulse">正在加载中...</p>
      </div>

      {/* 进度指示器 */}
      <div className="mt-6 w-64 bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>

      {/* 加载提示 */}
      <div className="mt-8 text-sm text-gray-500 text-center max-w-md">
        <p>正在为您准备最佳的安全分析体验</p>
      </div>
    </div>
  );
}