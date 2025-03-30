
import { useState, useRef, useEffect } from "react";
import { textToSpeech, getApiKey } from "@/utils/textToSpeech";
import { toast } from "sonner";
import { useTextToSpeech } from "@/context/TextToSpeechContext";

export function useTTS(text: string) {
  const { registerAudioElement } = useTextToSpeech();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestAbortController = useRef<AbortController | null>(null);

  const handleTextToSpeech = async () => {
    // If already loading, don't do anything
    if (isLoading) return;

    // Check if API key exists
    if (!getApiKey()) {
      // We'll handle this from the component
      return false;
    }

    // Start loading state immediately for better UX
    setIsLoading(true);
    
    // Create an abort controller for this request
    requestAbortController.current = new AbortController();
    
    try {
      const audio = await textToSpeech({
        text,
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
          setIsLoading(false);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          audioRef.current = null;
          requestAbortController.current = null;
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setIsLoading(false);
          audioRef.current = null;
          requestAbortController.current = null;
        },
        returnAudio: true,
        signal: requestAbortController.current.signal,
      });
      
      if (audio) {
        audioRef.current = audio;
        if (registerAudioElement) {
          registerAudioElement(audio);
        }
      }
      
      return true;
    } catch (error) {
      // Check if this was an abort error (user canceled) - don't show error
      if (error instanceof DOMException && error.name === 'AbortError') {
        setIsLoading(false);
        return true;
      }
      
      console.error("Error with text-to-speech:", error);
      setIsLoading(false);
      return false;
    }
  };

  const handlePlayPause = async () => {
    if (audioRef.current) {
      if (isPlaying && !isPaused) {
        // If already playing, stop it
        handleStop();
      } else if (isPlaying && isPaused) {
        // Resume playback
        audioRef.current.play();
        setIsPaused(false);
      } else {
        // Start new playback
        await handleTextToSpeech();
      }
    } else {
      // No audio element exists yet, start new playback
      await handleTextToSpeech();
    }
  };

  const handleStop = () => {
    // If still loading, abort the fetch request
    if (isLoading && requestAbortController.current) {
      requestAbortController.current.abort();
      requestAbortController.current = null;
      setIsLoading(false);
    }
    
    // If audio is playing, stop it
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    isLoading,
    handlePlayPause,
    handleStop,
    handleTextToSpeech
  };
}
