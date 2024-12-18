import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Edit2, Trash2, Clock, User, Phone } from "lucide-react";
import { useCafe } from "../context/CafeContext";
import { Customer } from "../types/customer";
import { formatDate } from "../utils/formatting";

interface ApiCustomer {
  PhoneNum: string;
  Name: string;
  TotalHourPlayed: number;
}

interface AppCustomer extends Customer {
  id: string;
  lastVisit: number;
}

export const CustomerManagement: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: cafeState, dispatch: cafeDispatch } = useCafe();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    hours: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      // Return early if customers already exist or if currently loading
      if (cafeState.customers.length > 0 || isLoading) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          "http://testplaystation.runasp.net/api/customers/getallcustomers"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const apiCustomers: ApiCustomer[] = await response.json();

        // Create a Map to track unique phone numbers
        const uniqueCustomers = new Map<string, AppCustomer>();

        apiCustomers.forEach((apiCustomer) => {
          // Only add if this phone number hasn't been seen yet
          if (!uniqueCustomers.has(apiCustomer.PhoneNum)) {
            const customerData: AppCustomer = {
              id: apiCustomer.PhoneNum,
              Name: apiCustomer.Name,
              PhoneNum: apiCustomer.PhoneNum,
              TotalHourPlayed: apiCustomer.TotalHourPlayed,
              lastVisit: Date.now(),
            };
            uniqueCustomers.set(apiCustomer.PhoneNum, customerData);
          }
        });

        // Add only unique customers to state
        uniqueCustomers.forEach((customerData) => {
          cafeDispatch({ type: "ADD_CUSTOMER", payload: customerData });
        });
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [cafeDispatch, cafeState.customers.length, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerData: AppCustomer = {
      id: editingCustomer || Date.now().toString(),
      Name: formData.name,
      PhoneNum: formData.phoneNumber,
      TotalHourPlayed: formData.hours,
      lastVisit: Date.now(),
    };

    if (editingCustomer) {
      cafeDispatch({ type: "UPDATE_CUSTOMER", payload: customerData });
    } else {
      cafeDispatch({ type: "ADD_CUSTOMER", payload: customerData });
    }

    setFormData({ name: "", phoneNumber: "", hours: 0 });
    setShowAddForm(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer: AppCustomer) => {
    setFormData({
      name: customer.Name,
      phoneNumber: customer.PhoneNum,
      hours: customer.TotalHourPlayed,
    });
    setEditingCustomer(customer.id);
    setShowAddForm(true);
  };

  const handleDelete = (customerId: string) => {
    if (customerId) {
      cafeDispatch({ type: "DELETE_CUSTOMER", payload: customerId });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Management
        </h2>
        {authState.user?.role === "admin" && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Name
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hours Played
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.hours}
                  onChange={(e) =>
                    setFormData({ ...formData, hours: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCustomer(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {cafeState.customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{customer.Name}</h3>
              <p className="text-gray-600">{customer.PhoneNum}</p>
              <div className="flex gap-4">
                <p className="text-blue-600">
                  Hours: {customer.TotalHourPlayed}
                </p>
              </div>
              {customer.lastVisit && (
                <p className="text-sm text-gray-500">
                  Last Visit: {formatDate(customer.lastVisit)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(customer as AppCustomer)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              {authState.user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(customer.id || "")}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
