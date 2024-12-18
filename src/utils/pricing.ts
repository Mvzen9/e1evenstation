import { Session, Drink, RoomRates, GameConsole } from '../types';

export const calculateTotal = (
  session: Session,
  drinks: Drink[],
  hourlyRates: RoomRates
) => {
  const duration = Date.now() - session.startTime;
  const hours = duration / (1000 * 60 * 60);
  const roomRate = hourlyRates[session.roomType];
  const roomCharge = Math.ceil(hours * roomRate);

  const drinksTotal = session.orders.reduce((total, order) => {
    const drink = drinks.find((d) => d.id === order.drinkId);
    return total + (drink?.price || 0) * order.quantity;
  }, 0);

  return {
    total: roomCharge + drinksTotal,
    roomCharge,
    drinksTotal,
  };
};