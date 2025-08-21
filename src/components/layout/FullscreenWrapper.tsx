"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import icon from "../../../public/icons/fullscreen.png"; 
import CustomButton from "../ui/CustomButton";

export default function FullscreenWrapper({ children }: { children: React.ReactNode }) {
  const appRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  useEffect(() => {
    // Check if device is mobile and show prompt instead of auto-entering fullscreen
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setShowFullscreenPrompt(true);
    }

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      const currentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(currentlyFullscreen);
      if (currentlyFullscreen) {
        setShowFullscreenPrompt(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && appRef.current?.requestFullscreen) {
      appRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const confirmEnterFullscreen = async () => {
    try {
      if (appRef.current?.requestFullscreen) {
        await appRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      // Silently fail; on some mobile browsers this may be blocked
    } finally {
      setShowFullscreenPrompt(false);
    }
  };

  return (
    <div 
      ref={appRef} 
      className="min-h-screen bg-white"
      style={{ backgroundColor: 'white' }}
    >
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullScreen}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/50 backdrop-blur-md hover:bg-white/20 transition-all duration-200 shadow-md"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
      <Image 
        src={icon}
        alt="Fullscreen toggle"
        width={16}
        height={16}
        className={`transition-transform duration-200 ${isFullscreen ? 'rotate-180' : ''}`}
      />
      </button>


      {showFullscreenPrompt && !isFullscreen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-3">Enter Fullscreen?</h2>
            <p className="text-gray-600 mb-6">
              For the best experience on mobile, we recommend viewing this page in fullscreen.
            </p>
            <div className="flex items-center gap-3">
              <CustomButton
                onClick={confirmEnterFullscreen}
                loading={false}
                label="Enter fullscreen"
                icon={undefined}
                iconPosition="left"
              />
              <CustomButton
                onClick={() => setShowFullscreenPrompt(false)}
                loading={false}
                label="Not now"
                backgroundColor="#e5e7eb"
                textColor="#111827"
                iconPosition="left"
              />
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
