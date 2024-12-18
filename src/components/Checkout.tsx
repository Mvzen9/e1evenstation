import React from 'react';
import { useCafe } from '../context/CafeContext';
import { calculateTotal } from '../utils/pricing';
import { formatCurrency } from '../utils/formatting';
import { formatDuration } from '../utils/timeUtils';
import { showCheckoutSuccess } from '../utils/alerts';

export const Checkout: React.FC<{ roomId: number; onClose: () => void }> = ({
  roomId,
  onClose,
}) => {
  const { state, dispatch } = useCafe();
  const room = state.rooms.find((r) => r.id === roomId);

  if (!room?.currentSession) return null;

  const { total, roomCharge, drinksTotal } = calculateTotal(
    room.currentSession,
    state.drinks,
    state.roomRates
  );

  const duration = Date.now() - room.currentSession.startTime;
  const formattedDuration = formatDuration(duration);

  const handleCheckout = async () => {
    dispatch({ type: 'END_SESSION', payload: { roomId } });
    await showCheckoutSuccess(room.currentSession!.customerName, total, formattedDuration);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Session Summary</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Customer:</span>{' '}
            {room.currentSession.customerName}
          </p>
          <p>
            <span className="font-medium">Room Type:</span>{' '}
            {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
          </p>
          <p>
            <span className="font-medium">Duration:</span> {formattedDuration}
          </p>
          <p>
            <span className="font-medium">Room Charge:</span> {formatCurrency(roomCharge)}
          </p>
          <p>
            <span className="font-medium">Drinks Total:</span> {formatCurrency(drinksTotal)}
          </p>
          <div className="border-t pt-2">
            <p className="text-xl font-bold">
              Total: {formatCurrency(total)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleCheckout}
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Complete Checkout
        </button>
      </div>
    </div>
  );
};