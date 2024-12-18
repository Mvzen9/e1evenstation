import { RoomRates, Session } from './room';
import { Drink } from './drink';
import { Customer } from './customer';

export type CafeAction =
  | { type: 'START_SESSION'; payload: { roomId: number; session: Session } }
  | { type: 'END_SESSION'; payload: { roomId: number } }
  | { type: 'ADD_DRINK_ORDER'; payload: { roomId: number; order: DrinkOrder } }
  | { type: 'UPDATE_ROOM_RATES'; payload: RoomRates }
  | { type: 'ADD_DRINK'; payload: Drink }
  | { type: 'UPDATE_DRINK'; payload: Drink }
  | { type: 'DELETE_DRINK'; payload: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string };