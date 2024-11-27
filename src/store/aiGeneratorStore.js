import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultSettings = {
  artStyles: ['Anime', 'Realistic', 'Digital Art', 'Oil Painting', 'Watercolor'],
  poses: ['Standing', 'Sitting', 'Action', 'Portrait', 'Full Body'],
  moods: ['Happy', 'Serious', 'Mysterious', 'Energetic', 'Calm'],
  settings: ['Urban', 'Nature', 'Fantasy', 'Sci-fi', 'Abstract'],
  lighting: ['Natural', 'Studio', 'Dramatic', 'Soft', 'Neon'],
  effects: ['None', 'Glow', 'Particles', 'Smoke', 'Fire'],
};

const defaultCosts = {
  base: {
    money: 1000,
    gems: 5
  },
  multipliers: {
    common: 1,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2,
    legendary: 3
  },
  levelMultiplier: 0.1 // 10% increase per level
};

const defaultCategories = {
  common: {
    enabled: true,
    displayName: 'Common Cards',
    description: 'Basic card generation',
    costMultiplier: 1
  },
  uncommon: {
    enabled: true,
    displayName: 'Uncommon Cards',
    description: 'Better quality cards',
    costMultiplier: 1.2
  },
  rare: {
    enabled: true,
    displayName: 'Rare Cards',
    description: 'High quality cards',
    costMultiplier: 1.5
  },
  epic: {
    enabled: true,
    displayName: 'Epic Cards',
    description: 'Premium quality cards',
    costMultiplier: 2
  },
  legendary: {
    enabled: true,
    displayName: 'Legendary Cards',
    description: 'Ultimate quality cards',
    costMultiplier: 3
  }
};

const defaultApiSettings = {
  activeProvider: 'seaart',
  providers: {
    seaart: {
      apiKey: '',
      enabled: true
    },
    tensorart: {
      apiKey: '',
      enabled: true
    },
    leonardo: {
      apiKey: '',
      enabled: true
    },
    webui: {
      endpoint: 'http://localhost:7860',
      enabled: false
    },
    flux: {
      enabled: false
    }
  }
};

const useAiGeneratorStore = create(
  persist(
    (set, get) => ({
      settings: { ...defaultSettings },
      apiSettings: { ...defaultApiSettings },
      categories: { ...defaultCategories },
      costs: { ...defaultCosts },
      
      // Update category settings
      updateCategorySettings: (category, settings) => {
        set(state => ({
          categories: {
            ...state.categories,
            [category]: {
              ...state.categories[category],
              ...settings
            }
          }
        }));
      },

      // Update cost settings
      updateCosts: (newCosts) => {
        set(state => ({
          costs: {
            ...state.costs,
            ...newCosts
          }
        }));
      },

      // Calculate generation cost
      calculateCost: (cardType, level) => {
        const state = get();
        const { base, multipliers, levelMultiplier } = state.costs;
        const typeMultiplier = multipliers[cardType] || 1;
        const levelCost = 1 + (level * levelMultiplier);
        
        return {
          money: Math.round(base.money * typeMultiplier * levelCost),
          gems: Math.round(base.gems * typeMultiplier * levelCost)
        };
      },

      // Check if player can afford generation
      canAffordGeneration: (player, cardType, level) => {
        const state = get();
        const cost = state.calculateCost(cardType, level);
        return player.money >= cost.money && player.gems >= cost.gems;
      },
      
      // Update a specific category's options
      updateCategory: (category, options) => {
        if (!Array.isArray(options)) {
          console.error('Options must be an array');
          return;
        }
        
        const validOptions = options.filter(option => 
          typeof option === 'string' && 
          option.length > 0 && 
          option.length <= 50 &&
          /^[a-zA-Z0-9\s-]+$/.test(option)
        );
        
        set(state => ({
          settings: {
            ...state.settings,
            [category]: validOptions
          }
        }));
      },
      
      // Reset a category to its default values
      resetCategory: (category) => {
        if (category in defaultSettings) {
          set(state => ({
            settings: {
              ...state.settings,
              [category]: [...defaultSettings[category]]
            }
          }));
        }
      },
      
      // Reset all settings to default values
      resetAllSettings: () => {
        set({
          settings: { ...defaultSettings },
          categories: { ...defaultCategories },
          costs: { ...defaultCosts }
        });
      },
      
      updateApiSettings: (newSettings) =>
        set(() => ({
          apiSettings: newSettings
        })),
      
      // Get the active provider's settings
      getActiveProviderSettings: () => {
        const state = get();
        const { activeProvider, providers } = state.apiSettings;
        return {
          provider: activeProvider,
          settings: providers[activeProvider]
        };
      },
      
      // Generate image using the active provider
      generateImage: async (prompt, options = {}) => {
        const state = get();
        const { activeProvider, providers } = state.apiSettings;
        const providerSettings = providers[activeProvider];

        if (!providerSettings.enabled) {
          throw new Error('Selected provider is not enabled');
        }

        switch (activeProvider) {
          case 'seaart':
            return state.generateSeaArtImage(prompt, providerSettings.apiKey, options);
          case 'tensorart':
            return state.generateTensorArtImage(prompt, providerSettings.apiKey, options);
          case 'leonardo':
            return state.generateLeonardoImage(prompt, providerSettings.apiKey, options);
          case 'webui':
            return state.generateWebUIImage(prompt, providerSettings.endpoint, options);
          case 'flux':
            return state.generateFluxImage(prompt, options);
          default:
            throw new Error('Invalid provider selected');
        }
      },

      // Save generated image
      saveGeneratedImage: async (imageData, cardType, playerId) => {
        // Implementation for saving the image would go here
        // This should integrate with your backend storage solution
        console.log('Saving generated image for', playerId, 'card type:', cardType);
        return true;
      }
    }),
    {
      name: 'ai-generator-settings',
      version: 1,
    }
  )
);

// Provider-specific image generation functions
const generateSeaArtImage = async (prompt, apiKey, options) => {
  // Implement SeaArt.ai API call
  // This is a placeholder - implement actual API call
  console.log('Generating with SeaArt.ai:', { prompt, apiKey, options });
};

const generateTensorArtImage = async (prompt, apiKey, options) => {
  // Implement TensorArt API call
  console.log('Generating with TensorArt:', { prompt, apiKey, options });
};

const generateLeonardoImage = async (prompt, apiKey, options) => {
  // Implement Leonardo.ai API call
  console.log('Generating with Leonardo.ai:', { prompt, apiKey, options });
};

const generateWebUIImage = async (prompt, endpoint, options) => {
  // Implement Stable Diffusion WebUI API call
  console.log('Generating with WebUI:', { prompt, endpoint, options });
};

const generateFluxImage = async (prompt, options) => {
  // Implement Flux model generation
  console.log('Generating with Flux:', { prompt, options });
};

export default useAiGeneratorStore;
