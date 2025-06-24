import type { MenuItem } from './MenuItem';

export type Order = {
    _id: string;
    customerName: string;
    phone: string;
    time: string;
    people?: number;
    note?: string;
    menuItemIds: MenuItem[]; // Populated menu items from the backend
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
  };