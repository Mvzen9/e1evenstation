import React, { useState, useEffect } from 'react';
import { Monitor, Coffee, Plus, CupSoda, CheckSquare, Dices } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { formatDuration } from '../utils/timeUtils';
import { formatCurrency, calculateRoomCharge } from '../utils/formatting';
import { BookingForm } from './BookingForm';
import { DrinkMenu } from './DrinkMenu';
import { Checkout } from './Checkout';

export const RoomGrid: React.FC = () => {
  const { state } = useCafe();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'booking' | 'drinks' | 'checkout' | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRoomAction = (roomId: number, action: 'booking' | 'drinks' | 'checkout') => {
    setSelectedRoom(roomId);
    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRoom(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {state.rooms.map((room) => {
          const duration = room.currentSession
            ? Date.now() - room.currentSession.startTime
            : 0;
          const roomCharge = room.currentSession
            ? calculateRoomCharge(duration, state.roomRates[room.type])
            : 0;

          return (
            <div
              key={room.id}
              className={`relative rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 min-h-[300px] ${
                room.isOccupied
                  ? 'bg-gradient-to-br from-red-100 to-pink-100 border-2 border-red-300'
                  : 'bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-300'
              }`}
            >
              <div className="absolute top-6 right-6">
                {room.type === 'billiards' ? (
                  <Dices className="w-8 h-8 text-gray-700" />
                ) : (
                  <Monitor className="w-8 h-8 text-gray-700" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{room.name}</h3>
              {room.currentSession ? (
                <>
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700 font-medium">
                      {room.currentSession.Name}
                    </p>
                    <p className="text-md text-gray-600">
                      {room.currentSession.PhoneNum}
                    </p>
                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                      <Coffee className="w-5 h-5 text-amber-600" />
                      <span className="text-md font-medium text-gray-700">
                        Orders: {room.currentSession.orders.length}
                      </span>
                    </div>
                    <div className="space-y-2 bg-white/50 p-3 rounded-lg">
                      <p className="text-lg font-medium text-gray-700">
                        Duration: {formatDuration(duration)}
                      </p>
                      <p className="text-md font-medium text-blue-600">
                        Current Charge: {formatCurrency(roomCharge)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rate: {formatCurrency(state.roomRates[room.type])}/hr
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => handleRoomAction(room.id, 'drinks')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-lg"
                    >
                      <CupSoda className="w-5 h-5" />
                      Add Drinks
                    </button>
                    <button
                      onClick={() => handleRoomAction(room.id, 'checkout')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg"
                    >
                      <CheckSquare className="w-5 h-5" />
                      Checkout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-emerald-600 font-medium mb-4">Available</p>
                  <p className="text-md text-gray-600 mb-4">
                    Rate: {formatCurrency(state.roomRates[room.type])}/hr
                  </p>
                  <button
                    onClick={() => handleRoomAction(room.id, 'booking')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Book Room
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {activeModal === 'booking' && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <BookingForm roomId={selectedRoom} onClose={closeModal} />
          </div>
        </div>
      )}

      {activeModal === 'drinks' && selectedRoom && (
        <DrinkMenu roomId={selectedRoom} onClose={closeModal} />
      )}

      {activeModal === 'checkout' && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <Checkout roomId={selectedRoom} onClose={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};