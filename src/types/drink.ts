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