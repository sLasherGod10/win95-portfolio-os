import { useState } from 'react';
import { Folder, ExternalLink, Calendar, Code } from 'lucide-react';
import { PROJECTS_LIST } from '../../data';

export default function ProjectsApp() {
  const [selectedTech, setSelectedTech] = useState<string>('All');

  // Accumulate all tech keywords to build the classic filters
  const allTechs = ['All', 'Python', 'Machine Learning', 'JavaScript', 'SQL', 'Hadoop', 'PHP'];

  const filteredProjects = selectedTech === 'All'
    ? PROJECTS_LIST
    : PROJECTS_LIST.filter(proj => proj.tech.some(t => t.toLowerCase().includes(selectedTech.toLowerCase())));

  return (
    <div className="space-y-6 select-text">
      {/* Visual Header */}
      <div className="p-3 bg-neutral-100 border border-neutral-300 flex justify-between items-center select-none">
        <div className="flex items-center space-x-2">
          <Folder className="text-yellow-600 fill-yellow-600" size={20} />
          <span className="font-bold text-xs text-neutral-800 tracking-wider">PROJECTS INDEX</span>
        </div>
        <span className="text-[10px] font-mono text-neutral-500">Record Count: {PROJECTS_LIST.length}</span>
      </div>

      {/* Classic Checkbox Grid filters */}
      <div className="bg-neutral-50 p-3 win95-outset">
        <p className="text-xs font-bold text-neutral-800 mb-2">Filter projects by technology stack:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allTechs.map((tech) => (
            <label 
              key={tech} 
              className="flex items-center space-x-2 cursor-pointer text-xs text-neutral-700 hover:text-black py-0.5 select-none"
            >
              <input 
                id={`filter-${tech.replace(/\s+/g, '-')}`}
                type="radio" 
                name="tech-filter" 
                checked={selectedTech === tech}
                onChange={() => setSelectedTech(tech)}
                className="accent-blue-900 cursor-pointer"
              />
              <span className={selectedTech === tech ? 'font-bold text-blue-900' : ''}>{tech}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter Stats status line */}
      <div className="text-[10px] font-mono select-none flex justify-between text-neutral-500 px-1">
        <span>Active filter: <span className="font-bold text-neutral-700">{selectedTech}</span></span>
        <span>Showing {filteredProjects.length} of {PROJECTS_LIST.length} files</span>
      </div>

      {/* Grid of Projects */}
      <div className="space-y-5">
        {filteredProjects.map((project, idx) => (
          <div key={idx} className="bg-white win95-inset p-4 hover:shadow-lg transition-shadow">
            {/* Title & Metadata Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-300 pb-2 mb-3">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center">
                  <span className="text-xs mr-2">📂</span>
                  {project.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1 select-none">
                  <span className="inline-flex items-center text-[10px] font-mono text-neutral-400">
                    <Calendar size={10} className="mr-1" />
                    {project.date}
                  </span>
                </div>
              </div>

              {/* GitHub Link button */}
              <a 
                id={`project-link-${idx}`}
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-2.5 py-1 text-[11px] font-mono font-semibold text-black bg-neutral-200 win95-button self-start sm:self-auto select-none"
              >
                <ExternalLink size={12} className="mr-1.5" />
                Explore Code
              </a>
            </div>

            {/* highlights timeline */}
            <ul className="space-y-2 list-none pl-1 mt-1 mb-4">
              {project.highlights.map((highlight, hIdx) => (
                <li key={hIdx} className="text-xs text-neutral-700 leading-normal flex items-start">
                  <span className="text-blue-900 font-bold mr-2 select-none">▸</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Technology tags */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100 select-none">
              <span className="text-[10px] font-mono text-neutral-400 mr-1 flex items-center">
                <Code size={11} className="mr-1" /> Tech:
              </span>
              {project.tech.map((tag) => (
                <span 
                  key={tag} 
                  className={`px-2 py-0.5 text-[10px] font-mono font-semibold transition-all ${
                    tag.toLowerCase().includes(selectedTech.toLowerCase())
                      ? 'bg-blue-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-neutral-50 border border-neutral-300 win95-inset">
            <span className="text-3xl block mb-2">🔍</span>
            <p className="font-bold text-xs text-neutral-700">No project files found matching filter criteria.</p>
            <p className="text-[10px] text-neutral-500 font-mono mt-1">Try selecting a different programming language above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
