import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy,
  RotateCcw,
  ArrowRight,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  audioUrl?: string;
}

interface AssessmentTest {
  id: string;
  testType: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit: number;
  learningStageId?: string;
}

interface TestResult {
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  feedback: string;
  nextSteps: string[];
}

export default function AssessmentTest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [currentTest, setCurrentTest] = useState<AssessmentTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get test type from URL params or default to stage completion
  const urlParams = new URLSearchParams(window.location.search);
  const testType = urlParams.get('type') || 'stage_completion';
  const stageId = urlParams.get('stageId');

  // Fetch user data
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    staleTime: 5 * 60 * 1000,
  });

  // Timer effect
  useEffect(() => {
    if (!isTestStarted || isTestCompleted || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTestStarted, isTestCompleted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate assessment test
  const generateTest = useMutation({
    mutationFn: () => apiRequest("/api/assessments/generate", {
      method: "POST",
      body: JSON.stringify({
        testType,
        learningStageId: stageId,
        questionCount: 10,
        difficulty: userResponse?.user?.cefr_level || "A1"
      })
    }),
    onSuccess: (data: AssessmentTest) => {
      setCurrentTest(data);
      setTimeRemaining(data.timeLimit * 60); // Convert minutes to seconds
      setAnswers({});
      setCurrentQuestionIndex(0);
      setIsTestCompleted(false);
      setTestResult(null);
    },
    onError: () => {
      toast({
        title: "Test Generation Failed",
        description: "Unable to generate assessment test. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Submit test
  const submitTest = useMutation({
    mutationFn: () => apiRequest("/api/assessments/submit", {
      method: "POST",
      body: JSON.stringify({
        testId: currentTest?.id,
        answers,
        timeSpent: currentTest ? (currentTest.timeLimit * 60) - timeRemaining : 0
      })
    }),
    onSuccess: (data: TestResult) => {
      setTestResult(data);
      setIsTestCompleted(true);
      setIsTestStarted(false);
      
      if (data.passed) {
        toast({
          title: "Test Passed!",
          description: `You scored ${data.score}% - Great job!`
        });
      } else {
        toast({
          title: "Test Needs Retry",
          description: `You scored ${data.score}%. You need ${currentTest?.passingScore}% to pass.`,
          variant: "destructive"
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/learning-paths"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Unable to submit test. Please try again.",
        variant: "destructive"
      });
    }
  });

  const startTest = () => {
    if (!currentTest) {
      generateTest.mutate();
    } else {
      setIsTestStarted(true);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = currentTest?.questions[currentQuestionIndex];
  const progress = currentTest ? ((currentQuestionIndex + 1) / currentTest.questions.length) * 100 : 0;
  const answeredQuestions = Object.keys(answers).length;

  if (!currentTest && !generateTest.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span>Assessment Test</span>
                </CardTitle>
                <CardDescription>
                  {testType === 'stage_completion' 
                    ? 'Complete this assessment to unlock the next learning stage'
                    : 'Test your knowledge with spaced repetition'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">Passing Score</p>
                    <p className="text-2xl font-bold text-blue-600">80%</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Time Limit</p>
                    <p className="text-2xl font-bold text-green-600">20 min</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Test Guidelines:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• You have 20 minutes to complete 10 questions</li>
                    <li>• You need to score 80% or higher to pass</li>
                    <li>• You can retake the test if you don't pass</li>
                    <li>• Questions cover vocabulary, grammar, and comprehension</li>
                    <li>• Make sure you have a stable internet connection</li>
                  </ul>
                </div>

                <Button 
                  onClick={startTest}
                  className="w-full"
                  size="lg"
                  disabled={generateTest.isPending}
                  data-testid="start-test"
                >
                  {generateTest.isPending ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Generating Test...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Start Assessment Test
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isTestCompleted && testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  {testResult.passed ? (
                    <Trophy className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span>Test {testResult.passed ? 'Completed' : 'Results'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="space-y-4">
                  <div className={`text-6xl font-bold ${testResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(testResult.score)}%
                  </div>
                  
                  <Badge 
                    variant={testResult.passed ? "default" : "destructive"}
                    className="text-lg px-4 py-2"
                  >
                    {testResult.passed ? 'PASSED' : 'RETRY REQUIRED'}
                  </Badge>

                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {testResult.correctAnswers} out of {testResult.totalQuestions} questions correct
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Feedback</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{testResult.feedback}</p>
                </div>

                {testResult.nextSteps.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Next Steps</h3>
                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      {testResult.nextSteps.map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-3">
                  {!testResult.passed && (
                    <Button 
                      onClick={() => {
                        setCurrentTest(null);
                        generateTest.mutate();
                      }}
                      variant="outline"
                      className="flex-1"
                      data-testid="retake-test"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake Test
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => setLocation('/dashboard')}
                    className="flex-1"
                    data-testid="return-dashboard"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTest || !isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Preparing Your Test</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generating personalized questions based on your progress...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Test Header */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    Question {currentQuestionIndex + 1} of {currentTest.questions.length}
                  </Badge>
                  <Badge variant={timeRemaining > 300 ? "default" : "destructive"}>
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(timeRemaining)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {answeredQuestions} answered
                </div>
              </div>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>

          {/* Question Card */}
          {currentQuestion && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                {currentQuestion.type === 'listening' && currentQuestion.audioUrl && (
                  <audio controls className="w-full mt-4">
                    <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option} 
                          id={`option-${index}`}
                          data-testid={`option-${index}`}
                        />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {(currentQuestion.type === 'fill_blank' || currentQuestion.type === 'translation') && (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="min-h-[100px]"
                    data-testid="answer-textarea"
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              data-testid="previous-question"
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              {currentQuestionIndex === currentTest.questions.length - 1 ? (
                <Button
                  onClick={() => submitTest.mutate()}
                  disabled={submitTest.isPending}
                  data-testid="submit-test"
                >
                  {submitTest.isPending ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Test
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  data-testid="next-question"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}