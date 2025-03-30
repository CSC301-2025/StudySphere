
import { toast } from "sonner";

// Voice IDs from ElevenLabs
export const VOICES = {
  ARIA: "9BWtsMINqrJLrRacOk9x", // Friendly, professional female voice
  ROGER: "CwhRBWXzGAHq8TQ4Fs17", // Clear male voice
  SARAH: "EXAVITQu4vr4xnSDxMaL", // Natural female voice
};

export type TextToSpeechOptions = {
  text: string;
  voiceId?: string;
  apiKey?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  returnAudio?: boolean; // New option to return the audio element
  signal?: AbortSignal; // Add support for AbortSignal
};

// Check if the API key is stored in localStorage
export const getApiKey = (): string | null => {
  return localStorage.getItem("elevenLabsApiKey");
};

// Save API key to localStorage
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem("elevenLabsApiKey", apiKey);
};

// Remove API key from localStorage
export const removeApiKey = (): void => {
  localStorage.removeItem("elevenLabsApiKey");
};

// Convert text to speech using ElevenLabs API
export const textToSpeech = async ({
  text,
  voiceId = VOICES.ARIA,
  apiKey = getApiKey(),
  onStart,
  onEnd,
  onError,
  returnAudio = false,
  signal,
}: TextToSpeechOptions): Promise<HTMLAudioElement | undefined> => {
  if (!apiKey) {
    toast.error("API key is required for text-to-speech functionality");
    onError?.(new Error("API key is required"));
    return;
  }

  if (!text) {
    onError?.(new Error("Text is required"));
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2", // Use the faster model for quicker response
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
        signal, // Pass the abort signal to the fetch request
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to convert text to speech");
    }

    // Get the audio data as an ArrayBuffer
    const audioData = await response.arrayBuffer();
    
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    
    // Create a URL for the Blob
    const audioUrl = URL.createObjectURL(blob);
    
    // Create an Audio element and play it
    const audio = new Audio(audioUrl);
    
    // Add accessibility attributes
    audio.setAttribute('aria-live', 'assertive');
    
    // Call onStart before playing to update UI immediately
    onStart?.();
    
    // Clean up after playback
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      onEnd?.();
    };
    
    // Play the audio
    await audio.play();
    
    // Return the audio element if requested
    if (returnAudio) {
      return audio;
    }
  } catch (error) {
    // Don't show error toast for aborted requests
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error; // Re-throw abort errors to be handled by the caller
    }
    
    console.error("Error with text-to-speech:", error);
    toast.error("Failed to convert text to speech");
    onError?.(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
};
