import { RoomRates } from '../types';

export const getRoomRate = (
  roomType: 'standard' | 'billiards',
  rates: RoomRates
): number => {
  return rates[roomType];
};