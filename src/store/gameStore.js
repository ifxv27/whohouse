import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '../config';

const CARD_RANKS = {
  COMMON: { value: 1, stars: '⭐' },
  RARE: { value: 2, stars: '⭐⭐' },
  EPIC: { value: 3, stars: '⭐⭐⭐' },
  LEGEND: { value: 4, stars: '⭐⭐⭐⭐' }
};

const CARD_CATEGORIES = {
  BATTLE: { id: 'battle', name: 'Battle Cards', grid: 'battle' },
  PLAYER: { id: 'player', name: 'Player Cards', grid: 'player' },
  STARTER: { id: 'starter', name: 'Starter Cards', grid: 'starter' },
  STORE: { id: 'store', name: 'Store Cards', grid: 'store' },
  EVENT: { id: 'event', name: 'Event Cards', grid: 'event' }
};

// Initial cards array will be empty - no default starter cards
const defaultCards = [];

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      cards: defaultCards,
      playerProfile: null,
      selectedCharacter: null,
      classes: [], // Initialize with empty array instead of DEFAULT_CLASSES
      categories: Object.values(CARD_CATEGORIES),
      tasks: [],
      isAdmin: false,
      isLoggedIn: false,

      // Category Management
      addCategory: (category) => {
        set(state => ({
          categories: [...state.categories, category]
        }));
      },

      updateCategory: (updatedCategory) => {
        set(state => ({
          categories: state.categories.map(cat =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        }));
      },

      deleteCategory: (id) => {
        set(state => ({
          categories: state.categories.filter(cat => cat.id !== id)
        }));
      },

      // Fetch cards from backend
      fetchCards: async () => {
        try {
          const response = await axios.get(`${API_URL}/api/cards`);
          set({ cards: response.data });
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      },

      // Card Management
      addCard: async (card) => {
        try {
          const response = await axios.post(`${API_URL}/api/cards`, card);
          set(state => ({
            cards: [...state.cards, response.data]
          }));
        } catch (error) {
          console.error('Error adding card:', error);
        }
      },

      updateCard: async (updatedCard) => {
        try {
          await axios.put(`${API_URL}/api/cards/${updatedCard.id}`, updatedCard);
          set(state => ({
            cards: state.cards.map(card =>
              card.id === updatedCard.id ? updatedCard : card
            )
          }));
        } catch (error) {
          console.error('Error updating card:', error);
        }
      },

      deleteCard: async (id) => {
        try {
          await axios.delete(`${API_URL}/api/cards/${id}`);
          set(state => ({
            cards: state.cards.filter(card => card.id !== id)
          }));
        } catch (error) {
          console.error('Error deleting card:', error);
        }
      },

      getCardsByCategory: (category) => {
        const state = get();
        return category === 'all'
          ? state.cards
          : state.cards.filter(card => card.category === category);
      },

      getCardsByGrid: (grid) => {
        const state = get();
        return state.cards.filter(card => {
          const category = Object.values(CARD_CATEGORIES).find(cat => cat.id === card.category);
          return category?.grid === grid;
        });
      },

      getCardById: (id) => {
        return get().cards.find(card => card.id === id);
      },

      getStarterCards: () => {
        const state = get();
        return state.cards.filter(card => card.category === 'starter');
      },

      setCardAsStarter: async (cardId, isStarter = true) => {
        try {
          const card = get().getCardById(cardId);
          if (card) {
            const updatedCard = { ...card, category: isStarter ? 'starter' : card.category };
            await get().updateCard(updatedCard);
          }
        } catch (error) {
          console.error('Error setting card as starter:', error);
        }
      },

      // Class Management
      addClass: (newClass) => {
        set(state => ({
          classes: [...state.classes, { ...newClass, id: newClass.id || `class-${Date.now()}` }]
        }));
      },

      updateClass: (updatedClass) => {
        set(state => ({
          classes: state.classes.map(c =>
            c.id === updatedClass.id ? updatedClass : c
          )
        }));
      },

      deleteClass: (id) => {
        set(state => ({
          classes: state.classes.filter(c => c.id !== id)
        }));
      },

      // Player Profile Management
      setPlayerProfile: (profile) => set({ playerProfile: profile }),
      getPlayerProfile: () => get().playerProfile,

      // Character Management
      setSelectedCharacter: (character) => set({ selectedCharacter: character }),
      getSelectedCharacter: () => get().selectedCharacter,

      // Task Management
      addTask: (task) => set(state => ({
        tasks: [...state.tasks, { ...task, id: task.id || `task-${Date.now()}` }]
      })),
      updateTask: (taskId, updatedTask) => set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      })),
      deleteTask: (taskId) => set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),
      updateTaskProgress: (taskId, progress) => set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, progress } : task
        )
      })),
      completeTask: (taskId) => {
        const state = get();
        if (taskId === 'lucky-roll-daily') {
          // Handle lucky roll completion
          localStorage.setItem('lastLuckyRoll', new Date().toISOString().split('T')[0]);
          // Roll for a card using the configured chances
          const dailyTaskStore = useDailyTaskStore.getState();
          const playerProfile = state.playerProfile;
          const result = dailyTaskStore.rollLuckyCard(playerProfile?.inventory || []);
          
          if (result) {
            // Add the card to player's inventory
            set(state => ({
              playerProfile: {
                ...state.playerProfile,
                inventory: [...(state.playerProfile?.inventory || []), result]
              }
            }));
          }
        } else {
          // Handle other tasks
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === taskId ? { ...task, completed: true } : task
            )
          }));
        }
      },

      getActiveTasks: () => {
        const state = get();
        const tasks = [...(state.tasks || [])];
        
        // Add lucky roll as a daily task if it hasn't been completed today
        const today = new Date().toISOString().split('T')[0];
        const lastLuckyRoll = localStorage.getItem('lastLuckyRoll');
        
        if (lastLuckyRoll !== today) {
          tasks.unshift({
            id: 'lucky-roll-daily',
            title: 'Daily Lucky Roll',
            description: 'Roll for a chance to get a rare card!',
            category: 'DAILY',
            imageUrl: 'https://image.cdn2.seaart.me/2024-11-24/ct1p4ale878c73928nf0/89ec594ae954bb2483863a8e9558a3f0_high.webp',
            progress: 0,
            timeLimit: '24h',
            reward: 'Random Card',
            type: 'lucky-roll',
            completed: false
          });
        }
        
        return tasks.filter(task => !task.completed);
      },

      getCompletedTasks: () => {
        const state = get();
        return state.tasks.filter(task => task.completed);
      },

      // Auth Management
      login: (isAdmin = false) => set({ isAdmin, isLoggedIn: true }),
      logout: () => set({ isAdmin: false, isLoggedIn: false, playerProfile: null }),
    }),
    {
      name: 'game-storage',
      version: 1,
      partialize: (state) => ({
        cards: state.cards,
        playerProfile: state.playerProfile,
        classes: state.classes,
        tasks: state.tasks,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
);
