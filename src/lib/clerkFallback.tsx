import React, { createContext, useContext, useState, Component } from 'react';
import * as RealClerk from '@clerk/clerk-react';

interface MockAuthContextType {
  isSignedIn: boolean;
  user: {
    id: string;
    fullName: string;
    firstName: string;
    primaryEmailAddress: { emailAddress: string };
  } | null;
  signIn: () => void;
  signOut: () => void;
}

const MockAuthContext = createContext<MockAuthContextType>({
  isSignedIn: true,
  user: {
    id: 'user_demo123',
    fullName: 'Demo Student',
    firstName: 'Demo',
    primaryEmailAddress: { emailAddress: 'student@abilities.ai' },
  },
  signIn: () => {},
  signOut: () => {},
});

export function MockClerkProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(true);

  const user = isSignedIn
    ? {
        id: 'user_demo123',
        fullName: 'Demo Student',
        firstName: 'Demo',
        primaryEmailAddress: { emailAddress: 'student@abilities.ai' },
      }
    : null;

  return (
    <MockAuthContext.Provider
      value={{
        isSignedIn,
        user,
        signIn: () => setIsSignedIn(true),
        signOut: () => setIsSignedIn(false),
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

const DEFAULT_CLERK_KEY = 'pk_test_cG9ldGljLWdudS00NS5jbGVyay5hY2NvdW50cy5kZXYk';

function getClerkKey() {
  const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (envKey && (envKey.startsWith('pk_test_') || envKey.startsWith('pk_live_'))) {
    return envKey;
  }
  return DEFAULT_CLERK_KEY;
}

class ClerkErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("ClerkProvider initialization error, switching to Demo Auth:", error);
  }

  render() {
    if (this.state.hasError) {
      return <MockClerkProvider>{this.props.children}</MockClerkProvider>;
    }
    return this.props.children;
  }
}

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  const key = getClerkKey();
  if (key) {
    return (
      <ClerkErrorBoundary>
        <RealClerk.ClerkProvider publishableKey={key}>
          {children}
        </RealClerk.ClerkProvider>
      </ClerkErrorBoundary>
    );
  }
  return <MockClerkProvider>{children}</MockClerkProvider>;
}

export function useAppUser() {
  const context = useContext(MockAuthContext);
  try {
    const clerkUser = RealClerk.useUser();
    if (clerkUser && clerkUser.isLoaded) {
      return clerkUser;
    }
  } catch {
    // Expected when running under MockClerkProvider or fallback
  }
  return {
    isLoaded: true,
    isSignedIn: context.isSignedIn,
    user: context.user,
  };
}

export function AppSignedIn({ children }: { children: React.ReactNode }) {
  const context = useContext(MockAuthContext);
  try {
    return (
      <>
        <RealClerk.SignedIn>{children}</RealClerk.SignedIn>
        {!RealClerk.useUser()?.isLoaded && context.isSignedIn ? children : null}
      </>
    );
  } catch {
    return context.isSignedIn ? <>{children}</> : null;
  }
}

export function AppSignedOut({ children }: { children: React.ReactNode }) {
  const context = useContext(MockAuthContext);
  try {
    return (
      <>
        <RealClerk.SignedOut>{children}</RealClerk.SignedOut>
        {!RealClerk.useUser()?.isLoaded && !context.isSignedIn ? children : null}
      </>
    );
  } catch {
    return !context.isSignedIn ? <>{children}</> : null;
  }
}

export function AppSignInButton({ children, mode }: { children: React.ReactNode; mode?: string }) {
  const context = useContext(MockAuthContext);
  try {
    return <RealClerk.SignInButton mode={mode as any}>{children}</RealClerk.SignInButton>;
  } catch {
    return <span onClick={() => context.signIn()} className="cursor-pointer">{children}</span>;
  }
}

export function AppSignUpButton({ children, mode }: { children: React.ReactNode; mode?: string }) {
  const context = useContext(MockAuthContext);
  try {
    return <RealClerk.SignUpButton mode={mode as any}>{children}</RealClerk.SignUpButton>;
  } catch {
    return <span onClick={() => context.signIn()} className="cursor-pointer">{children}</span>;
  }
}

export function AppUserButton({ afterSignOutUrl }: { afterSignOutUrl?: string }) {
  const context = useContext(MockAuthContext);
  try {
    return <RealClerk.UserButton afterSignOutUrl={afterSignOutUrl} />;
  } catch {
    return (
      <button
        onClick={() => (context.isSignedIn ? context.signOut() : context.signIn())}
        className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center hover:opacity-90 transition-opacity shadow"
        title={context.isSignedIn ? "Click to sign out (Demo Mode)" : "Click to sign in"}
      >
        {context.isSignedIn ? "DS" : "?"}
      </button>
    );
  }
}

