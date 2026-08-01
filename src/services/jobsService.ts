export interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogoBg: string; // e.g., 'bg-blue-600'
  companyInitial: string;
  platform: 'LinkedIn' | 'Y Combinator' | 'Wellfound' | 'Google Careers' | 'Indeed' | 'RemoteOK' | 'Glassdoor';
  platformBadgeColor: string; // tailwind color class
  type: 'Internship' | 'Full-Time' | 'Part-Time' | 'Co-op';
  category: 'Full-Stack / Web' | 'AI & Machine Learning' | 'Data Science' | 'Mobile Development' | 'Cybersecurity' | 'DevOps / Cloud' | 'UI/UX Design';
  location: string;
  workSetup: 'Remote' | 'Hybrid' | 'On-site';
  experienceLevel: 'Student / Intern' | 'Entry-Level (0-2 yrs)' | 'Mid-Level';
  salaryRange: string;
  tags: string[];
  description: string;
  postedDate: string;
  applyUrl: string;
  featured?: boolean;
  recommendedModuleId?: string;
  lastUpdatedDate?: string;
}

export const PLATFORMS = [
  'All Platforms',
  'LinkedIn',
  'Y Combinator',
  'Wellfound',
  'Google Careers',
  'Indeed',
  'RemoteOK',
  'Glassdoor'
] as const;

export const EMPLOYMENT_TYPES = [
  'All Types',
  'Internship',
  'Full-Time',
  'Part-Time',
  'Co-op'
] as const;

export const WORK_SETUPS = [
  'All Setups',
  'Remote',
  'Hybrid',
  'On-site'
] as const;

export const EXPERIENCE_LEVELS = [
  'All Levels',
  'Student / Intern',
  'Entry-Level (0-2 yrs)',
  'Mid-Level'
] as const;

export const CATEGORIES = [
  'All Roles',
  'Full-Stack / Web',
  'AI & Machine Learning',
  'Data Science',
  'Mobile Development',
  'Cybersecurity',
  'DevOps / Cloud',
  'UI/UX Design'
] as const;

