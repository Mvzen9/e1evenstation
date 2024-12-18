export interface Room {
  id: number;
  name: string;
  type: 'standard' | 'billiards';
  isOccupied: boolean;
  currentSession: Session | null;
}

export interface Session {
  customerId: string;
  customerName: string;
  phoneNumber: string;
  startTime: number;
  roomType: 'standard' | 'billiards';
  orders: DrinkOrder[];
}

export interface CheckoutHistory {
  id: string;
  roomId: number;
  roomName: string;
  roomType: 'standard' | 'billiards';
  customerName: string;
  phoneNumber: string;
  startTime: number;
  endTime: number;
  duration: number;
  roomCharge: number;
  drinksTotal: number;
  totalAmount: number;
  orders: DrinkOrder[];
}

export interface Drink {
  id: string;
  name: string;
  price: number;
}

export interface DrinkOrder {
  drinkId: string;
  quantity: number;
  timestamp: number;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  hours: number;
  discount: number;
  lastVisit?: number;
}

export interface User {
  id: string;
  name: string;
  password: string;
  phoneNumber?: string;
  role: 'admin' | 'employee';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface RoomRates {
  standard: number;
  billiards: number;
}