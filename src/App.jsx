import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import Admin from './components/admin/Admin';
import CardManagement from './components/admin/CardManagement.tsx';
import ClassManager from './components/admin/ClassManager';
import CategoryManager from './components/admin/CategoryManager';
import TaskManager from './components/admin/TaskManager';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="cards" element={<CardManagement />} />
          <Route path="classes" element={<ClassManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="tasks" element={<TaskManager />} />
          <Route path="settings" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
