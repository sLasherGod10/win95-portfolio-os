import { useState, useEffect } from 'react';
import { CLINICAL_FACTS } from '../data';

export default function WinClippy() {
  const [visible, setVisible] = useState(true);
  const [factIndex, setFactIndex] = useState(0);
  const [bubbleText, setBubbleText] = useState('');
  const [wiggle, setWiggle] = useState(false);

  useEffect(() => {
    setBubbleText(CLINICAL_FACTS[factIndex]);
  }, [factIndex]);

  // Staggered auto tip rotation every 15 seconds
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      handleNextTip();
    }, 15000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleNextTip = () => {
    setWiggle(true);
    setFactIndex((prev) => (prev + 1) % CLINICAL_FACTS.length);
    setTimeout(() => setWiggle(false), 500);
  };

  if (!visible) {
    return (
      <button 
        id="summon-clippy-btn"
        onClick={() => setVisible(true)}
        className="absolute bottom-16 right-5 bg-[#c0c0c0] win95-outset p-1 text-xs font-bold leading-none cursor-pointer flex items-center space-x-1.5 shadow-md hover:bg-neutral-100 z-40 select-none"
        title="Summon CLI Helper"
      >
        <span>🖇️</span>
        <span className="text-[10px]">Show Clippy</span>
      </button>
    );
  }

  return (
    <div 
      className={`absolute bottom-14 right-4 z-40 flex flex-col items-end max-w-xs transition-all duration-300 pointer-events-auto select-none ${
        wiggle ? 'translate-y-[-5px]' : ''
      }`}
    >
      {/* Balloon style speech bubble */}
      <div className="bg-[#ffffe1] text-black text-xs p-3.5 border border-black rounded-lg shadow-lg relative mb-3.5 mr-2">
        {/* Triangle caret pointing down to Clippy */}
        <div className="absolute right-5 bottom-[-10px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black" />
        <div className="absolute right-[21px] bottom-[-8px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-[#ffffe1]" />

        <div className="space-y-2">
          {/* Bubbled speech fact */}
          <p className="leading-relaxed text-neutral-800 tracking-wide break-words">{bubbleText}</p>
          
          <div className="flex items-center justify-between pt-1 select-none">
            <button 
              id="clippy-next-btn"
              onClick={handleNextTip}
              className="text-[10px] font-bold text-blue-950 hover:underline cursor-pointer"
            >
              Next Tip &gt;
            </button>
            <button 
              id="clippy-close-btn"
              onClick={() => setVisible(false)}
              className="text-[10px] text-neutral-400 hover:text-black cursor-pointer"
            >
              Hide
            </button>
          </div>
        </div>
      </div>

      {/* Clippy Body paperclip SVG with pixel eyes */}
      <div 
        onClick={handleNextTip} 
        className="cursor-pointer group flex flex-col items-center mr-6 select-none"
        title="Click for a tip!"
      >
        <div className="relative animate-bounce duration-1000">
          {/* Classic paper clip cartoon drawing */}
          <div className="w-11 h-14 bg-gray-300 border-2 border-slate-700 rounded-full flex flex-col justify-start p-2.5 relative shadow-[2px_3px_5px_rgba(0,0,0,0.25)]">
            {/* Pixelized Googly eyes */}
            <div className="flex justify-between w-full px-0.5 mt-1.5 select-none">
              <div className="w-2.5 h-2.5 bg-white border border-slate-900 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full" />
              </div>
              <div className="w-2.5 h-2.5 bg-white border border-slate-900 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full" />
              </div>
            </div>

            {/* Cute mini eyebrows */}
            <div className="absolute top-1 left-2 space-x-4 flex">
              <div className="w-2 h-[2px] bg-black rotate-12" />
              <div className="w-2 h-[2px] bg-black -rotate-12" />
            </div>

            {/* Wide pixel mouth */}
            <div className="w-4 h-1.5 border-b-2 border-black rounded-b-full mx-auto mt-2 select-none" />

            {/* Paper clip twist overlay effect */}
            <div className="absolute inset-x-2.5 bottom-1.5 top-5 border border-slate-500 rounded-full pointer-events-none opacity-40 border-b-0" />
          </div>
        </div>
        <span className="text-[10px] font-mono text-teal-100 bg-teal-900/40 px-1 border border-teal-500/20 rounded mt-1 opacity-70 group-hover:opacity-100 select-none">
          Clippy Assistant
        </span>
      </div>
    </div>
  );
}
