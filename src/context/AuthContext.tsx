import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP'; payload: User };

// Get initial state from localStorage if exists
const getInitialState = (): AuthState => {
  const savedUser = localStorage.getItem('user');
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
  };
};

// In a real app, these would be in a database
const users: User[] = [
  {
    id: '1',
    name: 'mazen',
    password: 'mazen', 
    role: 'admin',
  },
];

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      // Save user to localStorage on login
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      // Remove user from localStorage on logout
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SIGNUP':
      users.push(action.payload);
      return state;
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (username: string, password: string) => Promise<{ success: boolean; role?: 'admin' | 'employee' }>;
  signup: (name: string, password: string, phoneNumber: string) => Promise<boolean>;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  const login = async (username: string, password: string) => {
    const user = users.find(
      (u) => u.name === username && u.password === password
    );
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      return { success: true, role: user.role };
    }
    return { success: false };
  };

  const signup = async (name: string, password: string, phoneNumber: string) => {
    if (users.some((u) => u.name === name)) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      password,
      phoneNumber,
      role: 'employee',
    };
    dispatch({ type: 'SIGNUP', payload: newUser });
    return true;
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};