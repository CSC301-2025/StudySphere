
import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { type Course } from "../context/CourseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface GradeCalculatorProps {
  course: Course;
}

const GradeCalculator = ({ course }: GradeCalculatorProps) => {
  const { toast } = useToast();
  const [currentGrade, setCurrentGrade] = useState<number>(0);
  const [targetGrade, setTargetGrade] = useState<string>('');
  const [neededScore, setNeededScore] = useState<number | null>(null);
  const [remainingWeight, setRemainingWeight] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate the current grade whenever course grades change
  useEffect(() => {
    if (course.grades.length === 0) {
      setCurrentGrade(0);
      return;
    }
    
    const completedWeight = course.grades.reduce((acc, grade) => acc + grade.weight, 0);
    const totalWeightedScore = course.grades.reduce((acc, grade) => {
      // Use percentage directly as it's now stored as a percentage value
      return acc + grade.percentage * (grade.weight / 100);
    }, 0);
    
    // If there are grades with weights
    if (completedWeight > 0) {
      setCurrentGrade(totalWeightedScore / (completedWeight / 100));
    } else {
      setCurrentGrade(0);
    }
    
    // Calculate remaining weight
    setRemainingWeight(100 - completedWeight);
  }, [course.grades]);

  const calculateNeededGrade = () => {
    if (!targetGrade || isNaN(parseFloat(targetGrade))) {
      toast({
        title: "Invalid target grade",
        description: "Please enter a valid target grade percentage.",
        variant: "destructive",
      });
      return;
    }

    const target = parseFloat(targetGrade);
    
    if (target < 0 || target > 100) {
      toast({
        title: "Invalid target grade",
        description: "Target grade must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    // If there are no remaining assessments
    if (remainingWeight <= 0) {
      if (currentGrade >= target) {
        toast({
          title: "Goal already achieved!",
          description: `Your current grade (${currentGrade.toFixed(1)}%) already meets or exceeds your target.`,
        });
        setNeededScore(null);
      } else {
        toast({
          title: "Cannot reach target",
          description: "There are no remaining assessments to improve your grade.",
          variant: "destructive",
        });
        setNeededScore(null);
      }
      return;
    }

    // Calculate weighted current grade
    const completedWeight = 100 - remainingWeight;
    const weightedCurrentGrade = currentGrade * (completedWeight / 100);
    
    // Calculate needed grade for remaining assessments
    const neededGradeValue = (target - weightedCurrentGrade) / (remainingWeight / 100);
    
    if (neededGradeValue > 100) {
      toast({
        title: "Target may be unreachable",
        description: `You would need to score ${neededGradeValue.toFixed(1)}% on remaining assessments, which exceeds 100%.`,
        variant: "destructive",
      });
    } else if (neededGradeValue < 0) {
      toast({
        title: "Goal already achieved!",
        description: `Your current grade is high enough to achieve your target even with 0% on remaining work.`,
      });
    } else {
      toast({
        title: "Calculation complete",
        description: `You need to average ${neededGradeValue.toFixed(1)}% on remaining assessments worth ${remainingWeight}% of your grade.`,
      });
    }
    
    setNeededScore(neededGradeValue);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calculator size={16} />
          Grade Calculator
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Grade Calculator</h4>
            <p className="text-xs text-muted-foreground">
              Calculate what grade you need on remaining assessments to reach your target.
            </p>
          </div>
          
          <div className="grid gap-3">
            <div>
              <Label htmlFor="current-grade">Current Grade</Label>
              <div className="relative">
                <Input
                  id="current-grade"
                  value={currentGrade.toFixed(1)}
                  readOnly
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {course.grades.length} graded {course.grades.length === 1 ? 'assessment' : 'assessments'} ({100 - remainingWeight}% of final grade)
              </p>
            </div>
            
            <div>
              <Label htmlFor="target-grade">Target Grade</Label>
              <div className="relative">
                <Input
                  id="target-grade"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 90"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
            </div>
            
            {neededScore !== null && (
              <div className="p-3 rounded-md bg-muted">
                <p className="text-sm font-medium">
                  You need to score an average of:
                </p>
                <p className="text-2xl font-bold text-primary">
                  {neededScore > 100 
                    ? '> 100.0%' 
                    : neededScore < 0 
                      ? 'Any score' 
                      : `${neededScore.toFixed(1)}%`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  on remaining assessments worth {remainingWeight}% of your grade
                </p>
              </div>
            )}
            
            <Button onClick={calculateNeededGrade}>
              Calculate Needed Grade
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GradeCalculator;
