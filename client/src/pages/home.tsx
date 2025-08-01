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
    { name: "Spanish", flag: "🇪🇸", code: "es" },
    { name: "French", flag: "🇫🇷", code: "fr" },
    { name: "German", flag: "🇩🇪", code: "de" },
    { name: "Italian", flag: "🇮🇹", code: "it" },
    { name: "Portuguese", flag: "🇵🇹", code: "pt" },
    { name: "Russian", flag: "🇷🇺", code: "ru" },
    { name: "Chinese", flag: "🇨🇳", code: "zh" },
    { name: "Japanese", flag: "🇯🇵", code: "ja" },
    { name: "Korean", flag: "🇰🇷", code: "ko" },
    { name: "Arabic", flag: "🇸🇦", code: "ar" },
    { name: "Hindi", flag: "🇮🇳", code: "hi" },
    { name: "English", flag: "🇺🇸", code: "en" }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <Logo size="sm" className="brightness-0 invert" />
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                <Link href="/lessons" className="hover:text-blue-200 transition-colors">About</Link>
                <Link href="/community" className="hover:text-blue-200 transition-colors">Community</Link>
                <Link href="/stories" className="hover:text-blue-200 transition-colors">Contact</Link>
              </nav>
            </div>
            
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-100 via-blue-100 via-yellow-100 to-pink-100 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-8">
            Master Any Language
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-left">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Join Community</h3>
                <p className="text-gray-600 text-sm mb-4">Connect with millions of learners worldwide</p>
                <Link href="/community">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Join Community
                  </Button>
                </Link>
              </div>
              
              <div className="text-left">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile App</h3>
                <p className="text-gray-600 text-sm mb-4">Learn on the go with our mobile app</p>
                <p className="text-gray-500 text-xs italic">Coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 bg-white">
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

      {/* Languages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Choose Your Language</h2>
          <p className="text-center text-gray-600 mb-12">Available Languages</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableLanguages.map((language) => (
              <Link key={language.code} href="/dashboard">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                  <CardContent className="p-0">
                    <div className="text-4xl mb-3">{language.flag}</div>
                    <h3 className="font-medium text-gray-800">{language.name}</h3>
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