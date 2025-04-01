
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sun, Moon, Palette, CircleSlash } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";

// Define the available color themes
const colorThemes = [
  { id: "default", name: "Default Purple", class: "theme-default" },
  { id: "blue", name: "Ocean Blue", class: "theme-blue" },
  { id: "green", name: "Forest Green", class: "theme-green" },
  { id: "orange", name: "Sunset Orange", class: "theme-orange" },
];

const ThemeSettings: React.FC = () => {
  // Load the saved theme settings or use defaults
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("color-theme");
    return savedTheme || "default";
  });

  const [isGrayscale, setIsGrayscale] = useState(() => {
    return localStorage.getItem("grayscale-mode") === "true";
  });

  // Set initial dark mode state from localStorage instead of checking the DOM
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    // Default to light mode (false) if no preference is stored
    return storedTheme === "true";
  });

  // Apply theme settings when component mounts and when settings change
  useEffect(() => {
    // Remove any existing theme classes
    colorThemes.forEach(t => {
      document.documentElement.classList.remove(t.class);
    });

    // Add the selected theme class
    const selectedTheme = colorThemes.find(t => t.id === theme);
    if (selectedTheme) {
      document.documentElement.classList.add(selectedTheme.class);
    }

    // Save to localStorage
    localStorage.setItem("color-theme", theme);
    toast.success(`${selectedTheme?.name} theme applied`);
  }, [theme]);

  // Apply grayscale mode
  useEffect(() => {
    if (isGrayscale) {
      document.documentElement.classList.add("grayscale");
    } else {
      document.documentElement.classList.remove("grayscale");
    }

    // Save to localStorage
    localStorage.setItem("grayscale-mode", isGrayscale.toString());
    
    toast.success(isGrayscale ? "Grayscale mode enabled" : "Grayscale mode disabled");
  }, [isGrayscale]);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
      toast.success("Dark mode enabled");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
      toast.success("Light mode enabled");
    }
  };

  // Toggle grayscale mode
  const toggleGrayscale = (value: boolean) => {
    setIsGrayscale(value);
  };

  // Reset all theme settings to default
  const resetToDefaults = () => {
    // Remove all theme and grayscale classes
    colorThemes.forEach(t => {
      document.documentElement.classList.remove(t.class);
    });
    
    document.documentElement.classList.remove("grayscale");
    document.documentElement.classList.remove("dark");
    
    // Reset state
    setTheme("default");
    setIsGrayscale(false);
    setIsDarkMode(false);
    
    // Reset localStorage
    localStorage.removeItem("color-theme");
    localStorage.removeItem("grayscale-mode");
    localStorage.setItem("darkMode", "false");
    
    toast.success("Theme settings reset to defaults");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
        <CardDescription>
          Customize the appearance of the application
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Light/Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Appearance Mode</Label>
            <p className="text-sm text-muted-foreground">
              Choose between light and dark mode
            </p>
          </div>
          <ToggleGroup type="single" value={isDarkMode ? "dark" : "light"}>
            <ToggleGroupItem value="light" onClick={() => isDarkMode && toggleDarkMode()} aria-label="Light mode">
              <Sun className="h-4 w-4 mr-2" />
              Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" onClick={() => !isDarkMode && toggleDarkMode()} aria-label="Dark mode">
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Color Theme Selection */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="color-theme">Color Theme</Label>
            <p className="text-sm text-muted-foreground">
              Choose a color theme for the application
            </p>
          </div>
          
          <RadioGroup 
            id="color-theme" 
            value={theme} 
            onValueChange={setTheme}
            className="grid grid-cols-2 gap-4"
          >
            {colorThemes.map((colorTheme) => (
              <div 
                key={colorTheme.id}
                className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={colorTheme.id} id={`theme-${colorTheme.id}`} />
                <Label 
                  htmlFor={`theme-${colorTheme.id}`}
                  className="flex flex-1 items-center gap-2 cursor-pointer"
                >
                  <div className={`h-5 w-5 rounded-full bg-primary ring-1 ring-border theme-${colorTheme.id}-preview`}></div>
                  {colorTheme.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Grayscale Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="grayscale-toggle" className="flex items-center gap-2">
              <CircleSlash className="h-4 w-4" />
              Grayscale Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Display the application in black and white
            </p>
          </div>
          <Switch 
            id="grayscale-toggle"
            checked={isGrayscale}
            onCheckedChange={toggleGrayscale}
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" onClick={resetToDefaults} className="ml-auto">
          Reset to Defaults
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThemeSettings;
