import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RARITY, rollRarity } from '../constants/cardRarity';

interface Settings {
  enabled: boolean;
  minRarity: string;
  maxRarity: string;
  levelRange: {
    min: number;
    max: number;
  };
  allowedCategories: string[];
  rewardMultiplier: number;
  luckyRollChances: {
    [key: string]: number;
  };
}

interface DailyTaskState {
  currentDailyCard: any | null;
  lastRollDate: string | null;
  luckyCard: any | null;
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
  rollDailyCard: () => void;
  rollLuckyCard: (playerInventory: any[]) => any | null;
}

const defaultSettings: Settings = {
  enabled: true,
  minRarity: 'common',
  maxRarity: 'legendary',
  levelRange: {
    min: 1,
    max: 10
  },
  allowedCategories: ['all'],
  rewardMultiplier: 1.5,
  luckyRollChances: {
    common: 45,
    uncommon: 30,
    rare: 15,
    epic: 8,
    legendary: 2
  }
};

const useDailyTaskStore = create<DailyTaskState>()(
  persist(
    (set, get) => ({
      currentDailyCard: null,
      lastRollDate: null,
      luckyCard: null,
      settings: defaultSettings,

      setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      rollLuckyCard: (playerInventory) => {
        const { settings } = get();
        const roll = Math.random() * 100;
        let cumulative = 0;
        let selectedRarity = 'common';
        
        // Determine rarity based on chances
        for (const [rarity, chance] of Object.entries(settings.luckyRollChances)) {
          cumulative += chance;
          if (roll <= cumulative) {
            selectedRarity = rarity;
            break;
          }
        }
        
        // TODO: Implement actual card selection based on rarity and player's inventory
        // This should be integrated with your card database/store
        
        const result = {
          rarity: selectedRarity,
          timestamp: Date.now()
        };
        
        set({ luckyCard: result });
        return result;
      },

      rollDailyCard: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastRollDate } = get();

        if (lastRollDate === today) {
          return; // Already rolled today
        }

        // TODO: Implement actual card selection logic
        const dailyCard = {
          id: Date.now().toString(),
          name: 'Daily Task Card',
          description: 'Complete daily tasks to earn this card!',
          imageUrl: 'https://placehold.co/400x600',
          starRank: Math.floor(Math.random() * 3) + 1, // 1-3 stars for daily tasks
          stats: {
            power: 85,
            energy: 100,
            health: 90,
            defense: 75
          }
        };

        set({
          currentDailyCard: dailyCard,
          lastRollDate: today
        });
      }
    }),
    {
      name: 'daily-task-storage',
      version: 1
    }
  )
);

export default useDailyTaskStore;
