import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Clock, 
  Trophy, 
  Brain, 
  Book, 
  Mic, 
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";
import type { UserLanguage, Language, User } from "@shared/schema";

interface UserStats {
  totalTimeMinutes: number;
  totalLessons: number;
  totalWords: number;
  currentStreak: number;
}

interface DashboardData {
  user: User;
  currentLanguage: UserLanguage & { language: Language };
  userLanguages: (UserLanguage & { language: Language })[];
  stats: UserStats;
  recentLessons: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    type: string;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    iconName: string;
    earnedAt: Date;
  }>;
}

export default function ProgressDashboard() {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  
  // Mock current user ID - in real app would come from auth context
  const currentUserId = "mock-user-id";

  // Mock dashboard data for demonstration
  const mockDashboardData: DashboardData = {
    user: {
      id: currentUserId,
      username: "sarah_learner",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
      currentStreak: 7,
      totalPoints: 2450,
      dailyGoalMinutes: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    currentLanguage: {
      id: "ul1",
      userId: currentUserId,
      languageId: "spanish",
      level: "B1",
      progressPercentage: 68,
      totalLessonsCompleted: 24,
      totalWordsLearned: 347,
      totalTimeSpentMinutes: 45 * 60, // 45 hours
      isCurrent: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      language: {
        id: "spanish",
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        flagEmoji: "🇪🇸",
        isActive: true,
        createdAt: new Date(),
      }
    },
    userLanguages: [
      {
        id: "ul1",
        userId: currentUserId,
        languageId: "spanish",
        level: "B1",
        progressPercentage: 68,
        totalLessonsCompleted: 24,
        totalWordsLearned: 347,
        totalTimeSpentMinutes: 2700,
        isCurrent: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        language: {
          id: "spanish",
          code: "es", 
          name: "Spanish",
          nativeName: "Español",
          flagEmoji: "🇪🇸",
          isActive: true,
          createdAt: new Date(),
        }
      },
      {
        id: "ul2",
        userId: currentUserId,
        languageId: "french",
        level: "A2",
        progressPercentage: 25,
        totalLessonsCompleted: 8,
        totalWordsLearned: 120,
        totalTimeSpentMinutes: 900,
        isCurrent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        language: {
          id: "french",
          code: "fr",
          name: "French", 
          nativeName: "Français",
          flagEmoji: "🇫🇷",
          isActive: true,
          createdAt: new Date(),
        }
      }
    ],
    stats: {
      totalTimeMinutes: 2700, // 45 hours
      totalLessons: 24,
      totalWords: 347,
      currentStreak: 7,
    },
    recentLessons: [
      {
        id: "1",
        title: "Restaurant Conversations",
        description: "Learn dining vocabulary and phrases",
        progress: 75,
        type: "vocabulary"
      },
      {
        id: "2",
        title: "Pronunciation Practice",
        description: "Master difficult sounds and accents", 
        progress: 0,
        type: "pronunciation"
      }
    ],
    achievements: [
      {
        id: "1",
        name: "Week Warrior",
        description: "7 day learning streak",
        iconName: "medal",
        earnedAt: new Date()
      },
      {
        id: "2",
        name: "Vocabulary Master",
        description: "100 new words learned",
        iconName: "star",
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: "3",
        name: "Perfect Pronunciation", 
        description: "95% accuracy in speaking",
        iconName: "volume-up",
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]
  };

  // Fetch user dashboard data
  const { data: dashboardData = mockDashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/users", currentUserId, "dashboard"],
    enabled: false, // Disabled for demo
  });

  const dailyGoalProgress = Math.min((15 / (dashboardData.user.dailyGoalMinutes || 30)) * 100, 100); // 15 minutes completed today

  const handleLanguageSwitch = async (languageId: string) => {
    try {
      // In real app, would call API to switch current language
      console.log("Switching to language:", languageId);
      setSelectedLanguageId(languageId);
    } catch (error) {
      console.error("Failed to switch language:", error);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getIconForAchievement = (iconName: string) => {
    switch (iconName) {
      case "medal": return <Trophy className="w-5 h-5 text-amber-500" />;
      case "star": return <Brain className="w-5 h-5 text-emerald-500" />;
      case "volume-up": return <Mic className="w-5 h-5 text-blue-500" />;
      default: return <Trophy className="w-5 h-5 text-slate-500" />;
    }
  };

  const getIconForLessonType = (type: string) => {
    switch (type) {
      case "vocabulary": return <Book className="w-6 h-6 text-emerald-500" />;
      case "pronunciation": return <Mic className="w-6 h-6 text-blue-500" />;
      case "grammar": return <Brain className="w-6 h-6 text-purple-500" />;
      default: return <Book className="w-6 h-6 text-slate-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Your Learning Dashboard</h1>
          <p className="text-lg text-slate-600">Track your progress and stay motivated with personalized insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Language Progress */}
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{dashboardData.currentLanguage.language.flagEmoji}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {dashboardData.currentLanguage.language.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {dashboardData.currentLanguage.level} Level
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {dashboardData.currentLanguage.progressPercentage}%
                    </div>
                    <div className="text-sm text-slate-600">Complete</div>
                  </div>
                </div>
                
                <div className="w-full bg-white rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${dashboardData.currentLanguage.progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Current Focus:</span>
                  <span className="font-medium text-slate-800">Intermediate Conversations</span>
                </div>
              </CardContent>
            </Card>

            {/* Learning Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{dashboardData.stats.currentStreak}</div>
                  <div className="text-xs text-slate-600">Day Streak</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {Math.floor(dashboardData.stats.totalTimeMinutes / 60)}
                  </div>
                  <div className="text-xs text-slate-600">Hours Learned</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{dashboardData.achievements.length}</div>
                  <div className="text-xs text-slate-600">Achievements</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{dashboardData.stats.totalWords}</div>
                  <div className="text-xs text-slate-600">Words Learned</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentLessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center space-x-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                        {getIconForLessonType(lesson.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{lesson.title}</h4>
                        <p className="text-sm text-slate-600">{lesson.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-600">
                          {lesson.progress > 0 ? `${lesson.progress}% Complete` : "New"}
                        </div>
                        <div className="w-16 bg-slate-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-emerald-500 h-1 rounded-full transition-all"
                            style={{ width: `${lesson.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Goal */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Daily Goal</span>
                </h3>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">75%</span>
                    </div>
                    <Progress value={dailyGoalProgress} className="w-24 h-24 rotate-90" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">15 minutes completed</p>
                  <p className="text-xs text-slate-500">5 minutes remaining</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        {getIconForAchievement(achievement.iconName)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">{achievement.name}</h4>
                        <p className="text-xs text-slate-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Your Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.userLanguages.map((userLanguage) => (
                    <div
                      key={userLanguage.id}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        userLanguage.isCurrent ? "bg-emerald-50 border border-emerald-200" : "hover:bg-slate-50"
                      }`}
                      onClick={() => handleLanguageSwitch(userLanguage.languageId)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{userLanguage.language.flagEmoji}</span>
                        <div>
                          <span className="text-sm font-medium text-slate-700">
                            {userLanguage.language.name}
                          </span>
                          <div className="text-xs text-slate-500">{userLanguage.level} • {userLanguage.progressPercentage}%</div>
                        </div>
                      </div>
                      {userLanguage.isCurrent && (
                        <Badge className="bg-emerald-500 text-white">Current</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
