import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { type Course } from "../context/CourseContext";
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
import { Plus, Pencil, Trash, MoreHorizontal } from "lucide-react";
import { useCourses } from "../context/CourseContext";
import GradeCalculator from "./GradeCalculator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type GradeSectionProps = {
  course: Course;
};

type GradeData = {
  title: string;
  percentage: number;
  weight: number;
};

const GradeSection = ({ course }: GradeSectionProps) => {
  const { addGrade, deleteGrade, updateGrade } = useCourses();
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [isEditGradeOpen, setIsEditGradeOpen] = useState(false);

  const [newGrade, setNewGrade] = useState<GradeData>({
    title: "",
    percentage: 0,
    weight: 10,
  });

  const [selectedGrade, setSelectedGrade] = useState<
    GradeData & { id: string } | null
  >(null);

  // Calculate overall grade using weighted average of percentages
  const calculateOverallGrade = () => {
    if (course.grades.length === 0) return 0;
    const totalWeightedScore = course.grades.reduce((acc, grade) => {
      return acc + grade.percentage * (grade.weight / 100);
    }, 0);
    const totalWeight = course.grades.reduce(
      (acc, grade) => acc + grade.weight,
      0
    );
    if (totalWeight === 0) return 0;
    return totalWeightedScore / (totalWeight / 100);
  };

  const overallGrade = calculateOverallGrade();

  // Data for pie chart
  const pieData = [
    { name: "Completed", value: overallGrade },
    { name: "Remaining", value: 100 - overallGrade },
  ];
  const COLORS = ["#4f46e5", "#e5e7eb"];

  // Data for bar chart
  const barData = course.grades.map((grade) => ({
    name: grade.title,
    percentage: grade.percentage,
    weight: grade.weight,
  }));

  // Get letter grade from percentage
  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Validation for grade data
  const validateGrade = (grade: GradeData): boolean => {
    if (!grade.title.trim()) {
      toast.error("Assessment title is required");
      return false;
    }
    if (grade.percentage < 0 || grade.percentage > 100) {
      toast.error("Percentage must be between 0 and 100");
      return false;
    }
    if (grade.weight < 0 || grade.weight > 100) {
      toast.error("Weight must be between 0 and 100");
      return false;
    }
    return true;
  };

  // Handle adding a new grade
  const handleAddGrade = () => {
    if (!validateGrade(newGrade)) return;
    addGrade(course.id, newGrade);
    setNewGrade({ title: "", percentage: 0, weight: 10 });
    setIsAddGradeOpen(false);
    toast.success("Grade added successfully");
  };

  // Handle editing a grade
  const handleEditGrade = () => {
    if (selectedGrade && validateGrade(selectedGrade)) {
      updateGrade(course.id, selectedGrade);
      setSelectedGrade(null);
      setIsEditGradeOpen(false);
      toast.success("Grade updated successfully");
    }
  };

  // Handle deleting a grade
  const handleDeleteGrade = (gradeId: string) => {
    deleteGrade(course.id, gradeId);
    toast.success("Grade deleted successfully");
  };

  // Open edit dialog with selected grade data
  const openEditDialog = (grade: GradeData & { id: string }) => {
    setSelectedGrade(grade);
    setIsEditGradeOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Grade Summary</h3>
        <div className="flex gap-2">
          <GradeCalculator course={course} />
        </div>
      </div>

      {/* Add Grade Dialog */}
      <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Grade</DialogTitle>
            <DialogDescription>Add new grade information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-title">Assessment Title</Label>
              <Input
                id="add-title"
                value={newGrade.title}
                onChange={(e) =>
                  setNewGrade({ ...newGrade, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-percentage">Percentage</Label>
              <Input
                id="add-percentage"
                type="number"
                min="0"
                max="100"
                value={newGrade.percentage.toString()}
                onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    percentage: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-weight">Weight Percentage</Label>
              <Input
                id="add-weight"
                type="number"
                min="0"
                max="100"
                value={newGrade.weight.toString()}
                onChange={(e) =>
                  setNewGrade({ ...newGrade, weight: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGrade}>Add Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Grade Dialog */}
      <Dialog open={isEditGradeOpen} onOpenChange={setIsEditGradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Grade</DialogTitle>
            <DialogDescription>Update grade information</DialogDescription>
          </DialogHeader>
          {selectedGrade && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Assessment Title</Label>
                <Input
                  id="edit-title"
                  value={selectedGrade.title}
                  onChange={(e) =>
                    setSelectedGrade({
                      ...selectedGrade,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-percentage">Percentage</Label>
                <Input
                  id="edit-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={selectedGrade.percentage.toString()}
                  onChange={(e) =>
                    setSelectedGrade({
                      ...selectedGrade,
                      percentage: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-weight">Weight Percentage</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  min="0"
                  max="100"
                  value={selectedGrade.weight.toString()}
                  onChange={(e) =>
                    setSelectedGrade({
                      ...selectedGrade,
                      weight: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGradeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditGrade}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {course.grades.length === 0 ? (
        <div className="glass-card rounded-lg p-6 text-center">
          <h4 className="text-lg font-medium mb-2">No Grades Available</h4>
          <p className="text-muted-foreground mb-4">
            Add your grades to track your academic progress.
          </p>
          <Button onClick={() => setIsAddGradeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Grade
          </Button>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
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
                <p className="text-sm text-muted-foreground mt-2">
                  Overall Grade
                </p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-3">Grade Distribution</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
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
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          padding: "8px 12px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="percentage" fill="#4f46e5" barSize={24} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Detailed Grades</h3>
              <Button size="sm" onClick={() => setIsAddGradeOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Grade
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Assessment
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                      Percentage
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                      Weight
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                      Weighted Score
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {course.grades.map((grade) => {
                    const weightedScore = grade.percentage * (grade.weight / 100);
                    return (
                      <tr key={grade.id} className="border-b border-border/30">
                        <td className="py-3 text-sm font-medium">{grade.title}</td>
                        <td className="py-3 text-sm text-right">
                          {grade.percentage}%
                        </td>
                        <td className="py-3 text-sm text-right">{grade.weight}%</td>
                        <td className="py-3 text-sm text-right">
                          {weightedScore.toFixed(1)}%
                        </td>
                        <td className="py-3 text-sm text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(grade)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteGrade(grade.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-medium">
                    <td className="pt-4 text-sm">Total</td>
                    <td className="pt-4 text-sm text-right"></td>
                    <td className="pt-4 text-sm text-right">
                      {course.grades.reduce((acc, grade) => acc + grade.weight, 0)}%
                    </td>
                    <td className="pt-4 text-sm text-right">
                      {overallGrade.toFixed(1)}%
                    </td>
                    <td className="pt-4 text-sm text-right"></td>
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
