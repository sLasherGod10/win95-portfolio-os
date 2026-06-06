import React, { useRef, useEffect } from 'react';
import { Minus, Square, X, Move } from 'lucide-react';
import { WindowId } from '../types';

interface OSWindowProps {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  activeId: WindowId | null;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onMaximize: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onUpdatePosition: (id: WindowId, x: number, y: number) => void;
  onUpdateSize: (id: WindowId, width: number, height: number) => void;
  children: React.ReactNode;
}

export default function OSWindow({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  x,
  y,
  width,
  height,
  activeId,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  children
}: OSWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const windowStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });
  const windowSizeStart = useRef({ w: 0, h: 0 });

  const isActive = activeId === id;

  // Handle drag mouse events
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isMaximized) return; // Prevent drag if maximized
    onFocus(id);
    
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStart.current = { x: clientX, y: clientY };
    windowStart.current = { x, y };

    e.preventDefault();
  };

  // Handle resize mouse events
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    onFocus(id);

    isResizing.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    resizeStart.current = { x: clientX, y: clientY };

    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      windowSizeStart.current = { w: rect.width, h: rect.height };
    }

    e.preventDefault();
    e.stopPropagation(); // Avoid triggering dragging handler
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      if (isDragging.current) {
        const deltaX = clientX - dragStart.current.x;
        const deltaY = clientY - dragStart.current.y;
        
        // Dynamic drag clamping inside viewport limits
        const newX = Math.max(10, Math.min(window.innerWidth - 100, windowStart.current.x + deltaX));
        const newY = Math.max(10, Math.min(window.innerHeight - 80, windowStart.current.y + deltaY));
        
        onUpdatePosition(id, newX, newY);
      }

      if (isResizing.current) {
        const deltaX = clientX - resizeStart.current.x;
        const deltaY = clientY - resizeStart.current.y;

        const newWidth = Math.max(280, windowSizeStart.current.w + deltaX);
        const newHeight = Math.max(200, windowSizeStart.current.h + deltaY);

        onUpdateSize(id, newWidth, newHeight);
      }
    };

    const handleRelease = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleRelease);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleRelease);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleRelease);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleRelease);
    };
  }, [isOpen, id, x, y, isMaximized, onUpdatePosition, onUpdateSize]);

  if (!isOpen || isMinimized) return null;

  // Render Window Frame
  const style: React.CSSProperties = isMaximized
    ? {
        position: 'absolute',
        top: '40px', // Below top line / spacing
        left: 0,
        right: 0,
        bottom: '40px', // Above taskbar
        zIndex,
      }
    : {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      id={`window-${id}`}
      style={style}
      className="win95-outset p-1 flex flex-col select-none shadow-2xl overflow-hidden transition-all duration-75"
      onClick={() => onFocus(id)}
    >
      {/* Title Bar Area with active states */}
      <div
        className={`flex items-center justify-between p-1 pl-2 pr-1 cursor-move select-none ${
          isActive ? 'win95-titlebar-active' : 'win95-titlebar-inactive'
        }`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {/* Fun retro mini-icon placeholder */}
          <span className="text-xs mr-1 opacity-90 select-none">📁</span>
          <span className="font-bold text-xs whitespace-nowrap truncate select-none tracking-wide">
            {title}
          </span>
        </div>

        {/* Windows controls (Minimize, Maximize, Close) with beveled buttons */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            id={`btn-minimize-${id}`}
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(id);
            }}
            className="w-4 h-4 text-black win95-button flex items-center justify-center p-0"
          >
            <Minus size={8} className="stroke-[3]" />
          </button>
          <button
            id={`btn-maximize-${id}`}
            title="Maximize"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(id);
            }}
            className="w-4 h-4 text-black win95-button flex items-center justify-center p-0"
          >
            <Square size={8} className="stroke-[3]" />
          </button>
          <button
            id={`btn-close-${id}`}
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className="w-4 h-4 text-black win95-button flex items-center justify-center p-0 bg-red-200"
          >
            <X size={8} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Menu option ribbon - classic vintage desktop helper */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-neutral-400 text-neutral-800 text-xs">
        <span className="cursor-pointer hover:underline">File</span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Help</span>
      </div>

      {/* Main Window Workspaces Slot - Scrollable custom area */}
      <div className="flex-1 overflow-auto win95-inset bg-[#fcfcfc] p-3 text-neutral-800 text-sm flex flex-col relative">
        {children}
      </div>

      {/* Classic status bar footer or resizing icon handle */}
      {!isMaximized && (
        <div className="flex justify-between items-center text-[10px] text-neutral-700 bg-[#c0c0c0] min-h-[18px] px-1 pt-1 flex-shrink-0">
          <div className="win95-inset-depressed flex-1 py-0.5 px-2 mr-2 select-none truncate">
            Ready
          </div>
          <div
            className="w-4 h-4 cursor-se-resize flex items-end justify-end select-none pb-0.5 pr-0.5"
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          >
            {/* Grab Grid Ribs representation */}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-70">
              <path d="M10 0 L0 10 M10 4 L4 10 M10 8 L8 10" stroke="#808080" strokeWidth="1.5" />
              <path d="M10 1 L1 10 M10 5 L5 10 M10 9 L9 10" stroke="#ffffff" strokeWidth="1" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
