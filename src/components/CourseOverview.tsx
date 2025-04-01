
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Course } from "@/context/CourseContext";

interface CourseOverviewProps {
  course: Course;
  onEditCourse: () => void;
}

const CourseOverview = ({ course, onEditCourse }: CourseOverviewProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Course Details</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEditCourse}
        >
          <Pencil size={16} className="mr-2" />
          Edit Course
        </Button>
      </div>

      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Course Description</h3>
        <p className="text-sm leading-relaxed">{course.description}</p>
      </div>
      
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Course Schedule</h3>
        <p className="text-sm mb-4"><span className="font-medium">Class Times:</span> {course.schedule}</p>
        <p className="text-sm"><span className="font-medium">Location:</span> Main Campus, Building A, Room 201</p>
      </div>
    </div>
  );
};

export default CourseOverview;
