import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlayerStore = create(
  persist(
    (set, get) => ({
      currentPlayer: null,
      isAuthenticated: false,
      players: [],

      createPlayer: (playerData) => {
        const { players } = get();
        const existingPlayer = players.find(
          p => p.username === playerData.username || p.email === playerData.email
        );

        if (existingPlayer) {
          return { success: false, error: 'Username or email already exists' };
        }

        const newPlayer = {
          id: Date.now().toString(),
          ...playerData,
          role: playerData.username === 'admin' ? 'admin' : 'user', 
          stats: {
            level: 1,
            gamesPlayed: 0,
            wins: 0,
            coins: 100
          },
          characters: [],
          inventory: [],
          settings: {
            theme: 'dark',
            notifications: true
          },
          hasStarterCard: false
        };

        set(state => ({
          players: [...state.players, newPlayer],
          currentPlayer: newPlayer,
          isAuthenticated: true
        }));

        return { success: true };
      },

      loginPlayer: (username, password) => {
        if (username === 'admin' && password === 'admin123') {
          const adminPlayer = {
            id: 'admin',
            username: 'admin',
            role: 'admin',
            email: 'admin@example.com',
            hasStarterCard: true
          };
          
          set(() => ({
            currentPlayer: adminPlayer,
            isAuthenticated: true
          }));
          
          return { success: true, isAdmin: true };
        }
        
        const { players } = get();
        const player = players.find(
          p => p.username === username && p.password === password
        );

        if (!player) {
          return { success: false, error: 'Invalid username or password' };
        }

        set(() => ({
          currentPlayer: player,
          isAuthenticated: true
        }));

        return { success: true, isAdmin: player.role === 'admin' };
      },

      logoutPlayer: () => {
        set(() => ({
          currentPlayer: null,
          isAuthenticated: false
        }));
      },

      setStarterCardSelected: (playerId) => {
        const { players } = get();
        const updatedPlayers = players.map(player => 
          player.id === playerId 
            ? { ...player, hasStarterCard: true }
            : player
        );

        const updatedCurrentPlayer = get().currentPlayer?.id === playerId
          ? { ...get().currentPlayer, hasStarterCard: true }
          : get().currentPlayer;

        set(() => ({
          players: updatedPlayers,
          currentPlayer: updatedCurrentPlayer
        }));
      },

      deletePlayer: (playerId) => {
        const { players, currentPlayer } = get();
        
        if (currentPlayer?.id === playerId) {
          set(() => ({
            players: players.filter(p => p.id !== playerId),
            currentPlayer: null,
            isAuthenticated: false
          }));
        } else {
          set(() => ({
            players: players.filter(p => p.id !== playerId)
          }));
        }
      },

      updatePlayer: (playerId, updates) => {
        const { players } = get();
        const updatedPlayers = players.map(player =>
          player.id === playerId ? { ...player, ...updates } : player
        );

        set(state => ({
          players: updatedPlayers,
          currentPlayer: state.currentPlayer?.id === playerId
            ? { ...state.currentPlayer, ...updates }
            : state.currentPlayer
        }));
      },

      addCharacter: (playerId, character) => {
        const { players } = get();
        const player = players.find(p => p.id === playerId);
        
        if (player) {
          const updatedPlayer = {
            ...player,
            characters: [...player.characters, character]
          };
          
          get().updatePlayer(playerId, updatedPlayer);
        }
      },

      updateStats: (playerId, stats) => {
        const { players } = get();
        const player = players.find(p => p.id === playerId);
        
        if (player) {
          const updatedPlayer = {
            ...player,
            stats: { ...player.stats, ...stats }
          };
          
          get().updatePlayer(playerId, updatedPlayer);
        }
      },

      updateSettings: (playerId, settings) => {
        const { players } = get();
        const player = players.find(p => p.id === playerId);
        
        if (player) {
          const updatedPlayer = {
            ...player,
            settings: { ...player.settings, ...settings }
          };
          
          get().updatePlayer(playerId, updatedPlayer);
        }
      }
    }),
    {
      name: 'player-storage',
      version: 1
    }
  )
);

export default usePlayerStore;
