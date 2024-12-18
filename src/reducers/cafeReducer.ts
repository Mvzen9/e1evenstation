import { CafeState } from '../types/state';
import { CafeAction } from '../types/actions';
import { calculateTotal } from '../utils/pricing';

export const cafeReducer = (state: CafeState, action: CafeAction): CafeState => {
  switch (action.type) {
    case 'START_SESSION': {
      const { roomId, session } = action.payload;
      const existingCustomer = state.customers.find(
        c => c.phoneNumber === session.phoneNumber
      );

      let updatedCustomers = state.customers;
      if (!existingCustomer) {
        updatedCustomers = [...state.customers, {
          id: session.customerId,
          phoneNumber: session.phoneNumber,
          hours: 0,
          discount: 0,
          lastVisit: Date.now(),
        }];
      }

      return {
        ...state,
        customers: updatedCustomers,
        rooms: state.rooms.map(room =>
          room.id === roomId
            ? { ...room, isOccupied: true, currentSession: session }
            : room
        ),
      };
    }

    case 'END_SESSION': {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room?.currentSession) {
        const endTime = Date.now();
        const duration = endTime - room.currentSession.startTime;
        const hoursPlayed = Math.ceil(duration / (1000 * 60 * 60));
        
        const { total, roomCharge, drinksTotal } = calculateTotal(
          room.currentSession,
          state.drinks,
          state.roomRates
        );

        const checkoutEntry = {
          id: `checkout-${Date.now()}`,
          roomId: room.id,
          roomName: room.name,
          roomType: room.type,
          phoneNumber: room.currentSession.phoneNumber,
          startTime: room.currentSession.startTime,
          endTime,
          duration,
          roomCharge,
          drinksTotal,
          totalAmount: total,
          orders: room.currentSession.orders,
        };

        const updatedCustomers = state.customers.map(customer => {
          if (customer.phoneNumber === room.currentSession?.phoneNumber) {
            return {
              ...customer,
              hours: customer.hours + hoursPlayed,
              lastVisit: Date.now(),
            };
          }
          return customer;
        });

        return {
          ...state,
          customers: updatedCustomers,
          checkoutHistory: [checkoutEntry, ...state.checkoutHistory],
          rooms: state.rooms.map(r =>
            r.id === action.payload.roomId
              ? { ...r, isOccupied: false, currentSession: null }
              : r
          ),
        };
      }
      return state;
    }

    case 'ADD_DRINK_ORDER':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.roomId && room.currentSession
            ? {
                ...room,
                currentSession: {
                  ...room.currentSession,
                  orders: [...room.currentSession.orders, action.payload.order],
                },
              }
            : room
        ),
      };

    case 'UPDATE_ROOM_RATES':
      return {
        ...state,
        roomRates: action.payload,
      };

    case 'ADD_DRINK':
      return {
        ...state,
        drinks: [...state.drinks, action.payload],
      };

    case 'UPDATE_DRINK':
      return {
        ...state,
        drinks: state.drinks.map(drink =>
          drink.id === action.payload.id ? action.payload : drink
        ),
      };

    case 'DELETE_DRINK':
      return {
        ...state,
        drinks: state.drinks.filter(drink => drink.id !== action.payload),
      };

    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };

    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };

    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
      };

    default:
      return state;
  }
};