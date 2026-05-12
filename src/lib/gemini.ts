import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTailoredResumeContent(userData: any, jobContext: { description: string, keywords: string }) {
  const prompt = `
    You are an Expert AI Career Strategist & Quantitative Finance Architect. Your goal is to synthesize a high-authority, professional, and ATS-optimized resume. 
    STRATEGIC NARRATIVE: You are pivoting a high-performance Software Engineer into a specialized Quantitative Developer/Financial Engineer hybrid role. 
    Every section must support the story of a "Software Engineer mastering mathematical and data-driven complexities of Quantitative Finance."

    USER_DATA:
    ${JSON.stringify(userData, null, 2)}

    TARGET_JOB_CONTEXT:
    Description: ${jobContext.description}
    Keywords: ${jobContext.keywords}

    STRICT BLUEPRINT REQUIREMENTS:
    1. HEADER: Use the provided name, contact info, and location. Include LinkedIn/Portfolio placeholders if not present.
    2. PROFESSIONAL SUMMARY: 3-4 sentences. This is CRITICAL: You MUST prominently feature the user's transition from Software Engineering into Quantitative Software Engineering. You MUST explicitly mention "WorldQuant University" and the "Applied Data Science Lab" as the catalysts for this transition. Position the user as a sophisticated hybrid candidate. Incorporate these EXACT keywords: 'Stochastic Calculus', 'Risk Management', and 'Predictive Modeling'.
    3. CATEGORIZED SKILLS: 
       - Quantitative: Statistics, Linear Algebra, Financial Modeling, Stochastic Calculus.
       - Data Science: Python (Pandas/NumPy/SciPy), Machine Learning, Predictive Modeling, ETL.
       - Engineering: C++, Java, TypeScript, System Design, Cloud Infrastructure (AWS), DevOps.
    4. TAILORED EXPERIENCE: 
       - For EACH professional experience, prioritize achievements involving Data, Analytics, Performance, or Scalability.
       - Use "Financial Engineering" vernacular (e.g., "High-Throughput Pipelines", "Latency Reduction", "Risk Mitigation").
       - EVERY bullet point MUST follow the STAR method and include a PROFESSIONAL NUMBER (metric).
    5. EDUCATION: 
       - FEATURE PROMINENTLY: MSc in Financial Engineering (MScFE) at WorldQuant University (Starting June 2026).
       - FEATURE PROMINENTLY: Applied Data Science Lab (Current). Emphasize hands-on work with large-scale financial datasets.
       - Include the original academic background (BSc Computer Science).
    6. PROJECTS: Select the top 3 projects. Frame them as experiments in data integrity, predictive modeling, or high-performance systems.
    7. CERTIFICATIONS: Include relevant certifications with issuer and date.

    TONE: Executive, Highly Technical, Quantitative.
    FORMAT: Single-column, standard headings, machine-readable. NO graphics.

    RESPONSE_FORMAT (JSON ONLY):
    {
      "summary": "...",
      "topSkills": ["Quantitative: ...", "Data Science: ...", "Engineering: ..."],
      "tailoredExperience": [
        {
          "id": "...",
          "role": "...",
          "company": "...",
          "period": "...",
          "bulletPoints": ["...", "...", "..."]
        }
      ],
      "education": [
        {
          "degree": "...",
          "institution": "...",
          "period": "...",
          "details": "..."
        }
      ],
      "projects": [
        {
          "title": "...",
          "tech": "...",
          "description": "..."
        }
      ],
      "certifications": [
        {
          "title": "...",
          "issuer": "...",
          "date": "..."
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
