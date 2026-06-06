import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, Download } from 'lucide-react';

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const isDrawing = useRef(false);

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff'
  ];

  // Auto resize canvas to fit content container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-res backing
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = (rect?.width || 500) - 20;
    canvas.height = (rect?.height || 350) - 100;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath(); // Reset paths
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get position offsets relative to canvas bounds
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#ffffff' : color;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    e.preventDefault();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'ms_paint_doodle.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full space-y-3 p-1">
      {/* Paint Tool Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-neutral-200 border-b border-neutral-300 select-none">
        <div className="flex items-center space-x-2">
          {/* Brush button */}
          <button
            id="paint-pencil-btn"
            onClick={() => setIsEraser(false)}
            className={`w-7 h-7 flex items-center justify-center win95-button ${!isEraser ? 'win95-inset-depressed bg-[#dedede]' : ''}`}
            title="Brush Tool"
          >
            <Pencil size={14} />
          </button>

          {/* Eraser button */}
          <button 
            id="paint-erase-btn"
            onClick={() => setIsEraser(true)}
            className={`w-7 h-7 flex items-center justify-center win95-button ${isEraser ? 'win95-inset-depressed bg-[#dedede]' : ''}`}
            title="Eraser Tool"
          >
            <Eraser size={14} />
          </button>

          {/* Spacer */}
          <div className="w-[1px] h-6 bg-neutral-400 mx-1" />

          {/* Brush thickness select */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-bold text-neutral-600">Thick:</span>
            {[2, 4, 8, 14].map((size) => (
              <button
                key={size}
                id={`paint-size-${size}`}
                onClick={() => setBrushSize(size)}
                className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono win95-button ${
                  brushSize === size ? 'win95-inset-depressed bg-[#dedede] font-bold' : ''
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Clear & Save trigger */}
        <div className="flex items-center space-x-1.5">
          <button 
            id="paint-clear-btn"
            onClick={clearCanvas}
            className="px-2 py-0.5 text-[10px] font-bold win95-button bg-neutral-200 flex items-center space-x-1"
            title="Clear canvas"
          >
            <Trash2 size={11} />
            <span>Clear</span>
          </button>
          <button 
            id="paint-save-btn"
            onClick={saveCanvas}
            className="px-2 py-0.5 text-[10px] font-bold win95-button bg-neutral-200 flex items-center space-x-1"
            title="Download painting"
          >
            <Download size={11} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Stage Canvas */}
      <div className="flex-1 min-h-[220px] bg-neutral-300 win95-inset p-1 flex justify-center items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="bg-white cursor-crosshair border border-neutral-400 block max-w-full"
        />
      </div>

      {/* Bottom Color Palette ribbon panel */}
      <div className="bg-neutral-200 border border-neutral-300 p-1.5 win95-outset select-none">
        <div className="flex items-center space-x-2.5">
          {/* Active indicator box */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-neutral-500 font-bold uppercase mb-0.5">Active</span>
            <div 
              className="w-7 h-7 border border-neutral-500 shadow-inner flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* Palette Blocks selection list */}
          <div className="grid grid-cols-12 gap-1 flex-1">
            {colors.map((c, idx) => (
              <div
                key={idx}
                id={`paint-palette-${idx}`}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                className={`w-4 h-4 cursor-pointer border border-[#808080] hover:scale-110 active:scale-95 duration-75 flex-shrink-0 ${
                  color === c && !isEraser ? 'ring-2 ring-black outline-none scale-105' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
