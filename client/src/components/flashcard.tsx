import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2, RotateCcw } from "lucide-react";
import { playTextToSpeech } from "@/lib/audio-utils";
import type { VocabularyWord } from "@shared/schema";

export default function Flashcard() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Mock data for demonstration - in real app would fetch from API
  const mockWords: VocabularyWord[] = [
    {
      id: "1",
      languageId: "spanish",
      word: "Hola",
      translation: "Hello",
      pronunciation: "/ˈo.la/",
      audioUrl: "",
      difficulty: "beginner",
      category: "greetings",
      exampleSentence: "Hola, ¿cómo estás?",
      exampleTranslation: "Hello, how are you?",
      imageUrl: "",
      createdAt: new Date(),
    },
    {
      id: "2",
      languageId: "spanish", 
      word: "Gracias",
      translation: "Thank you",
      pronunciation: "/ˈɡɾa.θjas/",
      audioUrl: "",
      difficulty: "beginner",
      category: "politeness",
      exampleSentence: "Gracias por tu ayuda",
      exampleTranslation: "Thank you for your help",
      imageUrl: "",
      createdAt: new Date(),
    },
    {
      id: "3",
      languageId: "spanish",
      word: "Casa",
      translation: "House",
      pronunciation: "/ˈka.sa/",
      audioUrl: "",
      difficulty: "beginner", 
      category: "home",
      exampleSentence: "Mi casa es grande",
      exampleTranslation: "My house is big",
      imageUrl: "",
      createdAt: new Date(),
    },
  ];

  const { data: words = mockWords, isLoading } = useQuery<VocabularyWord[]>({
    queryKey: ["/api/languages/spanish-id/vocabulary/random", { count: 10 }],
    enabled: false, // Disabled for demo
  });

  const currentWord = words[currentCardIndex];
  const progress = ((currentCardIndex + 1) / words.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowTranslation(!showTranslation);
  };

  const handleNext = (known: boolean = false) => {
    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowTranslation(false);
    } else {
      // Reset to beginning
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowTranslation(false);
    }
  };

  const handlePlayAudio = () => {
    // In real app, would play actual audio file
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowTranslation(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No vocabulary words available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Vocabulary Practice</h3>
        <p className="text-sm text-slate-600">Click the card to reveal the translation</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>{currentCardIndex + 1} of {words.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="relative h-64 cursor-pointer" onClick={handleFlip}>
        <Card className={`absolute inset-0 transition-transform duration-300 ${
          isFlipped ? "rotate-y-180" : ""
        } hover:scale-105`}>
          <CardContent className="h-full flex items-center justify-center p-8">
            {!showTranslation ? (
              <div className="text-center text-white">
                <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl h-full flex items-center justify-center">
                  <div>
                    <div className="text-4xl font-bold mb-2">{currentWord.word}</div>
                    <div className="text-lg opacity-90 mb-4">{currentWord.pronunciation}</div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio();
                      }}
                      className="bg-white/20 hover:bg-white/30"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl h-full flex items-center justify-center text-white">
                  <div>
                    <div className="text-4xl font-bold mb-2">{currentWord.translation}</div>
                    {currentWord.exampleSentence && (
                      <div className="mt-4 opacity-90">
                        <div className="text-lg">{currentWord.exampleSentence}</div>
                        <div className="text-sm mt-1">{currentWord.exampleTranslation}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline" 
          size="sm"
          onClick={handleReset}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleNext(false)}
          >
            Skip
          </Button>
          <Button
            onClick={() => handleNext(true)}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            I Know This
          </Button>
        </div>
      </div>
    </div>
  );
}
