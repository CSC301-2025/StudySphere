
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Sun, Moon } from "lucide-react";
import SearchBar from "./SearchBar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = React.useState(
    document.documentElement.classList.contains('dark')
  );
  
  // Check for user's preferred color scheme on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && !document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      toast({
        title: "Dark mode enabled",
        description: "Your eyes will thank you later!",
        duration: 2000,
      });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
      toast({
        title: "Light mode enabled",
        description: "Bright and vibrant!",
        duration: 2000,
      });
    }
  };
  
  // Check if on courses page
  const isCoursesPage = location.pathname.includes("/course");
  
  // Don't show search bar on specific pages
  const hideSearchBar = location.pathname === "/" || isCoursesPage;
  
  // Handler for search bar
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search logic here
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
        </div>
        
        <div className="flex items-center gap-4">
          {!hideSearchBar && <SearchBar onSearch={handleSearch} placeholder="Search..." />}
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/sections" className="nav-link">Sections</Link>
            <Link to="/calendar" className="nav-link">Calendar</Link>
          </nav>
          
          <button 
            onClick={toggleDarkMode}
            className="icon-button relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className="icon-button relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" 
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
