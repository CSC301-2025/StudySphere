
import React, { useState } from 'react';
import { Plus, Search, Bookmark, Book, CalendarClock, File, MoreHorizontal, Pencil, Trash, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCourses } from '@/context/CourseContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Course } from '@/context/CourseContext';
import { toast } from "sonner";

const Courses = () => {
  const { courses, addCourse, deleteCourse, updateCourse, isLoading, isError } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    instructor: '',
    code: '',
    schedule: '',
    color: '#6D28D9'
  });
  
  // Filter courses based on search query
  const filteredCourses = courses?.filter(
    course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle adding a new course
  const handleAddCourse = () => {
    addCourse(newCourse);
    setNewCourse({ name: '', description: '', instructor: '', code: '', schedule: '', color: '#6D28D9' });
    setIsAddCourseOpen(false);
  };

  // Handle editing a course
  const handleEditCourse = () => {
    if (selectedCourse) {
      updateCourse(selectedCourse);
      setSelectedCourse(null);
      setIsEditCourseOpen(false);
    }
  };

  // Handle deleting a course
  const handleDeleteCourse = (courseId: string) => {
    deleteCourse(courseId);
  };

  // Open edit dialog with selected course data
  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsEditCourseOpen(true);
  };

  // Function to get icon based on course type
  const getCourseIcon = (type: string = 'course') => {
    switch (type) {
      case 'course':
        return <Book className="h-5 w-5" />;
      case 'assignment':
        return <File className="h-5 w-5" />;
      case 'event':
        return <CalendarClock className="h-5 w-5" />;
      default:
        return <Bookmark className="h-5 w-5" />;
    }
  };

  // Handle course card click (separate from dropdown actions)
  const handleCourseCardClick = (courseId: string, event: React.MouseEvent) => {
    // Only navigate if click is not on the dropdown menu
    if (!(event.target as Element).closest('.course-actions')) {
      window.location.href = `/course/${courseId}`;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="page-container flex flex-col items-center justify-center h-[80vh]">
        <div className="text-destructive mb-4">Failed to load courses</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        
        <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course to organize your academic work.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Course Name</Label>
                <Input 
                  id="name" 
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  placeholder="Course title" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="code">Course Code</Label>
                <Input 
                  id="code" 
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  placeholder="e.g. CS101" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input 
                  id="instructor" 
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  placeholder="Professor name" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input 
                  id="schedule" 
                  value={newCourse.schedule}
                  onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                  placeholder="e.g. Mon/Wed 10:00 AM - 11:30 AM" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="What's this course about?" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="color" 
                    type="color" 
                    value={newCourse.color}
                    onChange={(e) => setNewCourse({ ...newCourse, color: e.target.value })}
                    className="w-16 h-10 p-1" 
                  />
                  <div className="text-sm text-muted-foreground">
                    Choose a color for this course
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddCourse}>Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Course Dialog */}
        <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update course information
              </DialogDescription>
            </DialogHeader>
            
            {selectedCourse && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Course Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedCourse.name}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-code">Course Code</Label>
                  <Input 
                    id="edit-code" 
                    value={selectedCourse.code}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, code: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-instructor">Instructor</Label>
                  <Input 
                    id="edit-instructor" 
                    value={selectedCourse.instructor}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, instructor: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-schedule">Schedule</Label>
                  <Input 
                    id="edit-schedule" 
                    value={selectedCourse.schedule}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, schedule: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    value={selectedCourse.description}
                    onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="edit-color" 
                      type="color" 
                      value={selectedCourse.color || '#6D28D9'}
                      onChange={(e) => setSelectedCourse({ ...selectedCourse, color: e.target.value })}
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
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by title or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Book className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery ? `No courses matched "${searchQuery}"` : "Create your first course to get started"}
          </p>
          <Button onClick={() => setIsAddCourseOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id} 
              className="card-hover h-full overflow-hidden border-l-4 cursor-pointer" 
              style={{ borderLeftColor: course.color || '#6D28D9' }}
              onClick={(e) => handleCourseCardClick(course.id, e)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full p-1" style={{ backgroundColor: `${course.color || '#6D28D9'}20` }}>
                      {getCourseIcon()}
                    </div>
                    <CardTitle className="line-clamp-1">{course.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="course-actions">
                      <Button variant="ghost" size="icon" className="h-8 w-8 course-actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="course-actions">
                      <DropdownMenuItem onClick={() => openEditDialog(course)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-1">{course.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <div>{course.code}</div>
                  <div className="ml-auto">
                    {course.schedule}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
