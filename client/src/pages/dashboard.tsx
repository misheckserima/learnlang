import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Play, 
  Target, 
  Sparkles,
  Globe,
  TrendingUp,
  Flame,
  Star,
  Clock,
  ChevronRight,
  Zap,
  Users,
  Mic,
  Award,
  Languages
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";

interface LearningPath {
  id: string;
  languageId: string;
  currentLevel: string;
  targetLevel: string;
  completedStages: number;
  totalStages: number;
  progressPercentage: number;
}

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
}

interface LearningStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  difficulty: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  vocabularyData?: any[];
  grammarTopics?: any[];
  culturalNotes?: string[];
}

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  // Fetch user data
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch languages
  const { data: languages } = useQuery({
    queryKey: ["/api/languages"],
    staleTime: 10 * 60 * 1000,
  });

  // Fetch learning path for selected language
  const { data: learningPath, isLoading: pathLoading } = useQuery({
    queryKey: ["/api/learning-paths", selectedLanguage?.id],
    enabled: !!selectedLanguage?.id,
  });

  // Fetch learning stages
  const { data: stages, isLoading: stagesLoading } = useQuery({
    queryKey: ["/api/learning-paths", learningPath?.id, "stages"],
    enabled: !!learningPath?.id,
  });

  // Fetch study sessions
  const { data: studySessions } = useQuery({
    queryKey: ["/api/study-sessions"],
    enabled: !!userResponse?.user,
    staleTime: 2 * 60 * 1000,
  });

  const user = userResponse?.user;

  // Create learning path mutation
  const createPathMutation = useMutation({
    mutationFn: (data: { languageId: string }) => 
      apiRequest("/api/learning-paths", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      toast({
        title: "Learning Path Created!",
        description: "Your personalized language learning journey has been set up.",
      });
    },
  });

  // Generate pathway content mutation
  const generatePathwayMutation = useMutation({
    mutationFn: (data: { languageId: string }) => 
      apiRequest(`/api/learning-paths/${learningPath?.id}/generate`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      toast({
        title: "AI Content Generated!",
        description: "Your learning stages are now ready with personalized content.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate learning content",
        variant: "destructive",
      });
    },
  });

  // Set default language
  useEffect(() => {
    if (languages && languages.length > 0 && !selectedLanguage) {
      setSelectedLanguage(languages[0]);
    }
  }, [languages, selectedLanguage]);

  const calculateWeeklyProgress = () => {
    if (!studySessions || studySessions.length === 0) return 0;
    const totalMinutes = studySessions.reduce((acc: number, session: any) => acc + session.durationMinutes, 0);
    const dailyGoal = user?.dailyGoalMinutes || 20;
    return Math.min(100, (totalMinutes / (dailyGoal * 7)) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleStartLearning = () => {
    if (!selectedLanguage) return;
    
    if (!learningPath) {
      createPathMutation.mutate({ languageId: selectedLanguage.id });
    } else if (!stages || stages.length === 0) {
      generatePathwayMutation.mutate({ languageId: selectedLanguage.id });
    } else {
      // Navigate to learning pathway
      window.location.href = "/learning-pathway";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learn a Language
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome back, {user?.firstName}! Ready to continue your personalized learning journey?
          </p>
        </div>

        {/* Language Selection */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Languages className="w-6 h-6" />
              Choose Your Learning Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {languages?.map((language: Language) => (
                <Button
                  key={language.id}
                  variant={selectedLanguage?.id === language.id ? "default" : "outline"}
                  onClick={() => setSelectedLanguage(language)}
                  className="h-20 flex-col gap-2 transition-all hover:scale-105"
                >
                  <span className="text-3xl">{language.flagEmoji}</span>
                  <div className="text-center">
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{language.nativeName}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Learning Path Section */}
        {selectedLanguage && (
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Your {selectedLanguage.name} Learning Journey
              </CardTitle>
              <CardDescription className="text-lg">
                AI-powered personalized learning path designed just for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Learning Path Progress */}
              {learningPath && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Level: {learningPath.currentLevel} → {learningPath.targetLevel}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {learningPath.completedStages || 0}/{learningPath.totalStages || 0} stages completed
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {Math.round(learningPath.progressPercentage || 0)}%
                    </span>
                  </div>
                  <Progress value={learningPath.progressPercentage || 0} className="h-4" />
                </div>
              )}

              {/* Learning Content Preview */}
              {stages && stages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stages.slice(0, 3).map((stage: LearningStage, index: number) => (
                    <Card 
                      key={stage.id}
                      className={`transition-all hover:shadow-md ${
                        stage.isCompleted ? "border-green-200 bg-green-50 dark:bg-green-900/20" : 
                        stage.isUnlocked ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20" : 
                        "border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-60"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            stage.isCompleted ? "bg-green-500 text-white" :
                            stage.isUnlocked ? "bg-blue-500 text-white" :
                            "bg-gray-400 text-white"
                          }`}>
                            {stage.stageNumber}
                          </div>
                          <Badge className={getDifficultyColor(stage.difficulty)} variant="secondary">
                            {stage.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{stage.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{stage.description}</p>
                        <div className="flex items-center justify-between mt-3 text-xs">
                          <span>{stage.vocabularyData?.length || 0} words</span>
                          <span>{stage.grammarTopics?.length || 0} topics</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Main Action Button */}
              <div className="text-center">
                <Button 
                  onClick={handleStartLearning}
                  disabled={createPathMutation.isPending || generatePathwayMutation.isPending || pathLoading || stagesLoading}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  {createPathMutation.isPending || generatePathwayMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Setting Up Your Journey...
                    </>
                  ) : !learningPath ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Learning {selectedLanguage.name}
                    </>
                  ) : !stages || stages.length === 0 ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Learning Path
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5 mr-2" />
                      Continue Learning
                    </>
                  )}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</p>
                  <p className="text-xl font-bold text-blue-600">{user?.cefr_level || "A1"}</p>
                </div>
                <Target className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Streak</p>
                  <p className="text-xl font-bold text-green-600">{user?.currentStreak || 0} days</p>
                </div>
                <Flame className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Points</p>
                  <p className="text-xl font-bold text-purple-600">{user?.totalPoints || 0}</p>
                </div>
                <Star className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Goal</p>
                  <p className="text-xl font-bold text-orange-600">{Math.round(calculateWeeklyProgress())}%</p>
                </div>
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Practice
            </CardTitle>
            <CardDescription>Jump into quick learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-16 flex-col gap-2 hover:shadow-md transition-all"
                onClick={() => window.location.href = "/learning-pathway"}
              >
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Learning Path</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-16 flex-col gap-2 hover:shadow-md transition-all"
                onClick={() => window.location.href = "/online-friends"}
              >
                <Users className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Practice Partners</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 flex-col gap-2 hover:shadow-md transition-all"
              >
                <Mic className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Pronunciation</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 flex-col gap-2 hover:shadow-md transition-all"
                onClick={() => window.location.href = "/profile"}
              >
                <Award className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium">Achievements</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              AI-Powered Learning Features
            </CardTitle>
            <CardDescription>
              Personalized content generated specifically for your learning style and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Sparkles className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Content Generation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI creates vocabulary, grammar, and cultural content based on your interests and field of learning
                </p>
              </div>
              
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Target className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Adaptive Difficulty</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Learning path adjusts difficulty based on your progress and CEFR level
                </p>
              </div>
              
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Globe className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Cultural Context</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Learn real-world applications with cultural notes and practical examples
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}