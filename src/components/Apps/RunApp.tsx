import React, { useState } from 'react';
import { Terminal, Cpu } from 'lucide-react';
import { WindowId } from '../../types';

interface RunAppProps {
  onExecuteCommand: (id: WindowId) => void;
  onClose: () => void;
}

export default function RunApp({ onExecuteCommand, onClose }: RunAppProps) {
  const [command, setCommand] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    
    if (!cmd) return;

    if (cmd === 'mines' || cmd === 'minesweeper') {
      onExecuteCommand('mines');
      onClose();
    } else if (cmd === 'paint' || cmd === 'mspaint') {
      onExecuteCommand('paint');
      onClose();
    } else if (cmd === 'about' || cmd === 'bio') {
      onExecuteCommand('about');
      onClose();
    } else if (cmd === 'projects' || cmd === 'code') {
      onExecuteCommand('projects');
      onClose();
    } else if (cmd === 'skills' || cmd === 'tech') {
      onExecuteCommand('skills');
      onClose();
    } else if (cmd === 'contact' || cmd === 'mail') {
      onExecuteCommand('contact');
      onClose();
    } else if (cmd === 'help') {
      setErrorText('Supported executable parameters: about, projects, skills, contact, paint, mines');
    } else {
      setErrorText(`Windows cannot find '${command}'. Verify that the name is typed correctly, or type 'help' for command directories.`);
    }

    setCommand('');
  };

  return (
    <div className="space-y-4 p-1">
      {/* Intro visual panel */}
      <div className="flex items-start space-x-3 select-none">
        <div className="w-10 h-10 bg-neutral-200 text-neutral-800 flex items-center justify-center text-xl win95-outset shrink-0">
          🏃
        </div>
        <div className="space-y-1">
          <p className="text-xs text-neutral-800 font-bold leading-none">Execute DOS Program Coordinate</p>
          <p className="text-[11px] text-neutral-600 leading-normal">
            Type the name of a program, folder, or document, and Atharva-OS will execute it instantly.
          </p>
        </div>
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-neutral-700 shrink-0 select-none">Open:</label>
          <input
            id="run-cli-input"
            type="text"
            value={command}
            onChange={(e) => {
              setCommand(e.target.value);
              setErrorText('');
            }}
            placeholder="Type 'help' for program keywords..."
            className="flex-1 text-xs px-2 py-1.5 win95-inset focus:outline-none font-mono"
            autoFocus
          />
        </div>

        {/* Dynamic warning console output */}
        {errorText && (
          <div className="p-2.5 bg-neutral-900 border border-neutral-700 rounded font-mono text-[10px] text-amber-500 leading-normal scanlines select-text">
            {errorText}
          </div>
        )}

        {/* Buttons footer */}
        <div className="flex justify-end space-x-2 select-none">
          <button
            id="run-sumit-btn"
            type="submit"
            className="px-5 py-1.5 font-bold text-xs win95-button text-black bg-neutral-200"
          >
            OK
          </button>
          <button
            id="run-cancel-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 font-semibold text-xs win95-button text-black bg-neutral-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
