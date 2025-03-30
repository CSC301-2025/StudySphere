
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Tab = {
  id: string;
  label: string;
};

type CourseTabProps = {
  tabs: Tab[];
  courseId: string;
};

const CourseTab = ({ tabs, courseId }: CourseTabProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the current tab from the URL
  const currentTab = location.pathname.split("/").pop() || tabs[0].id;

  // Handle tab click
  const handleTabClick = (tabId: string) => {
    navigate(`/course/${courseId}/${tabId}`);
  };

  return (
    <div className="border-b border-border mb-6">
      <nav className="flex space-x-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`tab-button ${currentTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CourseTab;
