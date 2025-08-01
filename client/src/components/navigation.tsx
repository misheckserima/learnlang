import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock user data - in real app this would come from auth context
  const user = {
    name: "Sarah",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
    currentStreak: 7
  };

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/lessons", label: "Lessons" },
    { href: "/community", label: "Community" },
    { href: "/stories", label: "Stories" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Logo size="sm" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? "default" : "ghost"}
                  className={`${
                    isActive(link.href) 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Profile & Streak */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 flex items-center space-x-1">
                <Flame className="w-3 h-3" />
                <span>{user.currentStreak}</span>
              </Badge>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive(link.href) ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive(link.href) 
                        ? "bg-emerald-500 text-white" 
                        : "text-slate-600"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              
              {/* Mobile user info */}
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">{user.name}</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>{user.currentStreak}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
