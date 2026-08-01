import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { ModulePage } from './components/ModulePage';
import { AppClerkProvider, AppSignedIn, AppSignedOut } from './lib/clerkFallback';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <AppClerkProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="relative min-h-screen">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>

            <Routes>
              <Route path="/" element={
                <>
                  <AppSignedOut>
                    <LandingPage onGetStarted={() => setShowDashboard(true)} />
                  </AppSignedOut>
                  <AppSignedIn>
                    {showDashboard ? <Navigate to="/dashboard" /> : <LandingPage onGetStarted={() => setShowDashboard(true)} />}
                  </AppSignedIn>
                </>
              } />
              
              <Route path="/dashboard" element={
                <AppSignedIn>
                  <Dashboard />
                </AppSignedIn>
              } />

              <Route path="/study-area/:moduleId" element={
                <AppSignedIn>
                  <ModulePage />
                </AppSignedIn>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AppClerkProvider>
  );
}
