import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { Globe, Play, Users, Trophy, Book, MessageSquare } from "lucide-react";

export default function Home() {
  const [stats] = useState({
    totalUsers: "2.5M+",
    languages: "25+",
    completionRate: "94%"
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
                Master Any Language with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                  {" "}AI-Powered Learning
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Join millions of learners worldwide in an immersive, gamified language learning experience. 
                From pronunciation feedback to cultural immersion, we make language learning engaging and effective.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning Today
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                View Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">{stats.totalUsers}</div>
                <div className="text-sm text-slate-600">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">{stats.languages}</div>
                <div className="text-sm text-slate-600">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">{stats.completionRate}</div>
                <div className="text-sm text-slate-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose LinguaLearn?</h2>
            <p className="text-lg text-slate-600">Everything you need to master a new language</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Interactive Lessons</h3>
                <p className="text-slate-600">Engage with dynamic exercises, flashcards, and quizzes designed to accelerate your learning.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Pronunciation</h3>
                <p className="text-slate-600">Get real-time feedback on your pronunciation with our advanced speech recognition technology.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Gamified Learning</h3>
                <p className="text-slate-600">Stay motivated with streaks, achievements, and friendly competition with learners worldwide.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Cultural Immersion</h3>
                <p className="text-slate-600">Learn through authentic stories, dialogues, and cultural content from native speakers.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Global Community</h3>
                <p className="text-slate-600">Connect with language partners and practice with native speakers in our vibrant community.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Personalized Learning</h3>
                <p className="text-slate-600">AI-powered adaptive learning that adjusts to your pace and learning style.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Language Journey?</h2>
          <p className="text-xl text-slate-300 mb-8">Join millions of learners and start speaking a new language today</p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">LinguaLearn</span>
              </div>
              <p className="text-slate-400 text-sm">
                Master any language with AI-powered learning, cultural immersion, and global community support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Learning</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/lessons" className="hover:text-white transition-colors">Language Courses</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pronunciation Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grammar Hub</a></li>
                <li><Link href="/stories" className="hover:text-white transition-colors">Cultural Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/community" className="hover:text-white transition-colors">Language Exchange</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Study Groups</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discussion Forums</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Native Speakers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">© 2024 LinguaLearn. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
