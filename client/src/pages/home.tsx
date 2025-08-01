import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const headerLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ru", name: "Русский", flag: "🇷🇺" }
  ];

  // Fetch languages from database
  const { data: availableLanguages = [] } = useQuery<{
    id: string;
    code: string;
    name: string;
    nativeName: string;
    flagEmoji: string;
    isActive: boolean;
    createdAt: string;
  }[]>({
    queryKey: ['/api/languages'],
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Logo size="lg" className="brightness-0 invert" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-6">
                <Link href="/lessons" className="hover:text-blue-200 transition-colors">About</Link>
                <Link href="/community" className="hover:text-blue-200 transition-colors">Community</Link>
                <Link href="/stories" className="hover:text-blue-200 transition-colors">Contact</Link>
              </nav>
              
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-blue-700 text-white border-blue-500 rounded px-2 py-1 text-sm"
                >
                  {headerLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-transparent">
                    Log in
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-transparent font-semibold">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Language Selection Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Language Selection */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Which <span className="text-orange-500">language</span><br />
                do you want to<br />
                learn?
              </h1>
              
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {availableLanguages.map((lang) => (
                  <Link key={lang.code} href="/dashboard">
                    <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer">
                      <div className="text-2xl">
                        {lang.flagEmoji}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{lang.name}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right Side - Content Grid - Reduced size */}
            <div className="grid grid-cols-2 gap-2 max-w-md">
              <div className="space-y-2">
                <div className="bg-orange-100 rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-lg">🚗</div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Cultural History<br />Of Coffee</h3>
                  <p className="text-xs text-gray-600">Daily Life</p>
                </div>
                
                <div className="bg-blue-100 rounded-lg p-2 relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-lg">☕</div>
                  <div className="text-xs text-gray-600">Conversation</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-cover bg-center rounded-lg h-24 relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="text-xs font-semibold">Weekend Adventures</h3>
                  </div>
                </div>
                
                <div className="bg-green-400 rounded-lg p-3 relative">
                  <div className="absolute top-2 right-2 text-lg">🧺</div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Share your<br />weekend plans</h3>
                  <p className="text-xs text-gray-700">Daily Life</p>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="bg-yellow-300 rounded-lg p-3 relative">
                  <div className="absolute top-2 right-2 text-lg">📚</div>
                  <h3 className="text-sm font-bold text-gray-800">Newcomer</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Start learning a new language today
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Join millions of learners worldwide and discover the joy of speaking a new language.
          </p>
          
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Logo size="lg" className="brightness-0 invert mx-auto mb-4" />
          </div>
          <p className="text-gray-400 text-sm">
            Start your language learning journey today with Learn a Language
          </p>
        </div>
      </footer>
    </div>
  );
}