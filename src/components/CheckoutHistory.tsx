import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatDate } from '../utils/formatting';
import { formatDuration } from '../utils/timeUtils';
import { Clock, DollarSign, Coffee, Search, Calendar, User } from 'lucide-react';
import { formatCurrency } from '../utils/formatting';

export const CheckoutHistory: React.FC = () => {
  const { state } = useCafe();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredHistory = state.checkoutHistory.filter(checkout => {
    const matchesSearch = 
      checkout.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.phoneNumber.includes(searchTerm) ||
      checkout.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!filterDate) return matchesSearch;
    
    const checkoutDate = new Date(checkout.endTime).toISOString().split('T')[0];
    return matchesSearch && checkoutDate === filterDate;
  });

  const totalRevenue = filteredHistory.reduce(
    (sum, checkout) => sum + checkout.totalAmount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout History</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by customer or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredHistory.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <Coffee className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Drinks Ordered</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredHistory.reduce(
                    (sum, checkout) =>
                      sum +
                      checkout.orders.reduce((total, order) => total + order.quantity, 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time & Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charges
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((checkout) => (
                <tr key={checkout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{checkout.roomName}</p>
                      <p className="text-sm text-gray-500">{checkout.customerName}</p>
                      <p className="text-sm text-gray-400">{checkout.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(checkout.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(checkout.duration)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-gray-900 font-medium">
                        Total: {formatCurrency(checkout.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Room: {formatCurrency(checkout.roomCharge)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Drinks: {formatCurrency(checkout.drinksTotal)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {checkout.orders.map((order, index) => {
                        const drink = state.drinks.find(d => d.id === order.drinkId);
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-gray-600">
                              {drink?.name} x{order.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};