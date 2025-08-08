import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Upload, 
  CheckCircle, 
  ChevronDown,
  ChevronRight,
  Sparkles,
  Target,
  Globe,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
}

interface InterestCategory {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  subcategories?: InterestCategory[];
}

const PROFICIENCY_LEVELS = [
  { value: "Beginner", label: "Beginner", description: "Just starting out" },
  { value: "Intermediate", label: "Intermediate", description: "Some experience" },
  { value: "C1", label: "C1", description: "Advanced proficiency" },
  { value: "CA", label: "CA", description: "Near-native proficiency" }
];

const INTEREST_CATEGORIES = [
  {
    name: "Education",
    subcategories: [
      {
        name: "Engineering & Technology",
        subcategories: ["Robotics", "Software Development", "Mechanical Engineering", "Electrical Engineering"]
      },
      {
        name: "Sciences",
        subcategories: ["Biology", "Chemistry", "Physics", "Mathematics"]
      },
      {
        name: "Languages & Literature",
        subcategories: ["Linguistics", "Creative Writing", "Translation", "Literature Analysis"]
      }
    ]
  },
  {
    name: "Health",
    subcategories: [
      {
        name: "Medical Field",
        subcategories: ["General Medicine", "Nursing", "Pharmacy", "Dentistry"]
      },
      {
        name: "Wellness",
        subcategories: ["Nutrition", "Fitness", "Mental Health", "Alternative Medicine"]
      }
    ]
  },
  {
    name: "Technology",
    subcategories: [
      {
        name: "Software Development",
        subcategories: ["Web Development", "Mobile Apps", "AI/ML", "Data Science"]
      },
      {
        name: "IT & Networking",
        subcategories: ["Cybersecurity", "Cloud Computing", "System Administration", "DevOps"]
      }
    ]
  },
  {
    name: "Travel",
    subcategories: [
      {
        name: "Tourism",
        subcategories: ["Hotel Management", "Tour Guiding", "Travel Planning", "Cultural Exchange"]
      },
      {
        name: "Transportation",
        subcategories: ["Aviation", "Maritime", "Logistics", "Public Transport"]
      }
    ]
  },
  {
    name: "Business",
    subcategories: [
      {
        name: "Management",
        subcategories: ["Project Management", "Human Resources", "Operations", "Strategic Planning"]
      },
      {
        name: "Finance",
        subcategories: ["Accounting", "Investment", "Banking", "Insurance"]
      },
      {
        name: "Marketing",
        subcategories: ["Digital Marketing", "Brand Management", "Sales", "Public Relations"]
      }
    ]
  }
];

