import React from 'react';
import { motion } from 'framer-motion';
import StarDisplay from '../shared/StarDisplay';
import { RARITY } from '../../constants/cardRarity';
import useDailyTaskStore from '../../store/dailyTaskStore';

const LuckyCardRoll = () => {
  const { luckyCard, rollLuckyCard } = useDailyTaskStore();
  const rarity = Object.values(RARITY).find(r => r.stars === luckyCard?.starRank);

  const handleRoll = () => {
    rollLuckyCard();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4 text-purple-300">Lucky Card Roll</h2>
      
      {luckyCard ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative p-1 rounded-lg ${rarity?.bgGlow} transition-shadow duration-500 animate-pulse-slow`}
        >
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-4">
              <img 
                src={luckyCard.imageUrl} 
                alt={luckyCard.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <StarDisplay count={luckyCard.starRank} size="md" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-xl font-bold ${rarity?.color}`}>{luckyCard.name}</h3>
              <p className="text-gray-300">{luckyCard.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-700/50 p-2 rounded">
                  <span className="text-gray-400">Power:</span>
                  <span className="float-right text-white">{luckyCard.stats.power}</span>
                </div>
                <div className="bg-gray-700/50 p-2 rounded">
                  <span className="text-gray-400">Energy:</span>
                  <span className="float-right text-white">{luckyCard.stats.energy}</span>
                </div>
                <div className="bg-gray-700/50 p-2 rounded">
                  <span className="text-gray-400">Health:</span>
                  <span className="float-right text-white">{luckyCard.stats.health}</span>
                </div>
                <div className="bg-gray-700/50 p-2 rounded">
                  <span className="text-gray-400">Defense:</span>
                  <span className="float-right text-white">{luckyCard.stats.defense}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400 mb-4">Try your luck at getting a rare card!</p>
        </div>
      )}
      
      <button
        onClick={handleRoll}
        className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        Roll Lucky Card
      </button>
    </div>
  );
};

export default LuckyCardRoll;
