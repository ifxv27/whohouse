import React, { useState } from 'react';
import { useStore } from '../../store/gameStore';

const ClassManager = () => {
  const { classes, addClass, updateClass, deleteClass } = useStore();
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    baseStats: {
      health: 100,
      attack: 10,
      defense: 10,
      speed: 10,
      magic: 10
    },
    abilities: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('baseStats.')) {
      const statName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        baseStats: {
          ...prev.baseStats,
          [statName]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClass) {
      updateClass(editingClass.id, formData);
      setEditingClass(null);
    } else {
      addClass(formData);
    }
    setFormData({
      name: '',
      description: '',
      icon: '',
      baseStats: {
        health: 100,
        attack: 10,
        defense: 10,
        speed: 10,
        magic: 10
      },
      abilities: []
    });
  };

  const handleEdit = (classData) => {
    setEditingClass(classData);
    setFormData({
      name: classData.name,
      description: classData.description,
      icon: classData.icon,
      baseStats: {
        health: classData.baseStats?.health || 100,
        attack: classData.baseStats?.attack || 10,
        defense: classData.baseStats?.defense || 10,
        speed: classData.baseStats?.speed || 10,
        magic: classData.baseStats?.magic || 10
      },
      abilities: classData.abilities || []
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteClass(id);
    }
  };

  const renderStatBar = (value, maxValue = 100) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Class Manager</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Class Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            {editingClass ? 'Edit Class' : 'Add New Class'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Icon URL or emoji"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Base Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Health</label>
                  <input
                    type="number"
                    name="baseStats.health"
                    value={formData.baseStats.health}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Attack</label>
                  <input
                    type="number"
                    name="baseStats.attack"
                    value={formData.baseStats.attack}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Defense</label>
                  <input
                    type="number"
                    name="baseStats.defense"
                    value={formData.baseStats.defense}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Speed</label>
                  <input
                    type="number"
                    name="baseStats.speed"
                    value={formData.baseStats.speed}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Magic</label>
                  <input
                    type="number"
                    name="baseStats.magic"
                    value={formData.baseStats.magic}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {editingClass && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingClass(null);
                    setFormData({
                      name: '',
                      description: '',
                      icon: '',
                      baseStats: {
                        health: 100,
                        attack: 10,
                        defense: 10,
                        speed: 10,
                        magic: 10
                      },
                      abilities: []
                    });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingClass ? 'Update Class' : 'Add Class'}
              </button>
            </div>
          </form>
        </div>

        {/* Classes Grid */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Available Classes ({classes.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {classes.map((classData) => (
              <div
                key={classData.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {classData.icon && (
                      <span className="text-2xl">{classData.icon}</span>
                    )}
                    <div>
                      <h4 className="font-semibold">{classData.name}</h4>
                      <p className="text-sm text-gray-600">
                        {classData.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(classData)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(classData.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Health</span>
                      <span>{classData.baseStats?.health || 0}</span>
                    </div>
                    {renderStatBar(classData.baseStats?.health)}
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Attack</span>
                      <span>{classData.baseStats?.attack || 0}</span>
                    </div>
                    {renderStatBar(classData.baseStats?.attack)}
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Defense</span>
                      <span>{classData.baseStats?.defense || 0}</span>
                    </div>
                    {renderStatBar(classData.baseStats?.defense)}
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Speed</span>
                      <span>{classData.baseStats?.speed || 0}</span>
                    </div>
                    {renderStatBar(classData.baseStats?.speed)}
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Magic</span>
                      <span>{classData.baseStats?.magic || 0}</span>
                    </div>
                    {renderStatBar(classData.baseStats?.magic)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManager;
