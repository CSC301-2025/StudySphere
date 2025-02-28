import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Calendar from './pages/Calendar.tsx';
import Activities from './pages/Activities.tsx';
import Todo from './pages/Todo.tsx';
import CoursePage from './pages/CoursePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/courses" element={<CoursePage />} />
      </Routes>
    </Router>
  );
};

export default App;
