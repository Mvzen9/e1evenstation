import { Room, RoomRates } from './room';
import { Drink } from './drink';
import { Customer } from './customer';
import { CheckoutHistory } from './checkout';

export interface CafeState {
  rooms: Room[];
  drinks: Drink[];
  roomRates: RoomRates;
  customers: Customer[];
  checkoutHistory: CheckoutHistory[];
}