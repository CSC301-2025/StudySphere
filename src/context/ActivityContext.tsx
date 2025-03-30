
import React, { createContext, useContext, useState, ReactNode } from "react";

export type ActivityType = 
  | "note_added" 
  | "grade_posted" 
  | "assignment_added"
  | "course_updated"
  | "login";

export type Activity = {
  id: string;
  type: ActivityType;
  courseName?: string;
  courseId?: string;
  title: string;
  description: string;
  timestamp: string;
  link?: string;
};

type ActivityContextType = {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  getRecentActivities: (limit?: number) => Activity[];
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// Initial mock activities
const initialActivities: Activity[] = [
  {
    id: "act1",
    type: "note_added",
    courseName: "Introduction to Computer Science",
    courseId: "c1",
    title: "New lecture notes added",
    description: "Introduction to Computer Science",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    link: "/course/c1/notes"
  },
  {
    id: "act2",
    type: "grade_posted",
    courseName: "Data Structures and Algorithms",
    courseId: "c2",
    title: "Grade posted",
    description: "Data Structures and Algorithms",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    link: "/course/c2/grades"
  },
  {
    id: "act3",
    type: "course_updated",
    courseName: "Database Systems",
    courseId: "c3",
    title: "Course schedule updated",
    description: "Database Systems",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    link: "/course/c3"
  }
];

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const addActivity = (activityData: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setActivities(prevActivities => [newActivity, ...prevActivities]);
  };

  const getRecentActivities = (limit = 10) => {
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  };

  const value = {
    activities,
    addActivity,
    getRecentActivities
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
};
