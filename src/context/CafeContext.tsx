import React, { createContext, useContext, useReducer } from 'react';
import { CafeState } from '../types/state';
import { CafeAction } from '../types/actions';
import { cafeReducer } from '../reducers/cafeReducer';
import { createInitialRooms } from '../config/roomConfig';

const initialState: CafeState = {
  rooms: createInitialRooms(),
  drinks: JSON.parse(localStorage.getItem('menuItems') || '[]'),
  roomRates: {
    PS5: 40,
    PS4: 30,
    Billiards: 50,
  },
  customers: [],
  checkoutHistory: [],
};

interface CafeContextType {
  state: CafeState;
  dispatch: React.Dispatch<CafeAction>;
}

const CafeContext = createContext<CafeContextType | null>(null);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cafeReducer, initialState);

  return (
    <CafeContext.Provider value={{ state, dispatch }}>
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};