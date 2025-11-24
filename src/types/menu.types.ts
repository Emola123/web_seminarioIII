import { ReactElement } from 'react';

export interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number; 
  badge?: 'Oferta' | 'Donación' | string; 
  imageUrl: string;
  location: string;
  distance?: string;
  icon?: ReactElement<any, any>;
  descripcion?: string;
  fecha_vencimiento?: string | null;
  stock?: number | null;
  brand?: string;
  size?: string;
}

export interface CartItem {
  itemId: string; 
  name: string;
  brand: string;
  size: string;
  expiryDate: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  imageUrl: string;
}

export interface CartStore {
  id: number;
  store: string;
  items: CartItem[];
}
