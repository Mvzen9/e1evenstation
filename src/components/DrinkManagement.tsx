import React, { useState } from 'react';
import { Coffee, Plus, Trash2, X, Edit2 } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { formatCurrency } from '../utils/formatting';
import { showDrinkAdded, showDrinkDeleted } from '../utils/alerts';

export const DrinkManagement: React.FC = () => {
  const { state, dispatch } = useCafe();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDrink, setEditingDrink] = useState<string | null>(null);
  const [newDrink, setNewDrink] = useState({
    name: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const drinkData = {
      id: editingDrink || Date.now().toString(),
      name: newDrink.name,
      price: parseFloat(newDrink.price),
    };

    if (editingDrink) {
      dispatch({ type: 'UPDATE_DRINK', payload: drinkData });
    } else {
      dispatch({ type: 'ADD_DRINK', payload: drinkData });
    }

    const currentDrinks = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const updatedDrinks = editingDrink 
      ? currentDrinks.map((d: any) => d.id === drinkData.id ? drinkData : d)
      : [...currentDrinks, drinkData];
    localStorage.setItem('menuItems', JSON.stringify(updatedDrinks));

    await showDrinkAdded(drinkData.name);
    setNewDrink({ name: '', price: '' });
    setShowAddForm(false);
    setEditingDrink(null);
  };

  const handleEdit = (drink: any) => {
    setNewDrink({
      name: drink.name,
      price: drink.price.toString(),
    });
    setEditingDrink(drink.id);
    setShowAddForm(true);
  };

  const handleDelete = async (drink: any) => {
    dispatch({ type: 'DELETE_DRINK', payload: drink.id });
    
    const currentDrinks = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const updatedDrinks = currentDrinks.filter((d: any) => d.id !== drink.id);
    localStorage.setItem('menuItems', JSON.stringify(updatedDrinks));
    
    await showDrinkDeleted(drink.name);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Drink Management</h2>
        <button
          onClick={() => {
            setNewDrink({ name: '', price: '' });
            setEditingDrink(null);
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Drink
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingDrink ? 'Edit Drink' : 'Add New Drink'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingDrink(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drink Name
                </label>
                <input
                  type="text"
                  value={newDrink.name}
                  onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter drink name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (EGP)
                </label>
                <input
                  type="number"
                  value={newDrink.price}
                  onChange={(e) => setNewDrink({ ...newDrink, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price in EGP"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingDrink(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingDrink ? 'Update Drink' : 'Add Drink'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {state.drinks.map((drink) => (
          <div
            key={drink.id}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:border-blue-200 transition-all duration-200"
          >
            <div className="flex justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Coffee className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{drink.name}</h3>
                  <p className="text-blue-600 font-semibold mt-2">
                    {formatCurrency(drink.price)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(drink)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(drink)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};