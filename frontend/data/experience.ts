export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'WorldQuant University',
    role: 'MSc Financial Engineering (Incoming) | Applied Data Science Lab',
    period: 'Jun 2026 - Present',
    description: 'Starting MScFE on June 8, 2026. Currently enrolled in the separate 16-week Applied Data Science Lab, specializing in processing large-scale financial datasets using Python (Pandas/NumPy) and predictive modeling.'
  },
  {
    id: '2',
    company: 'Kirinyaga University',
    role: 'BSc Computer Science | Project Leader',
    period: 'Sep 2022 - Sep 2026',
    description: 'Focusing on Software Architecture, Distributed Systems, and Cybersecurity. Led multiple high-impact projects including AI-integrated PropTech systems and cloud security automation.'
  },
  {
    id: 'capstone-1',
    company: 'Kirinyaga University (Capstone)',
    role: 'Lead Project Architect | SmartRent AI',
    period: 'Sep 2025 - Apr 2026',
    description: 'Engineered "SmartRent AI" over a 7-month development cycle. Built high-performance data analysis pipelines, performance-optimized asset delivery, and algorithmic matching protocols to ensure low-latency property recommendations. Integrated Advanced AI Engines for semantic matching and Google Maps for location intelligence.'
  },
  {
    id: '4',
    company: 'Independent Research & Development',
    role: 'Platform Architect',
    period: '2023 - Present',
    description: 'Developing specialized tools for quantitative infrastructure and automated risk evaluation. Focused on high-fidelity performance metrics and AI integration.'
  },
  {
    id: '5',
    company: 'DevFlow Services',
    role: 'Software Development Associate (Attachment)',
    period: 'May 2025 - Aug 2025',
    description: 'Focused on optimizing internal software development lifecycles. Implemented automated CI/CD pipelines and performed rigorous data integrity audits for client-facing cloud applications.'
  },
  {
    id: '6',
    company: 'Nexus Technical Solutions',
    role: 'System Integration Specialist (Attachment)',
    period: 'May 2024 - Aug 2024',
    description: 'Delivered customized software solutions for local business automation. Specialized in high-performance data migration and initial deployment strategies for distributed service architectures.'
  }
];
