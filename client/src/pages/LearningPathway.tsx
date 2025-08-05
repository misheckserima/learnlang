import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  BookOpen, 
  Trophy, 
  Lock, 
  CheckCircle, 
  Play, 
  Clock, 
  Target,
  Sparkles,
  Users,
  Globe
} from "lucide-react";

interface LearningStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  difficulty: string;
  vocabularyData: any[];
  grammarTopics: any[];
  culturalNotes: string[];
  completionCriteria: any;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: string;
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

export default function LearningPathway() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(null);

  // Fetch languages
  const { data: languages } = useQuery({
    queryKey: ["/api/languages"],
  });

  // Fetch learning path
  const { data: learningPath, isLoading: pathLoading } = useQuery({
    queryKey: ["/api/learning-paths", selectedLanguageId],
    enabled: !!selectedLanguageId,
  });

  // Fetch learning stages
  const { data: stages, isLoading: stagesLoading } = useQuery({
    queryKey: ["/api/learning-paths", learningPath?.id, "stages"],
    enabled: !!learningPath?.id,
  });

  // Generate pathway mutation
  const generatePathwayMutation = useMutation({
    mutationFn: (data: { languageId: string }) => 
      apiRequest(`/api/learning-paths/${learningPath?.id}/generate`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      toast({
        title: "Success",
        description: "Your personalized learning pathway has been generated!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate learning pathway",
        variant: "destructive",
      });
    },
  });

  // Complete stage mutation
  const completeStage = useMutation({
    mutationFn: (stageId: string) => 
      apiRequest(`/api/learning-stages/${stageId}/complete`, {
        method: "PUT",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      toast({
        title: "Congratulations!",
        description: "Stage completed! Next stage unlocked.",
      });
    },
  });

  // Set default language
  useEffect(() => {
    if (languages && languages.length > 0 && !selectedLanguageId) {
      setSelectedLanguageId(languages[0].id);
    }
  }, [languages, selectedLanguageId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStageCard = (stage: LearningStage) => (
    <Card 
      key={stage.id}
      className={`relative transition-all duration-200 hover:shadow-md cursor-pointer ${
        stage.isCompleted ? "border-green-200 bg-green-50" : 
        stage.isUnlocked ? "border-blue-200 bg-blue-50" : 
        "border-gray-200 bg-gray-50 opacity-60"
      }`}
      onClick={() => stage.isUnlocked && setSelectedStage(stage)}
      data-testid={`stage-card-${stage.stageNumber}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              stage.isCompleted ? "bg-green-500 text-white" :
              stage.isUnlocked ? "bg-blue-500 text-white" :
              "bg-gray-400 text-white"
            }`}>
              {stage.isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : stage.isUnlocked ? (
                stage.stageNumber
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{stage.title}</CardTitle>
              <Badge className={getDifficultyColor(stage.difficulty)} variant="secondary">
                {stage.difficulty}
              </Badge>
            </div>
          </div>
          {stage.isUnlocked && !stage.isCompleted && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                completeStage.mutate(stage.id);
              }}
              disabled={completeStage.isPending}
              data-testid={`complete-stage-${stage.stageNumber}`}
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-3">{stage.description}</CardDescription>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>{stage.vocabularyData?.length || 0} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-green-500" />
            <span>{stage.grammarTopics?.length || 0} topics</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-purple-500" />
            <span>{stage.culturalNotes?.length || 0} notes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStageDetails = (stage: LearningStage) => (
    <Card data-testid="stage-details">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {stage.title}
            </CardTitle>
            <CardDescription>{stage.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(stage.difficulty)}>
            {stage.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vocabulary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
          </TabsList>

          <TabsContent value="vocabulary" className="mt-4">
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {stage.vocabularyData?.map((word, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{word.word}</h4>
                        <p className="text-sm text-gray-600">{word.pronunciation}</p>
                      </div>
                      <Badge variant="outline">{word.difficulty}</Badge>
                    </div>
                    <p className="text-gray-800 mb-1">{word.translation}</p>
                    <p className="text-sm text-gray-600 italic">{word.example}</p>
                    <p className="text-xs text-gray-500 mt-1">{word.context}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="grammar" className="mt-4">
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {stage.grammarTopics?.map((topic, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-semibold mb-2">{topic.topic}</h4>
                    <p className="text-gray-700 mb-3">{topic.explanation}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Examples:</p>
                      {topic.examples?.map((example: string, idx: number) => (
                        <p key={idx} className="text-sm text-gray-600 italic">• {example}</p>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="culture" className="mt-4">
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {stage.culturalNotes?.map((note, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-2">
                      <Globe className="w-5 h-5 text-purple-500 mt-0.5" />
                      <p className="text-gray-700">{note}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  if (pathLoading || stagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your learning pathway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  Your Learning Journey
                </CardTitle>
                <CardDescription className="text-lg">
                  AI-powered personalized language learning pathway
                </CardDescription>
              </div>
              {languages && (
                <select
                  value={selectedLanguageId}
                  onChange={(e) => setSelectedLanguageId(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  data-testid="language-selector"
                >
                  {languages.map((lang: any) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            {learningPath && (
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-2">
                  <Badge variant="outline" className="text-sm">
                    Level: {learningPath.currentLevel} → {learningPath.targetLevel}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {learningPath.completedStages}/{learningPath.totalStages} stages completed
                  </span>
                </div>
                <Progress value={learningPath.progressPercentage} className="h-2" />
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Generate Pathway Button */}
        {learningPath && (!stages || stages.length === 0) && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generate Your Learning Pathway</h3>
              <p className="text-gray-600 mb-4">
                Create a personalized learning journey based on your profile and interests
              </p>
              <Button
                onClick={() => generatePathwayMutation.mutate({ languageId: selectedLanguageId })}
                disabled={generatePathwayMutation.isPending}
                size="lg"
                data-testid="generate-pathway-button"
              >
                {generatePathwayMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Pathway
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stages List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Learning Stages
            </h2>
            
            {stages && stages.length > 0 ? (
              <div className="space-y-4" data-testid="stages-list">
                {stages.map((stage: LearningStage) => renderStageCard(stage))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No learning stages available yet.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stage Details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Stage Details</h2>
            
            {selectedStage ? (
              renderStageDetails(selectedStage)
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a stage to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}