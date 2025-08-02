import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Volume2, 
  Gamepad2, 
  Users, 
  Trophy, 
  Target, 
  Globe,
  Headphones,
  MessageCircle,
  Book,
  PuzzleIcon,
  Award,
  TrendingUp,
  Clock,
  Flame,
  Star,
  Play,
  Mic,
  Languages,
  MapPin,
  Zap,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";

const FEATURE_CATEGORIES = [
  {
    id: "pronunciation",
    title: "Pronunciation & Listening Tools",
    icon: Volume2,
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200",
    features: [
      { name: "AI Speech Recognition", desc: "Get instant pronunciation feedback and accuracy scoring" },
      { name: "Native Speaker Audio", desc: "Listen to native speakers with slow-play options" },
      { name: "Voice Comparison", desc: "Real-time voice analysis and accent improvement tools" }
    ]
  },
  {
    id: "exercises",
    title: "Interactive Exercises",
    icon: PuzzleIcon,
    color: "bg-green-50 dark:bg-green-900/20 border-green-200",
    features: [
      { name: "Vocabulary Drills", desc: "Visual flashcards and memory-building exercises" },
      { name: "Grammar Quizzes", desc: "Sentence-building challenges and grammar practice" },
      { name: "Listening Comprehension", desc: "Fill-in-the-gap and audio comprehension activities" },
      { name: "AI Tutor Support", desc: "Instant grammar corrections and explanations" }
    ]
  },
  {
    id: "gamification",
    title: "Gamified Learning",
    icon: Gamepad2,
    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200",
    features: [
      { name: "Language Games", desc: "Memory match, word puzzles, and spelling challenges" },
      { name: "Daily Challenges", desc: "Build streaks and maintain learning momentum" },
      { name: "Leaderboards", desc: "Compete with friends and community members" },
      { name: "Rewards System", desc: "Earn badges and track your achievements" }
    ]
  },
  {
    id: "cultural",
    title: "Cultural Immersion & Stories",
    icon: Globe,
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200",
    features: [
      { name: "Interactive Stories", desc: "Real-life dialogues adapted to your skill level" },
      { name: "Regional Expressions", desc: "Learn idioms and local expressions" },
      { name: "News & Literature", desc: "Practice with articles, fables, and novels" },
      { name: "Cultural Capsules", desc: "Explore customs, cuisine, and traditions" }
    ]
  },
  {
    id: "dictionary",
    title: "Dictionary & Grammar Hub",
    icon: Book,
    color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200",
    features: [
      { name: "Multilingual Dictionary", desc: "Pronunciation, synonyms, and usage examples" },
      { name: "Grammar Explanations", desc: "Interactive examples and explanations" },
      { name: "Verb Conjugation", desc: "Complete conjugation tables and tense trainer" },
      { name: "Visual Mind Maps", desc: "Sentence structure and syntax visualization" }
    ]
  },
  {
    id: "community",
    title: "Community & Collaboration",
    icon: Users,
    color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200",
    features: [
      { name: "Language Exchange", desc: "Peer-to-peer practice rooms" },
      { name: "AI Chatbot", desc: "24/7 conversation practice with AI assistant" },
      { name: "Speaking Rooms", desc: "Weekly group sessions with native speakers" },
      { name: "Community Forums", desc: "Grammar help, motivation, and discussions" }
    ]
  }
];

const QUICK_ACTIONS = [
  { name: "Start Lesson", icon: Play, action: "lesson", color: "bg-blue-500" },
  { name: "Practice Speaking", icon: Mic, action: "speaking", color: "bg-green-500" },
  { name: "Play Games", icon: Gamepad2, action: "games", color: "bg-purple-500" },
  { name: "Join Community", icon: Users, action: "community", color: "bg-pink-500" }
];

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  // Fetch user data
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => apiRequest("/api/auth/me"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch languages
  const { data: languages } = useQuery({
    queryKey: ["/api/languages"],
    queryFn: () => apiRequest("/api/languages"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch study sessions
  const { data: studySessions } = useQuery({
    queryKey: ["/api/study-sessions"],
    queryFn: () => apiRequest("/api/study-sessions?limit=5"),
    enabled: !!userResponse?.user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const user = userResponse?.user;

  const handleQuickAction = (action: string) => {
    // Implement navigation or action based on the selected action
    console.log(`Starting ${action}`);
  };

  const calculateWeeklyProgress = () => {
    if (!studySessions || studySessions.length === 0) return 0;
    const totalMinutes = studySessions.reduce((acc: number, session: any) => acc + session.durationMinutes, 0);
    const dailyGoal = user?.dailyGoalMinutes || 20;
    return Math.min(100, (totalMinutes / (dailyGoal * 7)) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Language Learning Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome back, {user?.firstName}! Ready to continue your language learning journey?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</p>
                  <p className="text-2xl font-bold text-blue-600">{user?.cefr_level || "A1"}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold text-green-600">{user?.currentStreak || 0} days</p>
                </div>
                <Flame className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points</p>
                  <p className="text-2xl font-bold text-purple-600">{user?.totalPoints || 0}</p>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Goal</p>
                  <p className="text-2xl font-bold text-orange-600">{Math.round(calculateWeeklyProgress())}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Start
            </CardTitle>
            <CardDescription>Jump into your favorite learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  variant="outline"
                  className="h-20 flex-col gap-2 hover:shadow-md transition-all"
                >
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
            <CardDescription>Your learning activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Daily Goal: {user?.dailyGoalMinutes || 20} minutes</span>
                <span className="text-sm text-gray-500">{Math.round(calculateWeeklyProgress())}% complete</span>
              </div>
              <Progress value={calculateWeeklyProgress()} className="h-3" />
              {studySessions && studySessions.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Recent sessions: {studySessions.length} completed
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Key Features
            </CardTitle>
            <CardDescription>Explore all the powerful tools available for your language learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pronunciation" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {FEATURE_CATEGORIES.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-1 text-xs"
                  >
                    <category.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.title.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {FEATURE_CATEGORIES.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Card className={category.color}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <category.icon className="w-6 h-6" />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.features.map((feature, index) => (
                          <div key={index} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <h4 className="font-semibold mb-2">{feature.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                            <Button size="sm" variant="outline" className="mt-3">
                              Try Now
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Language Selection */}
        {languages && languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Available Languages
              </CardTitle>
              <CardDescription>Choose a language to start learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {languages.map((language: any) => (
                  <Button
                    key={language.id}
                    variant={selectedLanguage === language.id ? "default" : "outline"}
                    onClick={() => setSelectedLanguage(language.id)}
                    className="h-20 flex-col gap-2"
                  >
                    <span className="text-2xl">{language.flag_emoji}</span>
                    <div className="text-center">
                      <div className="font-medium">{language.name}</div>
                      <div className="text-xs text-gray-500">{language.native_name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalized Learning Features */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Your Personalized Learning Experience
            </CardTitle>
            <CardDescription>
              AI-powered features tailored to your learning style and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI-Powered Adaptive Learning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Our AI adjusts difficulty and pacing based on your performance and learning style
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Smart Goals & Reminders</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Customizable study goals with intelligent notifications to keep you motivated
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">CEFR Progress Tracking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Track your progress with standardized CEFR levels from A1 to C2
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}