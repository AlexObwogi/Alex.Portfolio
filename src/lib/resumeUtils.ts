import { jsPDF } from 'jspdf';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';

export interface TailoredContent {
  summary: string;
  topSkills: string[];
  tailoredExperience: {
    id: string;
    role: string;
    company: string;
    period: string;
    bulletPoints: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    details: string;
  }[];
  projects: {
    title: string;
    tech: string;
    description: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
  }[];
}

export const downloadResumePDF = (tailoredContent: TailoredContent | null) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('ALEX NYANGARESI OBWOGI', margin, y);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Quantitative Software Engineer & Fullstack Architect | Nairobi, Kenya', margin, y);
  y += 5;
  doc.text('obwogialex728@gmail.com | +254 706 050 538 | github.com/AlexObwogi', margin, y);
  y += 15;

  // Professional Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PROFESSIONAL SUMMARY', margin, y);
  doc.line(margin, y + 1.5, 190, y + 1.5);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  
  const summaryText = tailoredContent?.summary || "Quantitative Software Engineer specializing in high-performance financial systems and predictive modeling. Transitioning from a strong background in Fullstack Architecture to Quantitative Finance through MSc studies at WorldQuant University. Expertise in Stochastic Calculus, Risk Management, and large-scale data engineering projects.";
  const summaryLines = doc.splitTextToSize(summaryText, 170);
  doc.text(summaryLines, margin, y);
  y += (summaryLines.length * 4.5) + 8;

  // Technical Skills Matrix
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TECHNICAL SKILLS MATRIX', margin, y);
  doc.line(margin, y + 1.5, 190, y + 1.5);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  
  if (tailoredContent?.topSkills && tailoredContent.topSkills.length > 0) {
    tailoredContent.topSkills.forEach(skillLine => {
      const wrappedLine = doc.splitTextToSize(skillLine, 170);
      doc.text(wrappedLine, margin, y);
      y += (wrappedLine.length * 4.5);
    });
    y += 4;
  } else {
    doc.text('Quantitative: Statistics, Linear Algebra, Financial Modeling, Stochastic Calculus', margin, y);
    y += 5;
    doc.text('Data Science: Python (Pandas, NumPy), Machine Learning, Predictive Modeling, ETL', margin, y);
    y += 5;
    doc.text('Engineering: C++, Java, TypeScript, System Design, AWS Cloud, DevOps', margin, y);
    y += 8;
  }

  // Professional Experience
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PROFESSIONAL EXPERIENCE', margin, y);
  doc.line(margin, y + 1.5, 190, y + 1.5);
  y += 7;
  
  const experienceToRender = tailoredContent?.tailoredExperience || experiences.slice(0, 3);
  
  experienceToRender.forEach((exp: any) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${exp.role.toUpperCase()}`, margin, y);
    
    doc.setFont('helvetica', 'normal');
    doc.text(exp.company, 190, y, { align: 'right' });
    y += 5;
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    const period = exp.period || experiences.find((e: any) => e.id === exp.id)?.period || '';
    doc.text(period, margin, y);
    y += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    
    if (exp.bulletPoints) {
      exp.bulletPoints.forEach((bullet: string) => {
        const lines = doc.splitTextToSize(`• ${bullet}`, 165);
        doc.text(lines, margin + 4, y);
        y += (lines.length * 4.5);
      });
      y += 4;
    } else {
      const desc = doc.splitTextToSize(exp.description, 170);
      doc.text(desc, margin, y);
      y += (desc.length * 4.5) + 4;
    }
  });

  // Projects Section
  const projectsToRender = tailoredContent?.projects || projects.slice(0, 3);
  if (y > 230) {
    doc.addPage();
    y = 20;
  }
  
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TECHNICAL ENGINEERING PROJECTS', margin, y);
  doc.line(margin, y + 1.5, 190, y + 1.5);
  y += 7;
  
  projectsToRender.forEach((p: any) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(p.title, margin, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const pDesc = doc.splitTextToSize(`${p.description} [${p.tech || p.techStack?.join(', ')}]`, 170);
    doc.text(pDesc, margin, y);
    y += (pDesc.length * 4.5) + 4;
  });

  // Education Section
  const eduToRender = tailoredContent?.education || [{ degree: "BSc Computer Science", institution: "Kirinyaga University", period: "2022 - 2026", details: "High-Performance Systems & Cloud Defense" }];
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('EDUCATION & ACADEMIC ACHIEVEMENTS', margin, y);
  doc.line(margin, y + 1.5, 190, y + 1.5);
  y += 7;
  
  eduToRender.forEach((edu: any) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(edu.degree, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(edu.period, 190, y, { align: 'right' });
    y += 4.5;
    doc.text(edu.institution, margin, y);
    y += 4.5;
    doc.setFontSize(9);
    doc.text(edu.details, margin, y);
    y += 6;
  });

  // Certifications Section
  if (tailoredContent?.certifications && tailoredContent.certifications.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CERTIFICATIONS', margin, y);
    doc.line(margin, y + 1.5, 190, y + 1.5);
    y += 7;

    tailoredContent.certifications.forEach(cert => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(cert.title, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(cert.date, 190, y, { align: 'right' });
      y += 4.5;
      doc.text(cert.issuer, margin, y);
      y += 6;
    });
  }

  doc.save('Alex_Obwogi_Tailored_Resume.pdf');
};
