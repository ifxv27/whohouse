import React, { useState } from 'react';
import { FaSave, FaUndo, FaPlus, FaTrash } from 'react-icons/fa';
import useAiGeneratorStore from '../../store/aiGeneratorStore';

const AiGeneratorConfig = () => {
  const settings = useAiGeneratorStore((state) => state.settings);
  const updateSettings = useAiGeneratorStore((state) => state.updateSettings);
  
  const [config, setConfig] = useState({
    apiKey: '',
    provider: 'openai', // or 'stable-diffusion', 'midjourney', etc.
    apiEndpoint: '',
    artStyles: [...settings.artStyles],
    effects: [...settings.effects],
  });

  const [newStyle, setNewStyle] = useState('');
  const [newEffect, setNewEffect] = useState('');

  const handleSave = () => {
    // Save API configuration securely
    // You might want to encrypt the API key or use environment variables
    localStorage.setItem('aiGenerator_provider', config.provider);
    localStorage.setItem('aiGenerator_endpoint', config.apiEndpoint);
    
    // Update store settings
    updateSettings({
      ...settings,
      artStyles: config.artStyles,
      effects: config.effects,
    });
  };

  const handleReset = () => {
    setConfig({
      ...config,
      artStyles: [...settings.artStyles],
      effects: [...settings.effects],
    });
  };

  const addStyle = () => {
    if (newStyle && !config.artStyles.includes(newStyle)) {
      setConfig({
        ...config,
        artStyles: [...config.artStyles, newStyle],
      });
      setNewStyle('');
    }
  };

  const addEffect = () => {
    if (newEffect && !config.effects.includes(newEffect)) {
      setConfig({
        ...config,
        effects: [...config.effects, newEffect],
      });
      setNewEffect('');
    }
  };

  const removeStyle = (style) => {
    setConfig({
      ...config,
      artStyles: config.artStyles.filter((s) => s !== style),
    });
  };

  const removeEffect = (effect) => {
    setConfig({
      ...config,
      effects: config.effects.filter((e) => e !== effect),
    });
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">AI Generator Configuration</h2>

      {/* API Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300">API Settings</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">Provider</label>
            <select
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value })}
              className="w-full bg-black/40 backdrop-blur-sm text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="openai">OpenAI DALL-E</option>
              <option value="stable-diffusion">Stable Diffusion</option>
              <option value="midjourney">Midjourney</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">API Key</label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full bg-black/40 backdrop-blur-sm text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder="Enter API key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">API Endpoint</label>
            <input
              type="text"
              value={config.apiEndpoint}
              onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
              className="w-full bg-black/40 backdrop-blur-sm text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              placeholder="Enter API endpoint"
            />
          </div>
        </div>
      </div>

      {/* Styles Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300">Art Styles</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newStyle}
            onChange={(e) => setNewStyle(e.target.value)}
            className="flex-1 bg-black/40 backdrop-blur-sm text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            placeholder="Add new style"
          />
          <button
            onClick={addStyle}
            className="px-3 py-2 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300"
          >
            <FaPlus className="text-purple-300" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {config.artStyles.map((style) => (
            <div
              key={style}
              className="flex items-center justify-between px-3 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30"
            >
              <span className="text-white">{style}</span>
              <button
                onClick={() => removeStyle(style)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Effects Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300">Effects</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newEffect}
            onChange={(e) => setNewEffect(e.target.value)}
            className="flex-1 bg-black/40 backdrop-blur-sm text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
            placeholder="Add new effect"
          />
          <button
            onClick={addEffect}
            className="px-3 py-2 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300"
          >
            <FaPlus className="text-purple-300" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {config.effects.map((effect) => (
            <div
              key={effect}
              className="flex items-center justify-between px-3 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30"
            >
              <span className="text-white">{effect}</span>
              <button
                onClick={() => removeEffect(effect)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-500/20 transition-all duration-300 text-white flex items-center gap-2"
        >
          <FaUndo /> Reset
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 text-white flex items-center gap-2"
        >
          <FaSave /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default AiGeneratorConfig;
