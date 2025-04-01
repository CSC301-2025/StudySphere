
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Sun, Moon, LogOut, User, Users, BellDot } from "lucide-react";
import SearchBar from "./SearchBar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useActivities } from "@/context/ActivityContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const { getRecentActivities } = useActivities();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Initialize isDarkMode from localStorage instead of the DOM
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme === "true";
  });
  
  // Check stored preferences on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    
    if (storedTheme === "true" && !document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (storedTheme === "false" && document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  // Load recent activities
  useEffect(() => {
    if (isAuthenticated) {
      const recentActivities = getRecentActivities(5);
      setNotifications(recentActivities);
    }
  }, [isAuthenticated, getRecentActivities]);
  
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
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  // Handle notification click
  const handleNotificationClick = () => {
    setHasUnreadNotifications(false);
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

  // Format time for notifications
  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "grade_posted":
        return "🎯";
      case "note_added":
        return "📝";
      case "assignment_added":
        return "📚";
      case "course_updated":
        return "🔄";
      case "login":
        return "🔐";
      default:
        return "🔔";
    }
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
            <Link to="/sections" className="nav-link">Courses</Link>
            <Link to="/calendar" className="nav-link">Calendar</Link>
            <Link to="/tutors" className="nav-link">Tutors</Link>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="icon-button relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" 
                    aria-label="Notifications"
                    onClick={handleNotificationClick}
                  >
                    {hasUnreadNotifications ? <BellDot size={20} /> : <Bell size={20} />}
                    {hasUnreadNotifications && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2 font-medium">Recent Activity</div>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-3">
                        <div className="flex w-full">
                          <span className="mr-2">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            {notification.courseName && (
                              <p className="text-xs text-muted-foreground">
                                {notification.courseName}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground ml-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="justify-center text-sm font-medium"
                    onClick={() => navigate("/")}
                  >
                    View all activity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
