
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { CourseProvider } from "./context/CourseContext";
import Index from "./pages/Index";
import Sections from "./pages/Sections";
import Calendar from "./pages/Calendar";
import CourseDetails from "./pages/CourseDetails";
import NotFound from "./pages/NotFound";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => {
  // Check for dark mode preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CourseProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <SidebarProvider>
              <div className="flex min-h-screen w-full overflow-hidden">
                <AppSidebar />
                <SidebarInset>
                  <Navbar />
                  <main className="flex-1 overflow-y-auto p-4">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/sections" element={<Sections />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/course/:courseId/*" element={<CourseDetails />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </CourseProvider>
    </QueryClientProvider>
  );
};

export default App;
