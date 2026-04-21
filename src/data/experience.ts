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
    company: 'Kirinyaga University',
    role: 'Computer Science Student & Project Leader',
    period: 'Sep 2022 - Sep 2026',
    description: 'Pursuing a Bachelor of Science in Computer Science. Stepping into leadership roles for complex technical projects, specializing in Full-stack engineering and Cloud Security.'
  },
  {
    id: '2',
    company: 'Attachment - Year 3',
    role: 'Software Architecture Intern',
    period: 'May 2025 - Aug 2025',
    description: 'Professional attachment focusing on advanced system architecture, cloud-native deployments, and high-performance engineering during the Year 3 summer block.'
  },
  {
    id: '3',
    company: 'Attachment - Year 2',
    role: 'Systems Engineering Intern',
    period: 'May 2024 - Aug 2024',
    description: 'Hands-on professional attachment in systems engineering and defensive automation, gaining critical industry exposure between Year 2 and Year 3.'
  },
  {
    id: '4',
    company: 'Open Source Development',
    role: 'Independent Security Researcher',
    period: '2023 - Present',
    description: 'Developing various specialized tools available on GitHub. Focused on high-fidelity UI design and integrating AI models into user-facing applications.'
  }
];
