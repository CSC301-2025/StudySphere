import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Clock, 
  LayoutDashboard, 
  Settings, 
  BookMarked,
  GraduationCap,
  Users
} from "lucide-react";
import { useCourses } from "../context/CourseContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { courses } = useCourses();
  const { state } = useSidebar();
  
  // Check if route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarRail />
      
      {/* Sidebar header */}
      <SidebarHeader className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap size={20} className="text-primary" />
          <span className="font-semibold text-lg">StudyHub</span>
        </Link>
        <SidebarTrigger className="ml-auto lg:hidden" />
      </SidebarHeader>
      
      {/* Sidebar content */}
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/")}
                  tooltip="Dashboard"
                >
                  <Link to="/">
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/courses")}
                  tooltip="Courses"
                >
                  <Link to="/courses">
                    <BookOpen size={18} />
                    <span>Courses</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/calendar")}
                  tooltip="Calendar"
                >
                  <Link to="/calendar">
                    <Calendar size={18} />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/tutors")}
                  tooltip="Tutors"
                >
                  <Link to="/tutors">
                    <Users size={18} />
                    <span>Tutors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Current Courses */}
        <SidebarGroup>
          <SidebarGroupLabel>Current Courses</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {courses.slice(0, 4).map((course) => (
                <SidebarMenuItem key={course.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === `/course/${course.id}`}
                    tooltip={course.name}
                  >
                    <Link to={`/course/${course.id}`}>
                      <BookMarked size={18} />
                      <span className="truncate">{course.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {courses.length > 4 && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="View all courses"
                  >
                    <Link to="/courses" className="text-sidebar-foreground/70">
                      <span className="text-xs">View all courses...</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Access */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/upcoming")}
                  tooltip="Upcoming Due"
                >
                  <Link to="/upcoming">
                    <Clock size={18} />
                    <span>Upcoming Due</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Sidebar footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenuButton 
          asChild 
          isActive={isActive("/settings")}
          tooltip="Settings"
        >
          <Link to="/settings">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
