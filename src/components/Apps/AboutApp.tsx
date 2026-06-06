import { Briefcase, GraduationCap, Award, Info, FileText } from 'lucide-react';
import { PERSONAL_INFO, EDUCATION_LIST, EXPERIENCE_LIST, CERTIFICATIONS } from '../../data';

export default function AboutApp() {
  return (
    <div className="space-y-6 select-text">
      {/* Overview Block */}
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 p-3 bg-neutral-100 border border-neutral-300 shadow-sm">
        <div className="w-16 h-16 bg-blue-900 text-white flex items-center justify-center font-bold text-2xl win95-outset rounded shadow-md flex-shrink-0">
          👤
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center">
            {PERSONAL_INFO.name}
          </h1>
          <p className="text-xs text-blue-800 font-mono font-semibold">
            {PERSONAL_INFO.title}
          </p>
          <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
            Graduating Class of May 2027
          </p>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-neutral-800 border-b border-neutral-300 pb-1 flex items-center">
          <Info size={16} className="text-blue-900 mr-2" />
          Summary Overview
        </h3>
        <p className="text-xs text-neutral-700 leading-relaxed text-justify bg-white p-3 win95-inset">
          {PERSONAL_INFO.summary}
        </p>
      </div>

      {/* Educational Milestones */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-neutral-800 border-b border-neutral-300 pb-1 flex items-center">
          <GraduationCap size={16} className="text-blue-900 mr-2" />
          Education Catalog
        </h3>
        <div className="space-y-3">
          {EDUCATION_LIST.map((edu, idx) => (
            <div key={idx} className="bg-neutral-50 p-3 win95-outset text-neutral-800 relative">
              <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-mono bg-blue-900 text-white font-bold select-none">
                {edu.period}
              </span>
              <h4 className="font-bold text-xs pr-20 text-neutral-900">{edu.institution}</h4>
              <p className="text-xs font-semibold text-blue-900 mt-1">{edu.degree}</p>
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mt-2">
                <span>📍 {edu.location}</span>
                <span className="font-bold text-neutral-700">Result: {edu.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-neutral-800 border-b border-neutral-300 pb-1 flex items-center">
          <Briefcase size={16} className="text-blue-900 mr-2" />
          Professional Experience
        </h3>
        <div className="space-y-3">
          {EXPERIENCE_LIST.map((exp, idx) => (
            <div key={idx} className="bg-neutral-50 p-3 win95-outset text-neutral-800 relative">
              <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-mono bg-emerald-800 text-white font-bold select-none">
                {exp.period}
              </span>
              <h4 className="font-bold text-xs pr-20 text-neutral-900">{exp.role}</h4>
              <p className="text-[11px] font-semibold text-blue-900 mt-0.5">{exp.company}</p>
              <div className="text-[10px] text-neutral-500 font-mono mb-2">📍 {exp.location}</div>
              
              <ul className="list-none space-y-1.5 pl-1.5 border-l-2 border-dashed border-neutral-400 mt-2">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-xs text-neutral-700 leading-normal flex items-start">
                    <span className="text-neutral-500 mr-1.5 select-none font-mono">▪</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Checklist */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-neutral-800 border-b border-neutral-300 pb-1 flex items-center">
          <Award size={16} className="text-blue-900 mr-2" />
          Academic Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {CERTIFICATIONS.map((cert, idx) => (
            <div key={idx} className="p-2.5 bg-white win95-inset text-neutral-800 flex items-center space-x-3">
              <div className="w-6 h-6 bg-amber-500 text-white flex items-center justify-center text-xs win95-outset flex-shrink-0 select-none">
                📜
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold leading-tight truncate text-neutral-900" title={cert.name}>
                  {cert.name}
                </p>
                <span className="text-[10px] font-mono text-neutral-500">Issued by {cert.provider}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
