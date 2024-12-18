import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Gamepad2, Users, Coffee, LogOut, Settings } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { state: authState, dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <Gamepad2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">E1even Station</h1>
            </Link>

            {authState.isAuthenticated && (
              <div className="flex space-x-6">
                <Link
                  to="/rooms"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Gamepad2 className="w-5 h-5" />
                  <span>Rooms</span>
                </Link>

                {/* Shared Section */}
                <Link
                  to="/customers"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Users className="w-5 h-5" />
                  <span>Customers</span>
                </Link>

                <Link
                  to="/drinks"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Coffee className="w-5 h-5" />
                  <span>Drinks</span>
                </Link>

                {/* Admin-Only Section */}
                {authState.user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/settings"
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      to="/admin/signup"
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                      <Users className="w-5 h-5" />
                      <span>Manage Staff</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {authState.isAuthenticated && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {authState.user?.name} ({authState.user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};