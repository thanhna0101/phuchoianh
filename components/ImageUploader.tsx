import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, FileWarning } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  onError: (msg: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      onError('Định dạng không hỗ trợ. Vui lòng dùng JPG, PNG hoặc WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      onError('File quá lớn. Vui lòng chọn ảnh dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`
        relative w-full max-w-2xl h-80 rounded-[32px] border-2 border-dashed transition-all duration-300 ease-out flex flex-col items-center justify-center cursor-pointer overflow-hidden
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        }
      `}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInput} 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp"
      />
      
      <div className="flex flex-col items-center gap-4 p-8 text-center animate-fade-in-up">
        <div className={`p-5 rounded-full ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} transition-colors duration-300`}>
          {isDragging ? <Upload size={32} /> : <ImageIcon size={32} />}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {isDragging ? 'Thả ảnh vào đây' : 'Tải ảnh lên'}
          </h3>
          <p className="text-sm text-gray-500">
            Kéo thả hoặc nhấn để chọn file
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mt-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">JPG</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PNG</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">WEBP</span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
