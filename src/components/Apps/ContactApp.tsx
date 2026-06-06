import React, { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, Github, Terminal, Send, Check } from 'lucide-react';
import { PERSONAL_INFO } from '../../data';

interface SavedMessage {
  id: string;
  name: string;
  email: string;
  body: string;
  date: string;
}

export default function ContactApp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<SavedMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiPopup, setUiPopup] = useState<{ show: boolean; type: 'success' | 'error'; text: string }>({
    show: false,
    type: 'success',
    text: ''
  });

  // Pull local history of feedback submissions on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('retro_os_feedback');
      if (saved) {
        setFeedbackHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('LocalStorage pull failed:', e);
    }
  }, []);

  const triggerPopup = (type: 'success' | 'error', text: string) => {
    setUiPopup({ show: true, type, text });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      triggerPopup('error', 'Critical Error: All fields (Name, Email, and Message) must be filled to complete system telemetry transmission!');
      return;
    }

    setIsSubmitting(true);

    // Simulate retro dial-up handshake lag
    setTimeout(() => {
      const newMessage: SavedMessage = {
        id: crypto.randomUUID(),
        name,
        email,
        body: message,
        date: new Date().toLocaleTimeString()
      };

      const updated = [newMessage, ...feedbackHistory];
      setFeedbackHistory(updated);
      try {
        localStorage.setItem('retro_os_feedback', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }

      // Reset values
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
      triggerPopup('success', 'Transmission Successful! Your feedback packets have been filed. Check your submitted message logs below.');
    }, 1200);
  };

  const handleClearHistory = () => {
    setFeedbackHistory([]);
    try {
      localStorage.removeItem('retro_os_feedback');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6 select-text relative">
      {/* Visual Header */}
      <div className="p-3 bg-neutral-100 border border-neutral-300 flex justify-between items-center select-none shadow-sm">
        <div className="flex items-center space-x-2">
          <Mail className="text-blue-900" size={20} />
          <span className="font-bold text-xs text-neutral-800 tracking-wider">CONTACT & INTEGRATIONS</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-500">COM1 PORT: ONLINE</span>
      </div>

      {/* Retro Popups Overlay (Windows 95 Warning Boxes Style) */}
      {uiPopup.show && (
        <div className="absolute inset-x-0 mx-auto w-80 bg-[#c0c0c0] win95-outset z-50 p-1 flex flex-col shadow-2xl animate-bounce select-none">
          <div className={`px-2 py-0.5 text-xs font-bold text-white flex justify-between ${
            uiPopup.type === 'error' ? 'bg-red-800' : 'win95-titlebar-active'
          }`}>
            <span>System Dialogue</span>
            <button 
              onClick={() => setUiPopup({ ...uiPopup, show: false })}
              className="w-4 h-4 bg-[#c0c0c0] text-black win95-button flex items-center justify-center text-[10px] p-0"
            >
              x
            </button>
          </div>
          <div className="p-4 flex space-x-3 items-start">
            <span className="text-2xl">{uiPopup.type === 'error' ? '⚠️' : '✅'}</span>
            <div className="space-y-2">
              <p className="text-xs text-neutral-900 leading-normal">{uiPopup.text}</p>
              <button 
                onClick={() => setUiPopup({ ...uiPopup, show: false })}
                className="px-4 py-1 self-end text-[11px] font-bold win95-button text-black bg-neutral-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of contact links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Telephone Card */}
        <div className="bg-neutral-50 p-3.5 win95-outset flex items-center space-x-4">
          <div className="w-10 h-10 bg-[#dfdfdf] win95-inset-depressed flex items-center justify-center text-xl select-none flex-shrink-0">
            📞
          </div>
          <div className="overflow-hidden">
            <h5 className="text-neutral-500 text-[10px] font-mono uppercase">Direct Dial</h5>
            <p className="text-xs font-bold font-mono tracking-tight text-neutral-800 truncate select-all">
              {PERSONAL_INFO.phone}
            </p>
          </div>
        </div>

        {/* Email Card */}
        <a 
          id="email-contact-link"
          href={`mailto:${PERSONAL_INFO.email}`}
          className="bg-neutral-50 p-3.5 win95-outset flex items-center space-x-4 hover:bg-neutral-100 group select-none"
        >
          <div className="w-10 h-10 bg-[#dfdfdf] win95-inset-depressed flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 duration-100">
            ✉️
          </div>
          <div className="overflow-hidden">
            <h5 className="text-neutral-500 text-[10px] font-mono uppercase">Electronic Mail</h5>
            <p className="text-xs font-bold font-mono text-blue-900 truncate group-hover:underline select-all">
              {PERSONAL_INFO.email}
            </p>
          </div>
        </a>

        {/* LinkedIn Connection */}
        <a 
          id="linkedin-contact-link"
          href={`https://${PERSONAL_INFO.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="bg-neutral-50 p-3.5 win95-outset flex items-center space-x-4 hover:bg-neutral-100 group select-none"
        >
          <div className="w-10 h-10 bg-blue-700 text-white win95-outset flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 duration-100">
            in
          </div>
          <div className="overflow-hidden">
            <h5 className="text-neutral-500 text-[10px] font-mono uppercase">LinkedIn Directory</h5>
            <p className="text-xs font-bold text-blue-900 truncate group-hover:underline">
              {PERSONAL_INFO.linkedin}
            </p>
          </div>
        </a>

        {/* GitHub Repository profiles */}
        <a 
          id="github-contact-link"
          href={`https://${PERSONAL_INFO.github}`}
          target="_blank"
          rel="noreferrer"
          className="bg-neutral-50 p-3.5 win95-outset flex items-center space-x-4 hover:bg-neutral-100 group select-none"
        >
          <div className="w-10 h-10 bg-neutral-900 text-white win95-outset flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 duration-100">
            🐙
          </div>
          <div className="overflow-hidden">
            <h5 className="text-neutral-500 text-[10px] font-mono uppercase">Version Control</h5>
            <p className="text-xs font-bold text-blue-900 truncate group-hover:underline">
              {PERSONAL_INFO.github}
            </p>
          </div>
        </a>
      </div>

      {/* feedback Form */}
      <div className="bg-neutral-100 p-4 win95-outset">
        <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-widest mb-3 border-b border-neutral-400 pb-1 flex items-center select-none">
          <Terminal size={14} className="mr-1.5" /> Transmitter Terminal
        </h4>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 select-none">
              <label className="text-xs font-bold text-neutral-700 block">Sender Name:</label>
              <input 
                id="contact-name-input"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full text-xs p-2 win95-inset focus:outline-none"
              />
            </div>

            <div className="space-y-1 select-none">
              <label className="text-xs font-bold text-neutral-700 block">Sender Mail Domain:</label>
              <input 
                id="contact-email-input"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@domain.com"
                className="w-full text-xs p-2 win95-inset focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1 select-none">
            <label className="text-xs font-bold text-neutral-700 block">Message Body Details:</label>
            <textarea 
              id="contact-msg-textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compile thoughts or system logs here..."
              className="w-full text-xs p-2 win95-inset focus:outline-none resize-none"
            />
          </div>

          {/* Form Trigger button and Dialup Indicator */}
          <div className="flex justify-between items-center select-none">
            {isSubmitting ? (
              <span className="text-[10px] font-mono text-blue-900 animate-pulse font-bold flex items-center">
                📡 DIALING CARRIER... ESTABLISHING HANDSHAKE...
              </span>
            ) : (
              <span className="text-[10px] font-mono text-neutral-500">
                Packets: Ready for packaging
              </span>
            )}

            <button 
              id="send-feedback-btn"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-1.5 font-bold text-xs text-black bg-neutral-200 win95-button disabled:opacity-50"
            >
              <Send size={12} className="mr-2" />
              Transmit
            </button>
          </div>
        </form>
      </div>

      {/* Logs section */}
      <div className="space-y-2 select-none">
        <div className="flex justify-between items-center bg-gray-200 p-2.5 shadow-sm border border-neutral-300">
          <span className="font-bold text-neutral-800 text-xs">COMMUNICATION BACKLOGS</span>
          {feedbackHistory.length > 0 && (
            <button 
              id="clear-logs-btn"
              onClick={handleClearHistory}
              className="text-[10px] text-red-800 hover:underline hover:font-bold cursor-pointer"
            >
              Wipe Logs
            </button>
          )}
        </div>

        <div className="max-h-44 overflow-y-auto bg-black p-3 rounded font-mono text-[11px] text-emerald-400 space-y-2.5 win95-inset scanlines">
          {feedbackHistory.length > 0 ? (
            feedbackHistory.map((msg, i) => (
              <div key={msg.id} className="border-b border-neutral-800 pb-2 flex flex-col">
                <span className="text-teal-400 select-all font-bold">
                  [{msg.date}] &gt; {msg.name} ({msg.email})
                </span>
                <span className="text-neutral-300 select-all pl-2 leading-relaxed break-all">
                  {msg.body}
                </span>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 italic">
              [SYSTEM DIALER LOG]: Log buffer blank. Submit the telecommunication form to register packets here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
