import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TutorPosting } from "@/types/tutors";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Canadian Universities
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
const tutorPostingSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  location: z.enum(["online", "in-person", "both"], { 
    required_error: "Please select a location option" 
  }),
  pricePerHour: z.coerce.number().positive({ message: "Price must be a positive number" }),
  university: z.string().optional(),
});

type TutorPostingFormValues = z.infer<typeof tutorPostingSchema> & {
  courseInput?: string;
};

interface CreateTutorPostingFormProps {
  onSubmit: (data: Omit<TutorPosting, "id">) => Promise<void>;
}

const CreateTutorPostingForm: React.FC<CreateTutorPostingFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<string[]>([]);
  const [courseInput, setCourseInput] = useState("");
  const [courseError, setCourseError] = useState<string | null>(null);

  const form = useForm<TutorPostingFormValues>({
    resolver: zodResolver(tutorPostingSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "online",
      pricePerHour: 25,
      university: "",
      courseInput: "",
    },
  });

  const handleAddCourse = () => {
    if (courseInput.trim() && !courses.includes(courseInput.trim())) {
      setCourses([...courses, courseInput.trim()]);
      setCourseInput("");
      setCourseError(null);
    }
  };

  const handleRemoveCourse = (course: string) => {
    setCourses(courses.filter(c => c !== course));
  };

  const handleFormSubmit = async (values: TutorPostingFormValues) => {
    // Validate courses
    if (courses.length === 0) {
      setCourseError("Please add at least one course");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the posting data
      const postingData: Omit<TutorPosting, "id"> = {
        tutorId: user?.id || "guest-user",
        title: values.title,
        description: values.description,
        location: values.location,
        pricePerHour: values.pricePerHour,
        coursesTaught: courses,
        contactEmail: user?.email || "contact@example.com",
        university: values.university || undefined,
      };
      
      console.log("Submitting form data:", postingData);
      await onSubmit(postingData);
      
      // Reset form state
      form.reset();
      setCourses([]);
      setCourseError(null);
      
      toast({
        title: "Success",
        description: "Your tutor posting has been created successfully",
      });
    } catch (error) {
      console.error("Error creating tutor posting:", error);
      toast({
        title: "Error",
        description: "Failed to create tutor posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Experienced Math Tutor" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive title for your tutoring service.
              </FormDescription>
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
            <FormLabel>Courses Taught</FormLabel>
            <div className="flex space-x-2">
              <Input
                placeholder="E.g., Calculus I"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCourse();
                  }
                }}
              />
              <Button type="button" onClick={handleAddCourse} variant="outline">
                Add
              </Button>
            </div>
            {courseError && (
              <p className="text-sm font-medium text-destructive mt-1">
                {courseError}
              </p>
            )}
            <FormDescription>
              Add the courses you can teach. Press Enter or click Add after typing each course.
            </FormDescription>
          </FormItem>

          {courses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {courses.map((course) => (
                <div
                  key={course}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                >
                  {course}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                    onClick={() => handleRemoveCourse(course)}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your tutoring experience, teaching style, and expertise..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about your teaching experience and approach.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tutoring Location</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <FormLabel htmlFor="online" className="font-normal">
                      Online
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <FormLabel htmlFor="in-person" className="font-normal">
                      In Person
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <FormLabel htmlFor="both" className="font-normal">
                      Both Online & In Person
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricePerHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Hour ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Set your hourly rate in USD.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Tutor Posting"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateTutorPostingForm;
