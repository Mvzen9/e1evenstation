import { Room, GameConsole } from '../types/room';

export const createInitialRooms = (): Room[] => {
  const roomConfigs: Array<{ id: number; type: GameConsole }> = [
    { id: 1, type: 'PS5' },
    { id: 2, type: 'PS5' },
    { id: 3, type: 'PS4' },
    { id: 4, type: 'PS4' },
    { id: 5, type: 'PS4' },
    { id: 6, type: 'Billiards' },
  ];

  return roomConfigs.map(config => ({
    id: config.id,
    name: `Room ${config.id}`,
    type: config.type,
    isOccupied: false,
    currentSession: null,
  }));
};