export default function GenerateLearningPath() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nativeLanguageId: "",
    targetLanguageId: "",
    proficiencyLevel: "Beginner",
    selectedInterests: [] as string[],
    syllabusFile: null as File | null
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

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

  const user = userResponse?.user;

  // Generate learning path mutation
  const generatePathMutation = useMutation({
    mutationFn: async (pathData: any) => {
      setIsGenerating(true);
      setGenerationProgress(10);
      
      // First create the learning path
      const pathResponse = await apiRequest("/api/learning-paths", {
        method: "POST",
        body: JSON.stringify({
          languageId: pathData.targetLanguageId,
          currentLevel: "A1",
          targetLevel: "B2"
        }),
      });
      
      setGenerationProgress(30);
      
      // Then generate AI content
      const contentResponse = await apiRequest(`/api/learning-paths/${pathResponse.id}/generate`, {
        method: "POST", 
        body: JSON.stringify({
          languageId: pathData.targetLanguageId,
          interests: pathData.selectedInterests,
          proficiencyLevel: pathData.proficiencyLevel,
          syllabusContent: pathData.syllabusContent
        }),
      });
      
      setGenerationProgress(80);
      
      // Update user profile with learning preferences
      await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          nativeLanguageId: pathData.nativeLanguageId,
          targetLanguageId: pathData.targetLanguageId,
          proficiencyLevel: pathData.proficiencyLevel,
          interests: pathData.selectedInterests
        }),
      });
      
      setGenerationProgress(100);
      return contentResponse;
    },
    onSuccess: () => {
      setTimeout(() => {
        toast({
          title: "Learning Path Generated!",
          description: "Your personalized learning journey is ready. Redirecting to dashboard...",
        });
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }, 1000);
    },
    onError: (error: any) => {
      setIsGenerating(false);
      setGenerationProgress(0);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate learning path",
        variant: "destructive",
      });
    },
  });

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = formData.selectedInterests.includes(interest)
      ? formData.selectedInterests.filter(i => i !== interest)
      : [...formData.selectedInterests, interest];
    
    setFormData({ ...formData, selectedInterests: newInterests });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, syllabusFile: file });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
    }
  };

  const processSyllabusFile = async (file: File): Promise<string> => {
    // In a real implementation, this would extract text from PDF
    // For now, we'll return a placeholder
    return `Syllabus content from ${file.name}`;
  };

  const handleGenerate = async () => {
    if (!formData.nativeLanguageId || !formData.targetLanguageId) {
      toast({
        title: "Missing Information",
        description: "Please select both native and target languages.",
        variant: "destructive",
      });
      return;
    }

    if (formData.selectedInterests.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one area of interest.",
        variant: "destructive",
      });
      return;
    }

    let syllabusContent = "";
    if (formData.syllabusFile) {
      syllabusContent = await processSyllabusFile(formData.syllabusFile);
    }

    generatePathMutation.mutate({
      ...formData,
      syllabusContent
    });
  };

  const renderInterestCategories = () => {
    return INTEREST_CATEGORIES.map((category) => (
      <Card key={category.name} className="border-2">
        <CardHeader className="pb-2">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory(category.name)}
          >
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              {category.name}
            </CardTitle>
            {expandedCategories.has(category.name) ? 
              <ChevronDown className="w-5 h-5" /> : 
              <ChevronRight className="w-5 h-5" />
            }
          </div>
        </CardHeader>
        {expandedCategories.has(category.name) && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.name}>
                  <h4 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                    {subcategory.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {subcategory.subcategories?.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.selectedInterests.includes(interest)}
                          onCheckedChange={() => toggleInterest(interest)}
                        />
                        <Label 
                          htmlFor={interest}
                          className="text-sm cursor-pointer"
                        >
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    ));
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <Card className="border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Generating Your Learning Path
              </CardTitle>
              <CardDescription className="text-lg">
                AI is creating personalized content based on your preferences...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-4" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className={`p-4 rounded-lg transition-colors ${generationProgress >= 30 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${generationProgress >= 30 ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">Creating Learning Path</p>
                </div>
                <div className={`p-4 rounded-lg transition-colors ${generationProgress >= 80 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <Sparkles className={`w-6 h-6 mx-auto mb-2 ${generationProgress >= 80 ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">Generating AI Content</p>
                </div>
                <div className={`p-4 rounded-lg transition-colors ${generationProgress >= 100 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <Globe className={`w-6 h-6 mx-auto mb-2 ${generationProgress >= 100 ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">Personalizing Experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generate Your Learning Path
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tell us about your language learning goals and interests, and we'll create a personalized AI-powered learning journey just for you.
          </p>
        </div>

        {/* Language Selection */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6" />
              Language Selection
            </CardTitle>
            <CardDescription>
              Choose your native language and the language you want to learn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="native-language">Native Language</Label>
                <Select 
                  value={formData.nativeLanguageId} 
                  onValueChange={(value) => setFormData({...formData, nativeLanguageId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your native language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages?.map((lang: Language) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flagEmoji}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target-language">Target Language</Label>
                <Select 
                  value={formData.targetLanguageId} 
                  onValueChange={(value) => setFormData({...formData, targetLanguageId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language to learn" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages?.filter(lang => lang.id !== formData.nativeLanguageId)?.map((lang: Language) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flagEmoji}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current Proficiency Level</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PROFICIENCY_LEVELS.map((level) => (
                  <Card 
                    key={level.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.proficiencyLevel === level.value 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200"
                    }`}
                    onClick={() => setFormData({...formData, proficiencyLevel: level.value})}
                  >
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold">{level.label}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{level.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interest Selection */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Areas of Interest
            </CardTitle>
            <CardDescription>
              Select topics and fields you're interested in. This helps AI generate relevant vocabulary and examples.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.selectedInterests.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Interests:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedInterests.map((interest) => (
                    <Badge 
                      key={interest} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest} ×
                    </Badge>
                  ))}
                </div>
                <Separator />
              </div>
            )}
            
            <div className="space-y-4">
              {renderInterestCategories()}
            </div>
          </CardContent>
        </Card>

        {/* Syllabus Upload */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Syllabus Upload (Optional)
            </CardTitle>
            <CardDescription>
              Upload your course syllabus PDF for even more personalized content generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload a PDF file containing your syllabus or course outline
                </p>
              </div>
              
              {formData.syllabusFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">{formData.syllabusFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({...formData, syllabusFile: null})}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            onClick={handleGenerate}
            disabled={generatePathMutation.isPending || !formData.nativeLanguageId || !formData.targetLanguageId || formData.selectedInterests.length === 0}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Learning Path
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            This may take a few moments as we generate personalized content for you
          </p>
        </div>
      </div>
    </div>
  );
}