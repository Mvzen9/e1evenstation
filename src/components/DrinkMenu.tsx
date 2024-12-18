import React, { useState } from 'react';
import { Coffee, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { formatCurrency } from '../utils/formatting';

export const DrinkMenu: React.FC<{ roomId: number; onClose: () => void }> = ({ roomId, onClose }) => {
  const { state, dispatch } = useCafe();
  const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>({});

  const handleQuantityChange = (drinkId: string, delta: number) => {
    setSelectedDrinks(prev => {
      const currentQty = prev[drinkId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        const { [drinkId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [drinkId]: newQty };
    });
  };

  const handleAddToOrder = () => {
    Object.entries(selectedDrinks).forEach(([drinkId, quantity]) => {
      dispatch({
        type: 'ADD_DRINK_ORDER',
        payload: {
          roomId,
          order: {
            drinkId,
            quantity,
            timestamp: Date.now(),
          },
        },
      });
    });
    onClose();
  };

  const getTotalPrice = () => {
    return Object.entries(selectedDrinks).reduce((total, [drinkId, quantity]) => {
      const drink = state.drinks.find(d => d.id === drinkId);
      return total + (drink?.price || 0) * quantity;
    }, 0);
  };

  const hasSelections = Object.keys(selectedDrinks).length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end transition-all duration-300">
      <div className="bg-white w-full max-w-md h-full shadow-xl transform transition-transform duration-300 overflow-hidden flex flex-col">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Drinks Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4">
            {state.drinks.map((drink) => (
              <div
                key={drink.id}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:border-blue-200 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Coffee className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{drink.name}</h3>
                      <p className="text-blue-600 font-semibold mt-1">
                        {formatCurrency(drink.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(drink.id, -1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={!selectedDrinks[drink.id]}
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {selectedDrinks[drink.id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(drink.id, 1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border-t">
          {hasSelections && (
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-900">
                Total: {formatCurrency(getTotalPrice())}
              </p>
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToOrder}
              disabled={!hasSelections}
              className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                hasSelections
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};