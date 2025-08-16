"use client";
import { useRef } from "react";

export default function FullscreenWrapper({ children }: { children: React.ReactNode }) {
  const appRef = useRef<HTMLDivElement>(null);

  const goFullScreen = () => {
    if (appRef.current?.requestFullscreen) {
      appRef.current.requestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={appRef} className="min-h-screen">
      {/* Fullscreen toggle buttons */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={goFullScreen}
          className="bg-black text-white px-3 py-1 rounded-md"
        >
          Fullscreen
        </button>
        <button
          onClick={exitFullScreen}
          className="bg-gray-600 text-white px-3 py-1 rounded-md"
        >
          Exit
        </button>
      </div>

      {children}
    </div>
  );
}
