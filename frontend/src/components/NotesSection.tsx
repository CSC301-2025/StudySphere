
import React, { useState } from "react";
import { FileText, Download, Plus, X } from "lucide-react";
import { type Course } from "../context/CourseContext";

type NotesSectionProps = {
  course: Course;
  addNote: (note: { title: string; content: string; fileUrl?: string }) => void;
};

const NotesSection = ({ course, addNote }: NotesSectionProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle note form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title.trim() && newNote.content.trim()) {
      addNote(newNote);
      setNewNote({ title: "", content: "" });
      setIsAddingNote(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Notes list */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Lecture Notes</h3>
        <button
          onClick={() => setIsAddingNote(true)}
          className="btn-outline flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Add Note</span>
        </button>
      </div>

      {course.notes.length === 0 && !isAddingNote ? (
        <div className="glass-card rounded-lg p-6 text-center">
          <FileText size={32} className="mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium mb-2">No Notes Yet</h4>
          <p className="text-muted-foreground mb-4">
            Add your first note to keep track of important lecture information.
          </p>
          <button
            onClick={() => setIsAddingNote(true)}
            className="btn-primary inline-flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Add Note</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add note form */}
          {isAddingNote && (
            <div className="glass-card rounded-lg p-4 mb-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">New Note</h4>
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="p-1 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Close form"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title"
                    className="w-full p-2 border border-border rounded-md bg-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Note content..."
                    className="w-full p-2 border border-border rounded-md bg-secondary focus:outline-none focus:ring-1 focus:ring-primary h-32"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.notes.map((note) => (
              <div key={note.id} className="glass-card rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{note.title}</h4>
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
        <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            <div className="flex flex-col items-center">
              <FileText size={32} className="text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag and drop or click to upload</p>
              <p className="text-xs text-muted-foreground">PDF, Word documents (up to 10MB)</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
