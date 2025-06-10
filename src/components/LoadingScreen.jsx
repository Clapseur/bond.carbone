import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
      {/* Animated logo/text */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider animate-pulse">
          CARBONE
        </h1>
      </div>
      
      {/* Loading spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
      
      {/* Loading text */}
      <p className="mt-6 text-white/70 text-lg animate-pulse">
        Initializing...
      </p>
      
      {/* Progress bar */}
      <div className="mt-4 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-pulse" style={{
          animation: 'loading-progress 2.5s ease-in-out infinite'
        }}></div>
      </div>
      
      <style jsx>{`
        @keyframes loading-progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;