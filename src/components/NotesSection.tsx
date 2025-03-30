
import React, { useState, useRef } from "react";
import { FileText, Download, Plus, X, Pencil, Trash, Upload } from "lucide-react";
import { type Course, type Note } from "../context/CourseContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCourses } from "../context/CourseContext";
import { MoreHorizontal } from "lucide-react";

type NotesSectionProps = {
  course: Course;
  addNote: (note: { title: string; content: string; fileUrl?: string }) => void;
};

const NotesSection = ({ course, addNote }: NotesSectionProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateNote, deleteNote } = useCourses();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle note form submission with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!newNote.content.trim()) {
      toast.error("Content is required");
      return;
    }

    // Create file URL if file is uploaded
    let fileUrl: string | undefined = undefined;
    
    if (uploadedFile) {
      // In a real application, we would upload the file to a server or storage service
      // For this demo, we'll create a local URL
      fileUrl = URL.createObjectURL(uploadedFile);
    }

    // Add the note with file URL if available
    addNote({
      title: newNote.title,
      content: newNote.content,
      fileUrl
    });
    
    // Reset form
    setNewNote({ title: "", content: "" });
    setUploadedFile(null);
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };

  // Handle editing a note with validation
  const handleEditNote = () => {
    if (selectedNote) {
      if (!selectedNote.title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!selectedNote.content.trim()) {
        toast.error("Content is required");
        return;
      }
      updateNote(course.id, selectedNote);
      setSelectedNote(null);
      setIsEditNoteOpen(false);
      toast.success("Note updated successfully");
    }
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId: string) => {
    deleteNote(course.id, noteId);
    toast.success("Note deleted successfully");
  };

  // Open edit dialog with selected note data
  const openEditDialog = (note: Note) => {
    setSelectedNote(note);
    setIsEditNoteOpen(true);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and Word documents are allowed");
        return;
      }
      
      setUploadedFile(file);
      toast.success(`File "${file.name}" selected`);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and Word documents are allowed");
        return;
      }
      
      setUploadedFile(file);
      toast.success(`File "${file.name}" selected`);
    }
  };

  // Clear uploaded file
  const clearUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Notes list */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Lecture Notes</h3>
        <Button onClick={() => setIsAddingNote(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {course.notes.length === 0 && !isAddingNote ? (
        <div className="glass-card rounded-lg p-6 text-center">
          <FileText size={32} className="mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium mb-2">No Notes Yet</h4>
          <p className="text-muted-foreground mb-4">
            Add your first note to keep track of important lecture information.
          </p>
          <Button onClick={() => setIsAddingNote(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add note form */}
          {isAddingNote && (
            <div className="glass-card rounded-lg p-4 mb-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">New Note</h4>
                <Button
                  onClick={() => setIsAddingNote(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X size={16} />
                </Button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    placeholder="Note title"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="mb-3">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                    placeholder="Note content..."
                    className="mt-1 h-32"
                    required
                  />
                </div>
                
                {/* File upload section */}
                <div className="mb-3">
                  <Label>Attachment (Optional)</Label>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                  />
                  
                  {!uploadedFile ? (
                    <label 
                      htmlFor="file-upload" 
                      className="cursor-pointer block border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors mt-1"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center">
                        <Upload size={24} className="text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, Word documents (up to 10MB)
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between border rounded-lg p-3 mt-1">
                      <div className="flex items-center">
                        <FileText size={18} className="text-primary mr-2" />
                        <div className="text-sm truncate max-w-[200px]">{uploadedFile.name}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearUploadedFile}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingNote(false);
                      setUploadedFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Save Note"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Note Dialog */}
          <Dialog open={isEditNoteOpen} onOpenChange={setIsEditNoteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogDescription>Update note information</DialogDescription>
              </DialogHeader>
              {selectedNote && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={selectedNote.title}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea
                      id="edit-content"
                      value={selectedNote.content}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          content: e.target.value,
                        })
                      }
                      className="h-32"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditNoteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditNote}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Notes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.notes.map((note) => (
              <div key={note.id} className="glass-card rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{note.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(note)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Added on {formatDate(note.dateAdded)}
                    </p>
                    <p className="text-sm mb-3 line-clamp-3">{note.content}</p>
                    {note.fileUrl && (
                      <a
                        href={note.fileUrl}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                        download
                      >
                        <Download size={14} />
                        <span>Download attachment</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload notes section */}
      <div className="glass-card rounded-lg p-6 text-center mt-8">
        <h4 className="font-medium mb-3">Upload Lecture Materials</h4>
        <input
          type="file"
          id="lecture-upload"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx"
        />
        <label 
          htmlFor="lecture-upload" 
          className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer block"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <FileText size={32} className="text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, Word documents (up to 10MB)
            </p>
            {uploadedFile && !isAddingNote && (
              <div className="mt-4 text-left w-full">
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center">
                    <FileText size={18} className="text-primary mr-2" />
                    <div className="text-sm truncate max-w-[200px]">{uploadedFile.name}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearUploadedFile}
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setIsAddingNote(true);
                      setNewNote({
                        title: uploadedFile.name.split('.').slice(0, -1).join('.'),
                        content: "Notes from uploaded document"
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add as Note
                  </Button>
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default NotesSection;
