import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaGamepad, FaGraduationCap, FaLayerGroup, FaTasks,
  FaFistRaised, FaStore, FaDice, FaCog, FaArrowLeft,
  FaStar, FaExchangeAlt, FaChartLine, FaUsers
} from 'react-icons/fa';
import usePlayerStore from '../../store/playerStore';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPlayer, isAuthenticated } = usePlayerStore();

  useEffect(() => {
    // Check if user is authenticated and has admin/mod role
    if (!isAuthenticated || !currentPlayer || 
        (currentPlayer.role !== 'admin' && currentPlayer.role !== 'moderator')) {
      navigate('/');
      return;
    }

    // Redirect to cards page if we're at the root admin path
    if (location.pathname === '/admin') {
      navigate('/admin/cards');
    }
  }, [location.pathname, navigate, isAuthenticated, currentPlayer]);

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const navItems = [
    { path: '/admin/cards', label: 'Cards', icon: FaGamepad },
    { path: '/admin/classes', label: 'Classes', icon: FaGraduationCap },
    { path: '/admin/categories', label: 'Categories', icon: FaLayerGroup },
    { path: '/admin/tasks', label: 'Tasks & Jobs', icon: FaTasks },
    { path: '/admin/battles', label: 'Battles', icon: FaFistRaised },
    { path: '/admin/store', label: 'Store', icon: FaStore },
    { path: '/admin/trade', label: 'Trade', icon: FaExchangeAlt },
    { path: '/admin/gamble', label: 'Gamble', icon: FaDice },
    { path: '/admin/featured', label: 'Featured', icon: FaStar },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartLine },
    { path: '/admin/users', label: 'Users', icon: FaUsers },
    { path: '/admin/settings', label: 'Settings', icon: FaCog },
  ];

  // If not authenticated or not admin/mod, don't render anything
  if (!isAuthenticated || !currentPlayer || 
      (currentPlayer.role !== 'admin' && currentPlayer.role !== 'moderator')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Top Navigation Bar */}
      <div className="bg-gray-900/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <FaArrowLeft />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
              <nav className="p-2 space-y-1">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive(path)
                        ? 'bg-purple-600 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-10">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-white/10 min-h-[calc(100vh-8rem)] p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Admin;
