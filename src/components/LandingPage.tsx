import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Box, Target, TrendingUp, GraduationCap, Rocket, Brain, Globe, Linkedin } from 'lucide-react';
import { AppSignInButton as SignInButton, AppSignUpButton as SignUpButton, useAppUser as useUser } from '../lib/clerkFallback';
import { LoadingScreen } from './LoadingScreen';

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <div className="min-h-screen bg-background selection:bg-primary/20">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-40 glass h-16 flex items-center px-6 pr-16 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">EduPulse AI</span>
          </div>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium hover:text-primary transition-colors">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">Sign Up</button>
                </SignUpButton>
              </>
            ) : (
              <button 
                onClick={onGetStarted}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 border border-primary/20"
              >
                <Rocket className="w-4 h-4" />
                <span>The Future of Learning is Here</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[0.9]"
              >
                Master Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600 animate-gradient">Hidden Abilities</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
              >
                Don't just study—excel. EduPulse AI maps your path to academic mastery 
                with precision-engineered roadmaps and real-time curriculum intelligence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                {isSignedIn ? (
                  <button
                    onClick={onGetStarted}
                    className="px-10 py-5 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    Enter Dashboard <ArrowRight className="w-6 h-6" />
                  </button>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="px-10 py-5 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                      Start Learning Free <ArrowRight className="w-6 h-6" />
                    </button>
                  </SignUpButton>
                )}
                <a 
                  href="https://www.linkedin.com/company/abilitiesai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-5 bg-secondary text-foreground rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-secondary/80 transition-all border border-border"
                >
                  <Linkedin className="w-6 h-6 text-[#0077b5]" /> Follow for Updates
                </a>
              </motion.div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-20 overflow-hidden bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-6 mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tighter mb-4">Master High-Demand Skills</h2>
            <p className="text-muted-foreground">Our AI-powered modules cover the most critical skills in the modern economy.</p>
          </div>
          
          <div className="flex flex-col gap-8">
            {/* Row 1 */}
            <div className="flex overflow-hidden group">
              <div className="flex animate-marquee pause-on-hover py-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-6 px-3">
                    <ModuleCard title="Full Stack Development" level="Advanced" icon={<Box className="text-blue-500" />} />
                    <ModuleCard title="Artificial Intelligence" level="Expert" icon={<Brain className="text-purple-500" />} />
                    <ModuleCard title="UI/UX Mastery" level="Intermediate" icon={<Target className="text-pink-500" />} />
                    <ModuleCard title="Cloud Architecture" level="Professional" icon={<Globe className="text-emerald-500" />} />
                    <ModuleCard title="Cybersecurity" level="Advanced" icon={<TrendingUp className="text-orange-500" />} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex overflow-hidden group">
              <div className="flex animate-marquee-reverse pause-on-hover py-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-6 px-3">
                    <ModuleCard title="Data Engineering" level="Expert" icon={<TrendingUp className="text-indigo-500" />} />
                    <ModuleCard title="Blockchain Tech" level="Advanced" icon={<Box className="text-amber-500" />} />
                    <ModuleCard title="Digital Marketing" level="Intermediate" icon={<Globe className="text-cyan-500" />} />
                    <ModuleCard title="Product Management" level="Professional" icon={<Target className="text-rose-500" />} />
                    <ModuleCard title="Mobile App Dev" level="Advanced" icon={<Rocket className="text-lime-500" />} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl font-black tracking-tighter mb-6 leading-tight">
                    How EduPulse AI <br />
                    <span className="text-primary">Transforms</span> Your Learning
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We don't just give you a list of videos. We build a personalized 
                    learning engine that adapts to your pace, goals, and the real-world market.
                  </p>
                </motion.div>

                <div className="space-y-6">
                  <StepItem 
                    number="01" 
                    title="Map Your Goal" 
                    description="Tell us what you want to become. Our AI analyzes the current job market to build your perfect roadmap."
                  />
                  <StepItem 
                    number="02" 
                    title="Master the Modules" 
                    description="Learn through high-density, professional curriculum designed by industry experts and AI."
                  />
                  <StepItem 
                    number="03" 
                    title="Get Certified" 
                    description="Pass the final assessment to earn a professional credential that proves your mastery."
                  />
                </div>
              </div>

              <div className="flex-1 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  className="relative z-10 p-2 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-[40px] border border-white/10 backdrop-blur-3xl"
                >
                  <div className="bg-card rounded-[32px] p-8 shadow-2xl border border-border">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold">Learning Progress</h4>
                        <p className="text-xs text-muted-foreground">Real-time skill tracking</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { label: 'System Design', value: 85, color: 'bg-blue-500' },
                        { label: 'AI Integration', value: 62, color: 'bg-purple-500' },
                        { label: 'Cloud Security', value: 45, color: 'bg-orange-500' },
                      ].map((skill) => (
                        <div key={skill.label} className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{skill.label}</span>
                            <span>{skill.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full ${skill.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <p className="text-sm font-medium text-primary mb-2 italic">"Your progress in System Design is exceptional. You're ready for the Professional Certification."</p>
                      <p className="text-xs text-muted-foreground">— EduPulse AI Tutor</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Blobs */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4">Why Choose EduPulse AI</h2>
              <p className="text-muted-foreground">The ultimate toolkit for modern students and educators.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Brain className="w-6 h-6" />}
                title="AI Roadmaps"
                description="Custom paths for any subject, from Computer Science to Data Analytics."
                color="bg-blue-500"
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6" />}
                title="Curriculum Insights"
                description="Real-time data on modern educational trends and core competencies."
                color="bg-purple-500"
              />
              <FeatureCard
                icon={<GraduationCap className="w-6 h-6" />}
                title="Study Partner"
                description="A 24/7 AI tutor that understands your syllabus and goals."
                color="bg-pink-500"
              />
              <FeatureCard
                icon={<Target className="w-6 h-6" />}
                title="Goal Tracking"
                description="Set your career targets and let AI guide you to the finish line."
                color="bg-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-border mt-20 bg-card/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">EduPulse AI</span>
                </div>
                <p className="text-muted-foreground max-w-sm leading-relaxed">
                  The world's premier AI-powered learning and academic mastery platform.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary rounded-lg hover:text-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-6">Platform</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><button onClick={onGetStarted} className="hover:text-primary transition-colors">Dashboard</button></li>
                  <li><button onClick={onGetStarted} className="hover:text-primary transition-colors">Study Area</button></li>
                  <li><button onClick={onGetStarted} className="hover:text-primary transition-colors">Curriculum Insights</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><button className="hover:text-primary transition-colors">Privacy Policy</button></li>
                  <li><button className="hover:text-primary transition-colors">Terms of Service</button></li>
                  <li><button className="hover:text-primary transition-colors">Contact Us</button></li>
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Globe className="w-4 h-4" />
                <span>Global Learning Network</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                © 2026 EduPulse AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function ModuleCard({ title, level, icon }: { title: string; level: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm min-w-[280px] hover:border-primary/50 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{level}</p>
      </div>
    </div>
  );
}

function StepItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex gap-6 group"
    >
      <div className="text-4xl font-black text-primary/20 group-hover:text-primary/40 transition-colors leading-none">
        {number}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-xl">{title}</h4>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-2xl transition-all group"
    >
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
