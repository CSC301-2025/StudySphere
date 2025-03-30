
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { ChevronLeft, Pencil } from "lucide-react";
import { useCourses } from "../context/CourseContext";
import CourseHeader from "../components/CourseHeader";
import CourseTab from "../components/CourseTab";
import AssignmentList from "../components/AssignmentList";
import NotesSection from "../components/NotesSection";
import GradeSection from "../components/GradeSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Define tabs - discussions tab already removed
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "assignments", label: "Assignments" },
  { id: "notes", label: "Lecture Notes" },
  { id: "grades", label: "Grades" },
];

const CourseDetails = () => {
  const { courseId, tabId } = useParams<{ courseId: string; tabId: string }>();
  const navigate = useNavigate();
  const { getCourse, toggleAssignmentStatus, addNote, updateCourse } = useCourses();
  
  const course = getCourse(courseId || "");
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [editableCourse, setEditableCourse] = useState<typeof course | null>(null);
  
  // Set editable course when original course changes
  useEffect(() => {
    if (course) {
      setEditableCourse(course);
    }
  }, [course]);
  
  // Redirect to 404 if course not found
  useEffect(() => {
    if (!course && courseId) {
      navigate("/404", { replace: true });
    }
  }, [course, courseId, navigate]);
  
  if (!course) {
    return null;
  }

  // Handle editing a course
  const handleEditCourse = () => {
    if (editableCourse) {
      updateCourse(editableCourse);
      setIsEditCourseOpen(false);
      toast.success("Course updated successfully");
    }
  };

  // Course overview content
  const CourseOverview = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Course Details</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditCourseOpen(true)}
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

  return (
    <div className="page-container pb-16 animate-fadeIn">
      {/* Edit Course Dialog */}
      <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information
            </DialogDescription>
          </DialogHeader>
          
          {editableCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Course Name</Label>
                <Input 
                  id="edit-name" 
                  value={editableCourse.name}
                  onChange={(e) => setEditableCourse({ ...editableCourse, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-code">Course Code</Label>
                <Input 
                  id="edit-code" 
                  value={editableCourse.code}
                  onChange={(e) => setEditableCourse({ ...editableCourse, code: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-instructor">Instructor</Label>
                <Input 
                  id="edit-instructor" 
                  value={editableCourse.instructor}
                  onChange={(e) => setEditableCourse({ ...editableCourse, instructor: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-schedule">Schedule</Label>
                <Input 
                  id="edit-schedule" 
                  value={editableCourse.schedule}
                  onChange={(e) => setEditableCourse({ ...editableCourse, schedule: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={editableCourse.description}
                  onChange={(e) => setEditableCourse({ ...editableCourse, description: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="edit-color" 
                    type="color" 
                    value={editableCourse.color || '#6D28D9'}
                    onChange={(e) => setEditableCourse({ ...editableCourse, color: e.target.value })}
                    className="w-16 h-10 p-1" 
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCourseOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCourse}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to Courses</span>
      </button>
      
      {/* Course header */}
      <CourseHeader course={course} />
      
      {/* Tab navigation */}
      <CourseTab tabs={tabs} courseId={course.id} />
      
      {/* Tab content */}
      <Routes>
        <Route path="/" element={<Navigate to={`/course/${course.id}/overview`} replace />} />
        <Route path="/overview" element={<CourseOverview />} />
        <Route path="/assignments" element={
          <AssignmentList 
            course={course} 
            toggleStatus={toggleAssignmentStatus} 
          />
        } />
        <Route path="/notes" element={
          <NotesSection 
            course={course} 
            addNote={(note) => addNote(course.id, note)} 
          />
        } />
        <Route path="/grades" element={<GradeSection course={course} />} />
      </Routes>
    </div>
  );
};

export default CourseDetails;
