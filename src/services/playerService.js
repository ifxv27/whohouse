import { useStore } from '../store/gameStore';

export const PROFILE_STORAGE_KEY = 'who-player-profile';

export const playerService = {
  // Save player profile to local storage
  saveProfile: (profile) => {
    if (!profile || !profile.name || !profile.character) {
      throw new Error('Invalid profile data');
    }

    try {
      const profileData = {
        ...profile,
        lastSaved: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      return profileData;
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw new Error('Failed to save profile');
    }
  },

  // Load player profile from local storage
  loadProfile: () => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!savedProfile) return null;
      
      const profile = JSON.parse(savedProfile);
      
      // Validate loaded profile
      if (!profile.name || !profile.character) {
        throw new Error('Invalid saved profile');
      }
      
      return profile;
    } catch (error) {
      console.error('Failed to load profile:', error);
      localStorage.removeItem(PROFILE_STORAGE_KEY); // Clear invalid data
      return null;
    }
  },

  // Delete player profile from local storage
  deleteProfile: () => {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  },

  // Update existing profile with new data
  updateProfile: (updates) => {
    try {
      const currentProfile = playerService.loadProfile();
      if (!currentProfile) throw new Error('No profile found');

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        lastModified: new Date().toISOString()
      };

      return playerService.saveProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Failed to update profile');
    }
  }
};

// Custom hook for profile management
export const usePlayerProfile = () => {
  const { setPlayerProfile, playerProfile } = useStore();

  const saveAndSetProfile = (profile) => {
    try {
      const savedProfile = playerService.saveProfile(profile);
      setPlayerProfile(savedProfile);
      return savedProfile;
    } catch (error) {
      console.error('Failed to save and set profile:', error);
      throw error;
    }
  };

  const loadAndSetProfile = () => {
    try {
      const profile = playerService.loadProfile();
      if (profile) {
        setPlayerProfile(profile);
      }
      return profile;
    } catch (error) {
      console.error('Failed to load and set profile:', error);
      return null;
    }
  };

  const updateAndSetProfile = (updates) => {
    try {
      const updatedProfile = playerService.updateProfile(updates);
      setPlayerProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update and set profile:', error);
      throw error;
    }
  };

  return {
    saveProfile: saveAndSetProfile,
    loadProfile: loadAndSetProfile,
    updateProfile: updateAndSetProfile,
    deleteProfile: playerService.deleteProfile,
    currentProfile: playerProfile
  };
};
