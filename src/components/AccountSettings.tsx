
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/types/auth";
import { UserRound, Mail, Phone } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema using Zod
const accountFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().regex(/^[0-9\-\+\s\(\)]{10,15}$/, "Invalid phone number format"),
  recoveryEmail: z.string().email("Invalid email format").optional().or(z.literal('')),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const AccountSettings: React.FC = () => {
  const { user, isLoading, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      recoveryEmail: user?.recoveryEmail || "",
    },
    mode: "onChange", // Validate on change for instant feedback
  });

  // Update form values when user data is loaded
  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        recoveryEmail: user.recoveryEmail || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: AccountFormValues) => {
    try {
      setIsSaving(true);
      // Call the updateUser method from AuthContext
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        recoveryEmail: data.recoveryEmail || undefined,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating account:", error);
      // Toast is already shown by the updateUser method in AuthContext
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Loading your account information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          View and update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <UserRound className="mr-2 h-4 w-4 opacity-70" />
                        <Input disabled={!isEditing} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <UserRound className="mr-2 h-4 w-4 opacity-70" />
                        <Input disabled={!isEditing} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 opacity-70" />
                        <Input disabled={!isEditing} {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your primary email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 opacity-70" />
                        <Input disabled={!isEditing} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recoveryEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recovery Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 opacity-70" />
                        <Input disabled={!isEditing} placeholder="Optional recovery email" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing ? (
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!form.formState.isValid || !form.formState.isDirty || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Information
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
