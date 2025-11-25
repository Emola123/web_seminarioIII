import React, { useMemo, useState } from 'react';
import { Header } from '../common/Header';
import '../menu/pages/menu.css';

interface InventoryItem {
  name: string;
  sku: string;
  expiration: string;
  price: number;
  offerPrice: number;
  stock: number;
  status: 'Activo' | 'Agotado';
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    name: 'Yogurt Natural Dance',
    sku: '12345',
    expiration: '25/12/2024',
    price: 5.0,
    offerPrice: 3.5,
    stock: 10,
    status: 'Activo',
  },
  {
    name: 'Pan de Molde Bimbo',
    sku: '67890',
    expiration: '23/10/2024',
    price: 2.5,
    offerPrice: 2.25,
    stock: 25,
    status: 'Activo',
  },
  {
    name: 'Leche Entera Pascual',
    sku: '12121',
    expiration: '22/12/2024',
    price: 1.8,
    offerPrice: 1.5,
    stock: 8,
    status: 'Agotado',
  },
  {
    name: 'Queso Curado García Baquero',
    sku: '23343',
    expiration: '23/12/2024',
    price: 10.3,
    offerPrice: 9.1,
    stock: 20,
    status: 'Activo',
  },
];

const statusClass = (status: InventoryItem['status']) =>
  status === 'Activo' ? 'status-badge success' : 'status-badge warning';

const InventoryManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | InventoryItem['status']>('Todos');

  const filteredItems = useMemo(() => {
    return INVENTORY_DATA.filter((item) => {
      const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
      const normalizedSearch = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) || item.sku.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      <Header />

      <main className="inventory-container">
        <div className="page-header">
          <div className="page-title">
            <h2>Gestión de Inventario</h2>
            <p>Administra tus productos y stock</p>
          </div>

          <div className="inventory-actions-header">
            <button className="btn-primary">Añadir Nuevo Producto</button>
          </div>
        </div>

        <div className="inventory-controls">
          <div className="search-container">
            <input
              type="search"
              className="search-input"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filters-row">
            <select className="filter-select" aria-label="Fecha de caducidad">
              <option>Fecha de caducidad</option>
            </select>
            <select className="filter-select" aria-label="Categoría">
              <option>Categoría</option>
            </select>
            <select
              className="filter-select"
              aria-label="Estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'Todos' | InventoryItem['status'])}
            >
              <option value="Todos">Estado</option>
              <option value="Activo">Activo</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>
        </div>

        <section className="inventory-table-wrapper" aria-label="Tabla de inventario">
          <div className="inventory-table-header">
            <span>Producto</span>
            <span>SKU</span>
            <span>Fecha Cad.</span>
            <span>Precio Orig.</span>
            <span>Precio Oferta</span>
            <span>Stock</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>

          <div className="inventory-table-body">
            {filteredItems.map((item) => (
              <div className="inventory-row" key={item.sku}>
                <span className="inventory-product-name">{item.name}</span>
                <span className="inventory-sku">{item.sku}</span>
                <span className="inventory-date">{item.expiration}</span>
                <span className="inventory-price">{item.price.toFixed(2)}€</span>
                <span className="inventory-offer-price">{item.offerPrice.toFixed(2)}€</span>
                <span className="inventory-stock">{item.stock}</span>
                <span className="inventory-status"><span className={statusClass(item.status)}>{item.status}</span></span>
                <span className="inventory-actions">
                  <button className="action-btn edit" title="Editar">✏️</button>
                  <button className="action-btn delete" title="Eliminar">🗑️</button>
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="pagination" aria-label="Paginación de inventario">
          {[1, 2, 3].map((page) => (
            <button key={page} className={`pagination-button ${page === 1 ? 'active' : ''}`}>
              {page}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InventoryManagement;
