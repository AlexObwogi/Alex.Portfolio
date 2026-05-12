import { ai, RESUME_MODEL } from './ai';

export async function generateTailoredResume(userData: any, jobContext: { description: string, keywords: string }) {
  const prompt = `
    You are an Expert Career Strategist & Quantitative Finance Architect. Your goal is to synthesize a high-authority, professional, and ATS-optimized resume. 
    STRATEGIC NARRATIVE: You are pivoting a high-performance Software Engineering career into a specialized Quantitative Developer/Financial Engineer hybrid role. 
    Every section must support the story of a "Software Engineer mastering mathematical and data-driven complexities of Quantitative Finance."

    USER_DATA:
    ${JSON.stringify(userData, null, 2)}

    TARGET_JOB_CONTEXT:
    Description: ${jobContext.description}
    Keywords: ${jobContext.keywords}

    STRICT BLUEPRINT REQUIREMENTS:
    1. HEADER: Use the provided name, contact info, and location. Include LinkedIn/Portfolio placeholders if not present.
    2. PROFESSIONAL SUMMARY: Exactly 3-4 sentences. This is CRITICAL: You MUST prominently feature the user's transition from Software Engineering into Quantitative Software Engineering, explicitly citing WorldQuant University and the Applied Data Science Lab as the primary catalysts. Use precise, executive-level language to position the user as a sophisticated hybrid candidate. Incorporate these EXACT keywords: 'Stochastic Calculus', 'Risk Management', and 'Predictive Modeling'. Ensure the narrative is cohesive and high-authority.
    3. CATEGORIZED SKILLS: 
       - Quantitative: Statistics, Linear Algebra, Financial Modeling, Stochastic Calculus.
       - Data Science: Python (Pandas/NumPy/SciPy), Machine Learning, Predictive Modeling, ETL.
       - Engineering: C++, Java, TypeScript, System Design, Cloud Infrastructure (AWS), DevOps.
    4. TAILORED EXPERIENCE: 
       - This section is MANDATORY. You MUST included a "Professional Experience" or "Key Engineering Experience" section.
       - Include the 4th-year Capstone Project (SmartRent AI) as a primary entry in the Experience section. Highlight that it was a 7-month intensive development cycle.
       - For EACH entry, prioritize achievements involving Data, Analytics, Mathematics, or Scalability.
       - Use "Financial Engineering" vernacular (e.g., "High-Throughput Pipelines", "Latency Reduction", "Risk Mitigation").
       - EVERY bullet point MUST follow the STAR method and include a PROFESSIONAL NUMBER (metric).
    5. EDUCATION: 
       - FEATURE PROMINENTLY: MSc in Financial Engineering (MScFE) at WorldQuant University (Starting June 2026).
       - FEATURE PROMINENTLY: Applied Data Science Lab (Current). MANDATORY: Emphasize extensive hands-on experience processing and modeling large-scale, high-fidelity financial datasets.
       - Include the original academic background (BSc Computer Science) and highlight the 4th-year Capstone excellence.
    6. PROJECTS: Select the top 3 projects (excluding the Capstone project which is now in Experience). Frame them as experiments in data integrity, predictive modeling, or high-performance systems.
    7. CERTIFICATIONS: Include relevant certifications with issuer and date.

    TONE: Executive, Highly Technical, Quantitative.
    FORMAT: Single-column, standard headings, machine-readable. NO graphics.

    RESPONSE_FORMAT (JSON ONLY):
    {
      "header": {
        "name": "...",
        "email": "...",
        "phone": "...",
        "location": "..."
      },
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
      model: RESUME_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
