import React, { useState } from 'react';
import { useStore } from '../../store/gameStore';
import useAiGeneratorStore from '../../store/aiGeneratorStore';
import { 
  FaStore, 
  FaExchangeAlt, 
  FaDice, 
  FaTrophy, 
  FaChartLine, 
  FaBolt, 
  FaHeart, 
  FaShieldAlt, 
  FaGem, 
  FaFistRaised, 
  FaBox, 
  FaCog, 
  FaRobot, 
  FaImage, 
  FaLightbulb, 
  FaMagic,
  FaRandom, 
  FaSave, 
  FaUndo, 
  FaEdit,
  FaCheck
} from 'react-icons/fa';
import { GiCardRandom, GiPokerHand, GiCardPlay, GiCardDraw } from 'react-icons/gi';
import { useCards } from '../../hooks/useCards';

const initialAiSettings = {
  style: 'anime',
  pose: 'standing',
  mood: 'heroic',
  setting: 'castle',
  lighting: 'natural',
  effects: 'none',
  quality: 'high'
};

const ProfileGrid = ({ onSelectCharacter }) => {
  const playerProfile = useStore((state) => state.playerProfile);
  const { getClassName } = useCards();
  const [generatingImage, setGeneratingImage] = useState(false);
  const [aiSettings, setAiSettings] = useState(initialAiSettings);
  const [previewIndex, setPreviewIndex] = useState(0);
  const aiGeneratorSettings = useAiGeneratorStore((state) => state.settings);

  const styles = aiGeneratorSettings.artStyles;
  const effects = aiGeneratorSettings.effects;

  const quickLinks = [
    { name: 'Store', icon: FaStore, onClick: () => console.log('Store clicked') },
    { name: 'Inventory', icon: FaBox, onClick: () => console.log('Inventory clicked') },
    { name: 'Rewards', icon: FaTrophy, onClick: () => console.log('Rewards clicked') },
    { name: 'Settings', icon: FaCog, onClick: () => console.log('Settings clicked') }
  ];

  if (!playerProfile) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/50">
        <p className="text-purple-300">Loading profile...</p>
      </div>
    );
  }

  const { character, stats = { power: 85, energy: 100, health: 90, defense: 75 }, level = 1 } = playerProfile;

  if (!character) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/50">
        <p className="text-purple-300">No character selected. Please return to home and select a character.</p>
      </div>
    );
  }

  const handleAiSettingChange = (key, value) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateAiImage = async () => {
    setGeneratingImage(true);
    try {
      // TODO: Implement AI image generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      console.log('Generating AI image with settings:', aiSettings);
      setPreviewIndex(prev => (prev + 1) % 2);
    } catch (error) {
      console.error('Error generating AI image:', error);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleRandomizeSettings = () => {
    const { artStyles, poses, moods, settings, lighting, effects } = aiGeneratorSettings;

    setAiSettings({
      style: artStyles[Math.floor(Math.random() * artStyles.length)],
      pose: poses[Math.floor(Math.random() * poses.length)],
      mood: moods[Math.floor(Math.random() * moods.length)],
      setting: settings[Math.floor(Math.random() * settings.length)],
      lighting: lighting[Math.floor(Math.random() * lighting.length)],
      effects: effects[Math.floor(Math.random() * effects.length)],
      quality: 'high'
    });
  };

  const handleRandomize = () => {
    handleRandomizeSettings();
  };

  const handleReset = () => {
    setAiSettings(initialAiSettings);
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 space-y-6">
      {/* Character Name with Stylish Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-grow"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500/50"></div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {character.name}
        </h1>
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500/50"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-grow"></div>
      </div>

      {/* Character Image Container */}
      <div className="flex justify-center">
        <div className="w-[315px]">
          <div 
            className="relative aspect-[315/560] rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectCharacter({ ...character, editName: true })}
          >
            {character?.imageUrl || character?.image ? (
              <img
                src={character.imageUrl || character.image}
                alt={character.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                <span className="text-purple-300">No Character Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            
            {/* Level Badge */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-base border border-yellow-500/20">
              {'⭐'.repeat(character.starRank || 1)}
            </div>

            {/* Name Overlay */}
            <div className="absolute top-3 left-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {character.name}
              </h2>
            </div>

            {/* Character Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
              <div className="space-y-3">
                <div className="text-center space-y-1">
                  <span className="block text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {getClassName(character.class)}
                  </span>
                </div>

                {/* Level Progress */}
                <div className="bg-black/30 p-2 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-purple-300 capitalize">Level</span>
                    <span className="text-sm text-purple-200">{level}</span>
                  </div>
                  <div className="w-full bg-purple-900/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCharacter({ ...character, editName: true });
                    }}
                    className="flex items-center justify-center px-3 py-1.5 bg-purple-600/40 hover:bg-purple-600/60 rounded text-sm font-medium text-purple-200 border border-purple-500/30 transition-colors duration-200"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Upgrade clicked');
                    }}
                    className="flex items-center justify-center px-3 py-1.5 bg-purple-600/40 hover:bg-purple-600/60 rounded text-sm font-medium text-purple-200 border border-purple-500/30 transition-colors duration-200"
                  >
                    <FaChartLine className="mr-1" /> Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section with Stylish Divider */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-grow"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500/50"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Quick Links
          </h2>
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500/50"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-grow"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.name}
              onClick={link.onClick}
              className="quick-action-btn hover:bg-purple-500/20 group"
            >
              <link.icon className="text-2xl text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors mt-1">
                {link.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Generator Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-grow"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500/50"></div>
        <h3 className="text-lg font-bold text-purple-300">AI Generator</h3>
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500/50"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-grow"></div>
      </div>

      {/* AI Generator Section */}
      <div className="space-y-4">
        {/* AI Settings */}
        <div className="space-y-3">
          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">Style</label>
            <select
              value={aiSettings.style}
              onChange={(e) => setAiSettings({ ...aiSettings, style: e.target.value })}
              className="w-full bg-black/40 backdrop-blur-sm text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              {styles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          {/* Effect */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">Effect</label>
            <select
              value={aiSettings.effects}
              onChange={(e) => setAiSettings({ ...aiSettings, effects: e.target.value })}
              className="w-full bg-black/40 backdrop-blur-sm text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              {effects.map((effect) => (
                <option key={effect} value={effect}>{effect}</option>
              ))}
            </select>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-2">
            <button
              onClick={handleRandomizeSettings}
              className="px-3 py-1.5 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 text-sm text-white flex items-center gap-1"
            >
              <FaDice /> Randomize
            </button>
            <button
              onClick={() => setAiSettings(initialAiSettings)}
              className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-500/20 transition-all duration-300 text-sm text-white flex items-center gap-1"
            >
              <FaUndo /> Reset
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateAiImage}
            disabled={generatingImage}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingImage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FaImage className="text-sm" />
                <span>Generate Image</span>
              </>
            )}
          </button>

          {/* API Configuration Note */}
          <div className="text-center text-sm text-purple-400/70">
            <p>AI Generator settings can be configured in the Admin Dashboard</p>
          </div>
        </div>

        {/* Sample Images */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-purple-300">Sample Images</div>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden border ${
                  previewIndex === index ? 'border-purple-500' : 'border-purple-500/30'
                } cursor-pointer transition-all duration-300 hover:border-purple-500`}
                onClick={() => setPreviewIndex(index)}
              >
                <img
                  src={`/sample${index + 1}.jpg`}
                  alt={`Sample ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {previewIndex === index && (
                  <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center">
                    <FaCheck className="text-white text-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGrid;
