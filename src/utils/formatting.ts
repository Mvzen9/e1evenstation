import { formatDuration } from './timeUtils';

export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} EGP`;
};

export const calculateRoomCharge = (duration: number, hourlyRate: number, discount: number = 0): number => {
  const hours = duration / (1000 * 60 * 60);
  const baseCharge = Math.ceil(hours * hourlyRate);
  return baseCharge * (1 - discount / 100);
};

export const getDurationDetails = (duration: number): { hours: number; minutes: number } => {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return { hours, minutes: remainingMinutes };
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};