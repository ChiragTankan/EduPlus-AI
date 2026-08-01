import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Menu,
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  Loader2, 
  Sparkles,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  Send,
  User,
  Bot,
  X,
  Award,
  ExternalLink,
  Linkedin,
  Mic,
  Download,
  FileText,
  Target,
  Briefcase,
  Upload,
  CheckCircle2,
  Zap,
  BarChart3,
  Layers,
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  FileUp,
  Check,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Building2,
  Globe,
  Filter,
  Calendar
} from 'lucide-react';
import { AppUserButton as UserButton, useAppUser as useUser } from '../lib/clerkFallback';
import { generateSkillRoadmap, analyzeResume } from '../services/aiService';
import { 
  JobItem, 
  getCachedJobs, 
  refreshDailyJobs, 
  is24HoursExpired, 
  PLATFORMS, 
  EMPLOYMENT_TYPES, 
  WORK_SETUPS, 
  EXPERIENCE_LEVELS, 
  CATEGORIES 
} from '../services/jobsService';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { MODULES, ModuleInfo } from '../constants/modules';
import preloadedModules from '../data/preloadedModules.json';
import { Certificate as CertificateComponent } from './Certificate';
import { storageService } from '../services/storageService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Certificate {
  id: number;
  module_name: string;
  issued_at: string;
}

