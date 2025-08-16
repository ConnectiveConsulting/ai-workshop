'use client';

import { useState, useCallback, useMemo } from 'react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [totalCompletedCount, setTotalCompletedCount] = useState(0);

  const completedCount = useMemo(() => 
    items.filter(item => item.completed).length, [items]
  );
  
  const totalCount = useMemo(() => items.length, [items]);

  const addItem = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newCompleted = !item.completed;
          setTotalCompletedCount(prevCount => 
            newCompleted ? prevCount + 1 : prevCount - 1
          );
          return { ...item, completed: newCompleted };
        }
        return item;
      })
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const itemToDelete = prev.find(item => item.id === id);
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setItems(prev => {
      const completedItems = prev.filter(item => item.completed);
      return prev.filter(item => !item.completed);
    });
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    addItem(newItemText);
  }, [addItem, newItemText]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Checklist Manager</h1>
      
      {/* Total Completed Counter */}
      <div className="text-center mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{totalCompletedCount}</div>
        <div className="text-sm text-blue-600">Total Tasks Completed</div>
      </div>
      
      {/* Add new item form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a new checklist item..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      {/* Current Stats */}
      <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
        <span>{completedCount} of {totalCount} currently completed</span>
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-red-500 hover:text-red-700 underline"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
              item.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span
              className={`flex-1 ${
                item.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {item.text}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label="Delete item"
            >
              ×
            </button>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No checklist items yet. Add one above to get started!
          </div>
        )}
      </div>
    </div>
  );
} 