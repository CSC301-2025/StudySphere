
import React from "react";
import TextToSpeechSettings from "@/components/TextToSpeechSettings";
import AccountSettings from "@/components/AccountSettings";
import ThemeSettings from "@/components/ThemeSettings";
import { Palette, User, Headphones } from "lucide-react";

const Settings = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Account</h2>
          </div>
          <AccountSettings />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <ThemeSettings />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Headphones className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Text-to-Speech</h2>
          </div>
          <TextToSpeechSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
