import React, { useMemo, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Header } from '../common/Header';
import './OrderHistory.css';

interface OrderInfo {
  id: string;
  status: 'En preparación' | 'Listo para recoger' | 'Entregado';
  date: string;
  time: string;
  store: string;
  total: number;
}

const STATUS_FILTERS = ['Todos', 'En preparación', 'Listos para recoger', 'Entregados'] as const;

const ORDER_DATA: OrderInfo[] = [
  {
    id: '#123456',
    status: 'En preparación',
    date: '16 de Octubre de 2023',
    time: '14:20',
    store: 'Supermercado El Ahorro',
    total: 71.5,
  },
  {
    id: '#123455',
    status: 'Entregado',
    date: '16 de Octubre de 2023',
    time: '14:20',
    store: 'Supermercado la Confianza',
    total: 25.75,
  },
  {
    id: '#123444',
    status: 'Listo para recoger',
    date: '15 de Octubre de 2023',
    time: '18:15',
    store: 'Mercado Fresco',
    total: 8.9,
  },
];

const statusBadgeClass = (status: OrderInfo['status']) => {
  if (status === 'En preparación') return 'order-badge warning';
  if (status === 'Listo para recoger') return 'order-badge info';
  return 'order-badge success';
};

const statusLabel = (status: OrderInfo['status']) => {
  if (status === 'En preparación') return 'En preparación';
  if (status === 'Listo para recoger') return 'Listo para recoger';
  return 'Entregado';
};

const OrderHistory: React.FC = () => {
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('Todos');

  const filteredOrders = useMemo(() => {
    if (filter === 'Todos') return ORDER_DATA;
    if (filter === 'Listos para recoger') {
      return ORDER_DATA.filter((order) => order.status === 'Listo para recoger');
    }
    if (filter === 'Entregados') {
      return ORDER_DATA.filter((order) => order.status === 'Entregado');
    }
    return ORDER_DATA.filter((order) => order.status === 'En preparación');
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      <Header />

      <main className="order-page">
        <div className="page-header">
          <div className="page-title">
            <h2>Historial de Pedidos</h2>
            <p>Revisa el estado de tus compras recientes</p>
          </div>
        </div>

        <div className="order-tabs" role="tablist">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              className={`order-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
              role="tab"
              aria-pressed={filter === status}
            >
              {status}
            </button>
          ))}
        </div>

        <section className="order-list">
          {filteredOrders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <p className="order-number">Pedido {order.id}</p>
                  <div className="order-meta">
                    <Clock size={16} />
                    <span>{order.date}, {order.time}</span>
                  </div>
                  <div className="order-store">
                    <MapPin size={16} />
                    <span>{order.store}</span>
                  </div>
                </div>

                <div className="order-actions-block">
                  <div className="order-status-row">
                    <span className={statusBadgeClass(order.status)}>{statusLabel(order.status)}</span>
                    <p className="order-price">${order.total.toFixed(2)}</p>
                  </div>
                  <button className="btn-details">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <div className="order-pagination" aria-label="Paginación de pedidos">
          {[1, 2, 3].map((page) => (
            <button key={page} className={`order-page-btn ${page === 1 ? 'active' : ''}`}>
              {page}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
