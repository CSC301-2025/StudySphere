
import React from "react";
import { Loader2 } from "lucide-react";

const CourseLoading = () => {
  return (
    <div className="page-container flex justify-center items-center h-[80vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading course details...</p>
      </div>
    </div>
  );
};

export default CourseLoading;
