import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Download, Apple, Smartphone, Facebook, Instagram, Twitter, Linkedin, Send } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" }
  ];

  const availableLanguages = [
    { name: "English", flag: "🇺🇸", code: "en" },
    { name: "Mandarin", flag: "🇨🇳", code: "zh" },
    { name: "Russian", flag: "🇷🇺", code: "ru" },
    { name: "Spanish", flag: "🇪🇸", code: "es" },
    { name: "German", flag: "🇩🇪", code: "de" },
    { name: "French", flag: "🇫🇷", code: "fr" }
  ];

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
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                
                <Link href="/dashboard">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    Log in
                  </Button>
                </Link>
                
                <Link href="/dashboard">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
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
              
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <Link href="/dashboard">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🇪🇸</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Spanish</div>
                      <div className="text-sm text-gray-500">(Mexico)</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🇪🇸</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Spanish</div>
                      <div className="text-sm text-gray-500">(Spain)</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🇫🇷</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">French</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🇩🇪</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">German</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🇮🇹</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Italian</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">More</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Right Side - Content Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-orange-100 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-2xl">🚗</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">A Cultural History<br />Of Coffee</h3>
                  <p className="text-sm text-gray-600">Daily Life</p>
                </div>
                
                <div className="bg-blue-100 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-2xl">☕</div>
                  <div className="text-sm text-gray-600">Conversation</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-cover bg-center rounded-xl h-48 relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Weekend Adventures</h3>
                  </div>
                </div>
                
                <div className="bg-green-400 rounded-xl p-6 relative">
                  <div className="absolute top-4 right-4 text-2xl">🧺</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Share your<br />weekend plans</h3>
                  <p className="text-sm text-gray-700">Daily Life</p>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="bg-yellow-300 rounded-xl p-6 relative">
                  <div className="absolute top-4 right-4 text-2xl">📚</div>
                  <h3 className="text-xl font-bold text-gray-800">Newcomer</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Effective Learning Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            The effective way to learn a language<br />online
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop" 
                  alt="People learning in a cafe" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-6 left-6 bg-yellow-400 text-black px-4 py-2 rounded-lg">
                  <div className="font-semibold">Talk about</div>
                  <div className="font-semibold">your favorite</div>
                  <div className="font-semibold">food</div>
                  <div className="text-sm mt-1">Daily Life</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Content */}
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Learn to speak a new<br />
                language with<br />
                confidence
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                With Learn a Language, you'll learn practical and useful skills that you can apply right away — so you can reach your goal of having real-life conversations faster.
              </p>
              
              <Link href="/dashboard">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full">
                  Start learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Download App</h2>
          
          <div className="flex justify-center items-center space-x-6">
            <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors cursor-pointer">
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </div>
            
            <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors cursor-pointer">
              <Play className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Languages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">All Available Languages</h2>
          <p className="text-center text-gray-600 mb-12">Choose from our complete selection</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {availableLanguages.map((language) => (
              <Link key={language.code} href="/dashboard">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                  <CardContent className="p-0">
                    <div className="text-5xl mb-4">{language.flag}</div>
                    <h3 className="font-medium text-gray-800 text-lg">{language.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">#LearnLanguagesTogether</h3>
            
            <div className="flex justify-center space-x-6 mb-8">
              <Facebook className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
              <Twitter className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
              <Linkedin className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
              <Send className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Language Learning Resources</h4>
              <p className="text-gray-700 text-sm">Comprehensive learning materials for all levels</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Grammar Guide</h4>
              <p className="text-gray-700 text-sm">Complete grammar reference for every language</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Open Education</h4>
              <p className="text-gray-700 text-sm">Free educational resources for everyone</p>
            </div>
          </div>
          
          <div className="border-t border-yellow-500 mt-8 pt-8 text-center">
            <Button className="bg-gray-800 hover:bg-gray-900 text-white mb-4">
              Feedback
            </Button>
            <p className="text-xs text-gray-600">
              © 2025 Learn a Language. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}