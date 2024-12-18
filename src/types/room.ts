export type GameConsole = 'PS5' | 'PS4' | 'Billiards';

export interface RoomRates {
  PS5: number;
  PS4: number;
  Billiards: number;
}

export interface Room {
  id: number;
  name: string;
  type: GameConsole;
  isOccupied: boolean;
  currentSession: Session | null;
}

export interface Session {
  customerId: string;
  phoneNumber: string;
  startTime: number;
  roomType: GameConsole;
  orders: DrinkOrder[];
}