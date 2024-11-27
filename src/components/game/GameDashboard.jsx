import React from 'react';
import { FaTasks, FaUsers, FaStar, FaClock, FaCoins, FaEdit, FaTrash, FaDice, FaGem, FaMoneyBillWave, FaTrophy } from 'react-icons/fa';
import { GiCrossedSwords } from 'react-icons/gi';
import { useStore } from '../../store/gameStore';
import { Link, useNavigate } from 'react-router-dom';
import { useCards } from '../../hooks/useCards';

const GameDashboard = () => {
  const { 
    getActiveTasks, 
    playerProfile,
    setSelectedCharacter,
    updateTaskProgress,
    completeTask,
    deleteCard
  } = useStore();

  const { getCardsByCategory, getClassName } = useCards();

  const activeTasks = getActiveTasks() || [];
  const battleCards = getCardsByCategory('BATTLE') || [];
  const playerCards = playerProfile?.inventory || [];

  const handleTaskProgress = (taskId) => {
    // Simulate task progress
    const task = activeTasks.find(t => t.id === taskId);
    if (task && task.progress < 100) {
      updateTaskProgress(taskId, task.progress + 20);
      if (task.progress + 20 >= 100) {
        completeTask(taskId);
      }
    }
  };

  const handleCardSelect = (card) => {
    setSelectedCharacter(card);
  };

  const handleCardDelete = (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
    }
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Money */}
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-yellow-500 w-8 h-8" />
            <div>
              <p className="text-yellow-500 text-sm font-medium">Money</p>
              <p className="text-white font-bold">{playerProfile?.money || 0}</p>
            </div>
          </div>
        </div>
        {/* Gems */}
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 border border-purple-500/30 shadow-lg shadow-purple-500/10">
          <div className="flex items-center gap-2">
            <FaGem className="text-purple-500 w-8 h-8" />
            <div>
              <p className="text-purple-500 text-sm font-medium">Gems</p>
              <p className="text-white font-bold">{playerProfile?.gems || 0}</p>
            </div>
          </div>
        </div>
        {/* Wins */}
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 border border-green-500/30 shadow-lg shadow-green-500/10">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-green-500 w-8 h-8" />
            <div>
              <p className="text-green-500 text-sm font-medium">Wins</p>
              <p className="text-white font-bold">{playerProfile?.stats?.wins || 0}</p>
            </div>
          </div>
        </div>
        {/* Losses */}
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 border border-red-500/30 shadow-lg shadow-red-500/10">
          <div className="flex items-center gap-2">
            <FaDice className="text-red-500 w-8 h-8" />
            <div>
              <p className="text-red-500 text-sm font-medium">Losses</p>
              <p className="text-white font-bold">{playerProfile?.stats?.losses || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Content */}
      <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-purple-500/30 shadow-lg shadow-purple-500/10 h-[calc(100%-5rem)]">
        
        {/* Quick Games Grid */}
        <div className="relative mt-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur"></div>
          <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
            {/* Stylish Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <h2 className="text-2xl font-bold px-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Gamble
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Dice Roll', icon: FaDice, color: 'from-yellow-600 to-amber-500' },
                { name: 'Coin Flip', icon: FaCoins, color: 'from-blue-600 to-cyan-500' },
                { name: 'Card Draw', icon: FaGem, color: 'from-purple-600 to-pink-500' }
              ].map((game) => (
                <button
                  key={game.name}
                  onClick={() => console.log(`${game.name} clicked`)}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative px-6 py-4 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200">
                    <div className="flex flex-col items-center gap-2">
                      <game.icon className="text-3xl text-purple-400 group-hover:text-purple-300 transition-colors" />
                      <span className="text-base font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent group-hover:from-purple-100 group-hover:to-pink-100">
                        {game.name}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Combat Arena */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur"></div>
          <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
            {/* Stylish Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <h2 className="text-2xl font-bold px-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Combat Arena
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {battleCards.map((opponent) => (
                <div
                  key={opponent.id}
                  className="relative bg-gray-800/50 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border border-pink-500/20"
                >
                  <img
                    src={opponent.image || opponent.imageUrl}
                    alt={opponent.name}
                    className="w-full h-72 object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold">{opponent.name}</h3>
                    <div className="flex items-center mt-1">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="text-gray-300 text-sm">Level {opponent.level || '??'}</span>
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      {getClassName(opponent.class)}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-white border border-red-500/50">
                    Battle
                  </div>
                </div>
              ))}
              {battleCards.length === 0 && (
                <div className="col-span-4 text-center py-8 text-gray-400">
                  No opponents available. Check back later!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur"></div>
          <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
            {/* Stylish Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <h2 className="text-2xl font-bold px-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Active Tasks
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskProgress(task.id)}
                  className={`relative bg-gray-800/50 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${
                    task.type === 'lucky-roll' 
                      ? 'border-2 border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.25)]' 
                      : 'border-2 border-pink-500/20 hover:border-pink-500/40'
                  }`}
                >
                  {task.type === 'lucky-roll' ? (
                    // Lucky Roll Card
                    <>
                      <div className="h-64 bg-gradient-to-br from-yellow-900/30 to-amber-900/30 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 animate-ping">
                            <FaDice className="text-7xl text-yellow-500/30" />
                          </div>
                          <FaDice className="text-7xl text-yellow-500" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-0 right-0 flex justify-center">
                        <div className="px-4 py-2 rounded-full text-sm font-bold bg-yellow-500/90 backdrop-blur-sm border border-yellow-400/50 text-black shadow-[0_4px_16px_rgba(234,179,8,0.4)]">
                          Lucky Roll
                        </div>
                      </div>
                    </>
                  ) : (
                    // Regular Task Card
                    <>
                      <div className="relative h-64">
                        {task.imageUrl ? (
                          <>
                            <img
                              src={task.imageUrl}
                              alt={task.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                          </>
                        ) : (
                          <div className="h-full bg-gradient-to-br from-purple-800/50 to-pink-800/50 flex items-center justify-center">
                            <FaTasks className="text-6xl text-pink-500/50" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-sm bg-black/20">
                          <h3 className="font-display text-lg font-bold text-white mb-3 line-clamp-2">
                            {task.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                              <FaClock className="w-4 h-4" />
                              <span className="font-medium">{task.timeLimit || 'No limit'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-400">
                              <FaCoins className="w-4 h-4" />
                              <span className="font-medium">{task.reward}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {activeTasks.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No tasks available. Check back later!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Player Cards */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur"></div>
          <div className="relative bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
            {/* Stylish Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <h2 className="text-2xl font-bold px-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Player Cards
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {playerCards.map((card) => (
                <div
                  key={card.id}
                  className="relative bg-gray-800/50 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-pink-500/20 group"
                >
                  <img
                    src={card.image || card.imageUrl}
                    alt={card.name}
                    className="w-full h-72 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm">
                    <h3 className="text-white text-lg font-semibold mb-2">{card.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-2" />
                        <span className="text-gray-300">Level {card.level || 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardSelect(card);
                          }}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg transition-colors"
                        >
                          <FaEdit className="text-blue-400" size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardDelete(card.id);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                        >
                          <FaTrash className="text-red-400" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-purple-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-purple-500/50">
                    {getClassName(card.class)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
              {playerCards.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No cards in inventory. Visit the store to get some cards!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
