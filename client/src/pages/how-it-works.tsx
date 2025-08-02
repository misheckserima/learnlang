import { AuthHeader } from "@/components/auth-header";
import { Brain, Headphones, Users, Trophy, Play, Check } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <AuthHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start your language learning journey in just 3 simple steps and discover our proven methodology.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Language</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Select from 6 popular languages: English, Spanish, French, German, Russian, or Mandarin. 
                Each course is designed by language experts and native speakers.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personalized Learning</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Take our placement test and get a customized learning path. Practice vocabulary, 
                grammar, pronunciation, and conversation skills at your own pace.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Achieve Fluency</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Track your progress, earn achievements, and connect with native speakers. 
                Build confidence through real-world practice and cultural immersion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to master a new language effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white dark:bg-slate-900 shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Smart algorithms adapt to your learning style and pace</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white dark:bg-slate-900 shadow-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Speech Recognition</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Perfect your pronunciation with AI feedback</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white dark:bg-slate-900 shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Community</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Practice with learners worldwide</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white dark:bg-slate-900 shadow-lg">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Gamified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Earn points and achievements as you learn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Process Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Learning Methodology
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Based on proven language acquisition principles and modern technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Spaced Repetition</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our algorithm presents vocabulary and concepts at optimal intervals for long-term retention.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Immersive Practice</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Practice real conversations with AI tutors and native speakers in contextualized scenarios.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cultural Context</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Learn not just the language, but the culture and customs that give words their true meaning.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed analytics help you understand your strengths and areas for improvement.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop" 
                  alt="Learning process" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Interactive Learning</h3>
                  <p className="text-lg opacity-90">Engage with real-world scenarios</p>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}