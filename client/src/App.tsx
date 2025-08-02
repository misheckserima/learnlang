import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Home from "@/pages/home";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import ProfileSetup from "@/pages/profile-setup";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

// Profile setup redirect component
function ProfileSetupRedirect({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  
  const { data: userResponse, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => apiRequest("/api/auth/me"),
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const user = userResponse?.user;

  useEffect(() => {
    // Skip redirect logic for auth pages and API routes
    if (location.startsWith('/login') || location.startsWith('/signup') || location.startsWith('/api')) {
      return;
    }

    if (!isLoading && !error && user) {
      if (!user.profileCompleted && location !== "/profile-setup") {
        setLocation("/profile-setup");
      } else if (user.profileCompleted && (location === "/" || location === "/home")) {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, error, location, setLocation]);

  // Don't show loading for unauthenticated users on public pages
  if (isLoading && !error) {
    const publicPages = ['/', '/about', '/how-it-works', '/contact', '/login', '/signup'];
    if (publicPages.includes(location)) {
      return <>{children}</>;
    }
    
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

function Router() {
  return (
    <ProfileSetupRedirect>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/profile-setup" component={ProfileSetup} />
        <Route path="/not-found" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </ProfileSetupRedirect>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
