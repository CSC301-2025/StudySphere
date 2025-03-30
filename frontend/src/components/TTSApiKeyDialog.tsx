
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveApiKey } from "@/utils/textToSpeech";
import { toast } from "sonner";

interface TTSApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  onSave: () => void;
}

const TTSApiKeyDialog: React.FC<TTSApiKeyDialogProps> = ({
  open,
  onOpenChange,
  apiKey,
  setApiKey,
  onSave,
}) => {
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    saveApiKey(apiKey);
    onOpenChange(false);
    toast.success("API key saved successfully");
    
    // Callback for parent component
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter ElevenLabs API Key</DialogTitle>
          <DialogDescription>
            To use text-to-speech functionality, you need to provide an API key from ElevenLabs.
            You can get one by signing up at{" "}
            <a
              href="https://elevenlabs.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              elevenlabs.io
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your ElevenLabs API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveApiKey}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TTSApiKeyDialog;
