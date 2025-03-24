
import React, { useState } from 'react';
import { Plus, Search, Bookmark, Book, CalendarClock, File, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCourses } from '@/context/CourseContext';

// Ensure all properties match what's expected in CourseContext
interface SectionType {
  id: string;
  title: string;
  description: string;
  instructor: string;
  type: string;
  color: string;
  createdAt: string;
}

const Sections = () => {
  const { courses, createCourse } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSection, setNewSection] = useState<Omit<SectionType, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    instructor: '',
    type: 'course',
    color: '#6D28D9'
  });
  
  // Filter sections based on search query
  const filteredSections = courses.filter(
    section => 
      (section as any).title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (section as any).instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new section
  const handleAddSection = () => {
    const section = {
      ...newSection,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    createCourse(section as any);
    setNewSection({ title: '', description: '', instructor: '', type: 'course', color: '#6D28D9' });
    setIsAddSectionOpen(false);
  };

  // Function to get icon based on section type
  const getSectionIcon = (type: string) => {
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

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
        
        <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
              <DialogDescription>
                Create a new section, course, or study area.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="Section title" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="instructor">Instructor or Category</Label>
                <Input 
                  id="instructor" 
                  value={newSection.instructor}
                  onChange={(e) => setNewSection({ ...newSection, instructor: e.target.value })}
                  placeholder="Professor name or category" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  placeholder="What's this section about?" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newSection.type}
                  onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="course">Course</option>
                  <option value="assignment">Assignment Group</option>
                  <option value="event">Event Collection</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="color" 
                    type="color" 
                    value={newSection.color}
                    onChange={(e) => setNewSection({ ...newSection, color: e.target.value })}
                    className="w-16 h-10 p-1" 
                  />
                  <div className="text-sm text-muted-foreground">
                    Choose a color for this section
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddSection}>Create Section</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections by title or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {filteredSections.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Book className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No sections found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery ? `No sections matched "${searchQuery}"` : "Create your first section to get started"}
          </p>
          <Button onClick={() => setIsAddSectionOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSections.map((section) => (
            <Link 
              key={section.id} 
              to={`/course/${section.id}`}
              className="block"
            >
              <Card className="card-hover h-full overflow-hidden border-l-4" style={{ borderLeftColor: (section as any).color }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full p-1" style={{ backgroundColor: `${(section as any).color}20` }}>
                        {getSectionIcon((section as any).type)}
                      </div>
                      <CardTitle className="line-clamp-1">{(section as any).title}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-1">{(section as any).instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {(section as any).description || "No description provided"}
                  </p>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className="capitalize">{(section as any).type}</div>
                    <div className="ml-auto">
                      {new Date((section as any).createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sections;
