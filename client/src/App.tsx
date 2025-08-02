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
import Profile from "@/pages/profile";
import ProfileSetup from "@/pages/profile-setup";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

// Profile setup redirect component
function ProfileSetupRedirect({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => apiRequest("/api/auth/me"),
    retry: false,
  });

  const user = userResponse?.user;

  useEffect(() => {
    if (!isLoading && user && !user.profileCompleted) {
      // Only redirect to profile setup if user is authenticated but profile is not completed
      // and they're not already on the profile-setup page
      if (window.location.pathname !== "/profile-setup") {
        setLocation("/profile-setup");
      }
    }
  }, [user, isLoading, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
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
