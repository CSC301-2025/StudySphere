
import React, { useState, useEffect } from "react";
import { TutorFilter } from "@/types/tutors";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TutorFilterFormProps {
  filters: TutorFilter;
  onFilterChange: (filters: TutorFilter) => void;
  onClose?: () => void;
}

// Canadian Universities - matching the list in CreateTutorPostingForm
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

const TutorFilterForm: React.FC<TutorFilterFormProps> = ({ 
  filters, 
  onFilterChange,
  onClose 
}) => {
  const [localFilters, setLocalFilters] = useState<TutorFilter>(filters);
  const [courseInput, setCourseInput] = useState<string>("");
  const [courseList, setCourseList] = useState<string[]>(filters.courses || []);
  
  // Update local state when props change
  useEffect(() => {
    setLocalFilters(filters);
    setCourseList(filters.courses || []);
  }, [filters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters: TutorFilter = {
      ...localFilters,
      courses: courseList.length > 0 ? courseList : undefined
    };
    onFilterChange(updatedFilters);
    if (onClose) onClose();
  };

  const handleUniversityChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      university: value === "All Universities" ? undefined : value
    });
  };

  const handleLocationChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      location: value as "online" | "in-person" | "all"
    });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalFilters({
      ...localFilters,
      priceRange: {
        min: value[0],
        max: value[1] || 100
      }
    });
  };

  const addCourse = () => {
    if (courseInput.trim() && !courseList.includes(courseInput.trim())) {
      setCourseList([...courseList, courseInput.trim()]);
      setCourseInput("");
    }
  };

  const removeCourse = (course: string) => {
    setCourseList(courseList.filter(c => c !== course));
  };

  const clearAllFilters = () => {
    setLocalFilters({
      university: undefined,
      courses: undefined,
      location: "all",
      priceRange: { min: 0, max: 100 }
    });
    setCourseList([]);
    setCourseInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="university">University</Label>
        <Select 
          value={localFilters.university || "All Universities"} 
          onValueChange={handleUniversityChange}
        >
          <SelectTrigger id="university">
            <SelectValue placeholder="Select University" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Universities">All Universities</SelectItem>
            {CANADIAN_UNIVERSITIES.map((uni) => (
              <SelectItem key={uni} value={uni}>
                {uni}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Course</Label>
        <div className="flex space-x-2">
          <Input 
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            placeholder="Add a course"
          />
          <Button type="button" variant="outline" onClick={addCourse}>
            Add
          </Button>
        </div>
        
        {courseList.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {courseList.map(course => (
              <div key={course} className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                {course}
                <button 
                  type="button" 
                  className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                  onClick={() => removeCourse(course)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <RadioGroup 
          defaultValue={localFilters.location || "all"}
          onValueChange={handleLocationChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Locations</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-person" id="in-person" />
            <Label htmlFor="in-person">In Person</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Price Range (per hour)</Label>
          <span className="text-sm">
            ${localFilters.priceRange?.min || 0} - ${localFilters.priceRange?.max || 100}
          </span>
        </div>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[
            localFilters.priceRange?.min || 0, 
            localFilters.priceRange?.max || 100
          ]}
          onValueChange={handlePriceChange}
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={clearAllFilters}>
          Clear All
        </Button>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
};

export default TutorFilterForm;
