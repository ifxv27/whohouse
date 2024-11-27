import { useState } from 'react';
import { useStore } from '../../store/gameStore';

interface CardFormProps {
  initialCard?: any;
  onSubmit: (cardData: any) => void;
  onCancel: () => void;
}

export function CardForm({ initialCard, onSubmit, onCancel }: CardFormProps) {
  const { classes, categories } = useStore();
  console.log('Initial Card:', initialCard);
  console.log('Available Classes:', classes);
  console.log('Available Categories:', categories);

  const [formData, setFormData] = useState({
    name: initialCard?.name || '',
    description: initialCard?.description || '',
    imageUrl: initialCard?.imageUrl || '',
    class: initialCard?.class || '',
    category: initialCard?.category || '',
    rank: initialCard?.rank || 'COMMON',
    power: initialCard?.power || 0,
    defense: initialCard?.defense || 0,
    speed: initialCard?.speed || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSubmit({
      ...formData,
      id: initialCard?.id || `card-${Date.now()}`,
    });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    console.log('Selected class ID:', classId);
    setFormData({ ...formData, class: classId });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    console.log('Selected category ID:', categoryId);
    setFormData({ ...formData, category: categoryId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Card Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Class
          </label>
          <select
            value={formData.class}
            onChange={handleClassChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            required
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Rank
          </label>
          <select
            value={formData.rank}
            onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            required
          >
            <option value="COMMON">Common ⭐</option>
            <option value="RARE">Rare ⭐⭐</option>
            <option value="EPIC">Epic ⭐⭐⭐</option>
            <option value="LEGEND">Legend ⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Stats
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Power</label>
            <input
              type="number"
              value={formData.power}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  power: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Defense</label>
            <input
              type="number"
              value={formData.defense}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  defense: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Speed</label>
            <input
              type="number"
              value={formData.speed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  speed: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              min="0"
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
          {initialCard ? 'Update Card' : 'Create Card'}
        </button>
      </div>
    </form>
  );
}
