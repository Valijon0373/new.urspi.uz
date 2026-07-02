import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const RangeSlider = ({ label, min, max, step, value, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <label className="block text-[15px] font-medium text-gray-800">{label}</label>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
};

export default function AccessibilityDrawer({ isOpen, onClose }) {
  const [fontSize, setFontSize] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [zoom, setZoom] = useState(100);
  const [theme, setTheme] = useState('normal');

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    document.body.style.letterSpacing = `${letterSpacing}px`;
    document.body.style.wordSpacing = `${wordSpacing}px`;
    document.body.style.lineHeight = `${lineHeight}`;

    // Some browsers support zoom directly on body
    document.body.style.zoom = `${zoom}%`;

    // Remove old theme classes
    document.documentElement.classList.remove('theme-grayscale', 'theme-low-light', 'theme-high-contrast');

    if (theme === 'grayscale') {
      document.documentElement.classList.add('theme-grayscale');
    } else if (theme === 'lowLight') {
      document.documentElement.classList.add('theme-low-light');
    } else if (theme === 'highContrast') {
      document.documentElement.classList.add('theme-high-contrast');
    }

  }, [fontSize, letterSpacing, wordSpacing, lineHeight, zoom, theme]);

  const handleReset = () => {
    setFontSize(100);
    setLetterSpacing(0);
    setWordSpacing(0);
    setLineHeight(1.5);
    setZoom(100);
    setTheme('normal');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-[101] h-full w-[350px] bg-white shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-5 mb-4">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-black" />
          </button>
          <h2 className="text-xl font-semibold" style={{ color: '#1d4ed8' }}>Maxsus imkoniyatlar</h2>
        </div>

        <div className="px-6 pb-6 space-y-6 text-black">
          <RangeSlider
            label="Shrift o'lchami"
            min={80} max={150} step={5}
            value={fontSize}
            onChange={setFontSize}
          />

          <RangeSlider
            label="Harf oralig'i"
            min={0} max={10} step={0.5}
            value={letterSpacing}
            onChange={setLetterSpacing}
          />

          <RangeSlider
            label="So'z oralig'i"
            min={0} max={20} step={1}
            value={wordSpacing}
            onChange={setWordSpacing}
          />

          <RangeSlider
            label="So'z balandligi"
            min={1} max={3} step={0.1}
            value={lineHeight}
            onChange={setLineHeight}
          />

          <RangeSlider
            label="Masshtab"
            min={80} max={150} step={5}
            value={zoom}
            onChange={setZoom}
          />

          {/* Maxsus rang */}
          <div className="space-y-3 pt-2">
            <label className="block text-[15px] font-medium text-gray-800 mb-3">Maxsus rang</label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setTheme('normal')}
                className={`px-4 py-2 text-sm rounded border ${theme === 'normal' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Normal
              </button>
              <button
                onClick={() => setTheme('grayscale')}
                className={`px-4 py-2 text-sm rounded border ${theme === 'grayscale' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Rangsiz
              </button>
              <button
                onClick={() => setTheme('lowLight')}
                className={`px-4 py-2 text-sm rounded border ${theme === 'lowLight' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Past yorug'lik
              </button>
              <button
                onClick={() => setTheme('highContrast')}
                className={`px-4 py-2 text-sm rounded border ${theme === 'highContrast' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                Yuqori kontrast
              </button>
            </div>
          </div>

          {/* Boshlang'ich holatga qaytarish */}
          <div className="pt-6">
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-[#e9ecf1] hover:bg-[#dce0e8] text-gray-800 text-[15px] rounded-lg transition-colors"
            >
              Boshlang'ich holatga qaytarish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
