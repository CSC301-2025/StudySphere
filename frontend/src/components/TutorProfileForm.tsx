
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TutorProfile } from "@/types/tutors";
import { useAuth } from "@/context/AuthContext";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

// Canadian Universities - same list as in CreateTutorPostingForm
const CANADIAN_UNIVERSITIES = [
  "University of Toronto",
  "University of British Columbia",
  "McGill University",
  "University of Waterloo",
  "University of Alberta",
  "Queen's University",
  "Western University",
  "McMaster University",
  "University of Calgary",
  "University of Ottawa",
  "York University",
  "Université de Montréal",
  "Simon Fraser University",
  "Dalhousie University",
  "University of Victoria"
];

// Form validation schema
const tutorProfileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  university: z.string().optional(),
  bio: z.string().min(30, { message: "Bio must be at least 30 characters" })
});

type TutorProfileFormValues = z.infer<typeof tutorProfileSchema> & {
  expertiseInput?: string;
};

interface TutorProfileFormProps {
  onSubmit: (data: Omit<TutorProfile, "id" | "createdAt">) => Promise<void>;
  isUpdate?: boolean;
  initialData?: Partial<TutorProfile>;
}

const TutorProfileForm: React.FC<TutorProfileFormProps> = ({ 
  onSubmit, 
  isUpdate = false, 
  initialData = {} 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expertise, setExpertise] = useState<string[]>(initialData?.expertise || []);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [expertiseError, setExpertiseError] = useState<string | null>(null);

  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      firstName: initialData?.firstName || user?.firstName || "",
      lastName: initialData?.lastName || user?.lastName || "",
      email: initialData?.email || user?.email || "",
      university: initialData?.university || "",
      bio: initialData?.bio || "",
      expertiseInput: "",
    },
  });

  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !expertise.includes(expertiseInput.trim())) {
      setExpertise([...expertise, expertiseInput.trim()]);
      setExpertiseInput("");
      setExpertiseError(null);
    }
  };

  const handleRemoveExpertise = (item: string) => {
    setExpertise(expertise.filter(e => e !== item));
  };

  const handleFormSubmit = async (values: TutorProfileFormValues) => {
    // Validate expertise
    if (expertise.length === 0) {
      setExpertiseError("Please add at least one area of expertise");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the profile data
      const profileData: Omit<TutorProfile, "id" | "createdAt"> = {
        userId: user?.id || "guest-user",
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        university: values.university,
        bio: values.bio,
        expertise: expertise,
      };
      
      await onSubmit(profileData);
    } catch (error) {
      console.error("Error submitting tutor profile:", error);
      setExpertiseError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select university (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CANADIAN_UNIVERSITIES.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The university you're affiliated with.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormItem>
            <FormLabel>Areas of Expertise</FormLabel>
            <div className="flex space-x-2">
              <Input
                placeholder="E.g., Mathematics"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddExpertise();
                  }
                }}
              />
              <Button type="button" onClick={handleAddExpertise} variant="outline">
                Add
              </Button>
            </div>
            {expertiseError && (
              <p className="text-sm font-medium text-destructive mt-1">
                {expertiseError}
              </p>
            )}
            <FormDescription>
              Add your areas of academic expertise. Press Enter or click Add after typing each one.
            </FormDescription>
          </FormItem>

          {expertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {expertise.map((item) => (
                <div
                  key={item}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                >
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                    onClick={() => handleRemoveExpertise(item)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your academic background, teaching experience, and tutoring philosophy..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your background and approach to tutoring.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting 
            ? (isUpdate ? "Updating..." : "Creating...") 
            : (isUpdate ? "Update Profile" : "Create Tutor Profile")}
        </Button>
      </form>
    </Form>
  );
};

export default TutorProfileForm;
