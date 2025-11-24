import { Product } from '../types/menu.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/products/`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      
      const contentType = res.headers.get('content-type') || '';
      let json: any;
      
      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Invalid JSON response: ${text.slice(0,200)}`);
      }
      
      const list: any[] = json.productos || json.products || json.data || [];
      
      return list.map(p => ({
        id: p.id_producto ?? p.id ?? Math.random(),
        name: p.nombre ?? p.name ?? 'Producto',
        price: typeof p.precio !== 'undefined' ? p.precio : (p.price ?? 0),
        fecha_vencimiento: p.fecha_vencimiento ?? p.expiryDate ?? null,
        stock: typeof p.stock !== 'undefined' ? p.stock : (p.cantidad ?? null),
        descripcion: p.descripcion ?? p.description ?? '',
        imageUrl: p.imagen ?? p.imageUrl ?? p.image ?? p.url_imagen ?? `https://placehold.co/300x300/cccccc/333333?text=${encodeURIComponent((p.nombre||p.name||'Producto').substring(0,10))}`,
        location: 'Ubicación Desconocida',
        distance: '0 km',
        badge: p.precio === 0 ? 'Donación' : (p.descuento ? 'Oferta' : undefined),
        originalPrice: p.precio_original
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
};