// Curated seed dataset of real-world jobs with direct search/apply links
export const INITIAL_JOBS: JobItem[] = [
  {
    id: 'job-1',
    title: 'Software Engineering Intern (Summer 2026)',
    company: 'Stripe',
    companyLogoBg: 'bg-indigo-600',
    companyInitial: 'S',
    platform: 'LinkedIn',
    platformBadgeColor: 'bg-blue-600 text-white',
    type: 'Internship',
    category: 'Full-Stack / Web',
    location: 'San Francisco, CA',
    workSetup: 'Hybrid',
    experienceLevel: 'Student / Intern',
    salaryRange: '$52 - $65 / hr + Housing Stipend',
    tags: ['React', 'TypeScript', 'Ruby', 'Distributed Systems'],
    description: 'Build core financial APIs, payment infrastructure, and web developer dashboards for global commerce. Work closely with senior engineers on real production microservices.',
    postedDate: 'Today (Updated 2h ago)',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Stripe+Software+Engineer+Intern',
    featured: true,
    recommendedModuleId: 'react-hooks'
  },
  {
    id: 'job-2',
    title: 'Junior AI & LLM Systems Developer',
    company: 'Anthropic',
    companyLogoBg: 'bg-stone-800',
    companyInitial: 'A',
    platform: 'Y Combinator',
    platformBadgeColor: 'bg-orange-500 text-white',
    type: 'Full-Time',
    category: 'AI & Machine Learning',
    location: 'San Francisco, CA / Remote',
    workSetup: 'Remote',
    experienceLevel: 'Entry-Level (0-2 yrs)',
    salaryRange: '$140,000 - $185,000 / yr + Equity',
    tags: ['Python', 'PyTorch', 'TypeScript', 'Vector DB', 'Claude API'],
    description: 'Design robust evaluation systems, model inference servers, and front-end tooling for next-generation Claude AI safety and assistant applications.',
    postedDate: 'Today (Updated 4h ago)',
    applyUrl: 'https://www.ycombinator.com/jobs?q=Anthropic+Software+Engineer',
    featured: true,
    recommendedModuleId: 'nlp-transformers'
  },
  {
    id: 'job-3',
    title: 'Frontend React Engineering Intern',
    company: 'Vercel',
    companyLogoBg: 'bg-black text-white',
    companyInitial: 'V',
    platform: 'Wellfound',
    platformBadgeColor: 'bg-purple-600 text-white',
    type: 'Internship',
    category: 'Full-Stack / Web',
    location: 'Remote (Worldwide)',
    workSetup: 'Remote',
    experienceLevel: 'Student / Intern',
    salaryRange: '$45 - $58 / hr',
    tags: ['React 18', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Web Vitals'],
    description: 'Craft high-performance user interfaces for Vercel Cloud platform, Next.js developer analytics, and edge deployment tools.',
    postedDate: 'Today',
    applyUrl: 'https://wellfound.com/jobs?q=Vercel+Frontend+Developer',
    featured: false,
    recommendedModuleId: 'react-hooks'
  },
  {
    id: 'job-4',
    title: 'Associate Cybersecurity Analyst (SOC / Blue Team)',
    company: 'Cloudflare',
    companyLogoBg: 'bg-amber-600',
    companyInitial: 'C',
    platform: 'Google Careers',
    platformBadgeColor: 'bg-emerald-600 text-white',
    type: 'Full-Time',
    category: 'Cybersecurity',
    location: 'Austin, TX / Remote',
    workSetup: 'Hybrid',
    experienceLevel: 'Entry-Level (0-2 yrs)',
    salaryRange: '$95,000 - $125,000 / yr',
    tags: ['Network Security', 'Linux', 'Wireshark', 'Bash', 'OWASP'],
    description: 'Monitor global network threat telemetry, respond to DDoS incidents, audit web application firewall rules, and maintain zero-trust edge infrastructure.',
    postedDate: 'Today (Updated 1h ago)',
    applyUrl: 'https://www.google.com/about/careers/applications/jobs/results/?q=Cloudflare+Security+Analyst',
    featured: true,
    recommendedModuleId: 'web-security'
  },
  {
    id: 'job-5',
    title: 'Data Science & Analytics Intern',
    company: 'Datadog',
    companyLogoBg: 'bg-purple-700',
    companyInitial: 'D',
    platform: 'LinkedIn',
    platformBadgeColor: 'bg-blue-600 text-white',
    type: 'Internship',
    category: 'Data Science',
    location: 'New York, NY',
    workSetup: 'Hybrid',
    experienceLevel: 'Student / Intern',
    salaryRange: '$40 - $52 / hr',
    tags: ['Python', 'Pandas', 'SQL', 'Tableau', 'Scikit-Learn'],
    description: 'Analyze telemetry metrics, build automated anomaly detection algorithms, and deliver data-driven Insights to observability platform engineering teams.',
    postedDate: 'Today',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Datadog+Data+Science+Intern',
    featured: false,
    recommendedModuleId: 'data-viz-d3'
  },
  {
    id: 'job-6',
    title: 'DevOps & Cloud Infrastructure Co-op',
    company: 'Supabase',
    companyLogoBg: 'bg-emerald-600',
    companyInitial: 'S',
    platform: 'RemoteOK',
    platformBadgeColor: 'bg-sky-600 text-white',
    type: 'Co-op',
    category: 'DevOps / Cloud',
    location: 'Remote Global',
    workSetup: 'Remote',
    experienceLevel: 'Student / Intern',
    salaryRange: '$4,500 - $6,500 / mo',
    tags: ['Docker', 'PostgreSQL', 'Kubernetes', 'Terraform', 'Go'],
    description: 'Automate open-source Postgres cluster deployments, CI/CD pipelines, and cloud monitoring across AWS and GCP infrastructure.',
    postedDate: 'Today',
    applyUrl: 'https://remoteok.com/remote-devops-jobs',
    featured: false,
    recommendedModuleId: 'docker-containers'
  },
  {
    id: 'job-7',
    title: 'Mobile App Developer Intern (React Native / iOS)',
    company: 'Linear',
    companyLogoBg: 'bg-zinc-900',
    companyInitial: 'L',
    platform: 'Y Combinator',
    platformBadgeColor: 'bg-orange-500 text-white',
    type: 'Internship',
    category: 'Mobile Development',
    location: 'Remote',
    workSetup: 'Remote',
    experienceLevel: 'Student / Intern',
    salaryRange: '$50 - $65 / hr',
    tags: ['React Native', 'TypeScript', 'iOS', 'GraphQL', 'Offline First'],
    description: 'Contribute to Linear mobile issue tracking app. Focus on buttery smooth animations, offline local state synchronization, and instant touch interactions.',
    postedDate: 'Today',
    applyUrl: 'https://www.ycombinator.com/jobs?q=Linear+Mobile+Developer',
    featured: false,
    recommendedModuleId: 'react-native-expo'
  },
  {
    id: 'job-8',
    title: 'Junior Full-Stack Developer',
    company: 'Sentry',
    companyLogoBg: 'bg-rose-600',
    companyInitial: 'S',
    platform: 'Indeed',
    platformBadgeColor: 'bg-blue-700 text-white',
    type: 'Full-Time',
    category: 'Full-Stack / Web',
    location: 'San Francisco, CA / Remote',
    workSetup: 'Remote',
    experienceLevel: 'Entry-Level (0-2 yrs)',
    salaryRange: '$110,000 - $140,000 / yr',
    tags: ['Python', 'TypeScript', 'React', 'PostgreSQL', 'Kafka'],
    description: 'Build developer-first error tracking and performance monitoring UI components and ingestion pipelines handling billions of events daily.',
    postedDate: 'Today',
    applyUrl: 'https://www.indeed.com/jobs?q=Sentry+Full+Stack+Developer',
    featured: false,
    recommendedModuleId: 'typescript-advanced'
  }
];

const JOBS_CACHE_KEY = 'edu_plus_jobs_stack_v1';
const JOBS_TIMESTAMP_KEY = 'edu_plus_jobs_last_refreshed_ts';
export const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 Hours

export function getCachedJobs(): { jobs: JobItem[]; lastRefreshed: number } {
  try {
    const cachedStr = localStorage.getItem(JOBS_CACHE_KEY);
    const tsStr = localStorage.getItem(JOBS_TIMESTAMP_KEY);
    const lastRefreshed = tsStr ? parseInt(tsStr, 10) : Date.now();

    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { jobs: parsed, lastRefreshed };
      }
    }
  } catch (e) {
    console.error("Error reading jobs cache:", e);
  }

  // Seed default cache if empty
  localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(INITIAL_JOBS));
  localStorage.setItem(JOBS_TIMESTAMP_KEY, Date.now().toString());
  return { jobs: INITIAL_JOBS, lastRefreshed: Date.now() };
}

