
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CourseError = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page-container flex flex-col justify-center items-center h-[80vh]">
      <div className="text-destructive mb-4">Error loading course details</div>
      <Button onClick={() => navigate("/courses")}>Return to Courses</Button>
    </div>
  );
};

export default CourseError;
