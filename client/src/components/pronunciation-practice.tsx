import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Mic, MicOff, Volume2 } from "lucide-react";
import { startSpeechRecognition, stopSpeechRecognition } from "@/lib/speech-recognition";
import { playTextToSpeech } from "@/lib/audio-utils";

interface PronunciationWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  difficulty: string;
}

export default function PronunciationPractice() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState<string>("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Mock pronunciation words - in real app would fetch from API
  const practiceWords: PronunciationWord[] = [
    {
      id: "1",
      word: "¿Cómo está usted?",
      translation: "How are you? (formal)",
      pronunciation: "/ˈko.mo esˈta usˈteð/",
      difficulty: "intermediate"
    },
    {
      id: "2", 
      word: "Buenos días",
      translation: "Good morning",
      pronunciation: "/ˈbwe.nos ˈdi.as/",
      difficulty: "beginner"
    },
    {
      id: "3",
      word: "Me llamo María",
      translation: "My name is María",
      pronunciation: "/me ˈʎa.mo maˈɾi.a/",
      difficulty: "beginner"
    }
  ];

  const currentWord = practiceWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / practiceWords.length) * 100;

  const handlePlayAudio = async () => {
    try {
      await playTextToSpeech(currentWord.word, 'es-ES');
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      setIsListening(true);
      setUserSpeech("");
      setAccuracy(null);

      const result = await startSpeechRecognition('es-ES');
      setUserSpeech(result);
      
      // Calculate accuracy (simplified comparison)
      const similarity = calculateSimilarity(result.toLowerCase(), currentWord.word.toLowerCase());
      setAccuracy(Math.round(similarity * 100));
      
    } catch (error) {
      console.error('Speech recognition error:', error);
      setUserSpeech("Error: Could not recognize speech");
      setAccuracy(0);
    } finally {
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const handleStopRecording = () => {
    stopSpeechRecognition();
    setIsRecording(false);
    setIsListening(false);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    // Simple similarity calculation - in real app would use more sophisticated algorithm
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;
    
    words1.forEach(word => {
      if (words2.some(w => w.includes(word) || word.includes(w))) {
        matches++;
      }
    });
    
    return matches / Math.max(words1.length, words2.length);
  };

  const handleNext = () => {
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
    }
    setUserSpeech("");
    setAccuracy(null);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-emerald-600";
    if (accuracy >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 90) return "bg-emerald-100";
    if (accuracy >= 70) return "bg-amber-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Pronunciation Practice</h3>
        <p className="text-sm text-slate-600">Listen and repeat to improve your accent</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Word {currentWordIndex + 1} of {practiceWords.length}</span>
          <span className="capitalize">{currentWord.difficulty} level</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Word Display */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="text-2xl font-bold text-slate-800 mb-2">
              {currentWord.word}
            </div>
            <div className="text-lg text-slate-600 mb-2">{currentWord.translation}</div>
            <div className="text-sm text-slate-500 font-mono">{currentWord.pronunciation}</div>
          </div>
          
          <Button
            onClick={handlePlayAudio}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            Listen to Native Speaker
          </Button>
        </CardContent>
      </Card>

      {/* Recording Section */}
      <div className="text-center space-y-4">
        <div className="relative">
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isListening && !isRecording}
            className={`w-20 h-20 rounded-full shadow-lg transition-all duration-200 ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
            size="lg"
          >
            {isRecording ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
          
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
          )}
        </div>
        
        <p className="text-sm text-slate-600">
          {isRecording ? "Listening... Click to stop" : "Click and hold to record your pronunciation"}
        </p>
      </div>

      {/* Results */}
      {userSpeech && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">What you said:</h4>
                <p className="text-slate-600 italic">"{userSpeech}"</p>
              </div>
              
              {accuracy !== null && (
                <div className={`rounded-lg p-4 ${getAccuracyBgColor(accuracy)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">Accuracy Score</span>
                    <span className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>
                      {accuracy}%
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    {accuracy >= 90 && (
                      <p className="text-sm text-emerald-700">Excellent pronunciation! 🎉</p>
                    )}
                    {accuracy >= 70 && accuracy < 90 && (
                      <p className="text-sm text-amber-700">Good job! Keep practicing to improve further.</p>
                    )}
                    {accuracy < 70 && (
                      <p className="text-sm text-red-700">Keep practicing! Try listening to the native speaker again.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-center">
        <Button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600">
          Next Word
        </Button>
      </div>
    </div>
  );
}
