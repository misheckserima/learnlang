interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

let recognition: any = null;
let isListening = false;

export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const startSpeechRecognition = (language: string = 'en-US'): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      reject(new Error('Speech recognition is not supported in this browser'));
      return;
    }

    // Create recognition instance
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    // Configure recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: any) => {
      if (event.results.length > 0) {
        const result = event.results[0][0];
        isListening = false;
        resolve(result.transcript);
      } else {
        reject(new Error('No speech detected'));
      }
    };

    // Handle errors
    recognition.onerror = (event: any) => {
      isListening = false;
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during speech recognition.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not allowed.';
          break;
        case 'bad-grammar':
          errorMessage = 'Grammar error in speech recognition.';
          break;
        case 'language-not-supported':
          errorMessage = 'Language not supported for speech recognition.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      reject(new Error(errorMessage));
    };

    // Handle end event
    recognition.onend = () => {
      isListening = false;
    };

    // Start recognition
    try {
      recognition.start();
      isListening = true;
    } catch (error) {
      reject(new Error('Failed to start speech recognition'));
    }
  });
};

export const stopSpeechRecognition = (): void => {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
  }
};

export const getSpeechRecognitionStatus = (): boolean => {
  return isListening;
};

// Language code mapping for better accuracy
export const getLanguageCode = (language: string): string => {
  const languageMap: { [key: string]: string } = {
    spanish: 'es-ES',
    french: 'fr-FR',
    german: 'de-DE',
    italian: 'it-IT',
    portuguese: 'pt-PT',
    english: 'en-US',
    chinese: 'zh-CN',
    japanese: 'ja-JP',
    korean: 'ko-KR',
    russian: 'ru-RU',
    arabic: 'ar-SA',
    hindi: 'hi-IN',
  };

  return languageMap[language.toLowerCase()] || language;
};

// Advanced speech recognition with confidence scoring
export const startAdvancedSpeechRecognition = (
  language: string = 'en-US',
  options: {
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
  } = {}
): Promise<SpeechRecognitionResult[]> => {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      reject(new Error('Speech recognition is not supported in this browser'));
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    // Configure with advanced options
    recognition.continuous = options.continuous || false;
    recognition.interimResults = options.interimResults || false;
    recognition.lang = getLanguageCode(language);
    recognition.maxAlternatives = options.maxAlternatives || 3;

    const results: SpeechRecognitionResult[] = [];

    recognition.onresult = (event: any) => {
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          for (let j = 0; j < result.length; j++) {
            results.push({
              transcript: result[j].transcript,
              confidence: result[j].confidence || 0,
            });
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      isListening = false;
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      isListening = false;
      resolve(results);
    };

    try {
      recognition.start();
      isListening = true;
    } catch (error) {
      reject(new Error('Failed to start speech recognition'));
    }
  });
};
