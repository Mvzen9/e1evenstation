import React from 'react';
import { AdminSettings } from './AdminSettings';
import { CheckoutHistory } from './CheckoutHistory';

export const AdminPanel: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <AdminSettings />
      <CheckoutHistory />
    </div>
  );
};