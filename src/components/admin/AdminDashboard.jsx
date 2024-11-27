import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardManagement from './CardManagement.tsx';
import AiGeneratorSettings from './AiGeneratorSettings';
import usePlayerStore from '../../store/playerStore';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logoutPlayer = usePlayerStore(state => state.logoutPlayer);

  const handleLogout = () => {
    logoutPlayer();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaCog className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold text-purple-300">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-8">
          <CardManagement />
          <AiGeneratorSettings />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
