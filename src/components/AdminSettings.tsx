import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { showSuccess } from '../utils/alerts';
import { formatCurrency } from '../utils/formatting';
import { RoomRates } from '../types/room';

export const AdminSettings: React.FC = () => {
  const { state, dispatch } = useCafe();
  const [rates, setRates] = useState<RoomRates>(state.roomRates);

  const handleUpdateRates = async () => {
    dispatch({ type: 'UPDATE_ROOM_RATES', payload: rates });
    await showSuccess(
      'Room Rates Updated',
      `PS5: ${formatCurrency(rates.PS5)}/hr\nPS4: ${formatCurrency(rates.PS4)}/hr\nBilliards: ${formatCurrency(rates.Billiards)}/hr`
    );
  };

  const validateRate = (value: string): number => {
    const rate = Number(value);
    return rate > 0 ? rate : 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-full">
            <SettingsIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Room Rate Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(Object.keys(rates) as Array<keyof RoomRates>).map((type) => (
                  <tr key={type}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(state.roomRates[type])}/hr
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={rates[type]}
                        onChange={(e) =>
                          setRates({
                            ...rates,
                            [type]: validateRate(e.target.value),
                          })
                        }
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleUpdateRates}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Save className="w-5 h-5" />
              Update Rates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};