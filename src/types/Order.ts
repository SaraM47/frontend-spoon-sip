import type { MenuItem } from './MenuItem';

export type Order = {
    _id: string;
    customerName: string;
    phone: string;
    time: string; // ISO 8601-format
    menuItemIds: MenuItem[]; // Populerade menyobjekt från backend
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
  };