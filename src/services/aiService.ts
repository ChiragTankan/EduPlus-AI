import preloadedModules from '../data/preloadedModules.json';
import { generateStaticModuleContent } from './moduleGenerator';

const CACHE_PREFIX = "abilities_ai_cache_";
const CACHE_EXPIRY = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

const getFromCache = (key: string) => {
  const cached = localStorage.getItem(CACHE_PREFIX + key);
  if (!cached) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

const setInCache = (key: string, data: string) => {
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isQuotaError = error?.message?.includes("429") || error?.status === 429;
      if (isQuotaError && i < retries - 1) {
        await sleep(delay * Math.pow(2, i));
        continue;
      }
      throw error;
    }
  }
};

const callGeminiAI = async (prompt: string, isJson = false) => {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, isJson })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI Proxy Error: ${response.status}`);
  }

  const data = await response.json();
  return data.content;
};

export const generateSkillRoadmap = async (skill: string) => {
  const cacheKey = `roadmap_${skill.toLowerCase().replace(/\s+/g, '_')}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const result = await callWithRetry(async () => {
    return await callGeminiAI(`You are a friendly and encouraging AI Study Tutor for students. 
      Create a highly detailed, student-friendly learning roadmap for: ${skill}. 
      
      Structure your response as follows:
      1. **Overview**: Why this skill is exciting and important in 2026.
      2. **Prerequisites**: What you should know before starting.
      3. **Phase 1-3**: A step-by-step guide with specific topics and recommended free resources.
      4. **Job Market Insight**: Show current salary ranges and top companies hiring for this skill.
      5. **Pro Tip**: A unique piece of advice for mastering this skill.
      
      Use a warm, approachable tone. Use emojis to make it engaging.`);
  });

  if (result) setInCache(cacheKey, result);
  return result;
};

export const generateModuleContent = async (moduleTitle: string) => {
  // 1. Check preloaded data first (Explicitly defined high-quality content)
  const preloaded = preloadedModules[moduleTitle as keyof typeof preloadedModules] as any;
  if (preloaded) {
    console.log(`[AI Service] Using preloaded content for: ${moduleTitle}`);
    // Ensure it has a quiz
    if (!preloaded.quiz || preloaded.quiz.length === 0) {
      const staticData = generateStaticModuleContent(moduleTitle);
      return { ...preloaded, quiz: staticData.quiz };
    }
    return preloaded;
  }

  // 2. Check cache for previously generated content
  const cacheKey = `module_content_${moduleTitle.toLowerCase().replace(/\s+/g, '_')}`;
  const cached = getFromCache(cacheKey);
  if (cached) return JSON.parse(cached);

  // 3. Use the Static Generator (Ensures 10 pages, no API call)
  // This fulfills the requirement that all modules work offline with 10 pages.
  console.log(`[AI Service] Generating static content for: ${moduleTitle}`);
  const staticContent = generateStaticModuleContent(moduleTitle);
  
  // Cache it for future use
  setInCache(cacheKey, JSON.stringify(staticContent));
  
  return staticContent;
};

export const getRecommendedSkills = async () => {
  const cacheKey = "recommended_curriculum_skills";
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const result = await callWithRetry(async () => {
      return await callGeminiAI(`Act as an expert academic advisor and curriculum designer for modern education in 2026. 
        What are the top 5 essential core competencies and curriculum subjects for students in 2026? 
        For each subject:
        - Provide an inspiring academic title.
        - Explain why it is essential in modern education.
        - Suggest a practical study assignment or hands-on academic project for students.
        
        Format with clear markdown headings, bullet points, and engaging emojis.`);
    });

    if (result) setInCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("Gemini API failed, using fallback data:", error);
    const fallback = `### 🎓 2026 Core Academic Curriculum & Trends

1. **AI-Assisted Research & Critical Analysis**
   - **Educational Value**: Teaches students how to synthesize AI-generated research, verify citations, and avoid algorithmic bias.
   - **Academic Project**: Critique and fact-check a multi-page AI research paper on quantum computing.

2. **Computational Logic & System Design**
   - **Educational Value**: Foundational problem-solving skill that transcends programming languages.
   - **Academic Project**: Map out a state-machine diagram for an automated hospital triage system.

3. **Data Literacy & Scientific Visualization**
   - **Educational Value**: Empowers students to transform raw data into actionable visual insights across STEM and social sciences.
   - **Academic Project**: Analyze global climate datasets and present interactive D3 visual charts.

4. **Digital Ethics & Cybersecurity Fundamentals**
   - **Educational Value**: Prepares students to navigate data privacy, security protocols, and ethical AI deployment.
   - **Academic Project**: Conduct an architectural security review for a mock student portal.

5. **Cross-Disciplinary Problem Solving**
   - **Educational Value**: Blends engineering principles with human-centered design and policy analysis.
   - **Academic Project**: Design an intelligent eco-friendly campus energy management system.`;
    return fallback;
  }
};
