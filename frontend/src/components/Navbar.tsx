
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Sun, Moon, LogOut, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  
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
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };
  
  // Check if on courses page
  const isCoursesPage = location.pathname.includes("/course");
  
  // Don't show search bar on specific pages
  const hideSearchBar = location.pathname === "/" || isCoursesPage || !isAuthenticated;
  
  // Don't show navbar on auth pages
  if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
    return null;
  }
  
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
          
          {isAuthenticated ? (
            <>
              <button 
                className="icon-button relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" 
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline-block">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={() => navigate("/sign-in")} variant="outline" size="sm">
              <User size={16} className="mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
