
import React from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TTSPlayButtonProps {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  tooltipText: string;
  className?: string;
  onPlayStop: (e: React.MouseEvent) => void;
}

const TTSPlayButton: React.FC<TTSPlayButtonProps> = ({
  isPlaying,
  isPaused,
  isLoading,
  tooltipText,
  className = "",
  onPlayStop,
}) => {
  const getTooltipText = () => {
    if (isPlaying || isLoading) {
      return "Stop audio";
    }
    return tooltipText;
  };

  const getAriaLabel = () => {
    if (isPlaying || isLoading) {
      return "Stop audio";
    }
    return tooltipText;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={className}
            onClick={onPlayStop}
            aria-label={getAriaLabel()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TTSPlayButton;
