import { Project, SkillCategory, Education, Experience, Certification } from './types';

export const PERSONAL_INFO = {
  name: 'Atharva Khaire',
  title: 'Computer Science Undergraduate & Web Developer',
  email: 'atharvakhaire.ak10@gmail.com',
  phone: '+91 8010911734',
  linkedin: 'linkedin.com/in/atharvakhaire09',
  github: 'github.com/sLasherGod10',
  summary: 'Results-oriented Computer Science undergraduate with practical experience in Python development, Data Science, Machine Learning, and software engineering. Demonstrated ability to develop scalable applications and data-driven solutions through industry internships and technical projects. Possesses strong analytical thinking, problem-solving, and collaboration skills, with a keen interest in building innovative technologies that address real-world challenges.'
};

export const EDUCATION_LIST: Education[] = [
  {
    institution: 'D. Y. Patil International University',
    location: 'Akurdi, Pune',
    degree: 'Bachelor of Technology in Computer Science',
    grade: 'CGPA: 8.28/10',
    period: 'Aug. 2023 – May 2027'
  },
  {
    institution: "AMS's Geetamat Jr. College",
    location: 'Chinchwad, Pune',
    degree: 'Higher Secondary Certificate (HSC)',
    grade: '81.17%',
    period: '2023'
  },
  {
    institution: 'Infant Jesus High School',
    location: 'Chinchwad, Pune',
    degree: 'Secondary School Certificate (SSC)',
    grade: '92.60%',
    period: '2021'
  }
];

export const EXPERIENCE_LIST: Experience[] = [
  {
    role: 'Python Web Developer Intern',
    company: 'CodTech IT Solutions',
    period: 'May 2025 – August 2025',
    location: 'Remote - Pune',
    bullets: [
      'Developed Python backend modules for web applications, improving system efficiency by 80%.',
      'Applied software engineering best practices to deliver maintainable, scalable backend logic.'
    ]
  }
];

export const PROJECTS_LIST: Project[] = [
  {
    title: 'Ignitron: AI-Powered Car Recommendation System',
    tech: ['Python', 'Machine Learning', 'KNN', 'Pandas', 'Scikit-learn'],
    date: 'December 2025',
    github: 'https://github.com/sLasherGod10',
    highlights: [
      'Engineered a KNN-based recommendation engine achieving 91.4% prediction accuracy through optimized feature selection and model tuning.',
      'Improved recommendation relevance by 35% using data preprocessing, normalization, and similarity-based filtering with Pandas and Scikit-learn.',
      'Built a personalized recommendation pipeline capable of analyzing multiple user preferences in real time.'
    ]
  },
  {
    title: 'IT Asset Management System',
    tech: ['HTML/CSS', 'PHP', 'JavaScript', 'MySQL', 'Chart.js'],
    date: 'May 2025',
    github: 'https://github.com/sLasherGod10',
    highlights: [
      'Developed a full-stack IT asset tracking platform that improved inventory management efficiency by 85% and reduced manual tracking efforts.',
      'Designed interactive dashboards and real-time analytics using JavaScript and Chart.js, enhancing monitoring speed by 40%.',
      'Implemented secure CRUD operations, asset allocation workflows, and maintenance tracking with optimized MySQL database performance.'
    ]
  },
  {
    title: 'Big Data Analytics with Hadoop',
    tech: ['Hadoop', 'MapReduce', 'HDFS'],
    date: 'December 2025',
    github: 'https://github.com/sLasherGod10',
    highlights: [
      'Implemented Hadoop and HDFS for large-scale distributed data processing.',
      'Developed a Word Count application using MapReduce for text analysis.'
    ]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Languages',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'C/C++', level: 85 },
      { name: 'SQL', level: 80 },
      { name: 'Java', level: 75 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'JavaScript', level: 88 },
      { name: 'PHP', level: 70 }
    ]
  },
  {
    name: 'AI / Machine Learning',
    skills: [
      { name: 'Scikit-learn', level: 85 },
      { name: 'TensorFlow / PyTorch', level: 70 },
      { name: 'NLP & LLMs', level: 80 },
      { name: 'Supervised Learning', level: 85 },
      { name: 'Unsupervised Learning', level: 80 },
      { name: 'RAG (Retrieval-Augmented Gen)', level: 75 }
    ]
  },
  {
    name: 'Data Analysis & Databases',
    skills: [
      { name: 'Pandas & NumPy', level: 90 },
      { name: 'Power BI & Excel', level: 80 },
      { name: 'Matplotlib & Seaborn', level: 85 },
      { name: 'MySQL', level: 85 },
      { name: 'MongoDB', level: 75 },
      { name: 'Flask', level: 80 }
    ]
  },
  {
    name: 'Tools & Core Subjects',
    skills: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'Jupyter & Colab', level: 85 },
      { name: 'VS Code', level: 95 },
      { name: 'DSA', level: 80 },
      { name: 'DBMS / RDBMS', level: 82 },
      { name: 'Operating Systems (OS)', level: 85 },
      { name: 'Computer Networks', level: 78 }
    ]
  }
];

export const CERTIFICATIONS: Certification[] = [
  { name: 'Cloud Architecture Design Patterns', provider: 'Coursera' },
  { name: 'GenAI for Data Engineers: Scaling with GenAI', provider: 'Coursera' },
  { name: 'Building Smarter Data Pipelines: SQL, Spark, Kafka & GenAI', provider: 'Coursera' }
];

export const CLINICAL_FACTS = [
  "Clippy Tip: Atharva can write clean Python backend logic and train precise Machine Learning algorithms at the same time!",
  "Clippy Tip: Try double clicking the Paint shortcut to practice your retro pixel art!",
  "Clippy Tip: Select the 'Run' prompt from the Start Menu and type 'mines' to launch classic Minesweeper!",
  "Clippy Tip: The Ignitron Car Recommendation Engine managed a stunning 91.4% prediction accuracy!",
  "Clippy Tip: Atharva is currently pursuing his B.Tech at D. Y. Patil International University - Pune, graduating in 2027.",
  "Clippy Tip: Try double-clicking any of the desktop files to read about Atharva's career metrics!"
];
