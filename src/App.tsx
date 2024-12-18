import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CafeProvider } from './context/CafeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { RoomGrid } from './components/RoomGrid';
import { CustomerManagement } from './components/CustomerManagement';
import { AdminPanel } from './components/AdminPanel';
import { DrinkManagement } from './components/DrinkManagement';
import { Login } from './components/Login';
import { Signup } from './components/Signup';

// Default menu items if API fails
const defaultMenuItems = [
  { id: '1', name: 'Coffee', price: 15 },
  { id: '2', name: 'Tea', price: 10 },
  { id: '3', name: 'Soda', price: 12 },
  { id: '4', name: 'Water', price: 5 },
];

const fetchAndStoreMenuItems = async () => {
  try {
    const response = await fetch('http://testplaystation.runasp.net/api/Menu/GetMenu');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    const transformedData = data.map((item: any) => ({
      id: item.ItemID.toString(),
      name: item.ItemName,
      price: item.ItemPrice
    }));
    
    localStorage.setItem('menuItems', JSON.stringify(transformedData));
    return transformedData;
  } catch (error) {
    console.warn('Using default menu items due to API error:', error);
    localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
    return defaultMenuItems;
  }
};

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee';
}> = ({ children, requiredRole }) => {
  const { state: authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && authState.user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  React.useEffect(() => {
    fetchAndStoreMenuItems();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoomGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drinks"
            element={
              <ProtectedRoute>
                <DrinkManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/signup"
            element={
              <ProtectedRoute requiredRole="admin">
                <Signup onSuccess={() => null} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <CafeProvider>
        <AppContent />
      </CafeProvider>
    </AuthProvider>
  );
}

export default App;