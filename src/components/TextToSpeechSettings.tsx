
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getApiKey, saveApiKey, removeApiKey } from "@/utils/textToSpeech";
import { useTextToSpeech } from "@/context/TextToSpeechContext";

const TextToSpeechSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { ttsEnabled, toggleTTS } = useTextToSpeech();

  useEffect(() => {
    const storedKey = getApiKey();
    setHasKey(!!storedKey);
    if (storedKey) {
      // Mask the API key for security
      setApiKey("****************************************");
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey || apiKey === "****************************************") {
      toast.error("Please enter a valid API key");
      return;
    }

    saveApiKey(apiKey);
    setHasKey(true);
    setIsEditMode(false);
    toast.success("API key saved successfully");
    
    // Mask the API key for security
    setApiKey("****************************************");
  };

  const handleRemoveApiKey = () => {
    removeApiKey();
    setApiKey("");
    setHasKey(false);
    setIsEditMode(false);
    toast.success("API key removed successfully");
  };

  const handleEditClick = () => {
    setApiKey("");
    setIsEditMode(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text-to-Speech Settings</CardTitle>
        <CardDescription>
          Configure your ElevenLabs API key for text-to-speech functionality.
          You can get an API key by signing up at{" "}
          <a
            href="https://elevenlabs.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            elevenlabs.io
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center justify-between" role="region" aria-labelledby="tts-toggle-label">
            <div className="space-y-0.5">
              <Label htmlFor="tts-enabled" id="tts-toggle-label">Enable Text-to-Speech</Label>
              <p className="text-sm text-muted-foreground">
                Turn on to show text-to-speech buttons throughout the app.
                When disabled, all audio features will be hidden.
              </p>
            </div>
            <Switch
              id="tts-enabled"
              checked={ttsEnabled}
              onCheckedChange={toggleTTS}
              aria-describedby="tts-toggle-description"
            />
            <span id="tts-toggle-description" className="sr-only">
              {ttsEnabled ? "Text-to-speech is enabled" : "Text-to-speech is disabled"}
            </span>
          </div>
          
          {ttsEnabled && (
            <div className="grid grid-cols-4 items-center gap-4" role="region" aria-labelledby="api-key-label">
              <Label htmlFor="tts-api-key" id="api-key-label" className="text-right">
                API Key
              </Label>
              <div className="col-span-3">
                {hasKey && !isEditMode ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value="****************************************"
                      disabled
                      type="password"
                      aria-label="Masked API key"
                    />
                    <Button variant="outline" onClick={handleEditClick}>
                      Edit
                    </Button>
                  </div>
                ) : (
                  <Input
                    id="tts-api-key"
                    type="password"
                    placeholder="Enter your ElevenLabs API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    aria-required="true"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {ttsEnabled && (
        <CardFooter className="flex justify-between">
          {hasKey && (
            <Button variant="destructive" onClick={handleRemoveApiKey}>
              Remove API Key
            </Button>
          )}
          <div className="ml-auto">
            {isEditMode && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditMode(false);
                  if (hasKey) {
                    setApiKey("****************************************");
                  } else {
                    setApiKey("");
                  }
                }}
                className="mr-2"
              >
                Cancel
              </Button>
            )}
            {(isEditMode || !hasKey) && (
              <Button onClick={handleSaveApiKey}>Save API Key</Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TextToSpeechSettings;
