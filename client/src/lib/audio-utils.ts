// Audio utility functions for language learning

interface AudioPlaybackOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

// Text-to-speech functionality
export const playTextToSpeech = (
  text: string,
  language: string = 'en-US',
  options: AudioPlaybackOptions = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech is not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure utterance
    utterance.lang = language;
    utterance.rate = options.rate || 0.8; // Slightly slower for learning
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Start speaking
    speechSynthesis.speak(utterance);
  });
};

// Get available voices for a specific language
export const getVoicesForLanguage = (language: string): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) {
    return [];
  }

  const voices = speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith(language.split('-')[0]));
};

// Get native voices (preferred for pronunciation)
export const getNativeVoicesForLanguage = (language: string): SpeechSynthesisVoice[] => {
  const voices = getVoicesForLanguage(language);
  return voices.filter(voice => voice.localService);
};

// Play audio with enhanced pronunciation
export const playPronunciation = (
  text: string,
  language: string = 'en-US',
  options: AudioPlaybackOptions & { preferNative?: boolean } = {}
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech is not supported in this browser'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to use native voice if preferred
    if (options.preferNative) {
      const nativeVoices = getNativeVoicesForLanguage(language);
      if (nativeVoices.length > 0) {
        utterance.voice = nativeVoices[0];
      }
    }

    utterance.lang = language;
    utterance.rate = options.rate || 0.7; // Slower for pronunciation practice
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      reject(new Error(`Pronunciation playback error: ${event.error}`));
    };

    speechSynthesis.speak(utterance);
  });
};

// Play audio from URL
export const playAudioUrl = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Failed to load audio'));
    audio.oncanplaythrough = () => {
      audio.play().catch(reject);
    };
    
    audio.load();
  });
};

// Record audio from microphone
export const recordAudio = (durationMs: number = 5000): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      };

      mediaRecorder.onerror = (event) => {
        stream.getTracks().forEach(track => track.stop());
        reject(new Error('Recording failed'));
      };

      mediaRecorder.start();
      
      // Stop recording after specified duration
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, durationMs);

    } catch (error) {
      reject(new Error('Failed to access microphone'));
    }
  });
};

// Analyze audio for pronunciation feedback (simplified)
export const analyzePronounciation = (
  recordedBlob: Blob,
  targetText: string,
  language: string
): Promise<{ accuracy: number; feedback: string }> => {
  return new Promise((resolve) => {
    // This is a simplified implementation
    // In a real app, you would send the audio to a speech analysis service
    
    // Simulate pronunciation analysis
    setTimeout(() => {
      const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
      let feedback = '';
      
      if (accuracy >= 90) {
        feedback = 'Excellent pronunciation! 🎉';
      } else if (accuracy >= 80) {
        feedback = 'Good job! Minor improvements needed.';
      } else if (accuracy >= 70) {
        feedback = 'Keep practicing! Focus on vowel sounds.';
      } else {
        feedback = 'Try again. Listen to the native speaker carefully.';
      }
      
      resolve({ accuracy, feedback });
    }, 1000);
  });
};

// Language code mapping for audio
export const getAudioLanguageCode = (language: string): string => {
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

// Check if audio features are supported
export const isAudioSupported = (): {
  textToSpeech: boolean;
  microphone: boolean;
  audioPlayback: boolean;
} => {
  return {
    textToSpeech: 'speechSynthesis' in window,
    microphone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    audioPlayback: 'Audio' in window,
  };
};

// Preload voices (helps with initial TTS performance)
export const preloadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        // Some browsers load voices asynchronously
        setTimeout(loadVoices, 100);
      }
    };

    // Listen for voice changes (some browsers fire this event)
    speechSynthesis.onvoiceschanged = loadVoices;
    
    // Start loading
    loadVoices();
  });
};
