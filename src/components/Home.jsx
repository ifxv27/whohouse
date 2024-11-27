import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/gameStore';
import usePlayerStore from '../store/playerStore';
import { useCards } from '../hooks/useCards';
import PlayerProfile from './player/PlayerProfile';
import { FaStar, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const { setPlayerProfile } = useStore();
  const { currentPlayer, isAuthenticated, updatePlayer, setStarterCardSelected } = usePlayerStore();
  const { getClassName } = useCards();
  const [selectedCard, setSelectedCard] = useState(null);
  const [characterName, setCharacterName] = useState('');

  const getStarterCards = useStore(state => state.getStarterCards);
  const starterCards = useMemo(() => getStarterCards(), [getStarterCards]);

  const getCardClassName = useCallback((classId) => {
    return getClassName(classId);
  }, [getClassName]);

  // Handle routing for authenticated users
  useEffect(() => {
    if (isAuthenticated && currentPlayer) {
      // Check for admin/mod access
      if (currentPlayer.role === 'admin' || currentPlayer.role === 'moderator') {
        navigate('/admin');
        return;
      }

      // If player has already selected a starter card, redirect to game
      if (currentPlayer.hasStarterCard) {
        navigate('/game');
      }
    }
  }, [isAuthenticated, currentPlayer, navigate]);

  const handleStartGame = async () => {
    if (!selectedCard) {
      alert('Please select a character to start!');
      return;
    }

    if (!characterName.trim()) {
      alert('Please enter a character name!');
      return;
    }

    if (isAuthenticated) {
      // Create the character object with all necessary properties
      const character = {
        id: selectedCard.id,
        name: characterName,
        class: selectedCard.class,
        className: getCardClassName(selectedCard.class),
        imageUrl: selectedCard.imageUrl,
        starRank: selectedCard.starRank || 1,
        stats: {
          power: 85,
          energy: 100,
          health: 90,
          defense: 75
        }
      };

      // Update player's profile with the character
      const updatedPlayer = {
        ...currentPlayer,
        character,
        inventory: [selectedCard],
        stats: {
          level: 1,
          gamesPlayed: 0,
          wins: 0,
          coins: 1000
        }
      };

      // Update both stores
      updatePlayer(currentPlayer.id, updatedPlayer);
      setPlayerProfile(updatedPlayer);
      setStarterCardSelected(currentPlayer.id);

      navigate('/game');
    }
  };

  // If player already has a starter card, don't render the selection screen
  if (isAuthenticated && currentPlayer?.hasStarterCard) {
    return null; // Component will unmount during navigation
  }

  return (
    <div className="min-h-screen bg-[url('https://image.cdn2.seaart.me/2024-11-24/ct1p4ale878c73928nf0/89ec594ae954bb2483863a8e9558a3f0_high.webp')] bg-cover bg-center bg-fixed">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Character Selection */}
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
              <div className="text-center space-y-4 mb-8">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  Select your Starter Card
                </h1>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                <p className="text-purple-300">Choose your character and begin your adventure</p>
              </div>

              {/* Authentication Message */}
              {!isAuthenticated && (
                <div className="mb-8 text-center">
                  <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Please login or create an account to start your journey
                  </p>
                </div>
              )}

              {/* Card Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {starterCards.map((card) => (
                  <div
                    key={card.id}
                    className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      selectedCard?.id === card.id 
                        ? 'ring-4 ring-purple-500/50 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                        : 'hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    }`}
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-black/70">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg text-yellow-400 font-bold text-sm border border-yellow-500/20">
                          {'⭐'.repeat(card.starRank || 1)}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                          <h3 className="text-sm font-bold text-white mb-0.5">{card.name}</h3>
                          <p className="text-xs text-purple-300">{getCardClassName(card.class)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Character Name Input */}
              <div className="mb-8">
                <label className="block text-purple-300 text-sm font-medium mb-2">Character Name</label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full bg-black/60 border border-purple-500/30 rounded-lg py-3 px-4 text-purple-200 placeholder-purple-500/50 focus:outline-none focus:border-purple-500/50"
                  placeholder="Enter your character's name"
                />
              </div>

              {/* Start Button */}
              {isAuthenticated ? (
                <button
                  onClick={handleStartGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  disabled={!selectedCard || !characterName.trim()}
                >
                  <span>Start Your Journey</span>
                  <FaArrowRight />
                </button>
              ) : (
                <div className="text-center text-purple-300">
                  <p>Please login or create an account to start your journey →</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Authentication */}
          <div className="lg:sticky lg:top-8">
            <PlayerProfile isHero={true} onSuccess={handleStartGame} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
