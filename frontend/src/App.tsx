import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { CourseProvider } from "./context/CourseContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TextToSpeechProvider } from "./context/TextToSpeechContext";
import { ActivityProvider } from "./context/ActivityContext";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Calendar from "./pages/Calendar";
import CourseDetails from "./pages/CourseDetails";
import Settings from "./pages/Settings";
import Tutors from "./pages/Tutors";
import Upcoming from "./pages/Upcoming";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" />;
};

const App = () => {
  // Check for dark mode preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CourseProvider>
          <ActivityProvider>
            <TextToSpeechProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Auth routes */}
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full overflow-hidden">
                            <AppSidebar />
                            <SidebarInset>
                              <Navbar />
                              <main className="flex-1 overflow-y-auto p-4">
                                <Index />
                              </main>
                            </SidebarInset>
                          </div>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/courses" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full overflow-hidden">
                            <AppSidebar />
                            <SidebarInset>
                              <Navbar />
                              <main className="flex-1 overflow-y-auto p-4">
                                <Courses />
                              </main>
                            </SidebarInset>
                          </div>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                    
                    {/* Redirect /sections to /courses */}
                    <Route path="/sections" element={<Navigate to="/courses" replace />} />
                    
                    <Route path="/calendar" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full overflow-hidden">
                            <AppSidebar />
                            <SidebarInset>
                              <Navbar />
                              <main className="flex-1 overflow-y-auto p-4">
                                <Calendar />
                              </main>
                            </SidebarInset>
                          </div>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/upcoming" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full overflow-hidden">
                            <AppSidebar />
                            <SidebarInset>
                              <Navbar />
                              <main className="flex-1 overflow-y-auto p-4">
                                <Upcoming />
                              </main>
                            </SidebarInset>
                          </div>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/tutors" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full overflow-hidden">
                            <AppSidebar />
                            <SidebarInset>
                              <Navbar />
                              <main className="flex-1 overflow-y-auto p-4">
                                <Tutors />
                              </main>
                            </SidebarInset>
                          </div>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full overflow-hidden">
                            <AppSidebar />
                            <SidebarInset>
                              <Navbar />
                              <main className="flex-1 overflow-y-auto p-4">
                                <Settings />
                              </main>
                            </SidebarInset>
                          </div>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/course/:courseId/*" element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <div className="flex min-h-screen w-full overflow-hidden">
                            <AppSidebar />
                            <SidebarInset>
                              <Navbar />
                              <main className="flex-1 overflow-y-auto p-4">
                                <CourseDetails />
                              </main>
                            </SidebarInset>
                          </div>
                        </SidebarProvider>
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </TextToSpeechProvider>
          </ActivityProvider>
        </CourseProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
