import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/gameStore';
import usePlayerStore from '../store/playerStore';
import GameDashboard from './game/GameDashboard';
import Navbar from './ui/Navbar';
import ProfileGrid from './game/ProfileGrid';
import CharacterModal from './modals/CharacterModal';

const Game = () => {
  const navigate = useNavigate();
  const { currentPlayer, isAuthenticated } = usePlayerStore();
  const { setPlayerProfile } = useStore();
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !currentPlayer) {
      navigate('/');
    } else {
      setPlayerProfile(currentPlayer);
    }
  }, [isAuthenticated, currentPlayer, navigate, setPlayerProfile]);

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const handleEdit = (char) => {
    console.log('Edit character:', char);
  };

  const handleUpgrade = (char) => {
    console.log('Upgrade character:', char);
  };

  const handleDelete = (char) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      console.log('Delete character:', char);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://image.cdn2.seaart.me/2024-11-24/ct1p4ale878c73928nf0/89ec594ae954bb2483863a8e9558a3f0_high.webp')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen pt-3">
        <Navbar />
        <div className="container mx-auto px-4">
          <div className="max-w-[1300px] mx-auto -mt-6">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 shadow-lg shadow-purple-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-4">
                {/* Profile Grid - Left Side */}
                <div>
                  <ProfileGrid
                    onSelectCharacter={setSelectedCharacter}
                    onEdit={handleEdit}
                    onUpgrade={handleUpgrade}
                    onDelete={handleDelete}
                  />
                </div>
                {/* Game Dashboard - Right Side */}
                <div>
                  <GameDashboard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
};

export default Game;