import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import type { GrammarExercise } from "@shared/schema";

export default function GrammarQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Mock data for demonstration
  const mockExercises: GrammarExercise[] = [
    {
      id: "1",
      languageId: "spanish",
      type: "multiple_choice",
      question: "Yo ______ español todos los días.",
      questionTranslation: "I ______ Spanish every day.",
      correctAnswer: "estudio",
      options: [
        { id: "a", text: "estudio", translation: "I study" },
        { id: "b", text: "estudié", translation: "I studied" },
        { id: "c", text: "estudiaré", translation: "I will study" }
      ],
      explanation: "Use 'estudio' (present tense) for habitual actions.",
      difficulty: "beginner",
      grammarTopic: "present_tense",
      createdAt: new Date(),
    },
    {
      id: "2",
      languageId: "spanish",
      type: "multiple_choice", 
      question: "¿Dónde ______ tú ayer?",
      questionTranslation: "Where ______ you yesterday?",
      correctAnswer: "estuviste",
      options: [
        { id: "a", text: "estás", translation: "you are" },
        { id: "b", text: "estuviste", translation: "you were" },
        { id: "c", text: "estarás", translation: "you will be" }
      ],
      explanation: "Use 'estuviste' (preterite tense) for completed past actions.",
      difficulty: "intermediate",
      grammarTopic: "past_tense",
      createdAt: new Date(),
    },
  ];

  const { data: exercises = mockExercises, isLoading } = useQuery<GrammarExercise[]>({
    queryKey: ["/api/languages/spanish-id/grammar/random", { count: 5 }],
    enabled: false, // Disabled for demo
  });

  const currentExercise = exercises[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exercises.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      // Quiz completed
      alert(`Quiz completed! Score: ${score}/${exercises.length}`);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setShowResult(false);
      setScore(0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No grammar exercises available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Grammar Challenge</h3>
        <p className="text-sm text-slate-600">Choose the correct form of the verb</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Question {currentQuestionIndex + 1} of {exercises.length}</span>
          <span>Score: {score}/{exercises.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="bg-slate-50">
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-lg text-slate-800 mb-2">
              {currentExercise.question.split('______').map((part, index, parts) => (
                <span key={index}>
                  {part}
                  {index < parts.length - 1 && (
                    <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      ______
                    </span>
                  )}
                </span>
              ))}
            </p>
            <p className="text-sm text-slate-600">{currentExercise.questionTranslation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Answer Options */}
      <div className="space-y-3">
        <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
          {(currentExercise.options as any[])?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Card className={`flex-1 p-4 cursor-pointer transition-colors ${
                selectedAnswer === option.text 
                  ? "border-blue-500 bg-blue-50" 
                  : "hover:border-blue-300 hover:bg-blue-50"
              } ${showResult ? (
                option.text === currentExercise.correctAnswer 
                  ? "border-emerald-500 bg-emerald-50" 
                  : selectedAnswer === option.text && !isCorrect
                    ? "border-red-500 bg-red-50"
                    : ""
              ) : ""}`}>
                <CardContent className="p-0">
                  <Label htmlFor={option.id} className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value={option.text} id={option.id} />
                    <div className="flex-1">
                      <span className="font-medium text-slate-800">{option.text}</span>
                      <span className="text-sm text-slate-600 ml-2">({option.translation})</span>
                    </div>
                    {showResult && option.text === currentExercise.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                    {showResult && selectedAnswer === option.text && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </Label>
                </CardContent>
              </Card>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Result & Explanation */}
      {showResult && (
        <Card className={`${isCorrect ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-medium ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            {currentExercise.explanation && (
              <p className="text-sm text-slate-600">{currentExercise.explanation}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600">
            {currentQuestionIndex < exercises.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
}
