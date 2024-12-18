import React, { useState } from 'react';
import { Phone, User, X, Loader2 } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { Customer } from '../types/customer';

interface BookingFormProps {
  roomId: number;
  onClose: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ roomId, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  
  const { dispatch, state } = useCafe();
  const room = state.rooms.find(r => r.id === roomId);

  const handlePhoneValidation = async () => {
    if (phoneNumber.length < 11) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Check if customer exists in state
      const existingCustomer = state.customers.find(c => c.PhoneNum === phoneNumber);
      
      if (existingCustomer) {
        setCustomer(existingCustomer);
      } else {
        setError('Customer not found. Please verify the phone number.');
      }
    } catch (error) {
      setError('Error validating phone number. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) {
      setError('Please validate phone number first');
      return;
    }
    
    if (!room) return;
    
    dispatch({
      type: 'START_SESSION',
      payload: {
        roomId,
        session: {
          customerId: customer.PhoneNum,
          phoneNumber: customer.PhoneNum,
          startTime: Date.now(),
          roomType: room.type,
          orders: [],
        },
      },
    });
    onClose();
  };

  const formatPhoneNumber = (value: string) => {
    // Only allow numbers up to 11 digits
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Book {room?.name}</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(formatPhoneNumber(e.target.value));
                setCustomer(null);
                setError('');
              }}
              className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
              placeholder="Enter phone number (11 digits)"
              maxLength={11}
              required
            />
            <button
              type="button"
              onClick={handlePhoneValidation}
              disabled={isValidating || phoneNumber.length < 11}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {isValidating ? (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              ) : (
                <span className="text-sm text-blue-600 hover:text-blue-700">
                  Validate
                </span>
              )}
            </button>
          </div>

          {customer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                <span className="text-green-700">Customer found!</span>
              </div>
              <p className="mt-1 text-sm text-green-600">
                Hours played: {customer.TotalHourPlayed}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!customer || isValidating}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              customer && !isValidating
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Book Room
          </button>
        </div>
      </form>
    </div>
  );
};