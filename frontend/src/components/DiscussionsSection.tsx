import React, { useState } from "react";
import { MessageCircle, Users, Clock, Send, Plus } from "lucide-react";
import { type Course } from "../context/CourseContext";

type DiscussionsSectionProps = {
  course: Course;
  addDiscussion: (discussion: { title: string; author: string; content: string }) => void;
  addReply: (discussionId: string, reply: { author: string; content: string }) => void;
};

const DiscussionsSection = ({ course, addDiscussion, addReply }: DiscussionsSectionProps) => {
  const [isAddingDiscussion, setIsAddingDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "", author: "You" });
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [expandedDiscussion, setExpandedDiscussion] = useState<string | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If the date is today, show only the time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    
    // If the date is yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    
    // Otherwise show the full date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  // Handle discussion form submission
  const handleSubmitDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDiscussion.title.trim() && newDiscussion.content.trim()) {
      addDiscussion(newDiscussion);
      setNewDiscussion({ title: "", content: "", author: "You" });
      setIsAddingDiscussion(false);
    }
  };

  // Handle reply form submission
  const handleSubmitReply = (e: React.FormEvent, discussionId: string) => {
    e.preventDefault();
    const content = replyContent[discussionId];
    if (content && content.trim()) {
      addReply(discussionId, { author: "You", content });
      setReplyContent({ ...replyContent, [discussionId]: "" });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Discussions header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Course Discussions</h3>
        <button
          onClick={() => setIsAddingDiscussion(true)}
          className="btn-outline flex items-center gap-1"
        >
          <Plus size={16} />
          <span>New Discussion</span>
        </button>
      </div>

      {/* New discussion form */}
      {isAddingDiscussion && (
        <div className="glass-card rounded-lg p-4 mb-6 animate-fadeIn">
          <h4 className="font-medium mb-3">Start a New Discussion</h4>
          <form onSubmit={handleSubmitDiscussion}>
            <div className="mb-3">
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                placeholder="Discussion title"
                className="w-full p-2 border border-border rounded-md bg-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                placeholder="What's your question or comment?"
                className="w-full p-2 border border-border rounded-md bg-secondary focus:outline-none focus:ring-1 focus:ring-primary h-32"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingDiscussion(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Post Discussion
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discussions list */}
      {course.discussions.length === 0 && !isAddingDiscussion ? (
        <div className="glass-card rounded-lg p-6 text-center">
          <MessageCircle size={32} className="mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium mb-2">No Discussions Yet</h4>
          <p className="text-muted-foreground mb-4">
            Start a discussion to ask questions or share thoughts with your classmates.
          </p>
          <button
            onClick={() => setIsAddingDiscussion(true)}
            className="btn-primary inline-flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Start a Discussion</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {course.discussions.map((discussion) => (
            <div key={discussion.id} className="glass-card rounded-lg p-4">
              {/* Discussion header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-sm font-medium">
                    {discussion.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{discussion.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>{discussion.author}</span>
                    <span>•</span>
                    <span>{formatDate(discussion.date)}</span>
                  </div>
                  <p className="text-sm">{discussion.content}</p>
                </div>
              </div>
              
              {/* Discussion meta info */}
              <div className="flex items-center justify-between border-t border-border/30 pt-3 mt-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <button 
                    onClick={() => setExpandedDiscussion(
                      expandedDiscussion === discussion.id ? null : discussion.id
                    )}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <MessageCircle size={14} />
                    <span>{discussion.replies.length} {discussion.replies.length === 1 ? "reply" : "replies"}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>3 participants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Last activity: Yesterday</span>
                  </div>
                </div>
                <button 
                  onClick={() => setExpandedDiscussion(
                    expandedDiscussion === discussion.id ? null : discussion.id
                  )}
                  className="text-xs text-primary hover:underline"
                >
                  {expandedDiscussion === discussion.id ? "Hide replies" : "Show replies"}
                </button>
              </div>
              
              {/* Replies */}
              {expandedDiscussion === discussion.id && (
                <div className="mt-4 pl-12 space-y-4 animate-fadeIn">
                  {discussion.replies.map((reply) => (
                    <div key={reply.id} className="border-l-2 border-border/50 pl-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-secondary-foreground text-xs font-medium">
                            {reply.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                            <span className="font-medium">{reply.author}</span>
                            <span>•</span>
                            <span>{formatDate(reply.date)}</span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Reply form */}
                  <form 
                    onSubmit={(e) => handleSubmitReply(e, discussion.id)}
                    className="flex items-center gap-3 mt-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-medium">Y</span>
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={replyContent[discussion.id] || ""}
                        onChange={(e) => setReplyContent({ 
                          ...replyContent, 
                          [discussion.id]: e.target.value 
                        })}
                        placeholder="Write a reply..."
                        className="w-full p-2 pr-10 border border-border rounded-full bg-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 transition-colors"
                        disabled={!replyContent[discussion.id]}
                      >
                        <Send size={16} className="text-primary" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionsSection;
