import { useState } from 'react'
import { useCards } from '../../hooks/useCards'
import { Card } from '../../types/card'
import { CardForm } from './CardForm'
import { useStore } from '../../store/gameStore'
import { ClassForm } from './ClassForm'
import useDailyTaskStore from '../../store/dailyTaskStore'

const TABS = {
  CARDS: 'cards',
  CLASSES: 'classes',
  CATEGORIES: 'categories',
  DAILY_TASKS: 'daily_tasks'
} as const;

const CARD_RANKS = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary'
} as const;

export default function CardManagement() {
  const { cards, addCard, updateCard, deleteCard } = useCards()
  const { classes, categories, addClass, updateClass, deleteClass, addCategory, updateCategory, deleteCategory } = useStore()
  const { 
    settings: dailyTaskSettings,
    updateSettings: updateDailyTaskSettings,
    dailyCardPool,
    addToCardPool,
    removeFromCardPool,
    clearCardPool,
    currentDailyCard
  } = useDailyTaskStore()
  
  // Helper functions to get names
  const getClassName = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem?.name || 'Unknown Class';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const [activeTab, setActiveTab] = useState<keyof typeof TABS>('CARDS')
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [editingClass, setEditingClass] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [previewCard, setPreviewCard] = useState(null)

  const handleAddCard = (newCard: Omit<Card, 'id'>) => {
    addCard(newCard)
    setIsDialogOpen(false)
  }

  const handleUpdateCard = (updatedCard: Card) => {
    updateCard(updatedCard)
    setEditingCard(null)
    setIsDialogOpen(false)
  }

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(id)
    }
  }

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryFilter === 'All' ? matchesSearch : matchesSearch && card.category === categoryFilter;
  })

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {Object.entries(TABS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as keyof typeof TABS)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === key
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'CARDS' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-300">Card Management</h1>
            <button
              onClick={() => {
                setEditingCard(null)
                setIsDialogOpen(true)
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add New Card
            </button>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredCards.map(card => (
              <div
                key={card.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <div className="relative aspect-[4/5]">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="absolute top-2 left-2">
                      <span className="text-yellow-400 text-lg">
                        {CARD_RANKS[card.rank]?.stars || '⭐'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-lg font-bold text-white mb-1">{card.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-purple-500/50 rounded text-sm text-white">
                          {getClassName(card.class)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-500/50 rounded text-sm text-white">
                          {getCategoryName(card.category)}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => {
                          setEditingCard(card)
                          setIsDialogOpen(true)
                        }}
                        className="p-2 bg-blue-600/80 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-2 bg-red-600/80 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-700 bg-gray-800/50">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="text-yellow-400">PWR</div>
                      <div className="text-white">{card.power}</div>
                    </div>
                    <div>
                      <div className="text-green-400">DEF</div>
                      <div className="text-white">{card.defense}</div>
                    </div>
                    <div>
                      <div className="text-blue-400">SPD</div>
                      <div className="text-white">{card.speed}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'CLASSES' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-300">Class Management</h1>
            <button
              onClick={() => setEditingClass({})}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add New Class
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(classItem => (
              <div
                key={classItem.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{classItem.name}</h3>
                    <p className="text-sm text-gray-400">{classItem.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingClass(classItem)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteClass(classItem.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm">
                    <div className="text-yellow-400">PWR</div>
                    <div className="text-white">{classItem.baseStats?.power || 0}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-green-400">DEF</div>
                    <div className="text-white">{classItem.baseStats?.defense || 0}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-blue-400">SPD</div>
                    <div className="text-white">{classItem.baseStats?.speed || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'CATEGORIES' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-300">Category Management</h1>
            <button
              onClick={() => setEditingCategory({})}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add New Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <div
                key={category.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-gray-400">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-purple-300">
                  Displays in: {category.displayGrid} grid
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'DAILY_TASKS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-300">Daily Task Settings</h1>
            <div className="flex gap-4">
              <button
                onClick={() => updateDailyTaskSettings({ enabled: !dailyTaskSettings.enabled })}
                className={`px-4 py-2 rounded-md ${
                  dailyTaskSettings.enabled
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {dailyTaskSettings.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lucky Roll Settings */}
            <div className="bg-gray-800 rounded-lg p-4 col-span-2">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Lucky Roll Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Rarity Chances</label>
                    <div className="space-y-2">
                      {Object.entries(CARD_RANKS).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-white">{value}:</span>
                          <input
                            type="number"
                            value={dailyTaskSettings.luckyRollChances?.[key] || 0}
                            onChange={(e) => updateDailyTaskSettings({
                              luckyRollChances: {
                                ...dailyTaskSettings.luckyRollChances,
                                [key]: parseFloat(e.target.value)
                              }
                            })}
                            className="w-24 bg-gray-700 text-white rounded-md p-2"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <span className="text-gray-400">%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Preview Lucky Roll</label>
                    <button
                      onClick={() => {
                        const roll = Math.random() * 100;
                        let cumulative = 0;
                        let selectedRarity = 'common';
                        
                        for (const [rarity, chance] of Object.entries(dailyTaskSettings.luckyRollChances || {})) {
                          cumulative += chance;
                          if (roll <= cumulative) {
                            selectedRarity = rarity;
                            break;
                          }
                        }
                        
                        // Filter cards by rarity that aren't in player's inventory
                        const eligibleCards = cards.filter(card => 
                          card.rank === selectedRarity && 
                          !currentDailyCard?.inventory?.some(inv => inv.id === card.id)
                        );
                        
                        if (eligibleCards.length > 0) {
                          const randomCard = eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
                          setPreviewCard(randomCard);
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    >
                      Test Roll
                    </button>
                    
                    {previewCard && (
                      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={previewCard.imageUrl}
                            alt={previewCard.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="text-white font-semibold">{previewCard.name}</h4>
                            <p className="text-gray-400">Rarity: {CARD_RANKS[previewCard.rank]}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rarity Range Settings */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Rarity Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Minimum Rarity</label>
                  <select
                    value={dailyTaskSettings.minRarity}
                    onChange={(e) => updateDailyTaskSettings({ minRarity: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-md p-2"
                  >
                    {Object.entries(CARD_RANKS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Maximum Rarity</label>
                  <select
                    value={dailyTaskSettings.maxRarity}
                    onChange={(e) => updateDailyTaskSettings({ maxRarity: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-md p-2"
                  >
                    {Object.entries(CARD_RANKS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Level Range Settings */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Level Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Minimum Level</label>
                  <input
                    type="number"
                    value={dailyTaskSettings.levelRange.min}
                    onChange={(e) => updateDailyTaskSettings({
                      levelRange: {
                        ...dailyTaskSettings.levelRange,
                        min: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-gray-700 text-white rounded-md p-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Maximum Level</label>
                  <input
                    type="number"
                    value={dailyTaskSettings.levelRange.max}
                    onChange={(e) => updateDailyTaskSettings({
                      levelRange: {
                        ...dailyTaskSettings.levelRange,
                        max: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-gray-700 text-white rounded-md p-2"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Category Settings */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Category Settings</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dailyTaskSettings.allowedCategories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...dailyTaskSettings.allowedCategories, category.id]
                          : dailyTaskSettings.allowedCategories.filter(id => id !== category.id);
                        updateDailyTaskSettings({ allowedCategories: newCategories });
                      }}
                      className="rounded"
                    />
                    <span className="text-white">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reward Settings */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Reward Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Reward Multiplier</label>
                  <input
                    type="number"
                    value={dailyTaskSettings.rewardMultiplier}
                    onChange={(e) => updateDailyTaskSettings({
                      rewardMultiplier: parseFloat(e.target.value)
                    })}
                    className="w-full bg-gray-700 text-white rounded-md p-2"
                    step="0.1"
                    min="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Daily Card Preview */}
          {currentDailyCard && (
            <div className="mt-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Current Daily Card</h3>
              <div className="flex items-center gap-4">
                <img
                  src={currentDailyCard.imageUrl}
                  alt={currentDailyCard.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h4 className="text-white font-semibold">{currentDailyCard.name}</h4>
                  <p className="text-gray-400">Rarity: {CARD_RANKS[currentDailyCard.rarity]}</p>
                  <p className="text-gray-400">Level: {currentDailyCard.level}</p>
                  <p className="text-gray-400">Category: {getCategoryName(currentDailyCard.category)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Existing dialogs */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {editingCard && (
                <>
                  <h2 className="text-xl font-bold text-purple-300 mb-4">
                    Edit Card
                  </h2>
                  <CardForm
                    initialCard={editingCard}
                    onSubmit={handleUpdateCard}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </>
              )}
              {!editingCard && (
                <>
                  <h2 className="text-xl font-bold text-purple-300 mb-4">
                    Add New Card
                  </h2>
                  <CardForm
                    onSubmit={handleAddCard}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Class editing dialog */}
      {editingClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-purple-300 mb-4">
                {editingClass.id ? 'Edit Class' : 'Add New Class'}
              </h2>
              <ClassForm
                initialClass={editingClass}
                onSubmit={(classData) => {
                  if (classData.id && classes.some(c => c.id === classData.id)) {
                    updateClass(classData);
                  } else {
                    addClass(classData);
                  }
                  setEditingClass(null);
                }}
                onCancel={() => setEditingClass(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
