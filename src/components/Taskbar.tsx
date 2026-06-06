import { useState, useEffect, useRef } from 'react';
import { Menu, Terminal, Award, Briefcase, User2, MessageSquare, Play, HelpCircle, Gamepad2, PenTool } from 'lucide-react';
import { OSWindow, WindowId } from '../types';

interface TaskbarProps {
  windows: OSWindow[];
  activeId: WindowId | null;
  onToggleMinimize: (id: WindowId) => void;
  onOpenWindow: (id: WindowId) => void;
  onTriggerShutdown: () => void;
}

export default function Taskbar({
  windows,
  activeId,
  onToggleMinimize,
  onOpenWindow,
  onTriggerShutdown
}: TaskbarProps) {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const startMenuRef = useRef<HTMLDivElement>(null);

  // Real-time tray clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Double-convert 0 to 12
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside listener for the Start Menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (startMenuOpen && startMenuRef.current && !startMenuRef.current.contains(e.target as Node)) {
        setStartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen]);

  // Open task with automatic Start Menu closure
  const handleStartCommand = (id: WindowId) => {
    onOpenWindow(id);
    setStartMenuOpen(false);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-t-white win95-outset z-50 flex items-center justify-between px-1 gap-1 select-none"
      style={{ zIndex: 99999 }}
    >
      {/* Start Button & Active Tasks */}
      <div className="flex items-center space-x-1.5 flex-1 overflow-hidden h-full py-0.5">
        
        {/* Legendary Start Button */}
        <button
          id="start-button"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className={`h-7 px-2.5 font-bold text-xs flex items-center space-x-1 win95-button shrink-0 select-none ${
            startMenuOpen ? 'win95-inset-depressed bg-[#dedede] border-1 pt-1 pl-3' : ''
          }`}
        >
          {/* Custom retro Windows flag rendering inside button */}
          <span className="text-sm select-none mr-1 flex items-center justify-center">❖</span>
          <span>Start</span>
        </button>

        {/* Vertical divider line */}
        <div className="w-[1.5px] h-6 bg-neutral-400 shrink-0" />

        {/* Live Tasks Drawer list */}
        <div className="flex-1 flex space-x-1.5 overflow-x-auto h-full items-center no-scrollbar">
          {windows.map((win) => {
            if (!win.isOpen) return null;
            const isTabActive = activeId === win.id && !win.isMinimized;

            return (
              <button
                key={win.id}
                id={`task-tab-${win.id}`}
                onClick={() => onToggleMinimize(win.id)}
                className={`h-7 px-2 px-3 text-[11px] font-bold text-neutral-800 flex items-center space-x-1.5 shrink-0 max-w-[140px] truncate select-none ${
                  isTabActive
                    ? 'win95-inset-depressed bg-[#dfdfdf] border-1 border-neutral-700/60 pt-1'
                    : 'win95-outset bg-neutral-200 border-2'
                }`}
                title={win.title}
              >
                <span className="text-xs shrink-0 select-none">{win.icon}</span>
                <span className="truncate whitespace-nowrap leading-none select-none">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side System tray */}
      <div className="h-7 px-2 bg-neutral-200 win95-inset-depressed flex items-center space-x-2 shrink-0 md:mr-0.5">
        
        {/* Retro hardware widgets representations */}
        <div className="flex items-center space-x-1.5 opacity-80 text-xs shrink-0 pl-1">
          <span title="Net: Connected @ COM3" className="cursor-help select-none">🖧</span>
          <span title="Audio: Operational" className="cursor-help select-none">🔊</span>
        </div>

        {/* Vertical tray splitter line */}
        <div className="w-[1px] h-4 bg-neutral-400 select-none shrink-0" />

        {/* Digital updating clock */}
        <span className="text-[10px] font-bold font-mono text-neutral-800 tracking-wide select-none">
          {currentTime}
        </span>
      </div>

      {/* Start Menu Popup */}
      {startMenuOpen && (
        <div
          ref={startMenuRef}
          id="start-menu"
          className="absolute bottom-10 left-1 w-64 bg-[#c0c0c0] win95-outset p-1 flex shadow-2xl overflow-hidden select-none"
          style={{ zIndex: 100000 }}
        >
          {/* Windows 95 Logo Side Strip */}
          <div className="w-10 bg-gradient-to-b from-blue-900 via-blue-950 to-neutral-900 p-1 flex items-end justify-center select-none text-white overflow-hidden shrink-0">
            <span className="font-bold text-base tracking-widest text-teal-100 font-mono rotate-270 uppercase whitespace-nowrap block pb-2 drop-shadow-md select-none leading-none">
              Windows<span className="text-amber-500 text-lg">95</span>
            </span>
          </div>

          {/* Start Menu items list */}
          <div className="flex-1 flex flex-col py-1.5 pl-1 bg-[#c0c0c0]">
            
            {/* Group 1: Career metrics / Resume short-links */}
            <button
              id="start-about"
              onClick={() => handleStartCommand('about')}
              className="w-full px-2.5 py-1.5 hover:bg-blue-900 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-neutral-100 p-1 rounded group-hover:bg-blue-950 shadow-sm border border-neutral-300 transform group-hover:scale-110 duration-75">👤</span>
              <div className="flex flex-col">
                <span className="font-bold">About Intern</span>
                <span className="text-[9px] opacity-70">Read summary profiles</span>
              </div>
            </button>

            <button
              id="start-projects"
              onClick={() => handleStartCommand('projects')}
              className="w-full px-2.5 py-1.5 hover:bg-blue-900 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-neutral-100 p-1 rounded group-hover:bg-blue-950 shadow-sm border border-neutral-300 transform group-hover:scale-110 duration-75">📂</span>
              <div className="flex flex-col">
                <span className="font-bold">Projects Archive</span>
                <span className="text-[9px] opacity-70">Inspect coded systems</span>
              </div>
            </button>

            <button
              id="start-skills"
              onClick={() => handleStartCommand('skills')}
              className="w-full px-2.5 py-1.5 hover:bg-blue-900 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-neutral-100 p-1 rounded group-hover:bg-blue-950 shadow-sm border border-neutral-300 transform group-hover:scale-110 duration-75">⚙️</span>
              <div className="flex flex-col">
                <span className="font-bold">Skills Matrix</span>
                <span className="text-[9px] opacity-70">Monitor driver capacities</span>
              </div>
            </button>

            <button
              id="start-contact"
              onClick={() => handleStartCommand('contact')}
              className="w-full px-2.5 py-1.5 hover:bg-blue-900 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-neutral-100 p-1 rounded group-hover:bg-blue-950 shadow-sm border border-neutral-300 transform group-hover:scale-110 duration-75">✉️</span>
              <div className="flex flex-col">
                <span className="font-bold">Contact Card</span>
                <span className="text-[9px] opacity-70">Direct messaging channels</span>
              </div>
            </button>

            {/* Splitter Line */}
            <div className="border-t border-neutral-400 my-1.5 mx-2" />

            {/* Group 2: Fun games & utilities */}
            <button
              id="start-paint"
              onClick={() => handleStartCommand('paint')}
              className="w-full px-2.5 py-1.2 hover:bg-blue-900 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-neutral-100 p-1 rounded group-hover:bg-blue-950 shadow-sm border border-neutral-300 transform group-hover:scale-105 duration-75">🎨</span>
              <div className="flex flex-col">
                <span className="font-semibold">Retro Paint</span>
                <span className="text-[9px] opacity-60">Draw custom doodles</span>
              </div>
            </button>

            <button
              id="start-mines"
              onClick={() => handleStartCommand('mines')}
              className="w-full px-2.5 py-1.2 hover:bg-blue-900 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-neutral-100 p-1 rounded group-hover:bg-blue-950 shadow-sm border border-neutral-300 transform group-hover:scale-105 duration-75">🚩</span>
              <div className="flex flex-col">
                <span className="font-semibold">Minesweeper</span>
                <span className="text-[9px] opacity-60">Retro 9x9 sweep game</span>
              </div>
            </button>

            <button
              id="start-cli"
              onClick={() => handleStartCommand('cli')}
              className="w-full px-2.5 py-1.2 hover:bg-blue-900 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-neutral-100 p-1 rounded group-hover:bg-blue-950 shadow-sm border border-neutral-300 transform group-hover:scale-105 duration-75">💬</span>
              <div className="flex flex-col">
                <span className="font-semibold">Run Command dialogue</span>
                <span className="text-[9px] opacity-60">Launch app parameters</span>
              </div>
            </button>

            {/* Splitter Line */}
            <div className="border-t border-neutral-400 my-1.5 mx-2" />

            {/* Group 3: Core Power Commands */}
            <button
              id="start-shutdown"
              onClick={onTriggerShutdown}
              className="w-full px-2.5 py-1.5 hover:bg-red-800 hover:text-white text-left text-xs text-neutral-800 flex items-center space-x-3 group"
            >
              <span className="text-sm bg-red-100 p-1 rounded group-hover:bg-red-950 shadow-sm border border-red-300 transform group-hover:scale-110 duration-75">🔴</span>
              <div className="flex flex-col">
                <span className="font-bold text-red-900 group-hover:text-white">Restart Kernel...</span>
                <span className="text-[9px] opacity-70 text-red-700/80 group-hover:text-red-100/70">Wipe process and reboot</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
