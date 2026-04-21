export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  languages: string[];
  liveUrl: string;
  repoUrl: string;
  tourVideoUrl: string;
  videoUrl?: string; // Add videoUrl for API projects
  imageUrl?: string; // Add imageUrl for API projects
  documentationUrl: string;
  technicalSummary: string;
  aiDocsAnalysis: string;
  isPinned?: boolean;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'SmartRent AI',
    isPinned: true,
    description: 'A revolutionary PropTech case study. Re-engineered the rental journey with AI-driven property matching, immersive video tours, and automated stakeholder coordination.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Tailwind'],
    languages: ['JavaScript', 'TypeScript', 'CSS', 'HTML'],
    liveUrl: 'https://smartrent-frontend.onrender.com/',
    repoUrl: 'https://github.com/AlexObwogi/SmartRent',
    tourVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    documentationUrl: '#',
    technicalSummary: 'Project Leader & Lead Architect: As the visionary behind SmartRent AI, I spearheaded the transition of traditional PropTech into an AI-first ecosystem. I architected the multi-tenant database schema, implemented the conversational AI interface using Google Gemini, and developed a custom video streaming module for virtual tours. This project serves as a masterwork in MERN stack engineering and user-centric automation.',
    aiDocsAnalysis: 'Role: Lead Software Engineer & Database Architect. Achievement: Reduced property search cycles by 40% through intelligent matching algorithms.'
  },
  {
    id: '2',
    title: 'Sentinel Cloud',
    isPinned: true,
    description: 'Automated AWS security auditing tool that scans for misconfigured S3 buckets and IAM over-privileges.',
    techStack: ['Python', 'Boto3', 'AWS Lambda', 'DynamoDB'],
    languages: ['Python'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/SentinelCloud',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Cloud Security: Implemented a scanning engine using Boto3. Automates security checklist validation against CIS benchmarks.',
    aiDocsAnalysis: 'Analysis: Demonstrates deep knowledge of AWS IAM and resource security policies.'
  },
  {
    id: '3',
    title: 'HardenSys',
    isPinned: true,
    description: 'Universal Linux hardening script for Ubuntu and Debian systems to enforce security baselines.',
    techStack: ['Bash', 'Linux', 'Security'],
    languages: ['Shell'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/HardenSys',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Operational Control: Automates firewall setup (UFW), user auditing, and disabling unused services.',
    aiDocsAnalysis: 'Analysis: A practical tool for increasing the security posture of Linux servers efficiently.'
  },
  {
    id: '4',
    title: 'PacketSniff Python',
    isPinned: true,
    description: 'Lightweight packet sniffer and analyzer with real-time traffic visualization.',
    techStack: ['Python', 'Scapy', 'Matplotlib'],
    languages: ['Python'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/PacketSniff',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Network Security: Built using Scapy to capture and decode protocols. Includes threat detection for ARP spoofing.',
    aiDocsAnalysis: 'Analysis: Combines low-level networking knowledge with Python scripting for security forensics.'
  },
  {
    id: '5',
    title: 'MERN Estate',
    description: 'Comprehensive real estate management system with user dashboards and booking capabilities.',
    techStack: ['MongoDB', 'Express', 'React', 'Node.js'],
    languages: ['JavaScript', 'CSS'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/MERN_Estate',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Full-Stack: Implemented CRUD operations, image uploads, and state management using Redux Toolkit.',
    aiDocsAnalysis: 'Analysis: Production-grade MERN architecture with robust error handling and responsive design.'
  },
  {
    id: '6',
    title: 'AuthGuard',
    description: 'Microservice for JWT-based authentication with support for 2FA and biometric entry points.',
    techStack: ['Node.js', 'JWT', 'Redis'],
    languages: ['JavaScript'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/AuthGuard',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Backend Security: Focuses on secure token handling and refresh logic to prevent replay attacks.',
    aiDocsAnalysis: 'Analysis: High-security authentication module ready for integration into larger systems.'
  },
  {
    id: '7',
    title: 'AutoTerra',
    isPinned: true,
    description: 'CLI tool to generate Terraform templates based on visualized cloud architecture inputs.',
    techStack: ['Go', 'Terraform', 'React (GUI)'],
    languages: ['Go', 'TypeScript'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/AutoTerra',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Infrastructure as Code: Translates UI diagrams into valid HCL code for AWS/GCP deployments.',
    aiDocsAnalysis: 'Analysis: Bridges the gap between visual planning and automated cloud provisioning.'
  },
  {
    id: '8',
    title: 'PyShade',
    description: 'Python script obfuscator designed to protect source code in sensitive security tool development.',
    techStack: ['Python', 'AST Manipulation'],
    languages: ['Python'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/PyShade',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Defense: Uses Abstract Syntax Tree manipulation to rename variables and flatten code structure.',
    aiDocsAnalysis: 'Analysis: Demonstrates advanced Python mastery and code protection techniques.'
  },
  {
    id: '9',
    title: 'VibeChat',
    description: 'Real-time messaging app featuring AI sentiment analysis of incoming transmissions.',
    techStack: ['Socket.io', 'React', 'Sentiment API'],
    languages: ['JavaScript', 'HTML'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/VibeChat',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Interactive: Real-time sync via WebSockets. Uses AI to flag malicious or toxic content in real-time.',
    aiDocsAnalysis: 'Analysis: Excellent integration of real-time communication protocols with basic machine learning.'
  },
  {
    id: '10',
    title: 'Nexus Terminal',
    description: 'Centralized server monitoring solution with SSH integration and visual health metrics.',
    techStack: ['Next.js', 'SSH2', 'Chart.js'],
    languages: ['TypeScript'],
    liveUrl: '#',
    repoUrl: 'https://github.com/AlexObwogi/NexusTerminal',
    tourVideoUrl: '',
    documentationUrl: '#',
    technicalSummary: 'Systems: Provides a web-based console for remote Linux management and resource tracking.',
    aiDocsAnalysis: 'Analysis: Demonstrates full-stack capability for building complex operational tools.'
  }
];
