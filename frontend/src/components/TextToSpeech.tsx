import React, { useState } from "react";
import { useTextToSpeech } from "@/context/TextToSpeechContext";
import { useTTS } from "@/hooks/useTTS";
import TTSApiKeyDialog from "./TTSApiKeyDialog";
import TTSPlayButton from "./TTSPlayButton";

interface TextToSpeechProps {
  text: string;
  className?: string;
  tooltipText?: string;
  preventNavigation?: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  className = "",
  tooltipText = "Listen to text",
  preventNavigation = false,
}) => {
  const { ttsEnabled } = useTextToSpeech();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  
  const { 
    isPlaying, 
    isPaused, 
    isLoading, 
    handlePlayPause, 
    handleStop,
    handleTextToSpeech
  } = useTTS(text);

  // If TTS is disabled, don't render anything
  if (!ttsEnabled) return null;

  const handlePlayStop = async (e: React.MouseEvent) => {
    // Prevent navigation if preventNavigation prop is true
    if (preventNavigation) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // If already loading or playing, stop playback
    if (isLoading || isPlaying) {
      handleStop();
      return;
    }
    
    // Otherwise start new playback
    const success = await handleTextToSpeech();
    if (success === false) {
      setShowApiKeyDialog(true);
    }
  };

  const handleApiKeySaved = () => {
    // After API key is saved, try playing again
    handleTextToSpeech();
  };

  return (
    <>
      <TTSPlayButton
        isPlaying={isPlaying}
        isPaused={isPaused}
        isLoading={isLoading}
        tooltipText={tooltipText}
        className={className}
        onPlayStop={handlePlayStop}
      />

      <TTSApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onSave={handleApiKeySaved}
      />
    </>
  );
};

export default TextToSpeech;
