import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RefreshCcw } from 'lucide-react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  onReset: () => void;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage, onReset }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const onMouseDown = () => setIsDragging(true);
  const onTouchStart = () => setIsDragging(true);

  const onMouseUp = () => setIsDragging(false);
  const onTouchEnd = () => setIsDragging(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, onMouseMove, onTouchMove]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = afterImage;
    link.download = 'ImagesRestore_Result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto animate-fade-in">
      
      {/* Viewer Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:h-[600px] bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 select-none cursor-ew-resize group"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        
        {/* After Image (Background - Full width) */}
        {/* We place After image as base, and overlay Before image on top to "reveal" old state or vice versa.
            Common pattern: Base is After, Overlay is Before (so sliding reveals After).
            Requirement: "After bị cắt theo vị trí slider để lộ Before". 
            So: Before is BOTTOM layer. After is TOP layer, clipped.
        */}
        
        {/* Layer 1: Before Image (Bottom) */}
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-contain bg-gray-50/50" 
          draggable={false}
        />

        {/* Layer 2: After Image (Top, Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }} // Clip from left based on position
        >
          <img 
            src={afterImage} 
            alt="After" 
            className="absolute inset-0 w-full h-full object-contain" 
            draggable={false}
          />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full z-10 pointer-events-none">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full z-10 pointer-events-none">
          After
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-transform duration-75 ease-out"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-1 h-3 bg-gray-300 rounded-full mx-0.5" />
            <div className="w-1 h-3 bg-gray-300 rounded-full mx-0.5" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 w-full justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-medium transition-all active:scale-95 shadow-sm"
        >
          <RefreshCcw size={18} />
          <span>Làm lại</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <Download size={18} />
          <span>Tải ảnh After</span>
        </button>
      </div>
    </div>
  );
};

export default ComparisonSlider;
