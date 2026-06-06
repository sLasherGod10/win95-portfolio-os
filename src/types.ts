export type WindowId = 'about' | 'projects' | 'skills' | 'contact' | 'paint' | 'mines' | 'run' | 'cli';

export interface OSWindow {
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
  icon: string; // Font icon name or custom element
}

export interface DesktopShortcut {
  id: WindowId;
  title: string;
  icon: string;
}

export interface Project {
  title: string;
  tech: string[];
  date: string;
  github: string;
  highlights: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[];
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  grade: string;
  period: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface Certification {
  name: string;
  provider: string;
}
