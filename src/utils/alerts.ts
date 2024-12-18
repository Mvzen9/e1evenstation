import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { formatCurrency } from './formatting';

const MySwal = withReactContent(Swal);

export const showLoginSuccess = async (role: 'admin' | 'employee') => {
  const title = role === 'admin' 
    ? 'Welcome, Administrator!' 
    : 'Welcome back!';
  
  const text = role === 'admin'
    ? 'You have successfully logged in as an administrator.'
    : 'You have successfully logged in as an employee.';

  await MySwal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold text-gray-800',
      htmlContainer: 'text-gray-600'
    }
  });
};

export const showSignupSuccess = async (employeeName: string) => {
  await MySwal.fire({
    icon: 'success',
    title: 'Employee Added Successfully!',
    text: `${employeeName} has been registered as a new employee.`,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold text-gray-800',
      htmlContainer: 'text-gray-600'
    }
  });
};

export const showSuccess = async (title: string, text: string) => {
  await MySwal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold text-gray-800',
      htmlContainer: 'text-gray-600'
    }
  });
};

export const showDrinkAdded = async (drinkName: string) => {
  await MySwal.fire({
    icon: 'success',
    title: 'Drink Added Successfully!',
    text: `${drinkName} has been added to the menu.`,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold text-gray-800',
      htmlContainer: 'text-gray-600'
    }
  });
};

export const showDrinkDeleted = async (drinkName: string) => {
  await MySwal.fire({
    icon: 'success',
    title: 'Drink Removed',
    text: `${drinkName} has been removed from the menu.`,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold text-gray-800',
      htmlContainer: 'text-gray-600'
    }
  });
};

export const showCheckoutSuccess = async (
  customerName: string,
  totalAmount: number,
  duration: string
) => {
  await MySwal.fire({
    icon: 'success',
    title: 'Checkout Complete',
    html: `
      <div class="space-y-2">
        <p class="text-gray-600">Session ended for ${customerName}</p>
        <p class="text-gray-600">Duration: ${duration}</p>
        <p class="font-semibold text-gray-800">Total: ${formatCurrency(totalAmount)}</p>
      </div>
    `,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      popup: 'rounded-lg',
      title: 'text-xl font-bold text-gray-800',
    }
  });
};