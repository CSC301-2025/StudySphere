
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { type Course } from "../context/CourseContext";

type GradeSectionProps = {
  course: Course;
};

const GradeSection = ({ course }: GradeSectionProps) => {
  // Calculate overall grade percentage
  const calculateOverallGrade = () => {
    if (course.grades.length === 0) return 0;
    
    const totalWeightedScore = course.grades.reduce((acc, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      return acc + percentage * (grade.weight / 100);
    }, 0);
    
    const totalWeight = course.grades.reduce((acc, grade) => acc + grade.weight, 0);
    
    if (totalWeight === 0) return 0;
    
    return totalWeightedScore / (totalWeight / 100);
  };
  
  const overallGrade = calculateOverallGrade();
  
  // Data for pie chart
  const pieData = [
    { name: "Completed", value: overallGrade },
    { name: "Remaining", value: 100 - overallGrade },
  ];
  
  // Colors for pie chart
  const COLORS = ["#4f46e5", "#e5e7eb"];
  
  // Data for bar chart
  const barData = course.grades.map(grade => ({
    name: grade.title,
    percentage: (grade.score / grade.maxScore) * 100,
    weight: grade.weight,
  }));
  
  // Get letter grade based on percentage
  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {course.grades.length === 0 ? (
        <div className="glass-card rounded-lg p-6 text-center">
          <h4 className="text-lg font-medium mb-2">No Grades Available</h4>
          <p className="text-muted-foreground">
            Grades will appear here once they've been posted by the instructor.
          </p>
        </div>
      ) : (
        <>
          {/* Grade summary */}
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Grade Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall grade display */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <div className="relative h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">
                      {Math.round(overallGrade)}%
                    </p>
                    <p className="text-lg font-medium">
                      {getLetterGrade(overallGrade)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Overall Grade</p>
              </div>
              
              {/* Grade distribution by category */}
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-3">Grade Distribution</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        unit="%"
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]}
                        contentStyle={{
                          borderRadius: "0.5rem",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          padding: "8px 12px",
                          fontSize: "12px"
                        }}
                      />
                      <Bar 
                        dataKey="percentage" 
                        fill="#4f46e5"
                        barSize={24}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed grades table */}
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Detailed Grades</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Assessment</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Score</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Max</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Percentage</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Weight</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  {course.grades.map((grade) => {
                    const percentage = (grade.score / grade.maxScore) * 100;
                    const weightedPercentage = percentage * (grade.weight / 100);
                    
                    return (
                      <tr key={grade.id} className="border-b border-border/30">
                        <td className="py-3 text-sm font-medium">{grade.title}</td>
                        <td className="py-3 text-sm text-right">{grade.score}</td>
                        <td className="py-3 text-sm text-right">{grade.maxScore}</td>
                        <td className="py-3 text-sm text-right">{percentage.toFixed(1)}%</td>
                        <td className="py-3 text-sm text-right">{grade.weight}%</td>
                        <td className="py-3 text-sm text-right">{weightedPercentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-medium">
                    <td className="pt-4 text-sm">Total</td>
                    <td className="pt-4 text-sm text-right"></td>
                    <td className="pt-4 text-sm text-right"></td>
                    <td className="pt-4 text-sm text-right"></td>
                    <td className="pt-4 text-sm text-right">
                      {course.grades.reduce((acc, grade) => acc + grade.weight, 0)}%
                    </td>
                    <td className="pt-4 text-sm text-right">{overallGrade.toFixed(1)}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GradeSection;
