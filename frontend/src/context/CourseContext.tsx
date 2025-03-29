
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define course types
type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isSubmitted: boolean;
  courseName: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
  dateAdded: string;
  fileUrl?: string;
};

type Grade = {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  weight: number;
};

export type Course = {
  id: string;
  name: string;
  instructor: string;
  description: string;
  code: string; 
  schedule: string;
  assignments: Assignment[];
  notes: Note[];
  grades: Grade[];
};

// Mock data for initial state
const mockCourses: Course[] = [
  {
    id: "c1",
    name: "Introduction to Computer Science",
    instructor: "Dr. Alex Johnson",
    description: "Fundamental principles of computer science and programming.",
    code: "CS101",
    schedule: "Mon/Wed 10:00 AM - 11:30 AM",
    assignments: [
      {
        id: "a1",
        title: "Algorithmic Problem Solving",
        description: "Solve five algorithmic problems using pseudocode.",
        dueDate: "2023-10-15T23:59:59",
        isSubmitted: false,
        courseName: "Introduction to Computer Science"
      },
      {
        id: "a2",
        title: "Programming Basics",
        description: "Create a simple program that demonstrates variables, loops, and conditionals.",
        dueDate: "2023-10-22T23:59:59",
        isSubmitted: true,
        courseName: "Introduction to Computer Science"
      }
    ],
    notes: [
      {
        id: "n1",
        title: "Lecture 1: Introduction",
        content: "Overview of computer science fundamentals...",
        dateAdded: "2023-09-05T10:30:00",
        fileUrl: "#"
      },
      {
        id: "n2",
        title: "Lecture 2: Variables and Data Types",
        content: "In-depth exploration of data types...",
        dateAdded: "2023-09-07T10:30:00",
        fileUrl: "#"
      }
    ],
    grades: [
      {
        id: "g1",
        title: "Quiz 1",
        score: 18,
        maxScore: 20,
        weight: 10
      },
      {
        id: "g2",
        title: "Midterm",
        score: 85,
        maxScore: 100,
        weight: 30
      }
    ]
  },
  {
    id: "c2",
    name: "Data Structures and Algorithms",
    instructor: "Prof. Maria Garcia",
    description: "Advanced data structures and algorithm design and analysis.",
    code: "CS202",
    schedule: "Tue/Thu 1:00 PM - 2:30 PM",
    assignments: [
      {
        id: "a3",
        title: "Linked List Implementation",
        description: "Implement a doubly linked list with various operations.",
        dueDate: "2023-10-18T23:59:59",
        isSubmitted: false,
        courseName: "Data Structures and Algorithms"
      }
    ],
    notes: [
      {
        id: "n3",
        title: "Lecture 1: Introduction to Data Structures",
        content: "Overview of fundamental data structures...",
        dateAdded: "2023-09-06T13:00:00",
        fileUrl: "#"
      }
    ],
    grades: [
      {
        id: "g3",
        title: "Assignment 1",
        score: 92,
        maxScore: 100,
        weight: 15
      }
    ]
  },
  {
    id: "c3",
    name: "Database Systems",
    instructor: "Dr. James Wilson",
    description: "Design and implementation of database management systems.",
    code: "CS305",
    schedule: "Mon/Wed/Fri 2:00 PM - 3:00 PM",
    assignments: [
      {
        id: "a4",
        title: "ER Diagram Design",
        description: "Create an ER diagram for a university database system.",
        dueDate: "2023-10-20T23:59:59",
        isSubmitted: false,
        courseName: "Database Systems"
      }
    ],
    notes: [
      {
        id: "n4",
        title: "Lecture 1: Relational Model",
        content: "Introduction to the relational data model...",
        dateAdded: "2023-09-04T14:00:00",
        fileUrl: "#"
      }
    ],
    grades: [
      {
        id: "g4",
        title: "Quiz 1",
        score: 15,
        maxScore: 15,
        weight: 5
      }
    ]
  },
  {
    id: "c4",
    name: "Web Development",
    instructor: "Prof. Sarah Lee",
    description: "Modern web development principles and frameworks.",
    code: "CS350",
    schedule: "Tue/Thu 10:00 AM - 11:30 AM",
    assignments: [
      {
        id: "a5",
        title: "Personal Portfolio Website",
        description: "Create a responsive personal portfolio using HTML, CSS, and JavaScript.",
        dueDate: "2023-10-25T23:59:59",
        isSubmitted: false,
        courseName: "Web Development"
      }
    ],
    notes: [],
    grades: []
  },
  {
    id: "c5",
    name: "Machine Learning",
    instructor: "Dr. Robert Chen",
    description: "Introduction to machine learning algorithms and applications.",
    code: "CS440",
    schedule: "Wed/Fri 3:30 PM - 5:00 PM",
    assignments: [],
    notes: [],
    grades: []
  },
  {
    id: "c6",
    name: "Computer Networks",
    instructor: "Prof. David Miller",
    description: "Fundamentals of computer networking and protocols.",
    code: "CS330",
    schedule: "Mon/Wed 1:00 PM - 2:30 PM",
    assignments: [],
    notes: [],
    grades: []
  }
];

// Context type
type CourseContextType = {
  courses: Course[];
  assignments: Assignment[];
  getCourse: (id: string) => Course | undefined;
  addAssignment: (courseId: string, assignment: Omit<Assignment, "id" | "courseName">) => void;
  updateAssignment: (assignment: Assignment) => void;
  toggleAssignmentStatus: (assignmentId: string) => void;
  addNote: (courseId: string, note: Omit<Note, "id" | "dateAdded">) => void;
};

// Create context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Context provider component
export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  // Calculate all assignments across courses
  const assignments = courses.flatMap(course => 
    course.assignments.map(assignment => ({
      ...assignment,
      courseName: course.name
    }))
  );

  // Get a specific course by ID
  const getCourse = (id: string) => {
    return courses.find(course => course.id === id);
  };

  // Add a new assignment to a course
  const addAssignment = (courseId: string, assignment: Omit<Assignment, "id" | "courseName">) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId
          ? {
              ...course,
              assignments: [
                ...course.assignments,
                {
                  ...assignment,
                  id: `a${Date.now()}`,
                  courseName: course.name
                }
              ]
            }
          : course
      )
    );
  };

  // Update an existing assignment
  const updateAssignment = (updatedAssignment: Assignment) => {
    setCourses(prevCourses => 
      prevCourses.map(course => ({
        ...course,
        assignments: course.assignments.map(assignment => 
          assignment.id === updatedAssignment.id
            ? updatedAssignment
            : assignment
        )
      }))
    );
  };

  // Toggle assignment submission status
  const toggleAssignmentStatus = (assignmentId: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => ({
        ...course,
        assignments: course.assignments.map(assignment => 
          assignment.id === assignmentId
            ? { ...assignment, isSubmitted: !assignment.isSubmitted }
            : assignment
        )
      }))
    );
  };

  // Add a new note to a course
  const addNote = (courseId: string, note: Omit<Note, "id" | "dateAdded">) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId
          ? {
              ...course,
              notes: [
                ...course.notes,
                {
                  ...note,
                  id: `n${Date.now()}`,
                  dateAdded: new Date().toISOString()
                }
              ]
            }
          : course
      )
    );
  };

  const value = {
    courses,
    assignments,
    getCourse,
    addAssignment,
    updateAssignment,
    toggleAssignmentStatus,
    addNote,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

// Custom hook to use the course context
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
