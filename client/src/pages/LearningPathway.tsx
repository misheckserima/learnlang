import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  CheckCircle, 
  Lock, 
  Play, 
  Target, 
  Trophy,
  Sparkles,
  Globe,
  Volume2,
  Star,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Award,
  Lightbulb,
  Clock,
  Users
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";

interface LearningStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  difficulty: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  vocabularyData?: VocabularyWord[];
  grammarTopics?: GrammarTopic[];
  culturalNotes?: string[];
  completionCriteria?: CompletionCriteria;
}

interface VocabularyWord {
  word: string;
  translation: string;
  pronunciation: string;
  difficulty: string;
  context: string;
  example: string;
}

interface GrammarTopic {
  topic: string;
  explanation: string;
  examples: string[];
}

interface CompletionCriteria {
  vocabularyMastery: number;
  grammarUnderstanding: number;
  practiceExercises: number;
}

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

export default function LearningPathway() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(null);
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [masteredWords, setMasteredWords] = useState<Set<string>>(new Set());

  // Fetch user data
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    staleTime: 5 * 60 * 1000,
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

  const user = userResponse?.user;

  // Complete stage mutation
  const completeStage = useMutation({
    mutationFn: (stageId: string) => 
      apiRequest(`/api/learning-stages/${stageId}/complete`, {
        method: "PUT",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      toast({
        title: "Stage Completed!",
        description: "Congratulations! You've completed this learning stage.",
      });
    },
  });

  // Create study session mutation
  const createStudySession = useMutation({
    mutationFn: (sessionData: any) => 
      apiRequest("/api/study-sessions", {
        method: "POST",
        body: JSON.stringify(sessionData),
      }),
  });

  // Set default language
  useEffect(() => {
    if (languages && languages.length > 0 && !selectedLanguage) {
      setSelectedLanguage(languages[0]);
    }
  }, [languages, selectedLanguage]);

  // Set first unlocked stage as selected
  useEffect(() => {
    if (stages && stages.length > 0 && !selectedStage) {
      const firstUnlocked = stages.find((stage: LearningStage) => stage.isUnlocked && !stage.isCompleted);
      const firstStage = stages[0];
      setSelectedStage(firstUnlocked || firstStage);
    }
  }, [stages, selectedStage]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleWordMastery = (word: string) => {
    const newMastered = new Set(masteredWords);
    if (newMastered.has(word)) {
      newMastered.delete(word);
    } else {
      newMastered.add(word);
    }
    setMasteredWords(newMastered);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage?.code || 'en';
      speechSynthesis.speak(utterance);
    }
  };

  const handleCompleteStage = () => {
    if (!selectedStage) return;
    
    // Create study session
    createStudySession.mutate({
      languageId: selectedLanguage?.id,
      activityType: "learning_stage",
      durationMinutes: 15, // Estimated time
      pointsEarned: 50,
      skillPracticed: selectedStage.title
    });

    completeStage.mutate(selectedStage.id);
  };

  const calculateStageProgress = () => {
    if (!selectedStage?.vocabularyData) return 0;
    const totalWords = selectedStage.vocabularyData.length;
    const masteredCount = masteredWords.size;
    return totalWords > 0 ? (masteredCount / totalWords) * 100 : 0;
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <Brain className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Loading Learning Pathway...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/dashboard"}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedLanguage.flagEmoji}</span>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your {selectedLanguage.name} Learning Journey
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered personalized language learning pathway
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Learning Stages Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {selectedLanguage.name} Learning Stages
                </CardTitle>
                {learningPath && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(learningPath.progressPercentage || 0)}%</span>
                    </div>
                    <Progress value={learningPath.progressPercentage || 0} className="h-2" />
                    <p className="text-xs text-gray-500">
                      {learningPath.completedStages}/{learningPath.totalStages} stages completed
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {stagesLoading ? (
                  <div className="text-center py-4">Loading stages...</div>
                ) : !stages || stages.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No learning stages available yet.</p>
                    <p className="text-xs">Return to dashboard to generate content.</p>
                  </div>
                ) : (
                  stages.map((stage: LearningStage) => (
                    <Card 
                      key={stage.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedStage?.id === stage.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                      } ${
                        stage.isCompleted ? "border-green-200 bg-green-50 dark:bg-green-900/20" : 
                        stage.isUnlocked ? "border-blue-200" : 
                        "border-gray-200 opacity-60"
                      }`}
                      onClick={() => stage.isUnlocked && setSelectedStage(stage)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            stage.isCompleted ? "bg-green-500 text-white" :
                            stage.isUnlocked ? "bg-blue-500 text-white" :
                            "bg-gray-400 text-white"
                          }`}>
                            {stage.isCompleted ? <CheckCircle className="w-4 h-4" /> : 
                             stage.isUnlocked ? stage.stageNumber : 
                             <Lock className="w-3 h-3" />}
                          </div>
                          <Badge className={getDifficultyColor(stage.difficulty)} variant="secondary">
                            {stage.difficulty}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{stage.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {stage.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Learning Content */}
          <div className="lg:col-span-3">
            {selectedStage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        selectedStage.isCompleted ? "bg-green-500" : 
                        selectedStage.isUnlocked ? "bg-blue-500" : "bg-gray-400"
                      }`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Stage {selectedStage.stageNumber}: {selectedStage.title}
                          <Badge className={getDifficultyColor(selectedStage.difficulty)}>
                            {selectedStage.difficulty}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{selectedStage.description}</CardDescription>
                      </div>
                    </div>
                    
                    {selectedStage.isUnlocked && !selectedStage.isCompleted && (
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <p className="text-gray-500">Progress</p>
                          <p className="font-semibold">{Math.round(calculateStageProgress())}%</p>
                        </div>
                        <Button 
                          onClick={handleCompleteStage}
                          disabled={calculateStageProgress() < 80 || completeStage.isPending}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {completeStage.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Completing...
                            </>
                          ) : (
                            <>
                              <Trophy className="w-4 h-4 mr-2" />
                              Complete Stage
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {selectedStage.isUnlocked && !selectedStage.isCompleted && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stage Progress</span>
                        <span>{masteredWords.size}/{selectedStage.vocabularyData?.length || 0} words mastered</span>
                      </div>
                      <Progress value={calculateStageProgress()} className="h-2" />
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="vocabulary" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Vocabulary
                      </TabsTrigger>
                      <TabsTrigger value="grammar" className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Grammar
                      </TabsTrigger>
                      <TabsTrigger value="culture" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Culture
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="vocabulary" className="space-y-4">
                      {selectedStage.vocabularyData && selectedStage.vocabularyData.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Vocabulary Words</h3>
                            <Badge variant="outline">
                              {currentWordIndex + 1} / {selectedStage.vocabularyData.length}
                            </Badge>
                          </div>
                          
                          {selectedStage.vocabularyData[currentWordIndex] && (
                            <Card className="border-2 border-blue-200">
                              <CardContent className="p-6">
                                <div className="text-center space-y-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-4">
                                      <h2 className="text-3xl font-bold text-blue-600">
                                        {selectedStage.vocabularyData[currentWordIndex].word}
                                      </h2>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => speakWord(selectedStage.vocabularyData[currentWordIndex].word)}
                                      >
                                        <Volume2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <p className="text-gray-500">
                                      /{selectedStage.vocabularyData[currentWordIndex].pronunciation}/
                                    </p>
                                    <p className="text-xl font-semibold">
                                      {selectedStage.vocabularyData[currentWordIndex].translation}
                                    </p>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Context</h4>
                                      <p className="text-sm">{selectedStage.vocabularyData[currentWordIndex].context}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Example</h4>
                                      <p className="text-sm italic">
                                        "{selectedStage.vocabularyData[currentWordIndex].example}"
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <Button
                                      variant="outline"
                                      disabled={currentWordIndex === 0}
                                      onClick={() => setCurrentWordIndex(currentWordIndex - 1)}
                                    >
                                      <ArrowLeft className="w-4 h-4 mr-2" />
                                      Previous
                                    </Button>
                                    
                                    <Button
                                      variant={masteredWords.has(selectedStage.vocabularyData[currentWordIndex].word) ? "default" : "outline"}
                                      onClick={() => handleWordMastery(selectedStage.vocabularyData[currentWordIndex].word)}
                                    >
                                      <Star className="w-4 h-4 mr-2" />
                                      {masteredWords.has(selectedStage.vocabularyData[currentWordIndex].word) ? "Mastered" : "Mark as Mastered"}
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      disabled={currentWordIndex === selectedStage.vocabularyData.length - 1}
                                      onClick={() => setCurrentWordIndex(currentWordIndex + 1)}
                                    >
                                      Next
                                      <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>No vocabulary words available for this stage.</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="grammar" className="space-y-4">
                      {selectedStage.grammarTopics && selectedStage.grammarTopics.length > 0 ? (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold">Grammar Topics</h3>
                          {selectedStage.grammarTopics.map((topic: GrammarTopic, index: number) => (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle className="text-base">{topic.topic}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Explanation</h4>
                                  <p className="text-sm">{topic.explanation}</p>
                                </div>
                                {topic.examples && topic.examples.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Examples</h4>
                                    <ul className="space-y-2">
                                      {topic.examples.map((example: string, exIndex: number) => (
                                        <li key={exIndex} className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                          {example}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>No grammar topics available for this stage.</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="culture" className="space-y-4">
                      {selectedStage.culturalNotes && selectedStage.culturalNotes.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Cultural Notes</h3>
                          <div className="grid gap-4">
                            {selectedStage.culturalNotes.map((note: string, index: number) => (
                              <Card key={index}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <Globe className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                                    <p className="text-sm">{note}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>No cultural notes available for this stage.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Select a Learning Stage</h3>
                  <p className="text-gray-500">Choose a stage from the sidebar to start learning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}