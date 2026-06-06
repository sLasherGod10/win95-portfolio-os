import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WindowId, OSWindow } from './types';
import { PERSONAL_INFO } from './data';

import BootScreen from './components/BootScreen';
import OSWindowFrame from './components/OSWindow';
import Taskbar from './components/Taskbar';
import WinClippy from './components/WinClippy';

// App Components
import AboutApp from './components/Apps/AboutApp';
import ProjectsApp from './components/Apps/ProjectsApp';
import SkillsApp from './components/Apps/SkillsApp';
import ContactApp from './components/Apps/ContactApp';
import PaintApp from './components/Apps/PaintApp';
import MinesApp from './components/Apps/MinesApp';
import RunApp from './components/Apps/RunApp';

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [activeId, setActiveId] = useState<WindowId | null>('about');
  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [shutdownDialogue, setShutdownDialogue] = useState(false);

  // Initialize Window coordinates based on responsive layout on startup
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    const initialWindows: OSWindow[] = [
      {
        id: 'about',
        title: 'About Intern - Resume_Atharva.doc',
        isOpen: true,
        isMinimized: false,
        isMaximized: isMobile,
        zIndex: 10,
        x: isMobile ? 10 : 80,
        y: isMobile ? 40 : 60,
        width: isMobile ? '95%' : 600,
        height: isMobile ? '80%' : 540,
        icon: '👤'
      },
      {
        id: 'projects',
        title: 'Projects Directory - code/',
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        zIndex: 5,
        x: isMobile ? 12 : 120,
        y: isMobile ? 45 : 90,
        width: isMobile ? '95%' : 620,
        height: isMobile ? '80%' : 520,
        icon: '📂'
      },
      {
        id: 'skills',
        title: 'Skills Matrix - config.sys',
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        zIndex: 5,
        x: isMobile ? 15 : 150,
        y: isMobile ? 50 : 120,
        width: isMobile ? '95%' : 600,
        height: isMobile ? '80%' : 500,
        icon: '⚙️'
      },
      {
        id: 'contact',
        title: 'Contact Card - COM1_modem',
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        zIndex: 5,
        x: isMobile ? 10 : 180,
        y: isMobile ? 40 : 140,
        width: isMobile ? '95%' : 560,
        height: isMobile ? '80%' : 500,
        icon: '✉️'
      },
      {
        id: 'paint',
        title: 'MSPaint - Doodle_Canvas.bmp',
        isOpen: false,
        isMinimized: false,
        isMaximized: isMobile,
        zIndex: 5,
        x: isMobile ? 10 : 200,
        y: isMobile ? 40 : 150,
        width: isMobile ? '95%' : 520,
        height: isMobile ? '80%' : 440,
        icon: '🎨'
      },
      {
        id: 'mines',
        title: 'Minesweeper OS-Core',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 5,
        x: isMobile ? 10 : 280,
        y: isMobile ? 50 : 100,
        width: isMobile ? '95%' : 290,
        height: isMobile ? 'auto' : 380,
        icon: '🏁'
      },
      {
        id: 'cli',
        title: 'Run Prompt',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 10,
        x: isMobile ? 20 : 240,
        y: isMobile ? 120 : 220,
        width: isMobile ? '90%' : 345,
        height: 'auto',
        icon: '🏃'
      }
    ];

    setWindows(initialWindows);
  }, []);

  // Web Audio retro tone generator representing physical motherboard buzzer tones
  const playRetroBeep = (freq = 600, duration = 0.1, type: OscillatorType = 'sine') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.02);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  };

  // Elevate focused window layering
  const focusWindow = (id: WindowId) => {
    setActiveId(id);
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => {
        if (w.id === id) {
          // Bring to front
          return { ...w, zIndex: maxZ + 1, isMinimized: false };
        }
        return w;
      });
    });
  };

  // Launch a window
  const openWindow = (id: WindowId) => {
    playRetroBeep(440, 0.12, 'triangle');
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isOpen: true, isMinimized: false };
        }
        return w;
      })
    );
    setTimeout(() => {
      focusWindow(id);
    }, 50);
  };

  // Minimize window state toggles from desktop shortcuts or taskbar clicks
  const toggleMinimize = (id: WindowId) => {
    playRetroBeep(330, 0.08);
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          if (w.isMinimized) {
            // Restore window
            setTimeout(() => focusWindow(id), 50);
            return { ...w, isMinimized: false };
          } else if (activeId === id) {
            // Minimize currently focused window
            return { ...w, isMinimized: true };
          } else {
            // If window was open but inactive, focus it first
            setTimeout(() => focusWindow(id), 50);
            return w;
          }
        }
        return w;
      })
    );
  };

  // Close window parameters
  const closeWindow = (id: WindowId) => {
    playRetroBeep(220, 0.1, 'sine');
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isOpen: false };
        }
        return w;
      })
    );
    if (activeId === id) {
      // Shift active focus to another open window
      const openWins = windows.filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
      if (openWins.length > 0) {
        const sorted = [...openWins].sort((a, b) => b.zIndex - a.zIndex);
        setActiveId(sorted[0].id);
      } else {
        setActiveId(null);
      }
    }
  };

  // Maximize toggling features
  const toggleMaximize = (id: WindowId) => {
    playRetroBeep(520, 0.12, 'triangle');
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isMaximized: !w.isMaximized };
        }
        return w;
      })
    );
  };

  // Update drag position offsets in coordinates array
  const handleUpdatePosition = (id: WindowId, newX: number, newY: number) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, x: newX, y: newY };
        }
        return w;
      })
    );
  };

  // Update resizes in coordinates array
  const handleUpdateSize = (id: WindowId, newWidth: number, newHeight: number) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, width: newWidth, height: newHeight };
        }
        return w;
      })
    );
  };

  // Restart OS trigger
  const handleWipeShutdown = () => {
    setShutdownDialogue(false);
    setIsBooted(false);
  };

  // List of shortcuts mapped grid-wise on the screen
  const desktopShortcuts = [
    { id: 'about' as WindowId, title: "Intern Bio", icon: "👤" },
    { id: 'projects' as WindowId, title: "Code Archive", icon: "📂" },
    { id: 'skills' as WindowId, title: "Driver Config", icon: "⚙️" },
    { id: 'contact' as WindowId, title: "COM1 Modem", icon: "✉️" },
    { id: 'paint' as WindowId, title: "MSPainted", icon: "🎨" },
    { id: 'mines' as WindowId, title: "Minesweeper", icon: "🏁" }
  ];

  if (!isBooted) {
    return <BootScreen onComplete={() => setIsBooted(true)} />;
  }

  return (
    <div className="w-screen h-screen relative bg-[#008080] win95-pattern overflow-hidden flex flex-col font-sans select-none">
      
      {/* CRT Scanline Retro Backdrop Layer */}
      <div className="absolute inset-0 pointer-events-none z-[9999] opacity-[0.035] bg-neutral-950 scanlines" />

      {/* Main OS Desktop space for desktop icons and floaters */}
      <div 
        id="desktop-canvas"
        className="flex-1 w-full relative p-4 pb-14 overflow-hidden select-none"
      >
        {/* Desktop Shortcuts grid columns on the left */}
        <div className="desktop-grid grid grid-flow-col auto-cols-min gap-y-6 gap-x-5 select-none max-h-[85%]">
          {desktopShortcuts.map((sh) => {
            const isRunning = windows.find((w) => w.id === sh.id)?.isOpen;

            return (
              <button
                key={sh.id}
                id={`shortcut-${sh.id}`}
                onClick={() => openWindow(sh.id)}
                className="w-16 h-18 cursor-pointer flex flex-col items-center group relative select-none"
              >
                {/* File Icon Graphic */}
                <div className="w-12 h-12 flex items-center justify-center text-3xl group-hover:scale-110 active:scale-95 duration-100 ease-out select-none relative">
                  <span>{sh.icon}</span>
                  {/* Miniature Green "Running" Indicator Dot */}
                  {isRunning && (
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white animate-pulse" />
                  )}
                </div>
                
                {/* Shortcut Label Text */}
                <span className="text-[10px] font-mono leading-tight tracking-wide text-white text-center mt-1 px-1 bg-teal-950/40 rounded-sm font-semibold select-none group-hover:bg-[#000080] border border-transparent group-hover:border-white/10 select-none pb-0.5 truncate max-w-full">
                  {sh.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Paperclip assistant */}
        <WinClippy />

        {/* Sub-application Screens wrapper */}
        <AnimatePresence>
          {windows.map((win) => {
            if (!win.isOpen || win.isMinimized) return null;

            return (
              <motion.div
                key={win.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.12 }}
                style={{ pointerEvents: 'auto' }}
                className="contents"
              >
                <OSWindowFrame
                  id={win.id}
                  title={win.title}
                  isOpen={win.isOpen}
                  isMinimized={win.isMinimized}
                  isMaximized={win.isMaximized}
                  zIndex={win.zIndex}
                  x={win.x}
                  y={win.y}
                  width={win.width}
                  height={win.height}
                  activeId={activeId}
                  onClose={closeWindow}
                  onMinimize={toggleMinimize}
                  onMaximize={toggleMaximize}
                  onFocus={focusWindow}
                  onUpdatePosition={handleUpdatePosition}
                  onUpdateSize={handleUpdateSize}
                >
                  {/* Select corresponding client app inside frame */}
                  {win.id === 'about' && <AboutApp />}
                  {win.id === 'projects' && <ProjectsApp />}
                  {win.id === 'skills' && <SkillsApp />}
                  {win.id === 'contact' && <ContactApp />}
                  {win.id === 'paint' && <PaintApp />}
                  {win.id === 'mines' && <MinesApp />}
                  {win.id === 'cli' && (
                    <RunApp 
                      onExecuteCommand={openWindow} 
                      onClose={() => closeWindow('cli')} 
                    />
                  )}
                </OSWindowFrame>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Shutdown restart dialogue pop up */}
      {shutdownDialogue && (
        <div className="absolute inset-0 m-auto w-84 h-48 bg-[#c0c0c0] win95-outset z-[99999] p-1 flex flex-col shadow-2xl select-none">
          <div className="win95-titlebar-active px-2 py-0.5 text-xs font-bold flex justify-between select-none">
            <span>Critical Shutdown Warning</span>
            <button 
              onClick={() => setShutdownDialogue(false)}
              className="w-4 h-4 bg-[#c0c0c0] text-black win95-button flex items-center justify-center text-[10px]"
            >
              x
            </button>
          </div>
          <div className="p-4 flex space-x-3 items-start select-none">
            <span className="text-3xl">🔌</span>
            <div className="space-y-3.5 flex-1">
              <p className="text-xs text-neutral-800 leading-normal font-mono">
                System kernel request: Restarting Atharva-OS will unload memory modules and reboot to BIOS diagnostics. Proceed?
              </p>
              <div className="flex justify-end space-x-2">
                <button 
                  id="reboot-ok"
                  onClick={handleWipeShutdown}
                  className="px-4 py-1.5 font-bold text-xs win95-button text-black bg-neutral-200"
                >
                  Reboot
                </button>
                <button 
                  id="reboot-abort"
                  onClick={() => setShutdownDialogue(false)}
                  className="px-4 py-1.5 font-semibold text-xs win95-button text-black bg-neutral-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retro Bottom Taskbar */}
      <Taskbar
        windows={windows}
        activeId={activeId}
        onToggleMinimize={toggleMinimize}
        onOpenWindow={openWindow}
        onTriggerShutdown={() => {
          playRetroBeep(330, 0.15, 'square');
          setShutdownDialogue(true);
        }}
      />
    </div>
  );
}
