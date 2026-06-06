import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, HardDrive } from 'lucide-react';
import { PERSONAL_INFO } from '../data';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [bootStep, setBootStep] = useState(0);
  const [dosLogs, setDosLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Sound Synthesizer using Web Audio API to generate a nostalgic Windows 95 opening chime
  const playRetroChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Let's build a classic sweeping bell pad sequence
      // Note frequencies for a retro major chord arpeggio (C maj 9 / G chord)
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99]; // C4, E4, G4, B4, C5, E5, G5
      const now = ctx.currentTime;
      
      notes.forEach((freq, idx) => {
        // Base sine oscillator for the bell
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        // Add a subtle frequency modulation or retro flutter
        osc.frequency.exponentialRampToValueAtTime(freq + 10, now + idx * 0.12 + 1.2);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0, now + idx * 0.12);
        gainNode.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 2.5);
        
        // Add a lowpass filter to make it warmer
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 2.0);
        
        osc.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(ctx.destination);
        
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 3.0);
      });

      // Ambient bass rumble
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(130.81, now); // C3
      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.15, now + 0.5);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 3.3);

    } catch (e) {
      console.warn('Web Audio chime failed to initialize:', e);
    }
  };

  // Stage 1: DOS command prompts
  useEffect(() => {
    if (bootStep !== 0) return;

    const logSequence = [
      'AMIBIOS (C)2026 American Megatrends, Inc.',
      'D.Y. Patil International Lab Unit (v0.2.7)',
      'CPU: AMD Atharva-X64 Core @ 3.40GHz',
      'Checking RAM: 262144KB OK',
      'Detecting Primary Master HDD... ST34200A 4.2GB',
      'Detecting Primary Slave HDD... NONE',
      'Mounting HDFS System drives ... DONE',
      'Searching for Boot Record on IDE-0... OK',
      'Starting MS-DOS v6.22...',
      ' ',
      'C:\\> LOADHIGH C:\\DOS\\HIMEM.SYS',
      'HIMEM: DOS Device Driver - (c) Microsoft Corp 2026',
      'C:\\> SMARTDRV.EXE /D',
      'C:\\> SET PATH=C:\\PYTHON;C:\\MYSQL;C:\\NODE__MODULES;%PATH%',
      'C:\\> CLS',
      'C:\\> cd C:\\WINDOWS\\',
      'C:\\WINDOWS\\> win.com'
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logSequence.length) {
        setDosLogs((prev) => [...prev, logSequence[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBootStep(1); // Proceed to Windows 95 splash screen
        }, 800);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [bootStep]);

  // Stage 2: Windows 95 Splash Loader Progress
  useEffect(() => {
    if (bootStep !== 1) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBootStep(2); // Proceed to user boot launcher
          }, 600);
          return 100;
        }
        // Random progress increments for vintage realism
        const increment = Math.floor(Math.random() * 8) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [bootStep]);

  // Fast skip key handler
  const handleSkip = () => {
    setBootStep(2);
  };

  const handleBootComplete = () => {
    playRetroChime();
    // Allow a small fade before trigger
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  if (bootStep === 0) {
    return (
      <div 
        id="dos-screen"
        className="w-full h-full bg-black text-neutral-300 font-terminal text-lg p-6 flex flex-col justify-between select-none scanlines"
      >
        <div className="flex-1 space-y-1 md:space-y-2 crt-screen overflow-y-auto pr-2">
          {dosLogs.map((log, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              {log?.startsWith('Detecting') || log?.startsWith('Checking') ? (
                <HardDrive className="inline-block w-4 h-4 text-emerald-500 mr-2" />
              ) : null}
              {log?.startsWith('CPU:') ? (
                <Cpu className="inline-block w-4 h-4 text-amber-500 mr-2" />
              ) : null}
              <span>{log}</span>
            </div>
          ))}
          <span className="inline-block w-2.5 h-5 bg-white animate-pulse ml-0.5" />
        </div>

        <div className="flex justify-between items-center text-xs text-neutral-500 border-t border-neutral-800 pt-3">
          <span>Press ESC or click here to skip memory test</span>
          <button 
            id="dos-skip-btn"
            onClick={handleSkip}
            className="px-3 py-1 border border-neutral-700 hover:bg-neutral-900 active:bg-neutral-800 rounded transition font-mono tracking-wider"
          >
            SKIP
          </button>
        </div>
      </div>
    );
  }

  if (bootStep === 1) {
    return (
      <div 
        id="win95-splash"
        className="w-full h-full bg-[#008080] flex flex-col items-center justify-between p-8 scanlines text-white select-none relative"
      >
        <div className="absolute top-4 right-4 animate-pulse">
          <button id="splash-skip" onClick={handleSkip} className="text-xs text-teal-200/70 hover:text-teal-100 cursor-pointer">
            Skip Splash &gt;
          </button>
        </div>

        {/* Windows 95 Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center items-center relative z-10">
          {/* Authentic Win95 Windows Graphic Layout */}
          <div className="perspective-500 md:scale-110 mb-8">
            <div className="relative w-44 h-44 flex flex-col justify-center items-center bg-[#c0c0c0] win95-outset p-2 text-neutral-800">
              <div className="text-3xl font-bold tracking-tight mb-2 text-blue-900 flex items-center">
                <span className="text-[#ff3b30] text-4xl mr-1">W</span>indows
              </div>
              <div className="grid grid-cols-2 gap-1.5 w-24 h-24 p-1">
                {/* Visual Representation of Windows 95 flags with hover effects */}
                <div className="bg-[#ff3b30] shadow-[1px_1px_4px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute top-0 right-0 w-2 h-2 border-b border-l border-white/20" />
                </div>
                <div className="bg-[#4cd964] shadow-[1px_1px_4px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-b border-r border-white/20" />
                </div>
                <div className="bg-[#007aff] shadow-[1px_1px_4px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-t border-l border-white/20" />
                </div>
                <div className="bg-[#ffcc00] shadow-[1px_1px_4px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-t border-r border-white/20" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-[#000080] tracking-wider absolute bottom-1">
                95
              </div>
            </div>
          </div>

          <h2 className="text-xl md:text-3xl font-semibold tracking-wide text-white drop-shadow-md text-center">
            {PERSONAL_INFO.name.toUpperCase()}
          </h2>
          <p className="text-xs md:text-sm text-teal-100/90 font-mono tracking-widest mt-1 text-center">
            B.TECH IN COMPUTER SCIENCE OS PORTFOLIO
          </p>
        </div>

        {/* Windows 95 Blue Loading bar container representing progression */}
        <div className="w-full max-w-sm mb-12 relative z-10 flex flex-col items-center">
          <p className="text-[10px] md:text-xs text-teal-100 font-mono mb-2 tracking-wider">
            SYSTEM BOOTING... {progress}%
          </p>
          <div className="w-full h-5 bg-[#c0c0c0] win95-inset p-1 relative flex overflow-hidden">
            <div 
              className="h-full bg-blue-900 duration-100 ease-out flex" 
              style={{ width: `${progress}%` }}
            >
              {/* Retro Block/Grid divider strips inside the slider fill */}
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-1.5 h-full border-r border-white/20 flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-teal-200/50 font-mono text-center relative z-10 mt-auto">
          Microsoft MS-DOS Copyright (C) 1981-2026. All Rights Reserved.
        </div>
      </div>
    );
  }

  // Final Stage: Confirm boot to unblock web audio Context
  return (
    <div 
      id="boot-trigger"
      className="w-full h-full bg-[#008080] flex flex-col justify-center items-center p-4 select-none relative scanlines"
    >
      <div className="w-96 max-w-full bg-[#c0c0c0] win95-outset p-1 flex flex-col">
        {/* TitleBar */}
        <div className="win95-titlebar-active px-2 py-1 text-xs font-bold flex items-center justify-between">
          <span>System Information</span>
          <div className="w-4 h-4 bg-[#c0c0c0] win95-outset text-black flex items-center justify-center font-bold text-[8px]">
            ?
          </div>
        </div>

        {/* Body content */}
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex space-x-3 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-blue-800 text-white flex items-center justify-center font-bold text-lg rounded-full shadow-inner border border-white">
              ℹ️
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-neutral-900">Welcome to Atharva's OS!</h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                The retro-kernel has loaded successfully. Press the boot button below to load high-resolution desktop visual effects and play the digital MIDI startup sound.
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-400 my-2" />

          {/* Prompt action */}
          <div className="flex justify-end space-x-2">
            <button 
              id="poweron-btn"
              onClick={handleBootComplete}
              className="px-5 py-1.5 font-bold text-xs win95-button text-black bg-neutral-200"
            >
              Start OS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
