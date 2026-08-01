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
  Download
} from 'lucide-react';
import { AppUserButton as UserButton, useAppUser as useUser } from '../lib/clerkFallback';
import { generateSkillRoadmap, getRecommendedSkills } from '../services/aiService';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'tutor' | 'mock-interview' | 'curriculum' | 'study' | 'certificates'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedSkills, setRecommendedSkills] = useState<string | null>(null);
  const [isSkillsLoading, setIsSkillsLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  // Progress State
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [completedRoadmaps, setCompletedRoadmaps] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);

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

  useEffect(() => {
    const fetchSkills = async () => {
      setIsSkillsLoading(true);
      try {
        const skills = await getRecommendedSkills();
        if (skills) {
          setRecommendedSkills(skills);
        }
      } catch (error: any) {
        console.error("Failed to fetch skills", error);
        setRecommendedSkills("### 🚀 Trending Skills for 2026\n\nWe're currently experiencing high demand for our AI insights. Please check back in a few minutes for the latest trending skills in Web Development, AI, and Cloud Computing!");
      } finally {
        setIsSkillsLoading(false);
      }
    };
    fetchSkills();
  }, []);

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
              {(isSidebarOpen || isMobileMenuOpen) && <span>EduPulse AI</span>}
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
            icon={<GraduationCap />} 
            label="Curriculum Insights" 
            active={activeTab === 'curriculum'} 
            onClick={() => { setActiveTab('curriculum'); setIsMobileMenuOpen(false); }}
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

                {/* Featured Curriculum Card */}
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/20 transition-colors" />
                  <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary text-white rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-primary/20">
                      <GraduationCap className="w-8 h-8 lg:w-10 lg:h-10" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-xl lg:text-2xl font-black tracking-tight mb-2">Featured Academic Disciplines</h3>
                      <p className="text-sm lg:text-base text-muted-foreground mb-4">Core subject streams aligned with modern 2026 educational standards.</p>
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {['Agentic AI', 'System Architecture', 'Quantum Logic', 'Data Science', 'Cyber Ethics', 'Green Coding'].map(skill => (
                          <span key={skill} className="px-3 py-1 lg:px-4 lg:py-1.5 bg-background border border-border rounded-full text-[10px] lg:text-xs font-bold hover:border-primary transition-colors cursor-default">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('curriculum')}
                      className="w-full lg:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                    >
                      Curriculum Insights
                    </button>
                  </div>
                </div>

                {/* Recommended Skills Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl lg:text-2xl font-bold tracking-tight">2026 Core Academic Curriculum & Trends</h3>
                    <button onClick={() => setActiveTab('curriculum')} className="text-xs lg:text-sm font-bold text-primary hover:underline">View All Trends</button>
                  </div>
                  
                  {isSkillsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-secondary/50 animate-pulse rounded-3xl border border-border" />
                      ))}
                    </div>
                  ) : recommendedSkills ? (
                    <div className="bg-card p-6 lg:p-8 rounded-3xl border border-border shadow-sm markdown-body overflow-x-auto">
                      <Markdown>{recommendedSkills}</Markdown>
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                      <p className="text-muted-foreground">No trending data available right now.</p>
                    </div>
                  )}
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

            {activeTab === 'curriculum' && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                 <div className="bg-card p-10 rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold tracking-tight">2026 Academic & Curriculum Insights</h2>
                        <p className="text-muted-foreground">Live recommendations and curriculum benchmarks for modern students.</p>
                      </div>
                    </div>
                    
                    {isSkillsLoading ? (
                      <div className="space-y-4">
                        <div className="h-8 w-1/2 bg-secondary animate-pulse rounded-lg" />
                        <div className="h-32 w-full bg-secondary animate-pulse rounded-xl" />
                        <div className="h-32 w-full bg-secondary animate-pulse rounded-xl" />
                      </div>
                    ) : recommendedSkills ? (
                      <div className="markdown-body">
                        <Markdown>{recommendedSkills}</Markdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Fetching latest curriculum insights...</p>
                      </div>
                    )}
                  </div>
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
