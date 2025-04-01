
import React, { createContext, useContext, useEffect, useState, useRef } from "react";

interface TextToSpeechContextType {
  ttsEnabled: boolean;
  toggleTTS: () => void;
  globalStopAudio: () => void;
  isAnyAudioPlaying: boolean;
  registerAudioElement: (audio: HTMLAudioElement) => void;
}

const TextToSpeechContext = createContext<TextToSpeechContextType | undefined>(undefined);

export const TextToSpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    // Check localStorage for saved preference
    const savedPreference = localStorage.getItem("tts-enabled");
    return savedPreference ? savedPreference === "true" : false; // Default to disabled
  });
  
  const [isAnyAudioPlaying, setIsAnyAudioPlaying] = useState(false);
  const activeAudioElements = useRef<HTMLAudioElement[]>([]);

  // Function to register active audio elements
  const registerAudioElement = (audio: HTMLAudioElement) => {
    activeAudioElements.current.push(audio);
    setIsAnyAudioPlaying(true);
    
    // Remove from registry once done
    audio.addEventListener('ended', () => {
      const index = activeAudioElements.current.indexOf(audio);
      if (index !== -1) {
        activeAudioElements.current.splice(index, 1);
      }
      setIsAnyAudioPlaying(activeAudioElements.current.length > 0);
    });
  };

  // Function to stop all active audio playback
  const globalStopAudio = () => {
    activeAudioElements.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    activeAudioElements.current = [];
    setIsAnyAudioPlaying(false);
  };

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("tts-enabled", ttsEnabled.toString());
    
    // If TTS is disabled, stop any playing audio
    if (!ttsEnabled) {
      globalStopAudio();
    }
  }, [ttsEnabled]);

  // Listen for keyboard shortcut to stop audio (Esc key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAnyAudioPlaying) {
        globalStopAudio();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnyAudioPlaying]);

  const toggleTTS = () => {
    setTtsEnabled(prev => !prev);
  };

  return (
    <TextToSpeechContext.Provider 
      value={{ 
        ttsEnabled, 
        toggleTTS, 
        globalStopAudio,
        isAnyAudioPlaying,
        registerAudioElement
      }}
    >
      {children}
    </TextToSpeechContext.Provider>
  );
};

export const useTextToSpeech = (): TextToSpeechContextType => {
  const context = useContext(TextToSpeechContext);
  if (context === undefined) {
    throw new Error("useTextToSpeech must be used within a TextToSpeechProvider");
  }
  return context;
};
