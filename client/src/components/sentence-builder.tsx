import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface SentenceExercise {
  id: string;
  targetSentence: string;
  targetTranslation: string;
  words: string[];
  difficulty: string;
}

interface DroppedWord {
  word: string;
  index: number;
}

export default function SentenceBuilder() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [droppedWords, setDroppedWords] = useState<DroppedWord[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Mock sentence exercises - in real app would fetch from API
  const exercises: SentenceExercise[] = [
    {
      id: "1",
      targetSentence: "Los estudiantes estudian en la biblioteca",
      targetTranslation: "The students study in the library",
      words: ["Los", "estudiantes", "estudian", "en", "la", "biblioteca"],
      difficulty: "beginner"
    },
    {
      id: "2",
      targetSentence: "Mi familia come en el restaurante",
      targetTranslation: "My family eats at the restaurant", 
      words: ["Mi", "familia", "come", "en", "el", "restaurante"],
      difficulty: "beginner"
    },
    {
      id: "3",
      targetSentence: "El profesor enseña español muy bien",
      targetTranslation: "The teacher teaches Spanish very well",
      words: ["El", "profesor", "enseña", "español", "muy", "bien"],
      difficulty: "intermediate"
    }
  ];

  const currentExercise = exercises[currentExerciseIndex];

  // Initialize available words when exercise changes
  useState(() => {
    setAvailableWords([...currentExercise.words].sort(() => Math.random() - 0.5));
    setDroppedWords([]);
    setShowResult(false);
  });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: string) => {
    setDraggedWord(word);
    e.dataTransfer.setData("text/plain", word);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text/plain");
    
    if (word && availableWords.includes(word)) {
      // Add word to dropped words
      setDroppedWords(prev => [...prev, { word, index: prev.length }]);
      // Remove word from available words
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
    setDraggedWord(null);
  };

  const handleWordClick = (word: string) => {
    // Alternative to drag and drop - click to add word
    if (availableWords.includes(word)) {
      setDroppedWords(prev => [...prev, { word, index: prev.length }]);
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
  };

  const handleRemoveWord = (index: number) => {
    const wordToRemove = droppedWords[index];
    if (wordToRemove) {
      // Remove from dropped words
      setDroppedWords(prev => prev.filter((_, i) => i !== index));
      // Add back to available words
      setAvailableWords(prev => [...prev, wordToRemove.word]);
    }
  };

  const handleReset = () => {
    setAvailableWords([...currentExercise.words].sort(() => Math.random() - 0.5));
    setDroppedWords([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleCheckSentence = () => {
    const userSentence = droppedWords.map(w => w.word).join(" ");
    const correct = userSentence === currentExercise.targetSentence;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setCurrentExerciseIndex(0);
    }
    
    // Reset for next exercise
    const nextExercise = exercises[currentExerciseIndex < exercises.length - 1 ? currentExerciseIndex + 1 : 0];
    setAvailableWords([...nextExercise.words].sort(() => Math.random() - 0.5));
    setDroppedWords([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-blue-100 text-blue-600";
      case "intermediate": return "bg-amber-100 text-amber-600"; 
      case "advanced": return "bg-emerald-100 text-emerald-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-800">Sentence Builder</h3>
          <Badge className={getDifficultyColor(currentExercise.difficulty)}>
            {currentExercise.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-slate-600">Arrange the words to form the correct sentence</p>
      </div>

      {/* Target Sentence */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <p className="text-sm text-slate-600 mb-2">Build this sentence:</p>
          <p className="text-lg font-medium text-slate-800">{currentExercise.targetTranslation}</p>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <Card className="min-h-[80px] border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
        <CardContent
          ref={dropZoneRef}
          className="p-4 min-h-[60px] flex items-center flex-wrap gap-2"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {droppedWords.length === 0 ? (
            <span className="text-slate-400">Drag words here or click them below...</span>
          ) : (
            droppedWords.map((droppedWord, index) => (
              <div
                key={`${droppedWord.word}-${index}`}
                onClick={() => handleRemoveWord(index)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors select-none"
              >
                {droppedWord.word}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Word Bank */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Available Words:</p>
        <div className="flex flex-wrap gap-2">
          {availableWords.map((word, index) => (
            <div
              key={`${word}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, word)}
              onClick={() => handleWordClick(word)}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg cursor-move select-none hover:bg-blue-600 transition-colors ${
                draggedWord === word ? "opacity-50" : ""
              }`}
            >
              {word}
            </div>
          ))}
        </div>
        
        {availableWords.length === 0 && !showResult && (
          <p className="text-sm text-slate-500 italic">All words used. Check your sentence!</p>
        )}
      </div>

      {/* Result */}
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
                {isCorrect ? "Perfect! Well done!" : "Not quite right. Try again!"}
              </span>
            </div>
            
            {!isCorrect && (
              <div className="text-sm text-slate-600">
                <p className="mb-1">Your sentence: <span className="italic">{droppedWords.map(w => w.word).join(" ")}</span></p>
                <p>Correct sentence: <span className="italic font-medium">{currentExercise.targetSentence}</span></p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>

        <div className="flex space-x-2">
          {!showResult ? (
            <Button
              onClick={handleCheckSentence}
              disabled={droppedWords.length === 0}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Check Sentence
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600">
              Next Exercise
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
