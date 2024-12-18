import { GameConsole } from './room';
import { DrinkOrder } from './drink';

export interface CheckoutHistory {
  id: string;
  roomId: number;
  roomName: string;
  roomType: GameConsole;
  phoneNumber: string;
  startTime: number;
  endTime: number;
  duration: number;
  roomCharge: number;
  drinksTotal: number;
  totalAmount: number;
  orders: DrinkOrder[];
}