export function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tutor' | 'resume' | 'mock-interview' | 'jobs' | 'study' | 'certificates'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  // Progress State
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [completedRoadmaps, setCompletedRoadmaps] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);

  // Jobs & Internships State (With 24hr auto refresh)
  const [jobsList, setJobsList] = useState<JobItem[]>([]);
  const [jobsLastRefreshed, setJobsLastRefreshed] = useState<number>(Date.now());
  const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedJobPlatform, setSelectedJobPlatform] = useState<string>('All Platforms');
  const [selectedJobType, setSelectedJobType] = useState<string>('All Types');
  const [selectedJobSetup, setSelectedJobSetup] = useState<string>('All Setups');
  const [selectedJobLevel, setSelectedJobLevel] = useState<string>('All Levels');
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('All Roles');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('edu_plus_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Resume Analyzer 4-Stage State
  const [resumeStage, setResumeStage] = useState<1 | 2 | 3 | 4>(1);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [resumeInputText, setResumeInputText] = useState('');
  const [targetCareerGoal, setTargetCareerGoal] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('Top Tech / MAANG');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level / Student');
  const [focusAreas, setFocusAreas] = useState('Full-Stack Development & Distributed Systems');
  const [resumeAnalysisResult, setResumeAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [atsScore, setAtsScore] = useState<number>(84);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeInputText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyzeResume = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resumeInputText.trim() && !targetCareerGoal.trim()) return;

    setIsAnalyzingResume(true);
    try {
      const result = await analyzeResume(
        resumeInputText, 
        targetCareerGoal,
        targetIndustry,
        experienceLevel,
        focusAreas
      );
      setResumeAnalysisResult(result);
      const match = result.match(/Overall ATS Match Score\*?:?\s*\*?(\d{2,3})/i);
      if (match && match[1]) {
        setAtsScore(parseInt(match[1], 10));
      } else {
        setAtsScore(84);
      }
      setResumeStage(3);
    } catch (error) {
      console.error("Resume analysis failed:", error);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const loadSampleResume = (role: 'swe' | 'data' | 'cyber') => {
    if (role === 'swe') {
      setUploadedFileName('fullstack_engineer_resume.pdf');
      setTargetCareerGoal('Full-Stack Software & AI Engineer');
      setTargetIndustry('Top Tech / MAANG');
      setExperienceLevel('Entry-Level / Student');
      setFocusAreas('React, TypeScript, Node.js, System Architecture');
      setResumeInputText(`B.Tech Computer Science & Engineering Student (Final Year)
Technical Skills: TypeScript, JavaScript (ES6+), React 18, Node.js, Express, C++, Python, Data Structures & Algorithms, Git, HTML5/CSS3.
Projects:
- Interactive Web Portfolio: Single-page React app styled with Tailwind CSS and Framer Motion.
- Real-time Task Orchestrator: Node.js backend proxying external REST APIs with custom endpoints.
Coursework: Database Management Systems, Computer Networks, Operating Systems, Software Engineering.
Objective: Secure a Full-Stack Software Engineer role at an innovative tech company.`);
    } else if (role === 'data') {
      setUploadedFileName('data_science_resume.pdf');
      setTargetCareerGoal('Data Scientist & AI Specialist');
      setTargetIndustry('AI & High-Growth Startup');
      setExperienceLevel('Entry-Level / Student');
      setFocusAreas('Python, PyTorch, Pandas, Vector Databases, Machine Learning');
      setResumeInputText(`B.S. Information Technology & Data Analytics Student
Technical Skills: Python, Pandas, NumPy, SQL, PyTorch, Scikit-Learn, Matplotlib, Jupyter Notebooks, Docker.
Projects:
- Customer Churn Predictive Model: Built Random Forest & Logistic Regression classifiers achieving 87% accuracy.
- Climate Data Analytics Dashboard: Interactive data visualizer built with Python and D3.js.
Coursework: Applied Statistics, Linear Algebra, Machine Learning, Database Design.
Objective: Land a Data Science role constructing high-precision predictive AI models.`);
    } else if (role === 'cyber') {
      setUploadedFileName('cybersecurity_analyst_resume.pdf');
      setTargetCareerGoal('Cybersecurity & Ethical Hacking Specialist');
      setTargetIndustry('Enterprise Security');
      setExperienceLevel('Entry-Level / Student');
      setFocusAreas('Linux Administration, Network Security, Wireshark, Web Security');
      setResumeInputText(`B.Tech Network Security & Cybersecurity Student
Technical Skills: Linux (Ubuntu/Kali), Networking (TCP/IP, OSI, Wireshark), Python scripting, Bash, OWASP Top 10.
Projects:
- Home Lab Network Intrusion Audit: Configured Wireshark packet capture to monitor simulated intrusion attempts.
- Vulnerability Assessment Report: Conducted automated security scanning on test web server environment.
Coursework: Computer Networks, Information Security, Cryptography, Cyber Defense.
Objective: Become a SOC Security Analyst or Penetration Tester.`);
    }
  };

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/ai');
        setIsApiHealthy(res.ok);
      } catch {
        setIsApiHealthy(false);
      }
    };
    checkApi();
  }, []);

  const filteredModules = MODULES.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(MODULES.map(m => m.category)))];

  const totalModules = MODULES.length;
  const progress = Math.round((completedModules.length / totalModules) * 100);

  // AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Jobs from 24h cache & trigger auto-refresh if expired
  useEffect(() => {
    const { jobs, lastRefreshed } = getCachedJobs();
    setJobsList(jobs);
    setJobsLastRefreshed(lastRefreshed);

    if (is24HoursExpired(lastRefreshed)) {
      handleRefreshJobs();
    }
  }, []);

  const handleRefreshJobs = async () => {
    setIsRefreshingJobs(true);
    try {
      const { jobs, refreshedAt } = await refreshDailyJobs({
        category: selectedJobCategory,
        type: selectedJobType,
        query: jobSearchQuery,
        workSetup: selectedJobSetup
      });
      setJobsList(jobs);
      setJobsLastRefreshed(refreshedAt);
    } catch (err) {
      console.error("Failed to refresh jobs:", err);
    } finally {
      setIsRefreshingJobs(false);
    }
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const updated = prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId];
      localStorage.setItem('edu_plus_saved_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredJobs = jobsList.filter(job => {
    const query = jobSearchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.tags.some(t => t.toLowerCase().includes(query));

    const matchesPlatform = selectedJobPlatform === 'All Platforms' || job.platform === selectedJobPlatform;
    const matchesType = selectedJobType === 'All Types' || job.type === selectedJobType;
    const matchesSetup = selectedJobSetup === 'All Setups' || job.workSetup === selectedJobSetup;
    const matchesLevel = selectedJobLevel === 'All Levels' || job.experienceLevel === selectedJobLevel;
    const matchesCategory = selectedJobCategory === 'All Roles' || job.category === selectedJobCategory;
    const matchesSaved = !showSavedOnly || savedJobIds.includes(job.id);

    return matchesSearch && matchesPlatform && matchesType && matchesSetup && matchesLevel && matchesCategory && matchesSaved;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const progressData = await storageService.getProgress(user.id);
        const certsData = await storageService.getCertificates(user.id);
        
        setCompletedModules(progressData);
        setCertificates(certsData);
        
        // Calculate completed roadmaps (all 3 modules done)
        const moduleIds = ['web-dev', 'data-ai', 'mobile', 'cloud'];
        let count = 0;
        moduleIds.forEach(id => {
          if (['m1', 'm2', 'm3'].every(step => progressData.includes(`${id}-${step}`))) {
            count++;
          }
        });
        setCompletedRoadmaps(count);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const input = overrideInput || chatInput;
    if (!input.trim() || isChatLoading) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsChatLoading(true);
    setActiveTab('tutor');

    try {
      const result = await generateSkillRoadmap(input);
      setChatMessages(prev => [...prev, { role: 'assistant', content: result }]);
      // Increment roadmap count if it's a new roadmap request
      if (input.toLowerCase().includes('roadmap') || input.toLowerCase().includes('path')) {
        setCompletedRoadmaps(prev => prev + 1);
      }
    } catch (error: any) {
      console.error("Chat error", error);
      let errorMessage = "I'm having trouble connecting right now. Let's try again in a moment.";
      
      if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "I've been helping so many students today that I need a quick breather! 😅 Please try again in a few minutes, or explore our existing modules in the **Study Area** while I recharge.";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCompleteModule = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card border-r border-border transition-all duration-300 flex flex-col z-[70] fixed lg:relative h-full",
          isSidebarOpen ? "w-72" : "w-20",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {(isSidebarOpen || isMobileMenuOpen || !isSidebarOpen) && (
            <span className={cn("text-2xl font-black tracking-tighter gradient-text animate-gradient flex items-center gap-2")}>
              <GraduationCap className="w-6 h-6 text-primary" /> 
              {(isSidebarOpen || isMobileMenuOpen) && <span>EDU Plus</span>}
            </span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-secondary rounded-xl transition-colors hidden lg:block"
          >
            {isSidebarOpen ? <ChevronRight className="w-5 h-5 rotate-180" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-secondary rounded-xl transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={<LayoutDashboard />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<MessageSquare />} 
            label="AI Study Tutor" 
            active={activeTab === 'tutor'} 
            onClick={() => { setActiveTab('tutor'); setIsMobileMenuOpen(false); }}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<FileText />} 
            label="Resume Analyzer" 
            active={activeTab === 'resume'} 
            onClick={() => { setActiveTab('resume'); setIsMobileMenuOpen(false); }}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<Mic />} 
            label="AI Mock Interview" 
            active={activeTab === 'mock-interview'} 
            onClick={() => { setActiveTab('mock-interview'); setIsMobileMenuOpen(false); }}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<BookOpen />} 
            label="Study Area" 
            active={activeTab === 'study'} 
            onClick={() => { setActiveTab('study'); setIsMobileMenuOpen(false); }}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<Briefcase />} 
            label="Jobs & Internships" 
            active={activeTab === 'jobs'} 
            onClick={() => { setActiveTab('jobs'); setIsMobileMenuOpen(false); }}
            collapsed={!isSidebarOpen}
          />
          <SidebarItem 
            icon={<Award />} 
            label="My Certificates" 
            active={activeTab === 'certificates'} 
            onClick={() => { setActiveTab('certificates'); setIsMobileMenuOpen(false); }}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-border bg-secondary/20">
          <div className={cn("flex items-center gap-3 p-2 rounded-2xl", (!isSidebarOpen && !isMobileMenuOpen) && "justify-center")}>
            <UserButton afterSignOutUrl="/" />
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate">{user?.fullName || 'Student'}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-secondary rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-primary" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg lg:text-xl font-bold capitalize tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                {activeTab === 'overview' ? `Welcome back, ${user?.firstName || 'Student'}!` : activeTab.replace('-', ' ')}
              </h2>
              <p className="text-[8px] lg:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                {activeTab === 'overview' ? "Your potential, unlocked." : "Engineered for Excellence"}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          {isApiHealthy === false && (
            <div className="max-w-6xl mx-auto mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-500">AI Service Offline</h4>
                  <p className="text-xs text-amber-500/70">The ASI One API key is missing. Dynamic module generation is disabled, but preloaded modules will still work!</p>
                </div>
              </div>
              <a 
                href="https://ai.studio/build" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:scale-105 transition-all whitespace-nowrap"
              >
                Configure Key
              </a>
            </div>
          )}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  <StatsCard 
                    icon={<GraduationCap className="w-5 h-5" />}
                    title="Learning Progress" 
                    value={`${progress}%`} 
                    trend="Top 10% of students"
                    color="text-blue-500"
                  />
                  <StatsCard 
                    icon={<BookOpen className="w-5 h-5" />}
                    title="Active Roadmaps" 
                    value={completedRoadmaps.toString()} 
                    trend="Keep it up!"
                    color="text-purple-500"
                  />
                  <StatsCard 
                    icon={<Lightbulb className="w-5 h-5" />}
                    title="AI Insights" 
                    value="14" 
                    trend="New trends found"
                    color="text-orange-500"
                  />
                  <StatsCard 
                    icon={<Sparkles className="w-5 h-5" />}
                    title="Recent Skills" 
                    value="8" 
                    trend="New requirements"
                    color="text-emerald-500"
                  />
                </div>

                {/* Featured Jobs & Internships Card */}
                <div className="bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 border border-primary/20 p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/20 transition-colors" />
                  <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary text-white rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-primary/20">
                      <Briefcase className="w-8 h-8 lg:w-10 lg:h-10" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
                        <Zap className="w-3 h-3 animate-pulse" /> Daily 24-Hour Job Stack
                      </div>
                      <h3 className="text-xl lg:text-2xl font-black tracking-tight mb-2">Live Tech Jobs & Internships</h3>
                      <p className="text-sm lg:text-base text-muted-foreground mb-4">Discover daily updated tech internships and full-time developer openings across LinkedIn, Y Combinator, Wellfound, Google Careers, and RemoteOK.</p>
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {['Software Internships', 'Full-Stack Developer', 'AI/ML Engineering', 'Cybersecurity', 'DevOps & Cloud', 'Remote Work'].map(tag => (
                          <span key={tag} className="px-3 py-1 lg:px-4 lg:py-1.5 bg-background border border-border rounded-full text-[10px] lg:text-xs font-bold hover:border-primary transition-colors cursor-default">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('jobs')}
                      className="w-full lg:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      Browse Jobs & Internships <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Fresh Today's Openings Highlights */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold tracking-tight">Today's Fresh Openings</h3>
                      <p className="text-xs text-muted-foreground">Handpicked opportunities updated within the last 24 hours.</p>
                    </div>
                    <button onClick={() => setActiveTab('jobs')} className="text-xs lg:text-sm font-bold text-primary hover:underline flex items-center gap-1">
                      View All ({jobsList.length}) <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobsList.slice(0, 3).map(job => (
                      <div key={job.id} className="bg-card border border-border p-5 rounded-2xl hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold", job.platformBadgeColor)}>
                              {job.platform}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary text-foreground">
                              {job.type}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">{job.title}</h4>
                            <p className="text-xs text-muted-foreground font-medium">{job.company} • {job.location}</p>
                          </div>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{job.salaryRange}</p>
                        </div>
                        <a 
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-secondary hover:bg-primary hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          Apply on {job.platform} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Study Tutor Tab (ACTIVATED & FULLY INTERACTIVE) */}
            {activeTab === 'tutor' && (
              <motion.div
                key="tutor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full max-w-5xl mx-auto pb-28"
              >
                <div className="flex-1 space-y-6">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
                        <Bot className="w-10 h-10 text-primary" />
                      </div>
                      <div className="max-w-md">
                        <h3 className="text-2xl font-bold mb-2">Your AI Study Tutor</h3>
                        <p className="text-muted-foreground">
                          Ask me to create a personalized study roadmap, explain a complex topic, or guide you through your current syllabus.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                        <SuggestionButton onClick={() => handleChatSubmit(undefined, "Full Stack Web Dev 2026")}>"Roadmap for Web Dev"</SuggestionButton>
                        <SuggestionButton onClick={() => handleChatSubmit(undefined, "Explain Quantum Computing simply")}>"Explain Quantum Computing"</SuggestionButton>
                        <SuggestionButton onClick={() => handleChatSubmit(undefined, "Top AI skills to learn")}>"AI Skills for 2026"</SuggestionButton>
                        <SuggestionButton onClick={() => handleChatSubmit(undefined, "Data Science career path")}>"Data Science Path"</SuggestionButton>
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex gap-4 max-w-[85%]",
                          msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                          msg.role === 'user' ? "bg-primary text-white" : "bg-secondary text-primary"
                        )}>
                          {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className={cn(
                          "p-6 rounded-3xl border shadow-sm",
                          msg.role === 'user' 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-card border-border markdown-body"
                        )}>
                          {msg.role === 'user' ? (
                            <p className="font-medium">{msg.content}</p>
                          ) : (
                            <Markdown>{msg.content}</Markdown>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex gap-4 mr-auto">
                      <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                      <div className="p-6 rounded-3xl bg-secondary/50 border border-border">
                        <p className="text-sm text-muted-foreground animate-pulse">Thinking and analyzing curriculum resources...</p>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-40">
                  <form 
                    onSubmit={handleChatSubmit}
                    className="relative flex items-center glass p-2 rounded-3xl shadow-2xl"
                  >
                    <input 
                      type="text"
                      placeholder="Ask your tutor anything..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-sm font-medium outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim() || isChatLoading}
                      className="p-4 bg-primary text-white rounded-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Resume Analyzer Tab */}
            {activeTab === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-8 pb-20"
              >
                {/* Header Banner */}
                <div className="bg-card p-6 sm:p-8 lg:p-10 rounded-[32px] border border-border shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">AI Resume & Skill Gap Analyzer</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Four-stage assessment engine evaluating ATS parseability, career fit, technical skill gaps, and EDU Plus stack modules.
                        </p>
                      </div>
                    </div>

                    {/* Stepper Tabs Bar */}
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button 
                          type="button"
                          onClick={() => setResumeStage(1)}
                          className={cn(
                            "flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs transition-all border",
                            resumeStage === 1 
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                              : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          <Upload className="w-3.5 h-3.5" /> Stage 1: Upload CV
                        </button>
                        <button 
                          type="button"
                          onClick={() => setResumeStage(2)}
                          className={cn(
                            "flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs transition-all border",
                            resumeStage === 2 
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                              : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          <Target className="w-3.5 h-3.5" /> Stage 2: Fill Details
                        </button>
                        <button 
                          type="button"
                          onClick={() => { if (resumeAnalysisResult) setResumeStage(3); }}
                          disabled={!resumeAnalysisResult}
                          className={cn(
                            "flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs transition-all border disabled:opacity-40",
                            resumeStage === 3 
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                              : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          <BarChart3 className="w-3.5 h-3.5" /> Stage 3: ATS & Gaps
                        </button>
                        <button 
                          type="button"
                          onClick={() => { if (resumeAnalysisResult) setResumeStage(4); }}
                          disabled={!resumeAnalysisResult}
                          className={cn(
                            "flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-xl font-bold text-xs transition-all border disabled:opacity-40",
                            resumeStage === 4 
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                              : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          <Layers className="w-3.5 h-3.5" /> Stage 4: Stack Links
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STAGE 1: UPLOAD RESUME / CV */}
                {resumeStage === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-card p-6 sm:p-8 rounded-[32px] border border-border shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Upload className="w-5 h-5 text-primary" /> Stage 1: Upload Your Resume / CV File
                        </h3>
                        <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                          Step 1 of 4
                        </span>
                      </div>

                      {/* Drag & Drop File Upload Box */}
                      <div className="border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 rounded-3xl p-8 text-center transition-all relative group cursor-pointer">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx,.txt,.md"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileUp className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-base font-bold">
                              {uploadedFileName ? (
                                <span className="text-emerald-500 flex items-center gap-2 justify-center">
                                  <Check className="w-5 h-5" /> File Loaded: {uploadedFileName}
                                </span>
                              ) : (
                                "Click to browse or drop your Resume file here"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Supports PDF, DOCX, TXT, or Markdown files. Text extracted automatically.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sample Preset Resumes */}
                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Or pick a sample student resume to test instantly:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button 
                            type="button"
                            onClick={() => { loadSampleResume('swe'); }}
                            className={cn(
                              "p-4 border rounded-2xl text-left transition-all hover:border-primary",
                              uploadedFileName === 'fullstack_engineer_resume.pdf' ? "border-primary bg-primary/5" : "border-border bg-card"
                            )}
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                              <Target className="w-4 h-4" /> Full-Stack Student
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">React, Node.js, TypeScript, Data Structures & Portfolio Apps</p>
                          </button>

                          <button 
                            type="button"
                            onClick={() => { loadSampleResume('data'); }}
                            className={cn(
                              "p-4 border rounded-2xl text-left transition-all hover:border-blue-500",
                              uploadedFileName === 'data_science_resume.pdf' ? "border-blue-500 bg-blue-500/5" : "border-border bg-card"
                            )}
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 mb-1">
                              <Zap className="w-4 h-4" /> Data Science Student
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">Python, PyTorch, Pandas, SQL & ML Classifier Projects</p>
                          </button>

                          <button 
                            type="button"
                            onClick={() => { loadSampleResume('cyber'); }}
                            className={cn(
                              "p-4 border rounded-2xl text-left transition-all hover:border-purple-500",
                              uploadedFileName === 'cybersecurity_analyst_resume.pdf' ? "border-purple-500 bg-purple-500/5" : "border-border bg-card"
                            )}
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-purple-500 mb-1">
                              <Briefcase className="w-4 h-4" /> Cybersecurity Aspirant
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">Linux, Networking, Wireshark, OWASP Top 10 & Lab Audits</p>
                          </button>
                        </div>
                      </div>

                      {/* Textarea Preview & Edit */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> Resume Text Preview ({resumeInputText.length} chars)
                          </label>
                          {resumeInputText && (
                            <button 
                              type="button"
                              onClick={() => { setResumeInputText(''); setUploadedFileName(null); }}
                              className="text-xs font-bold text-red-500 hover:underline"
                            >
                              Clear Text
                            </button>
                          )}
                        </div>
                        <textarea 
                          rows={6}
                          placeholder="Paste or review your resume text here..."
                          value={resumeInputText}
                          onChange={(e) => setResumeInputText(e.target.value)}
                          className="w-full px-5 py-3.5 bg-secondary/50 border border-border rounded-2xl text-xs font-mono leading-relaxed focus:outline-none focus:border-primary transition-colors resize-none custom-scrollbar"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button 
                          type="button"
                          disabled={!resumeInputText.trim()}
                          onClick={() => setResumeStage(2)}
                          className="px-8 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          Continue to Stage 2: Fill Details <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STAGE 2: FILL CANDIDATE DETAILS */}
                {resumeStage === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <form onSubmit={handleAnalyzeResume} className="bg-card p-6 sm:p-8 rounded-[32px] border border-border shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" /> Stage 2: Fill Candidate Profile & Target Career Goal
                        </h3>
                        <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                          Step 2 of 4
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" /> Target Career Goal / Role
                          </label>
                          <input 
                            type="text"
                            placeholder="e.g. Full-Stack Software Engineer, Data Scientist, DevOps Lead"
                            value={targetCareerGoal}
                            onChange={(e) => setTargetCareerGoal(e.target.value)}
                            className="w-full px-5 py-3.5 bg-secondary/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" /> Target Industry & Tier
                          </label>
                          <select
                            value={targetIndustry}
                            onChange={(e) => setTargetIndustry(e.target.value)}
                            className="w-full px-5 py-3.5 bg-secondary/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                          >
                            <option value="Top Tech / MAANG">Top Tech / MAANG Tier</option>
                            <option value="AI & High-Growth Startup">AI & High-Growth Startup</option>
                            <option value="Fintech & Banking">Fintech & Banking</option>
                            <option value="Enterprise Software">Enterprise Software</option>
                            <option value="EdTech & Research">EdTech & Research</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" /> Experience Level
                          </label>
                          <select
                            value={experienceLevel}
                            onChange={(e) => setExperienceLevel(e.target.value)}
                            className="w-full px-5 py-3.5 bg-secondary/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                          >
                            <option value="Entry-Level / Student">Entry-Level / Student (0-1 yrs)</option>
                            <option value="Junior Engineer">Junior Engineer (1-2 yrs)</option>
                            <option value="Mid-Level Engineer">Mid-Level Engineer (3-5 yrs)</option>
                            <option value="Career Switcher">Career Switcher / Self-Taught</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" /> Core Tech Stack to Highlight
                          </label>
                          <input 
                            type="text"
                            placeholder="e.g. React, TypeScript, Node.js, Python, AWS, Docker"
                            value={focusAreas}
                            onChange={(e) => setFocusAreas(e.target.value)}
                            className="w-full px-5 py-3.5 bg-secondary/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                        <button 
                          type="button"
                          onClick={() => setResumeStage(1)}
                          className="px-6 py-3 border border-border rounded-2xl text-sm font-bold hover:bg-secondary transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back to Upload
                        </button>

                        <button 
                          type="submit"
                          disabled={isAnalyzingResume || !targetCareerGoal.trim()}
                          className="px-8 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto justify-center"
                        >
                          {isAnalyzingResume ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Resume & Calculating ATS Score...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> Analyze Resume & Generate Stage 3 Report
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STAGE 3: ATS SCORE & SKILL GAPS REPORT */}
                {resumeStage === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* ATS Score Overview Gauge Card */}
                    <div className="bg-card p-6 sm:p-8 rounded-[32px] border border-primary/30 shadow-xl space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-border">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-primary shrink-0 shadow-inner">
                            <span className="text-3xl font-black">{atsScore}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">ATS Score</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-black">ATS Compatibility Assessment</h3>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                                High Compatibility
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Evaluating parseability and keyword match against top tier specifications for <strong className="text-foreground">{targetCareerGoal}</strong>.
                            </p>
                          </div>
                        </div>

                        <button 
                          type="button"
                          onClick={() => setResumeStage(4)}
                          className="px-6 py-3 bg-primary text-white rounded-2xl text-xs sm:text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                          Stage 4: View Stack Links <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Micro Progress Gauges */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-muted-foreground">Keyword Relevance</span>
                            <span className="text-emerald-500">86%</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '86%' }} />
                          </div>
                        </div>

                        <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-muted-foreground">ATS Format</span>
                            <span className="text-emerald-500">92%</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>

                        <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-muted-foreground">Metric Quantification</span>
                            <span className="text-amber-500">72%</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }} />
                          </div>
                        </div>

                        <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-muted-foreground">Tech Stack Match</span>
                            <span className="text-blue-500">84%</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '84%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed AI Report Markdown */}
                    {resumeAnalysisResult && (
                      <div className="bg-card p-6 sm:p-8 lg:p-10 rounded-[32px] border border-border shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-border">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <h3 className="text-lg font-bold">Detailed Skill Gap & Career Roadmap Report</h3>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                          <Markdown>{resumeAnalysisResult}</Markdown>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border">
                          <button 
                            type="button"
                            onClick={() => setResumeStage(4)}
                            className="px-8 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                          >
                            Go to Stage 4: Suggested Stack Links <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STAGE 4: RECOMMENDED MODULES & DIRECT LEARNING LINKS */}
                {resumeStage === 4 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="bg-card p-6 sm:p-8 rounded-[32px] border border-border shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Stage 4: Recommended EDU Plus Modules</h3>
                            <p className="text-xs text-muted-foreground">
                              Direct interactive links to start learning modules specifically tailored to close your resume's skill gaps.
                            </p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setResumeStage(3)}
                          className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-secondary transition-colors"
                        >
                          ← Back to Report
                        </button>
                      </div>
                    </div>

                    {/* Recommended Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {MODULES.filter(m => {
                        const query = (targetCareerGoal + ' ' + focusAreas + ' ' + targetIndustry).toLowerCase();
                        if (query.includes('data') || query.includes('ai') || query.includes('python')) {
                          return ['pytorch-basics', 'nlp-transformers', 'data-viz-d3', 'llm-prompt-eng', 'vector-databases', 'mlops-production'].includes(m.id);
                        } else if (query.includes('cyber') || query.includes('security') || query.includes('network')) {
                          return ['web-security', 'cybersecurity-blue-team', 'linux-sysadmin', 'nginx-config', 'docker-containers'].includes(m.id);
                        } else if (query.includes('mobile') || query.includes('android') || query.includes('ios')) {
                          return ['react-native-expo', 'flutter-dart', 'mobile-ux-design', 'firebase-mobile', 'mobile-app-testing'].includes(m.id);
                        } else if (query.includes('cloud') || query.includes('devops')) {
                          return ['docker-containers', 'kubernetes-k8s', 'terraform-iac', 'github-actions-cicd', 'postgresql-tuning'].includes(m.id);
                        } else {
                          return ['react-hooks', 'typescript-advanced', 'web-security', 'docker-containers', 'web-performance', 'postgresql-tuning'].includes(m.id);
                        }
                      }).map((module) => (
                        <div 
                          key={module.id} 
                          className="bg-card border border-border hover:border-primary/40 rounded-[28px] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
                          
                          <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                                {module.category}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                                Gaps Targeted
                              </span>
                            </div>

                            <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{module.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{module.description}</p>
                          </div>

                          <div className="pt-6 space-y-2 relative z-10">
                            {/* Link 1: Direct Router Link to open Study Module */}
                            <Link
                              to={`/study-area/${module.id}`}
                              className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-md shadow-primary/20"
                            >
                              <PlayCircle className="w-4 h-4" /> Start Learning Module
                            </Link>

                            <div className="flex items-center gap-2">
                              {/* Link 2: Ask AI Tutor */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('tutor');
                                  handleChatSubmit(undefined, `Please generate a comprehensive step-by-step learning guide and practice roadmap for ${module.title}.`);
                                }}
                                className="flex-1 py-2.5 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-border"
                              >
                                <Bot className="w-3.5 h-3.5 text-primary" /> Ask AI Tutor
                              </button>

                              {/* Link 3: Official External Documentation */}
                              {module.resources?.[0]?.url && (
                                <a
                                  href={module.resources[0].url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2.5 bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors border border-border"
                                  title="Open Official Documentation"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> Docs
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* AI Mock Interview Tab (PAUSED & UNDER CONSTRUCTION) */}
            {activeTab === 'mock-interview' && (
              <motion.div
                key="mock-interview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center min-h-[70vh] p-8"
              >
                <div className="max-w-md w-full bg-card border border-border p-10 rounded-[40px] text-center shadow-2xl space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                    <Mic className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">AI Mock Interview Paused</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our AI Mock Interviewer is currently undergoing major model fine-tuning. 
                      We're upgrading its speech-recognition latency, technical scoring rubrics, and real-time audio scenarios.
                    </p>
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      Back to Overview
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Status: Upgrades In Progress
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'study' && (
              <motion.div
                key="study"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto space-y-8 lg:space-y-10"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/10 text-blue-500 rounded-xl lg:rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 lg:w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Study Area</h2>
                      <p className="text-xs lg:text-sm text-muted-foreground">Explore 200+ specialized technical modules.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(preloadedModules, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'abilities-ai-modules.json';
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-6 py-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all"
                    >
                      <Download className="w-4 h-4" /> Download All Data
                    </button>
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text"
                        placeholder="Search modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-card border border-border rounded-2xl w-full lg:w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-6 py-3 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filteredModules.map(module => (
                    <StudyCard 
                      key={module.id}
                      id={module.id}
                      title={module.title}
                      description={module.description}
                      category={module.category}
                      isCompleted={completedModules.includes(module.id)}
                    />
                  ))}
                </div>

                {filteredModules.length === 0 && (
                  <div className="p-20 text-center bg-secondary/20 rounded-[40px] border-2 border-dashed border-border">
                    <p className="text-muted-foreground font-medium">No modules found matching your search.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'certificates' && (
              <motion.div
                key="certificates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-6 lg:space-y-8"
              >
                <div className="flex items-center gap-4 mb-6 lg:mb-8">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-pink-500/10 text-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center">
                    <Award className="w-5 h-5 lg:w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">My Certificates</h2>
                    <p className="text-xs lg:text-sm text-muted-foreground">Your verified achievements and professional credentials.</p>
                  </div>
                </div>

                {certificates.length === 0 ? (
                  <div className="p-10 lg:p-20 text-center bg-card border border-border rounded-[24px] lg:rounded-[40px] space-y-6">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                      <Award className="w-8 h-8 lg:w-10 lg:h-10 text-muted-foreground" />
                    </div>
                    <div className="max-w-sm mx-auto">
                      <h3 className="text-lg lg:text-xl font-bold mb-2">No Certificates Yet</h3>
                      <p className="text-sm text-muted-foreground">Complete all modules in a study area to earn your first professional certificate.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('study')}
                      className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all"
                    >
                      Start Learning
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 lg:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="bg-card border border-border p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                          <div className="flex items-center justify-between mb-4 lg:mb-6 relative z-10">
                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <Award className="w-6 h-6 lg:w-7 h-7" />
                            </div>
                            <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Verified Achievement</span>
                          </div>
                          <div className="relative z-10">
                            <h3 className="text-xl lg:text-2xl font-black tracking-tight mb-2">{cert.module_name}</h3>
                            <p className="text-xs lg:text-sm text-muted-foreground mb-6 lg:mb-8">Issued on {new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button 
                                onClick={() => setSelectedCertificate(cert)}
                                className="flex-1 py-3 lg:py-4 bg-primary text-white rounded-xl lg:rounded-2xl font-bold text-[10px] lg:text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                              >
                                <ExternalLink className="w-4 h-4" /> View Certificate
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto space-y-8"
              >
                {/* Header & 24h Refresh Status */}
                <div className="bg-gradient-to-br from-card via-card to-primary/5 p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] border border-border shadow-sm space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                        <Briefcase className="w-6 h-6 lg:w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Tech Jobs & Internships</h2>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                            <Zap className="w-3 h-3 animate-pulse text-emerald-500" /> Live 24h Stack
                          </span>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          Latest software engineering internships & full-time developer openings across top global platforms. Refreshes every 24 hours.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-3.5 py-2 bg-secondary/70 border border-border rounded-xl text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Last Refreshed: <strong className="text-foreground">{new Date(jobsLastRefreshed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                      </div>
                      
                      <button
                        onClick={handleRefreshJobs}
                        disabled={isRefreshingJobs}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                      >
                        <RefreshCw className={cn("w-4 h-4", isRefreshingJobs && "animate-spin")} />
                        {isRefreshingJobs ? 'Fetching Daily Jobs...' : 'Refresh 24h Jobs'}
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by job title, company name, tech stack (e.g. React, Python, Cloud), or location..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3.5 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                    />
                    {jobSearchQuery && (
                      <button 
                        onClick={() => setJobSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Role Category Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedJobCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                          selectedJobCategory === cat
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Multi Filters Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Platform Select */}
                      <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-xl text-xs font-medium">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        <select
                          value={selectedJobPlatform}
                          onChange={(e) => setSelectedJobPlatform(e.target.value)}
                          className="bg-transparent outline-none font-bold cursor-pointer"
                        >
                          {PLATFORMS.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      {/* Employment Type */}
                      <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-xl text-xs font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                        <select
                          value={selectedJobType}
                          onChange={(e) => setSelectedJobType(e.target.value)}
                          className="bg-transparent outline-none font-bold cursor-pointer"
                        >
                          {EMPLOYMENT_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* Work Setup */}
                      <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-xl text-xs font-medium">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <select
                          value={selectedJobSetup}
                          onChange={(e) => setSelectedJobSetup(e.target.value)}
                          className="bg-transparent outline-none font-bold cursor-pointer"
                        >
                          {WORK_SETUPS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Experience Level */}
                      <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-xl text-xs font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                        <select
                          value={selectedJobLevel}
                          onChange={(e) => setSelectedJobLevel(e.target.value)}
                          className="bg-transparent outline-none font-bold cursor-pointer"
                        >
                          {EXPERIENCE_LEVELS.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Bookmarked Jobs Toggle */}
                    <button
                      onClick={() => setShowSavedOnly(!showSavedOnly)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all",
                        showSavedOnly
                          ? "bg-amber-500/10 border-amber-500 text-amber-500"
                          : "bg-background border-border hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Bookmarked ({savedJobIds.length})</span>
                    </button>
                  </div>
                </div>

                {/* Jobs Cards Grid */}
                {filteredJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map(job => {
                      const isBookmarked = savedJobIds.includes(job.id);
                      return (
                        <div
                          key={job.id}
                          className={cn(
                            "bg-card border border-border p-6 rounded-[24px] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-5 relative group overflow-hidden",
                            job.featured && "ring-2 ring-primary/30"
                          )}
                        >
                          {job.featured && (
                            <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-purple-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                              Featured Role
                            </div>
                          )}

                          <div className="space-y-4">
                            {/* Top Header: Company Avatar + Name + Platform Badge + Bookmark */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md shrink-0", job.companyLogoBg)}>
                                  {job.companyInitial}
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm text-foreground">{job.company}</h4>
                                  <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block mt-0.5", job.platformBadgeColor)}>
                                    {job.platform}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleSaveJob(job.id)}
                                className={cn(
                                  "p-2 rounded-xl border transition-all shrink-0",
                                  isBookmarked
                                    ? "bg-amber-500/10 border-amber-500 text-amber-500"
                                    : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                                )}
                                title={isBookmarked ? "Remove Bookmark" : "Save Job"}
                              >
                                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                              </button>
                            </div>

                            {/* Job Title & Badges */}
                            <div>
                              <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="px-2.5 py-1 bg-secondary rounded-lg text-xs font-bold text-foreground">
                                  {job.type}
                                </span>
                                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-bold">
                                  {job.workSetup}
                                </span>
                                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-bold">
                                  {job.experienceLevel}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                  • {job.location}
                                </span>
                              </div>
                            </div>

                            {/* Compensation Range */}
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-between">
                              <span>Compensation:</span>
                              <span className="text-sm font-black">{job.salaryRange}</span>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                              {job.description}
                            </p>

                            {/* Tech Stack Tags */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {job.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-secondary/80 border border-border rounded-md text-[10px] font-bold text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-emerald-500" /> {job.postedDate}
                            </span>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {job.recommendedModuleId && (
                                <button
                                  onClick={() => navigate(`/study-area/${job.recommendedModuleId}`)}
                                  className="flex-1 sm:flex-none px-3 py-2 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl text-xs font-bold transition-all"
                                  title="Study required skills for this job"
                                >
                                  Prepare Skills
                                </button>
                              )}
                              <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:scale-105 transition-all shadow-md shadow-primary/20"
                              >
                                Apply Now <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-16 text-center bg-card border border-border rounded-[32px] space-y-4">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-bold">No jobs found matching your filters</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try resetting your search query or filters to discover available tech opportunities, or trigger a 24-hour job stack refresh.
                      </p>
                    </div>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setJobSearchQuery('');
                          setSelectedJobPlatform('All Platforms');
                          setSelectedJobType('All Types');
                          setSelectedJobSetup('All Setups');
                          setSelectedJobLevel('All Levels');
                          setSelectedJobCategory('All Roles');
                          setShowSavedOnly(false);
                        }}
                        className="px-5 py-2.5 bg-secondary text-foreground rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all"
                      >
                        Reset All Filters
                      </button>
                      <button
                        onClick={handleRefreshJobs}
                        disabled={isRefreshingJobs}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
                      >
                        <RefreshCw className={cn("w-3.5 h-3.5", isRefreshingJobs && "animate-spin")} />
                        Refresh 24h Jobs
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-3xl"
            >
              <CertificateComponent 
                userName={user?.fullName || 'Student'} 
                moduleTitle={selectedCertificate.module_name} 
                date={new Date(selectedCertificate.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                onClose={() => setSelectedCertificate(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, collapsed }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all relative group",
        active 
          ? "bg-primary text-white shadow-lg shadow-primary/30" 
          : "hover:bg-secondary text-muted-foreground hover:text-foreground",
        collapsed ? "lg:justify-center" : "justify-start"
      )}
    >
      <span className={cn("w-5 h-5 transition-transform group-hover:scale-110 shrink-0", active && "scale-110")}>{icon}</span>
      <span className={cn(
        "font-bold text-sm whitespace-nowrap transition-all duration-300",
        collapsed ? "lg:hidden opacity-0 lg:w-0" : "opacity-100 w-auto"
      )}>
        {label}
      </span>
      {active && !collapsed && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white hidden lg:block"
        />
      )}
    </button>
  );
}

function StatsCard({ title, value, trend, icon, color }: { title: string; value: string; trend: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={cn("p-2.5 lg:p-3 rounded-xl lg:rounded-2xl bg-secondary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white", color)}>
          {icon}
        </div>
        <span className="text-[10px] lg:text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{trend}</span>
      </div>
      <div className="relative z-10">
        <p className="text-xs lg:text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <span className="text-3xl lg:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50">{value}</span>
      </div>
    </div>
  );
}

function SuggestionButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-3 bg-card border border-border rounded-2xl text-sm font-bold hover:bg-secondary hover:border-primary/30 transition-all text-left w-full"
    >
      {children}
    </button>
  );
}

function StudyCard({ id, title, description, category, isCompleted }: { 
  id: string;
  title: string; 
  description: string; 
  category: string;
  isCompleted: boolean;
}) {
  const isOfflineReady = true; // All modules now use the static generator fallback

  return (
    <div className={cn(
      "p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] bg-card border border-border shadow-sm flex flex-col h-full group hover:border-primary/50 transition-all relative overflow-hidden",
      isCompleted && "border-emerald-500/30 bg-emerald-500/5"
    )}>
      <div className="flex-1 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">{category}</span>
            {isOfflineReady && (
              <span className="text-[8px] lg:text-[10px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-2 h-2 lg:w-2.5 lg:h-2.5" /> Offline Ready
              </span>
            )}
          </div>
          {isCompleted && <span className="text-[8px] lg:text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Completed ✓</span>}
        </div>
        <h3 className="text-lg lg:text-xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-xs lg:text-sm text-muted-foreground mb-6 lg:mb-8 leading-relaxed line-clamp-2">{description}</p>
      </div>
      
      <div className="relative z-10">
        <Link 
          to={`/study-area/${id}`}
          className={cn(
            "w-full py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-xs lg:text-sm",
            isCompleted 
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
              : "bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20"
          )}
        >
          {isCompleted ? "Review Material" : "Start Learning"} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}

function SyllabusModule({ id, title, content, points, isCompleted, onComplete }: { 
  id: string; 
  title: string; 
  content: string; 
  points: string[]; 
  isCompleted: boolean; 
  onComplete: () => void;
}) {
  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-all",
      isCompleted ? "bg-emerald-500/5 border-emerald-500/20" : "bg-secondary/20 border-border"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg">{title}</h4>
        {isCompleted && <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Completed ✓</span>}
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{content}</p>
      <ul className="space-y-2 mb-6">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            {point}
          </li>
        ))}
      </ul>
      <button 
        onClick={onComplete}
        disabled={isCompleted}
        className={cn(
          "px-6 py-2 rounded-xl text-xs font-bold transition-all",
          isCompleted 
            ? "bg-emerald-500/10 text-emerald-500 cursor-default" 
            : "bg-primary text-white hover:scale-105"
        )}
      >
        {isCompleted ? "Read & Completed" : "Mark as Read"}
      </button>
    </div>
  );
}
