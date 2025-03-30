
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useActivities } from "@/context/ActivityContext";
import TextToSpeech from "@/components/TextToSpeech";

// Form validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isLoginBlocked, blockUntil, loginAttempts } = useAuth();
  const { addActivity } = useActivities();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Update time left for blocked login
  useEffect(() => {
    if (!isLoginBlocked || !blockUntil) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const diffMs = blockUntil.getTime() - now.getTime();
      
      if (diffMs <= 0) return "";
      
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      return `${diffMins}:${diffSecs.toString().padStart(2, '0')}`;
    };
    
    setTimeLeft(calculateTimeLeft());
    const intervalId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (!newTimeLeft) {
        clearInterval(intervalId);
        window.location.reload(); // Refresh to reset the form
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isLoginBlocked, blockUntil]);

  const onSubmit = async (data: FormData) => {
    if (isLoginBlocked) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      
      // Record login activity
      addActivity({
        type: "login",
        title: "Successful login",
        description: `User logged in with email ${data.email}`,
      });
      
      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate content for text-to-speech
  const speechContent = isLoginBlocked 
    ? "Sign In temporarily disabled due to too many failed attempts. Please try again later."
    : "Sign In. Enter your email and password to access your account. If you don't have an account, you can click on Sign Up to create a new account.";

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <TextToSpeech 
              text={speechContent} 
              tooltipText="Listen to page information"
            />
          </div>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginBlocked ? (
            <Alert variant="destructive" className="mb-4">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Account temporarily locked due to too many failed login attempts. 
                Please try again in {timeLeft}.
              </AlertDescription>
            </Alert>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loginAttempts > 0 ? (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed login attempts: {loginAttempts} of 5 allowed
              </AlertDescription>
            </Alert>
          ) : null}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        {...field} 
                        disabled={isLoginBlocked}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        disabled={isLoginBlocked}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isLoginBlocked}
              >
                {isLoginBlocked ? "Sign In Disabled" : isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
