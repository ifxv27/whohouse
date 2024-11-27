import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaStore, FaExchangeAlt, FaDice } from 'react-icons/fa';
import usePlayerStore from '../../store/playerStore';

const Navbar = () => {
  const { currentPlayer, logoutPlayer } = usePlayerStore();

  const handleLogout = () => {
    logoutPlayer();
  };

  return (
    <div className="container mx-auto px-4 relative">
      <nav className="max-w-[900px] mx-auto relative z-50">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20 transform -mb-6">
          <div className="px-4">
            <div className="flex items-center justify-between h-11">
              {/* Left side - Logo & Navigation */}
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors">
                  <FaHome size={15} />
                  <span className="font-medium text-sm">Home</span>
                </Link>
                <Link to="/store" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors">
                  <FaStore size={15} />
                  <span className="font-medium text-sm">Store</span>
                </Link>
                <Link to="/trade" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors">
                  <FaExchangeAlt size={15} />
                  <span className="font-medium text-sm">Trade</span>
                </Link>
                <Link to="/game" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors">
                  <FaDice size={15} />
                  <span className="font-medium text-sm">Game</span>
                </Link>
              </div>

              {/* Right side - User Info & Actions */}
              <div className="flex items-center gap-3">
                {currentPlayer && (
                  <>
                    <div className="flex items-center gap-1.5 text-purple-400">
                      <FaUser size={13} />
                      <span className="font-medium text-sm">{currentPlayer.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <FaSignOutAlt size={13} />
                      <span className="font-medium text-sm">Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