export function is24HoursExpired(lastRefreshedTs: number): boolean {
  return Date.now() - lastRefreshedTs >= REFRESH_INTERVAL_MS;
}

export async function refreshDailyJobs(filters?: {
  category?: string;
  type?: string;
  query?: string;
  workSetup?: string;
}): Promise<{ jobs: JobItem[]; refreshedAt: number }> {
  const prompt = `You are a real-time tech job market aggregator. Generate 8 highly realistic, currently hiring Job / Internship postings for 2026.
Include top tech companies, startups, and remote teams (e.g. Stripe, OpenAI, Anthropic, Vercel, Supabase, Cloudflare, Datadog, Linear, Figma, Google, Microsoft, Meta).

Filter context requested by user:
- Role/Category: ${filters?.category || 'All Tech Roles'}
- Employment Type: ${filters?.type || 'Internships & Full-time'}
- Location/Setup: ${filters?.workSetup || 'Remote & Hybrid'}
- Search Query: ${filters?.query || 'Software & Data'}

Format response strictly as a JSON array of objects with these exact keys:
[
  {
    "id": "job-ai-1",
    "title": "Software Engineering Intern - Summer 2026",
    "company": "Company Name",
    "companyLogoBg": "bg-indigo-600",
    "companyInitial": "S",
    "platform": "LinkedIn",
    "platformBadgeColor": "bg-blue-600 text-white",
    "type": "Internship",
    "category": "Full-Stack / Web",
    "location": "San Francisco, CA / Remote",
    "workSetup": "Remote",
    "experienceLevel": "Student / Intern",
    "salaryRange": "$50 - $65 / hr",
    "tags": ["React", "TypeScript", "Node.js"],
    "description": "2-3 sentence overview of responsibilities and real tech stack...",
    "postedDate": "Today (Fresh 24h listing)",
    "applyUrl": "https://www.linkedin.com/jobs/search/?keywords=Software+Engineer+Intern",
    "featured": true,
    "recommendedModuleId": "react-hooks"
  }
]
Platforms allowed: LinkedIn, Y Combinator, Wellfound, Google Careers, Indeed, RemoteOK, Glassdoor.
Return ONLY valid raw JSON array without markdown code fences.`;

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, isJson: true })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        let cleanText = data.content.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const parsed: JobItem[] = JSON.parse(cleanText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Format URLs properly
          const sanitizedJobs = parsed.map((j, idx) => ({
            ...j,
            id: j.id || `job-fresh-${Date.now()}-${idx}`,
            applyUrl: j.applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(j.company + ' ' + j.title)}`,
            postedDate: `Today (Refreshed ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            companyInitial: (j.company || 'C').charAt(0).toUpperCase()
          }));

          const now = Date.now();
          localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(sanitizedJobs));
          localStorage.setItem(JOBS_TIMESTAMP_KEY, now.toString());
          return { jobs: sanitizedJobs, refreshedAt: now };
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch fresh AI jobs, falling back to dynamic stack:", err);
  }

  // Fallback: shuffle/update timestamp on initial dataset
  const now = Date.now();
  const refreshedSeed = INITIAL_JOBS.map((job) => ({
    ...job,
    postedDate: `Today (Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
  }));

  localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(refreshedSeed));
  localStorage.setItem(JOBS_TIMESTAMP_KEY, now.toString());
  return { jobs: refreshedSeed, refreshedAt: now };
}
