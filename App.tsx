import React, { useState } from 'react';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ComparisonSlider from './components/ComparisonSlider';
import { restoreImage } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setAppState(AppState.IDLE); // Ready to process
    setErrorMessage(null);
  };

  const handleProcess = async () => {
    if (!originalImage) return;

    setAppState(AppState.PROCESSING);
    setErrorMessage(null);

    try {
      const result = await restoreImage(originalImage);
      setRestoredImage(result);
      setAppState(AppState.COMPLETED);
    } catch (error: any) {
      console.error("Processing failed", error);
      setErrorMessage(error.message || "Không thể xử lý ảnh. Vui lòng thử lại.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setRestoredImage(null);
    setErrorMessage(null);
  };

  const handleRetry = () => {
    setAppState(AppState.IDLE);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <header className="text-center mb-12 space-y-3 animate-fade-in-down">
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-2">
           <Sparkles className="text-white w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          ImagesRestore
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium max-w-md mx-auto">
          Phục chế & Tô màu ảnh cổ bằng AI
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex flex-col items-center justify-center flex-1 min-h-[400px]">
        
        {/* State: IDLE (Upload or Preview) */}
        {appState === AppState.IDLE && !originalImage && (
          <ImageUploader 
            onImageSelected={handleImageSelected} 
            onError={(msg) => setErrorMessage(msg)}
          />
        )}

        {/* State: IDLE (Selected, Ready to Process) */}
        {appState === AppState.IDLE && originalImage && (
          <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-200 bg-white p-2 max-h-[60vh]">
               <img src={originalImage} alt="Original" className="w-full h-full object-contain rounded-2xl max-h-[50vh]" />
               <div className="absolute top-4 left-4 bg-gray-900/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium">Original</div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleReset}
                className="px-6 py-3 rounded-full text-gray-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Chọn ảnh khác
              </button>
              <button 
                onClick={handleProcess}
                className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles size={18} />
                Phục chế & Tô màu
              </button>
            </div>
          </div>
        )}

        {/* State: PROCESSING */}
        {appState === AppState.PROCESSING && (
          <div className="flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6 animate-bounce" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-gray-900">Đang xử lý...</h3>
              <p className="text-gray-500">AI đang phục hồi và tô màu ảnh của bạn.</p>
              <p className="text-xs text-gray-400 mt-2">Quá trình có thể mất vài giây.</p>
            </div>
          </div>
        )}

        {/* State: COMPLETED */}
        {appState === AppState.COMPLETED && originalImage && restoredImage && (
          <ComparisonSlider 
            beforeImage={originalImage} 
            afterImage={restoredImage} 
            onReset={handleReset}
          />
        )}

        {/* State: ERROR */}
        {appState === AppState.ERROR && ( // Or simple error toast
             <div className="flex flex-col items-center gap-4 text-center max-w-md bg-red-50 p-8 rounded-3xl border border-red-100 animate-shake">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-semibold text-red-900">Đã xảy ra lỗi</h3>
                <p className="text-red-600">{errorMessage}</p>
                <div className="flex gap-3 mt-2">
                   <button onClick={handleRetry} className="px-5 py-2 bg-white text-red-600 border border-red-200 rounded-full font-medium hover:bg-red-50">Thử lại</button>
                   <button onClick={handleReset} className="px-5 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700">Chọn ảnh mới</button>
                </div>
             </div>
        )}

        {/* Inline Error Toast (if in IDLE state) */}
        {appState === AppState.IDLE && errorMessage && !originalImage && (
             <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-bounce-short">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">{errorMessage}</span>
             </div>
        )}

      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} ImagesRestore AI. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
