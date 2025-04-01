
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/context/CourseContext";

interface EditCourseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onSave: () => void;
  onChange: (field: string, value: string) => void;
  nameError?: string | null;
}

const EditCourseDialog = ({ 
  isOpen, 
  onOpenChange, 
  course, 
  onSave, 
  onChange,
  nameError
}: EditCourseDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update course information
          </DialogDescription>
        </DialogHeader>
        
        {course && (
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="flex items-center">
                Course Name <span className="text-destructive ml-1">*</span>
              </Label>
              <Input 
                id="edit-name" 
                value={course.name}
                onChange={(e) => onChange("name", e.target.value)}
                className={nameError ? "border-destructive" : ""}
              />
              {nameError && <p className="text-sm text-destructive">{nameError}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Course Code</Label>
              <Input 
                id="edit-code" 
                value={course.code}
                onChange={(e) => onChange("code", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-instructor">Instructor</Label>
              <Input 
                id="edit-instructor" 
                value={course.instructor}
                onChange={(e) => onChange("instructor", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-schedule">Schedule</Label>
              <Input 
                id="edit-schedule" 
                value={course.schedule}
                onChange={(e) => onChange("schedule", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={course.description}
                onChange={(e) => onChange("description", e.target.value)}
                className="max-h-32"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="edit-color" 
                  type="color" 
                  value={course.color || '#6D28D9'}
                  onChange={(e) => onChange("color", e.target.value)}
                  className="w-16 h-10 p-1" 
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
