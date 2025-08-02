import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Download, Apple, Smartphone, Facebook, Instagram, Twitter, Linkedin, Send, Check } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AuthHeader } from "@/components/auth-header";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Español", flag: "🇪🇸" }
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
      <AuthHeader />
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
                
                <Link href="/not-found">
                  <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-transparent">
                    Log in
                  </Button>
                </Link>
                
                <Link href="/not-found">
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
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Animated Background - positioned in empty white spaces only */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          {/* Rotating Language Rings - positioned in right side empty space */}
          <div className="absolute top-32 right-16 w-36 h-36 border-3 border-blue-400 rounded-full animate-spin-slow">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-sm font-bold text-blue-600">EN</div>
            <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-sm font-bold text-blue-600">ES</div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-sm font-bold text-blue-600">FR</div>
            <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 text-sm font-bold text-blue-600">DE</div>
          </div>
          
          <div className="absolute bottom-24 right-32 w-28 h-28 border-3 border-green-400 rounded-full animate-spin-reverse">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-green-600">中文</div>
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-sm font-bold text-green-600">RU</div>
          </div>

          {/* Floating Text Animations - using empty margins/padding areas */}
          <div className="absolute top-4 left-0 animate-slide-right">
            <div className="flex items-center space-x-3 text-lg font-semibold">
              <span className="text-blue-600">Hello</span>
              <span className="text-gray-500">→</span>
              <span className="text-green-600">Hola</span>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-0 animate-slide-left">
            <div className="flex items-center space-x-3 text-lg font-semibold">
              <span className="text-purple-600">Bonjour</span>
              <span className="text-gray-500">←</span>
              <span className="text-orange-600">Guten Tag</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-0 animate-slide-right-delayed">
            <div className="flex items-center space-x-3 text-lg font-semibold">
              <span className="text-red-600">你好</span>
              <span className="text-gray-500">→</span>
              <span className="text-blue-600">Привет</span>
            </div>
          </div>

          {/* Flag to Dictionary Transformations - positioned in right margin area */}
          <div className="absolute top-72 right-4">
            <div className="animate-pulse-slow">
              <div className="text-2xl mb-1 animate-flag-transform">🇪🇸</div>
              <div className="text-xs bg-white p-1.5 rounded shadow-md border">
                <div className="font-bold text-gray-800">casa</div>
                <div className="text-gray-600">house</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-48 right-6">
            <div className="animate-pulse-slow-delayed">
              <div className="text-2xl mb-1 animate-flag-transform">🇫🇷</div>
              <div className="text-xs bg-white p-1.5 rounded shadow-md border">
                <div className="font-bold text-gray-800">amour</div>
                <div className="text-gray-600">love</div>
              </div>
            </div>
          </div>

          {/* Floating Language Particles - in empty corner spaces */}
          <div className="absolute top-8 right-8 animate-float">
            <span className="text-xl">🌍</span>
          </div>
          <div className="absolute bottom-8 right-4 animate-float-delayed">
            <span className="text-xl">📚</span>
          </div>
          <div className="absolute top-2 right-1/2 animate-float-slow">
            <span className="text-xl">💬</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  <Link key={lang.code} href="/not-found">
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

      {/* Effective Learning Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Animations in empty white space */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          {/* Top right empty area */}
          <div className="absolute top-8 right-8 animate-float-slow">
            <span className="text-xl">🎯</span>
          </div>
          
          {/* Bottom left empty area */}
          <div className="absolute bottom-16 left-8 w-24 h-24 border-2 border-purple-400 rounded-full animate-spin-slow">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600">IT</div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600">PT</div>
          </div>
          
          {/* Right side margin */}
          <div className="absolute top-1/3 right-4">
            <div className="animate-pulse-slow">
              <div className="text-2xl mb-1 animate-flag-transform">🇮🇹</div>
              <div className="text-xs bg-white p-1.5 rounded shadow-md border">
                <div className="font-bold text-gray-800">ciao</div>
                <div className="text-gray-600">hello</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

      {/* What Makes Us Different Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Animations in white space margins */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          {/* Left margin area */}
          <div className="absolute top-1/4 left-4 animate-float-delayed">
            <span className="text-xl">📖</span>
          </div>
          
          {/* Right margin area */}
          <div className="absolute bottom-1/3 right-6 animate-float">
            <span className="text-xl">🗣️</span>
          </div>
          
          {/* Top margin sliding text */}
          <div className="absolute top-4 left-0 animate-slide-right">
            <div className="flex items-center space-x-3 text-lg font-semibold">
              <span className="text-green-600">Gracias</span>
              <span className="text-gray-500">→</span>
              <span className="text-blue-600">Thank you</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            What makes Learn a Language different?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real People */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                    alt="Real person" 
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✨</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real people</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Learn authentic language for real-world situations.
              </p>
            </div>
            
            {/* Supportive Community */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-12 bg-orange-400 rounded-full"></div>
                    <div className="w-8 h-12 bg-orange-600 rounded-full"></div>
                  </div>
                  <div className="absolute mt-8 ml-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">💬</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Supportive Community</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Learn together and get feedback from other fluent speakers.
              </p>
            </div>
            
            {/* Express Yourself */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-8 bg-blue-500 rounded transform rotate-12"></div>
                    <div className="w-12 h-8 bg-orange-500 rounded transform -rotate-12 -mt-4 ml-4"></div>
                    <div className="w-12 h-8 bg-green-500 rounded transform rotate-6 -mt-4 ml-2"></div>
                    <div className="w-12 h-8 bg-purple-500 rounded transform -rotate-6 -mt-4 ml-6"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Express yourself</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Learn grammar, cultural skills in expertly designed lessons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Integration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Learn real-world language skills
            </h2>
            <p className="text-xl text-gray-600">
              See and hear real people speaking the language you're learning to build your confidence.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {/* English Speaker */}
              <div className="flex-shrink-0 relative">
                <div className="w-64 h-80 bg-cover bg-center rounded-2xl relative overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🇺🇸</span>
                        <div>
                          <div className="font-bold text-gray-900">ENGLISH</div>
                          <div className="text-sm text-gray-600">2M learners</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* German Speaker */}
              <div className="flex-shrink-0 relative">
                <div className="w-64 h-80 bg-cover bg-center rounded-2xl relative overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🇩🇪</span>
                        <div>
                          <div className="font-bold text-gray-900">GERMAN</div>
                          <div className="text-sm text-gray-600">4M learners</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Spanish Speaker */}
              <div className="flex-shrink-0 relative">
                <div className="w-64 h-80 bg-cover bg-center rounded-2xl relative overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🇪🇸</span>
                        <div>
                          <div className="font-bold text-gray-900">SPANISH</div>
                          <div className="text-sm text-gray-600">5M learners</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* French Speaker */}
              <div className="flex-shrink-0 relative">
                <div className="w-64 h-80 bg-cover bg-center rounded-2xl relative overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🇫🇷</span>
                        <div>
                          <div className="font-bold text-gray-900">FRENCH</div>
                          <div className="text-sm text-gray-600">2M learners</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Russian Speaker */}
              <div className="flex-shrink-0 relative">
                <div className="w-64 h-80 bg-cover bg-center rounded-2xl relative overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🇷🇺</span>
                        <div>
                          <div className="font-bold text-gray-900">RUSSIAN</div>
                          <div className="text-sm text-gray-600">1M learners</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mandarin Speaker */}
              <div className="flex-shrink-0 relative">
                <div className="w-64 h-80 bg-cover bg-center rounded-2xl relative overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop&crop=face')"}}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg p-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🇨🇳</span>
                        <div>
                          <div className="font-bold text-gray-900">MANDARIN</div>
                          <div className="text-sm text-gray-600">3M learners</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
              <span className="text-gray-600">‹</span>
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
              <span className="text-gray-600">›</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Learning Experience Section */}
      <section className="py-20 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
        {/* Animations in gradient background empty areas */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Upper right corner */}
          <div className="absolute top-12 right-12 w-20 h-20 border-2 border-orange-400 rounded-full animate-spin-reverse">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-orange-600">KO</div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-orange-600">HI</div>
          </div>
          
          {/* Bottom left area */}
          <div className="absolute bottom-12 left-12 animate-pulse-slow-delayed">
            <div className="text-2xl mb-1 animate-flag-transform">🇰🇷</div>
            <div className="text-xs bg-white p-1.5 rounded shadow-md border">
              <div className="font-bold text-gray-800">안녕</div>
              <div className="text-gray-600">hello</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Interactive Demo */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
                <div className="relative h-80 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop')"}}>
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  </div>
                  
                  {/* Interactive Elements */}
                  <div className="relative z-10 space-y-4">
                    <div className="bg-white bg-opacity-90 rounded-lg p-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🎯</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Practice Speaking</div>
                          <div className="text-xs text-gray-600">Interactive lessons</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white bg-opacity-90 rounded-lg p-3 max-w-xs ml-auto">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Grammar Mastery</div>
                          <div className="text-xs text-gray-600">Step by step</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white bg-opacity-90 rounded-lg p-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">💬</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Real Conversations</div>
                          <div className="text-xs text-gray-600">With native speakers</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white bg-opacity-90 rounded-lg p-3 max-w-xs ml-auto">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🏆</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Cultural Context</div>
                          <div className="text-xs text-gray-600">Learn traditions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play Button */}
                  <div className="absolute bottom-4 right-4 z-20">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all">
                      <Play className="w-5 h-5 text-gray-800 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Features */}
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Interactive learning<br />
                experience designed<br />
                for success
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pronunciation Practice</h4>
                    <p className="text-gray-600">AI-powered speech recognition helps perfect your accent</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Grammar Exercises</h4>
                    <p className="text-gray-600">Interactive quizzes that adapt to your learning pace</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cultural Stories</h4>
                    <p className="text-gray-600">Learn language through engaging cultural narratives</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community Learning</h4>
                    <p className="text-gray-600">Connect with other learners and native speakers</p>
                  </div>
                </div>
              </div>
              
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full">
                  Try Interactive Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available Languages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose from 12+ languages
            </h2>
            <p className="text-lg text-gray-600">
              Start your journey with any of our supported languages
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availableLanguages.map((language) => (
              <Link key={language.code} href="/dashboard">
                <div className="text-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="text-3xl mb-2">{language.flagEmoji}</div>
                  <div className="font-medium text-gray-900 text-sm">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.nativeName}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Animations in empty margins */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          {/* Right side empty space */}
          <div className="absolute top-16 right-8 animate-float">
            <span className="text-xl">⭐</span>
          </div>
          
          {/* Left side margin */}
          <div className="absolute bottom-20 left-6 animate-float-delayed">
            <span className="text-xl">💡</span>
          </div>
          
          {/* Bottom margin text animation */}
          <div className="absolute bottom-4 left-0 animate-slide-right-delayed">
            <div className="flex items-center space-x-3 text-lg font-semibold">
              <span className="text-purple-600">Danke</span>
              <span className="text-gray-500">→</span>
              <span className="text-green-600">Thanks</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join millions of learners
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say about their learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" 
                  alt="User testimonial" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Maria Rodriguez</div>
                  <div className="text-sm text-gray-500">Learning French</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The pronunciation practice feature helped me gain confidence in speaking French. 
                I can now have conversations with native speakers!"
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                  alt="User testimonial" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">James Chen</div>
                  <div className="text-sm text-gray-500">Learning Spanish</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The cultural stories made learning Spanish so much more engaging. 
                I understand not just the language, but the culture behind it."
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" 
                  alt="User testimonial" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Anna Schmidt</div>
                  <div className="text-sm text-gray-500">Learning Mandarin</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The community features are amazing! I practice with native speakers 
                and other learners. It feels like having language partners worldwide."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay updated with language learning tips
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Get weekly tips, cultural insights, and exclusive content delivered to your inbox
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center justify-center">
              <Send className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <Logo size="lg" className="brightness-0 invert" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Learn a Language is the world's leading language learning platform, 
                helping millions of people master new languages through innovative technology 
                and engaging content.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/lessons" className="text-gray-400 hover:text-white transition-colors">Lessons</Link></li>
                <li><Link href="/stories" className="text-gray-400 hover:text-white transition-colors">Stories</Link></li>
                <li><Link href="/community" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Learn a Language. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}