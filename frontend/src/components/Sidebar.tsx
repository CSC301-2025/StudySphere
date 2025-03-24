
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Clock, 
  LayoutDashboard, 
  Settings, 
  X, 
  Folder,
  BookMarked,
  GraduationCap
} from "lucide-react";
import { useCourses } from "../context/CourseContext";

type SidebarProps = {
  isOpen: boolean;
  closeSidebar: () => void;
};

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const { courses } = useCourses();
  
  // Check if route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap size={20} className="text-primary" />
              <span className="font-semibold text-lg">StudyHub</span>
            </Link>
            <button 
              onClick={closeSidebar}
              className="p-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent lg:hidden transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 py-4 px-3 overflow-y-auto">
            <nav className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                  Main
                </h3>
                <div className="mt-2 space-y-1">
                  <Link 
                    to="/" 
                    className={`sidebar-link ${isActive("/") ? "active" : ""}`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/sections" 
                    className={`sidebar-link ${isActive("/sections") ? "active" : ""}`}
                  >
                    <BookOpen size={18} />
                    <span>Sections</span>
                  </Link>
                  <Link 
                    to="/assignments" 
                    className={`sidebar-link ${isActive("/assignments") ? "active" : ""}`}
                  >
                    <ClipboardList size={18} />
                    <span>Assignments</span>
                  </Link>
                  <Link 
                    to="/calendar" 
                    className={`sidebar-link ${isActive("/calendar") ? "active" : ""}`}
                  >
                    <Calendar size={18} />
                    <span>Calendar</span>
                  </Link>
                  <Link 
                    to="/notes" 
                    className={`sidebar-link ${isActive("/notes") ? "active" : ""}`}
                  >
                    <FileText size={18} />
                    <span>Notes</span>
                  </Link>
                </div>
              </div>
              
              {/* Current Courses */}
              <div>
                <h3 className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                  Current Courses
                </h3>
                <div className="mt-2 space-y-1">
                  {courses.slice(0, 4).map((course) => (
                    <Link 
                      key={course.id}
                      to={`/course/${course.id}`}
                      className={`sidebar-link ${location.pathname === `/course/${course.id}` ? "active" : ""}`}
                    >
                      <BookMarked size={18} />
                      <span className="truncate">{course.name}</span>
                    </Link>
                  ))}
                  {courses.length > 4 && (
                    <Link 
                      to="/sections"
                      className="sidebar-link text-sidebar-foreground/70"
                    >
                      <span className="text-xs pl-7">View all courses...</span>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Quick Access */}
              <div>
                <h3 className="px-3 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                  Quick Access
                </h3>
                <div className="mt-2 space-y-1">
                  <Link 
                    to="/upcoming"
                    className="sidebar-link"
                  >
                    <Clock size={18} />
                    <span>Upcoming Due</span>
                  </Link>
                  <Link 
                    to="/resources"
                    className="sidebar-link"
                  >
                    <Folder size={18} />
                    <span>Resources</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
          
          {/* Sidebar footer */}
          <div className="border-t border-sidebar-border p-3">
            <Link 
              to="/settings"
              className="sidebar-link"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
