import { useState } from 'react';
import { Settings, Cpu, Database, Award, BarChart } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../data';

export default function SkillsApp() {
  const [hoveredSkill, setHoveredSkill] = useState<{ name: string; level: number } | null>(null);

  // Helper icons for categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Languages':
        return <Settings className="text-blue-900" size={16} />;
      case 'AI / Machine Learning':
        return <Cpu className="text-purple-800" size={16} />;
      case 'Data Analysis & Databases':
        return <Database className="text-amber-700" size={16} />;
      default:
        return <BarChart className="text-emerald-800" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="p-3 bg-neutral-100 border border-neutral-300 flex justify-between items-center select-none shadow-sm">
        <div className="flex items-center space-x-2">
          <Settings className="text-neutral-700 animate-spin" size={20} />
          <span className="font-bold text-xs text-neutral-800 tracking-wider">SYSTEM PERFORMANCE MONITOR</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 win95-inset select-none">
          ● ENGINE ONLINE
        </span>
      </div>

      {/* Sub-header instruction */}
      <p className="text-xs text-neutral-600 leading-normal select-none">
        Hover over individual computing components to analyze their exact system integration and capability matrices.
      </p>

      {/* Dynamic Skill Level Tooltip Box */}
      <div className="min-h-[50px] bg-[#dfdfdf] win95-inset-depressed p-2.5 flex items-center justify-between select-none">
        {hoveredSkill ? (
          <>
            <div>
              <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">
                System Driver: {hoveredSkill.name}
              </p>
              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                Status: Operational @ {hoveredSkill.level}% Efficiency
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-900 text-white px-2.5 py-1 text-center">
              {hoveredSkill.level}% V-CORE
            </span>
          </>
        ) : (
          <p className="text-xs font-mono text-neutral-400 italic">
            Waiting for device probe... Move cursor over any skill bar.
          </p>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="bg-neutral-100 p-3.5 win95-outset flex flex-col justify-between">
            {/* Folder tab layout */}
            <div className="flex items-center space-x-2 border-b border-neutral-400 pb-2 mb-3 select-none">
              {getCategoryIcon(cat.name)}
              <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wide">
                [ {cat.name} ]
              </h4>
            </div>

            {/* List of skills with retro pixel bars */}
            <div className="space-y-3.5">
              {cat.skills.map((skill, sIdx) => {
                // Compute number of green blocks based on percentage (e.g. 10 blocks max)
                const totalBlocks = 12;
                const filledBlocks = Math.round((skill.level / 100) * totalBlocks);

                return (
                  <div 
                    key={sIdx} 
                    className="space-y-1 group"
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-neutral-800 font-mono group-hover:text-blue-900 group-hover:underline">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Windows 95 style satisfy blocks */}
                    <div className="w-full h-5 bg-white win95-inset p-0.5 flex gap-0.5 relative overflow-hidden select-none">
                      {Array.from({ length: totalBlocks }).map((_, bIdx) => (
                        <div 
                          key={bIdx}
                          className={`h-full w-full transition-all duration-300 ${
                            bIdx < filledBlocks 
                              ? 'bg-[#000080]' // Classic blue satisfy block
                              : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
