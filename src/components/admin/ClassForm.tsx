import { useState } from 'react';

interface ClassFormProps {
  initialClass?: any;
  onSubmit: (classData: any) => void;
  onCancel: () => void;
}

export function ClassForm({ initialClass, onSubmit, onCancel }: ClassFormProps) {
  const [formData, setFormData] = useState({
    id: initialClass?.id || '',
    name: initialClass?.name || '',
    description: initialClass?.description || '',
    baseStats: initialClass?.baseStats || {
      power: 0,
      defense: 0,
      speed: 0,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: formData.id || `class-${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Class Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
          placeholder="e.g., Warrior, Mage, Rogue"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
          placeholder="Describe the class's unique traits and abilities..."
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Base Stats
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Power</label>
            <input
              type="number"
              value={formData.baseStats.power}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseStats: {
                    ...formData.baseStats,
                    power: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              min="0"
              max="100"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Defense</label>
            <input
              type="number"
              value={formData.baseStats.defense}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseStats: {
                    ...formData.baseStats,
                    defense: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              min="0"
              max="100"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Speed</label>
            <input
              type="number"
              value={formData.baseStats.speed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseStats: {
                    ...formData.baseStats,
                    speed: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              min="0"
              max="100"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          {initialClass ? 'Update Class' : 'Create Class'}
        </button>
      </div>
    </form>
  );
}
