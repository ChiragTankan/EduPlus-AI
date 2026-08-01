import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  Loader2, 
  Award,
  ChevronRight,
  PlayCircle,
  Code,
  Share2,
  Sparkles as SparklesIcon,
  Rocket,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAppUser as useUser } from '../lib/clerkFallback';
import Markdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';
import { MODULES } from '../constants/modules';
import { Certificate } from './Certificate';
import { storageService } from '../services/storageService';
import { generateModuleContent } from '../services/aiService';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ModulePageContent {
  pages: {
    title: string;
    content: string;
  }[];
  quiz: QuizQuestion[];
}

export function ModulePage() {
  const { moduleId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [moduleContent, setModuleContent] = useState<ModulePageContent | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [installProgress, setInstallProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>(new Array(10).fill(-1));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const moduleInfo = MODULES.find(m => m.id === moduleId) || MODULES[0];

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setInstallProgress(0);
      
      const interval = setInterval(() => {
        setInstallProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      try {
        const data = await generateModuleContent(moduleInfo.title);
        setModuleContent(data);
        setQuizAnswers(new Array(data.quiz.length).fill(-1));
        setInstallProgress(100);
      } catch (error: any) {
        console.error("Failed to fetch module content", error);
        setError("Failed to install module. Please try again.");
      } finally {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    const fetchProgress = async () => {
      if (!user) return;
      try {
        const data = await storageService.getProgress(user.id);
        setCompletedModules(data);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };

    fetchContent();
    fetchProgress();
  }, [moduleId, user]);

  const handleQuizSubmit = () => {
    if (!moduleContent) return;
    
    let score = 0;
    quizAnswers.forEach((answer, index) => {
      if (answer === moduleContent.quiz[index].correctAnswer) {
        score++;
      }
    });

    const percentage = (score / moduleContent.quiz.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
    setShowQuizFeedback(true);

    if (percentage >= 75) {
      handleCompleteModule();
    }
  };

  const handleCompleteModule = async () => {
    if (!user || isMarking || !moduleId) return;
    setIsMarking(true);
    
    try {
      await storageService.saveProgress(user.id, moduleId);
      setCompletedModules(prev => [...prev, moduleId]);
      await handleIssueCertificate();
    } catch (error) {
      console.error("Failed to save progress", error);
    } finally {
      setIsMarking(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!user) return;
    
    try {
      const result = await storageService.issueCertificate(user.id, moduleInfo.title);

      if (result.success) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899']
        });
        setShowCertificateModal(true);
      } else {
        setError("Failed to issue certificate.");
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error("Certificate error", error);
    }
  };

  const renderQuiz = () => {
    if (!moduleContent) return null;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 lg:p-10 bg-primary/5 border border-primary/20 rounded-[32px] text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black tracking-tight">Final Assessment</h3>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            Test your knowledge of {moduleInfo.title}. You need at least 75% (8/10) to earn your professional certificate.
          </p>
        </div>

        <div className="space-y-6">
          {moduleContent.quiz.map((q, qIndex) => (
            <div key={qIndex} className="p-6 lg:p-8 bg-card border border-border rounded-[24px] lg:rounded-[32px] shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">{qIndex + 1}</span>
                <p className="text-base lg:text-lg font-bold leading-tight pt-1">{q.question}</p>
              </div>
              <div className="grid gap-3 pl-12">
                {q.options.map((option, oIndex) => {
                  const isSelected = quizAnswers[qIndex] === oIndex;
                  const isCorrect = q.correctAnswer === oIndex;
                  const showResult = quizSubmitted;

                  return (
                    <button
                      key={oIndex}
                      onClick={() => {
                        if (quizSubmitted) return;
                        const newAnswers = [...quizAnswers];
                        newAnswers[qIndex] = oIndex;
                        setQuizAnswers(newAnswers);
                      }}
                      disabled={quizSubmitted}
                      className={cn(
                        "p-4 rounded-xl lg:rounded-2xl text-left text-sm font-medium transition-all border-2",
                        isSelected && !showResult && "border-primary bg-primary/5",
                        !isSelected && !showResult && "border-transparent bg-secondary/50 hover:bg-secondary hover:border-border",
                        showResult && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-700",
                        showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                        showResult && !isSelected && !isCorrect && "border-transparent bg-secondary/30 opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-destructive" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pl-12 pt-2"
                >
                  <p className="text-xs font-medium text-muted-foreground bg-secondary/30 p-3 rounded-xl border border-border/50 italic">
                    <span className="font-bold text-primary not-italic">Explanation:</span> {q.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {!quizSubmitted ? (
          <button
            onClick={handleQuizSubmit}
            disabled={quizAnswers.includes(-1)}
            className="w-full py-6 bg-primary text-white rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Submit Assessment
          </button>
        ) : (
          <div className={cn(
            "p-8 lg:p-12 rounded-[40px] text-center space-y-6 border-4",
            quizScore >= 8 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"
          )}>
            <div className={cn(
              "w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto",
              quizScore >= 8 ? "bg-emerald-500/20" : "bg-destructive/20"
            )}>
              {quizScore >= 8 ? <Award className="w-10 h-10 lg:w-12 lg:h-12 text-emerald-500" /> : <X className="w-10 h-10 lg:w-12 lg:h-12 text-destructive" />}
            </div>
            <div>
              <h3 className={cn(
                "text-3xl lg:text-4xl font-black tracking-tighter",
                quizScore >= 8 ? "text-emerald-600" : "text-destructive"
              )}>
                {quizScore >= 8 ? "Assessment Passed!" : "Assessment Failed"}
              </h3>
              <p className="text-lg lg:text-xl font-bold mt-2">Your Score: {quizScore}/10 ({quizScore * 10}%)</p>
            </div>
            
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              {quizScore >= 8 
                ? "Excellent work! You've demonstrated professional mastery of this topic. Your certificate is now available."
                : "Don't worry! Engineering is about persistence. Review the module content and try the assessment again to earn your certificate."}
            </p>

            {quizScore < 8 && (
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers(new Array(10).fill(-1));
                  setCurrentPage(0);
                  scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                Review & Retake
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "min-h-screen bg-background pb-20 selection:bg-primary/20 transition-all duration-500",
      isFullScreen && "fixed inset-0 z-[100] pb-0 overflow-y-auto"
    )}>
      {/* Header */}
      <header className={cn(
        "h-16 lg:h-20 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between transition-all",
        isFullScreen && "lg:h-16"
      )}>
        <div className="flex items-center gap-3 lg:gap-4">
          {!isFullScreen && (
            <Link to="/dashboard" className="p-2 hover:bg-secondary rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="text-sm lg:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 truncate max-w-[120px] sm:max-w-none">{moduleInfo.title}</h1>
            <p className="text-[8px] lg:text-xs text-muted-foreground font-medium truncate">Professional Learning Path</p>
          </div>
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 hover:bg-secondary rounded-xl transition-colors flex items-center gap-2 text-xs font-bold text-primary"
          >
            {isFullScreen ? (
              <>
                <X className="w-4 h-4" /> Exit Full Screen
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" /> Full Screen
              </>
            )}
          </button>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-primary">Progress</span>
            <div className="w-24 lg:w-32 h-1 lg:h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentPage + 1) / (moduleContent?.pages.length || 1)) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500" 
              />
            </div>
          </div>
          <div className="h-6 lg:h-8 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 lg:w-4 h-4 text-primary" />
            </div>
            <span className="text-xs lg:text-sm font-bold whitespace-nowrap">
              {currentPage < (moduleContent?.pages.length || 0) 
                ? `Page ${currentPage + 1} of ${moduleContent?.pages.length || 10}`
                : "Final Assessment"}
            </span>
          </div>
        </div>
      </header>

      <main className={cn(
        "container mx-auto px-4 lg:px-6 pt-6 lg:pt-10 transition-all duration-500",
        isFullScreen ? "max-w-7xl pb-20" : "max-w-5xl"
      )}>
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold flex items-center gap-3"
            >
              <X className="w-5 h-5" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 lg:py-40 space-y-8 lg:space-y-10">
            <div className="relative w-24 h-24 lg:w-32 lg:h-32">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Rocket className="w-8 h-8 lg:w-10 lg:h-10 text-primary animate-bounce" />
              </div>
            </div>
            <div className="text-center space-y-4 max-w-sm px-4">
              <h2 className="text-2xl lg:text-3xl font-black tracking-tighter">Preparing Curriculum...</h2>
              <p className="text-sm lg:text-base text-muted-foreground font-medium">Loading high-depth technical content and assessment for {moduleInfo.title}.</p>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${installProgress}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{Math.round(installProgress)}% Complete</p>
            </div>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6 lg:gap-10",
            isFullScreen ? "lg:grid-cols-1" : "lg:grid-cols-[1fr_300px]"
          )}>
            {/* Content */}
            <div className="space-y-6 lg:space-y-10">
              <section className="bg-card border border-border rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] lg:text-[10px] font-bold uppercase tracking-widest">{moduleInfo.category}</span>
                    <span className="text-[10px] lg:text-xs text-muted-foreground font-medium">
                      {currentPage < (moduleContent?.pages.length || 0) ? `Page ${currentPage + 1}` : "Assessment"}
                    </span>
                  </div>
                  <h2 className={cn(
                    "font-black tracking-tighter mb-4 lg:mb-6 gradient-text animate-gradient",
                    isFullScreen ? "text-3xl lg:text-6xl" : "text-2xl lg:text-4xl"
                  )}>
                    {currentPage < (moduleContent?.pages.length || 0) 
                      ? moduleContent?.pages[currentPage].title 
                      : "Final Knowledge Check"}
                  </h2>
                </div>
              </section>

              <div 
                ref={scrollRef}
                className={cn(
                  "bg-card border border-border rounded-[24px] lg:rounded-[32px] p-6 lg:p-10 shadow-sm markdown-body prose prose-slate dark:prose-invert max-w-none min-h-[500px] lg:min-h-[600px] overflow-visible",
                  isFullScreen && "prose-lg lg:prose-xl"
                )}
              >
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentPage >= (moduleContent?.pages.length || 0) ? (
                    renderQuiz()
                  ) : (
                    <Markdown>{moduleContent?.pages[currentPage]?.content || ""}</Markdown>
                  )}
                </motion.div>
                
                {currentPage === (moduleContent?.pages.length || 0) - 1 && quizSubmitted && quizScore >= 8 && (
                  <div className="mt-10 lg:mt-20 p-6 lg:p-10 border-2 border-dashed border-emerald-500/30 rounded-[32px] bg-emerald-500/5 text-center space-y-6">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-500" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h3 className="text-xl lg:text-2xl font-black tracking-tight text-emerald-600">Module Complete!</h3>
                      <p className="text-sm lg:text-base text-muted-foreground font-medium">You've passed the assessment. Click below to claim your professional certificate.</p>
                    </div>
                    <button 
                      onClick={handleCompleteModule}
                      disabled={isMarking}
                      className={cn(
                        "w-full sm:w-auto px-12 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl",
                        completedModules.includes(moduleId!)
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : "bg-primary text-white shadow-primary/20 hover:scale-105"
                      )}
                    >
                      {isMarking ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </>
                      ) : completedModules.includes(moduleId!) ? (
                        <>
                          <Award className="w-5 h-5" /> View Certificate
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5" /> Claim Your Certificate
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-card border border-border p-4 lg:p-6 rounded-[24px] lg:rounded-[28px] shadow-sm gap-4">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(0, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 0}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl lg:rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-all disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" /> Previous
                </button>
                
                <div className="flex items-center gap-1.5 lg:gap-2">
                  {moduleContent?.pages.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full transition-all",
                        i === currentPage ? "w-4 lg:w-6 bg-primary" : "bg-secondary"
                      )} 
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (currentPage < (moduleContent?.pages.length || 0)) {
                      setCurrentPage(prev => prev + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={currentPage >= (moduleContent?.pages.length || 0)}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl lg:rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {currentPage === (moduleContent?.pages.length || 0) - 1 ? "Start Quiz" : "Next Page"} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sidebar */}
            {!isFullScreen && (
              <aside className="space-y-6 lg:space-y-8 pb-10 lg:pb-0">
                <div className="bg-card border border-border rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 shadow-sm lg:sticky lg:top-28 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <h3 className="text-lg lg:text-xl font-bold mb-6 lg:mb-8 flex items-center gap-3 relative z-10">
                    <Code className="w-5 h-5 lg:w-6 h-6 text-primary" /> Resources
                  </h3>
                  <div className="space-y-3 lg:space-y-4 relative z-10">
                    {moduleInfo.resources.map((res, i) => (
                      <a 
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 lg:p-5 bg-secondary/50 rounded-xl lg:rounded-2xl hover:bg-primary hover:text-white transition-all group"
                      >
                        <span className="text-xs lg:text-sm font-bold">{res.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 lg:w-4 h-4 opacity-50 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>

                  <div className="mt-8 lg:mt-10 p-5 lg:p-6 bg-primary/5 rounded-[20px] lg:rounded-[24px] border border-primary/10 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <SparklesIcon className="w-3.5 h-3.5 lg:w-4 h-4 text-primary" />
                      <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-primary">Status</p>
                    </div>
                    <p className="text-[10px] lg:text-xs text-muted-foreground leading-relaxed font-medium">
                      {completedModules.includes(moduleId!) 
                        ? "You have successfully completed this module and earned your certificate." 
                        : "Complete all pages and pass the final assessment with 75% or higher to earn your certificate."}
                    </p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}
      </main>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-3xl"
            >
              <Certificate 
                userName={user?.fullName || 'Student'} 
                moduleTitle={moduleInfo.title} 
                date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                onClose={() => setShowCertificateModal(false)}
              />
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/30"
                >
                  Back to Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
