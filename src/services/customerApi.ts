import { Customer } from "../types/customer";

export const validatePhoneNumber = async (
  phoneNumber: string
): Promise<Customer | null> => {
  try {
    const response = await fetch(
      `http://testplaystation.runasp.net/api/Customers/GetCustomer/{CustomerPhone}`
    );
    if (!response.ok) {
      throw new Error("Customer not found");
    }
    return await response.json();
  } catch (error) {
    console.error("Error validating phone number:", error);
    return null;
  }
};
