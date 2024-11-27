import React, { useState } from 'react';
import { FaRobot, FaSave, FaPlus, FaTrash, FaCog, FaDollarSign, FaGem } from 'react-icons/fa';
import useAiGeneratorStore from '../../store/aiGeneratorStore';

const AiGeneratorSettings = () => {
  const { 
    settings, 
    categories,
    costs,
    updateCategory, 
    resetCategory, 
    resetAllSettings, 
    updateApiSettings,
    updateCategorySettings,
    updateCosts
  } = useAiGeneratorStore();

  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('artStyles');
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'costs', or 'api'

  const [apiSettings, setApiSettings] = useState({
    activeProvider: localStorage.getItem('aiGenerator_provider') || 'seaart',
    providers: {
      seaart: {
        apiKey: localStorage.getItem('seaart_api_key') || '',
        enabled: true
      },
      tensorart: {
        apiKey: localStorage.getItem('tensorart_api_key') || '',
        enabled: true
      },
      leonardo: {
        apiKey: localStorage.getItem('leonardo_api_key') || '',
        enabled: true
      },
      webui: {
        endpoint: localStorage.getItem('webui_endpoint') || 'http://localhost:7860',
        enabled: false
      },
      flux: {
        enabled: false
      }
    }
  });

  const handleAddItem = () => {
    if (newItem.trim()) {
      const currentItems = settings[selectedCategory] || [];
      updateCategory(selectedCategory, [...currentItems, newItem.trim()]);
      setNewItem('');
      setSaveStatus('Changes saved automatically');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleRemoveItem = (category, item) => {
    const currentItems = settings[category] || [];
    updateCategory(category, currentItems.filter(i => i !== item));
    setSaveStatus('Changes saved automatically');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleCategorySettingChange = (categoryKey, field, value) => {
    updateCategorySettings(categoryKey, { [field]: value });
    setSaveStatus('Category settings updated');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleCostChange = (type, field, value) => {
    const newCosts = { ...costs };
    if (type === 'base') {
      newCosts.base[field] = parseInt(value) || 0;
    } else if (type === 'multiplier') {
      newCosts.multipliers[field] = parseFloat(value) || 1;
    } else if (type === 'level') {
      newCosts.levelMultiplier = parseFloat(value) || 0.1;
    }
    updateCosts(newCosts);
    setSaveStatus('Cost settings updated');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleApiSettingChange = (provider, key, value) => {
    setApiSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          [key]: value
        }
      }
    }));
  };

  const handleSaveApiSettings = () => {
    Object.entries(apiSettings.providers).forEach(([provider, settings]) => {
      if (settings.apiKey) {
        localStorage.setItem(`${provider}_api_key`, settings.apiKey);
      }
      if (settings.endpoint) {
        localStorage.setItem(`${provider}_endpoint`, settings.endpoint);
      }
    });
    localStorage.setItem('aiGenerator_provider', apiSettings.activeProvider);
    
    updateApiSettings(apiSettings);
    setSaveStatus('API settings saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaRobot className="text-purple-400" size={24} />
          <h2 className="text-2xl font-bold text-purple-300">AI Generator Settings</h2>
        </div>
        {saveStatus && (
          <div className="text-green-400 text-sm animate-fade-in">
            {saveStatus}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-purple-500/30">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 ${
            activeTab === 'categories'
              ? 'text-purple-300 border-b-2 border-purple-500'
              : 'text-purple-400 hover:text-purple-300'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('costs')}
          className={`px-4 py-2 ${
            activeTab === 'costs'
              ? 'text-purple-300 border-b-2 border-purple-500'
              : 'text-purple-400 hover:text-purple-300'
          }`}
        >
          Costs
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 ${
            activeTab === 'api'
              ? 'text-purple-300 border-b-2 border-purple-500'
              : 'text-purple-400 hover:text-purple-300'
          }`}
        >
          API Settings
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="bg-black/20 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-purple-300">{category.displayName}</h3>
                  <input
                    type="checkbox"
                    checked={category.enabled}
                    onChange={(e) => handleCategorySettingChange(key, 'enabled', e.target.checked)}
                    className="ml-2"
                  />
                </div>
                <input
                  type="text"
                  value={category.description}
                  onChange={(e) => handleCategorySettingChange(key, 'description', e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100 mb-2"
                  placeholder="Category description"
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm text-purple-300">Cost Multiplier:</label>
                  <input
                    type="number"
                    value={category.costMultiplier}
                    onChange={(e) => handleCategorySettingChange(key, 'costMultiplier', parseFloat(e.target.value))}
                    className="w-24 bg-black/50 border border-purple-500/30 rounded-lg px-3 py-1 text-purple-100"
                    step="0.1"
                    min="0.1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Costs Tab */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          <div className="bg-black/20 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Base Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-purple-400" />
                  <label className="text-sm text-purple-300">Base Money Cost:</label>
                </div>
                <input
                  type="number"
                  value={costs.base.money}
                  onChange={(e) => handleCostChange('base', 'money', e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaGem className="text-purple-400" />
                  <label className="text-sm text-purple-300">Base Gems Cost:</label>
                </div>
                <input
                  type="number"
                  value={costs.base.gems}
                  onChange={(e) => handleCostChange('base', 'gems', e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Level Multiplier</h3>
            <div className="space-y-2">
              <label className="text-sm text-purple-300">Cost Increase per Level (%):</label>
              <input
                type="number"
                value={costs.levelMultiplier * 100}
                onChange={(e) => handleCostChange('level', 'multiplier', e.target.value / 100)}
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100"
                step="1"
                min="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* API Configuration Tab */}
      {activeTab === 'api' && (
        <div className="space-y-4 bg-black/20 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center gap-2">
            <FaCog className="text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-300">API Configuration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-purple-300">Active Provider</label>
              <select
                value={apiSettings.activeProvider}
                onChange={(e) => setApiSettings({ ...apiSettings, activeProvider: e.target.value })}
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100"
              >
                <option value="seaart">SeaArt.ai</option>
                <option value="tensorart">TensorArt</option>
                <option value="leonardo">Leonardo.ai</option>
                <option value="webui">Stable Diffusion WebUI</option>
                <option value="flux">Flux Models (Free)</option>
              </select>
            </div>

            {Object.entries(apiSettings.providers).map(([provider, settings]) => (
              <div key={provider} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-purple-300">
                    {provider.charAt(0).toUpperCase() + provider.slice(1)} {settings.apiKey ? 'API Key' : 'Endpoint'}
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => handleApiSettingChange(provider, 'enabled', e.target.checked)}
                    className="ml-2"
                  />
                </div>
                {settings.apiKey !== undefined && (
                  <input
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => handleApiSettingChange(provider, 'apiKey', e.target.value)}
                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100"
                    placeholder={`Enter ${provider} API Key`}
                  />
                )}
                {settings.endpoint !== undefined && (
                  <input
                    type="text"
                    value={settings.endpoint}
                    onChange={(e) => handleApiSettingChange(provider, 'endpoint', e.target.value)}
                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-100"
                    placeholder={`Enter ${provider} Endpoint`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleSaveApiSettings}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaSave />
              Save API Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiGeneratorSettings;
