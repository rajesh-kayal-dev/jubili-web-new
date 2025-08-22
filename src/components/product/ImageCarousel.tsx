"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface ImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length <= 1 || !isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  // Scroll to center the current image
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const targetImage = container.children[index] as HTMLElement;
    
    if (targetImage) {
      const containerWidth = container.offsetWidth;
      const imageLeft = targetImage.offsetLeft;
      const imageWidth = targetImage.offsetWidth;
      
      // Center the target image
      const scrollPosition = imageLeft - (containerWidth / 2) + (imageWidth / 2);
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, []);

  // Update scroll position when currentIndex changes
  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
    
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  // Handle scroll to update current index based on center-most image
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    Array.from(container.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const imageCenter = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(containerCenter - imageCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  }, [currentIndex]);

  // Debounced scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 150);
    };

    container.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      container.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  if (!images || images.length === 0) {
    return (
      <div className="h-[440px] rounded-2xl bg-gray-50 flex items-center justify-center">
        <img src="/window.svg" alt={productName} className="max-h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Fixed Height Container like Flutter ListView */}
      <div className="h-[440px] rounded-2xl bg-gray-50 overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-x-auto overflow-y-hidden flex items-center gap-4 px-4 cursor-grab active:cursor-grabbing select-none"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 h-full flex items-center">
              <img 
                src={image} 
                alt={`${productName} - Image ${index + 1}`} 
                className="h-full w-auto object-contain pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: Math.abs(index - currentIndex) <= 1 ? 1 : 0.7
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}