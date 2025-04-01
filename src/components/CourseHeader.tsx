
import React, { useState } from "react";
import { Clock, Calendar, Users } from "lucide-react";
import { Course } from "../context/CourseContext";
import TextToSpeech from "./TextToSpeech";
import AddReminderDialog from "./AddReminderDialog";

type CourseHeaderProps = {
  course: Course;
};

const CourseHeader = ({ course }: CourseHeaderProps) => {
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  
  // Count upcoming assignments
  const upcomingAssignments = course.assignments.filter(
    (assignment) => !assignment.submitted && new Date(assignment.dueDate) > new Date()
  );

  // Calculate overall grade if there are any grades
  const calculateOverallGrade = () => {
    if (course.grades.length === 0) return null;
    
    const totalWeightedScore = course.grades.reduce((acc, grade) => {
      const percentage = grade.percentage
      return acc + percentage * (grade.weight / 100);
    }, 0);
    
    const totalWeight = course.grades.reduce((acc, grade) => acc + grade.weight, 0);
    
    if (totalWeight === 0) return null;
    
    return totalWeightedScore / (totalWeight / 100);
  };
  
  const overallGrade = calculateOverallGrade();
  
  // Get letter grade based on percentage
  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Generate content for text-to-speech
  const speechContent = `Course: ${course.name}. ${course.description}. Instructor: ${course.instructor}. Schedule: ${course.schedule}. ${upcomingAssignments.length > 0 ? `You have ${upcomingAssignments.length} upcoming ${upcomingAssignments.length === 1 ? 'assignment' : 'assignments'}.` : 'No upcoming assignments.'} ${overallGrade !== null ? `Your current grade is ${overallGrade.toFixed(1)} percent, which is a ${getLetterGrade(overallGrade)}.` : ''}`;

  return (
    <div className="glass-card rounded-xl p-6 mb-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {course.code}
            </span>
            {overallGrade !== null && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                Grade: {overallGrade.toFixed(1)}% ({getLetterGrade(overallGrade)})
              </span>
            )}
            <TextToSpeech 
              text={speechContent} 
              tooltipText="Listen to course details"
            />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.name}</h1>
          <p className="text-lg text-muted-foreground mb-4">{course.instructor}</p>
          
          <p className="text-sm md:text-base mb-6">{course.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-primary" />
              <span>{course.schedule}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-primary" />
              <span>
                {upcomingAssignments.length} upcoming {upcomingAssignments.length === 1 ? "assignment" : "assignments"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
          <button 
            className="btn-primary"
            onClick={() => setIsReminderOpen(true)}
          >
            Add Reminder
          </button>
        </div>
      </div>
      
      <AddReminderDialog 
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        course={course}
      />
    </div>
  );
};

export default CourseHeader;
