export const RARITY = {
  COMMON: {
    name: 'Common',
    stars: 1,
    chance: 45, // 45% chance
    color: 'text-gray-400',
    bgGlow: 'shadow-gray-400/50'
  },
  UNCOMMON: {
    name: 'Uncommon',
    stars: 2,
    chance: 30, // 30% chance
    color: 'text-green-400',
    bgGlow: 'shadow-green-400/50'
  },
  RARE: {
    name: 'Rare',
    stars: 3,
    chance: 15, // 15% chance
    color: 'text-blue-400',
    bgGlow: 'shadow-blue-400/50'
  },
  EPIC: {
    name: 'Epic',
    stars: 4,
    chance: 8, // 8% chance
    color: 'text-purple-400',
    bgGlow: 'shadow-purple-400/50'
  },
  LEGENDARY: {
    name: 'Legendary',
    stars: 5,
    chance: 2, // 2% chance
    color: 'text-yellow-400',
    bgGlow: 'shadow-yellow-400/50'
  }
};

export const getRarityByStars = (stars) => {
  return Object.values(RARITY).find(rarity => rarity.stars === stars);
};

export const rollRarity = () => {
  const roll = Math.random() * 100;
  let cumulative = 0;
  
  for (const rarity of Object.values(RARITY)) {
    cumulative += rarity.chance;
    if (roll <= cumulative) {
      return rarity;
    }
  }
  
  return RARITY.COMMON; // Fallback
};
