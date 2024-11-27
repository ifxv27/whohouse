import React, { useState } from "react";
import { useStore } from "../../store/gameStore";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSave,
  FaTimes,
  FaCoins,
  FaClock,
  FaTrophy,
  FaPlus,
  FaTag
} from "react-icons/fa";

const TaskManager = () => {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: 100,
    rewardType: "coins", // coins, item, card, experience
    difficulty: "Easy",
    timeLimit: "",
    requirements: "",
    category: "Daily",
    status: "active",
    rewardItems: [], // Additional rewards
    imageUrl: "",
  });

  const difficulties = ["Easy", "Medium", "Hard", "Expert"];
  const categories = ["Daily", "Weekly", "Story", "Achievement", "Special Event"];
  const rewardTypes = ["coins", "item", "card", "experience"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now(),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: editingTask?.progress || 0,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reward: 100,
      rewardType: "coins",
      difficulty: "Easy",
      timeLimit: "",
      requirements: "",
      category: "Daily",
      status: "active",
      rewardItems: [],
      imageUrl: "",
    });
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      ...task,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const filteredTasks = tasks?.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Task Management</h2>
        </div>
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Form */}
        <div className="lg:col-span-4">
          <div className="bg-purple-900/50 rounded-xl border border-purple-500/30 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-purple-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2">Reward Type</label>
                  <select
                    name="rewardType"
                    value={formData.rewardType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {rewardTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 mb-2">
                    Reward Amount
                  </label>
                  <input
                    type="number"
                    name="reward"
                    value={formData.reward}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Time Limit</label>
                <input
                  type="text"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                  placeholder="e.g., 24h, 7d, or leave empty for no limit"
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Enter any special requirements or prerequisites"
                  rows="2"
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-2 bg-gray-700/50 rounded-lg font-semibold text-white hover:bg-gray-600/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-purple-900/50 rounded-xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all duration-300"
              >
                {task.imageUrl && (
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {task.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-purple-300 hover:text-purple-100 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-pink-300 hover:text-pink-100 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="text-purple-200 text-sm mb-4">
                  {task.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-purple-300">
                    <FaCoins />
                    <span>
                      {task.reward} {task.rewardType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <FaClock />
                    <span>{task.timeLimit || "No limit"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <FaTrophy />
                    <span>{task.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <FaTag />
                    <span>{task.category}</span>
                  </div>
                </div>

                {task.requirements && (
                  <div className="mt-4 text-sm text-purple-300">
                    <strong>Requirements:</strong> {task.requirements}
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

export default TaskManager;
