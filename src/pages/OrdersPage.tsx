import { useMemo, useState } from "react";
import TopBar from "../components/TopBar/TopBar";
import "./OrdersPage.css";

type OrderStatus = "En preparación" | "Listo para recoger" | "Entregado" | "Todos";

interface OrderItem {
  id: string;
  store: string;
  createdAt: string;
  deliveryAt: string;
  status: Exclude<OrderStatus, "Todos">;
  total: number;
}

const orders: OrderItem[] = [
  {
    id: "#3241",
    store: "Supermercados Tottus",
    createdAt: "01/08/2024 05:45 pm",
    deliveryAt: "02/08/2024 03:45 pm",
    status: "En preparación",
    total: 25.0,
  },
  {
    id: "#3243",
    store: "Supermercados Vivanda",
    createdAt: "01/08/2024 09:20 am",
    deliveryAt: "02/08/2024 10:00 am",
    status: "Listo para recoger",
    total: 34.5,
  },
  {
    id: "#3155",
    store: "Supermercados Metro",
    createdAt: "30/07/2024 01:50 pm",
    deliveryAt: "31/07/2024 08:45 am",
    status: "Entregado",
    total: 10.99,
  },
];

const statusClass: Record<OrderStatus, string> = {
  "En preparación": "badge badge--yellow",
  "Listo para recoger": "badge badge--blue",
  Entregado: "badge badge--green",
  Todos: "badge",
};

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus>("Todos");
  const filteredOrders = useMemo(
    () => orders.filter((order) => tab === "Todos" || order.status === tab),
    [tab]
  );

  return (
    <div className="page orders-page">
      <TopBar currentPath={window.location.pathname} />
      <main className="page__content">
        <header className="page__header">
          <div>
            <p className="eyebrow">Órdenes</p>
            <h1>Historial de pedidos</h1>
            <p className="lead">Revisa el estado y detalle de cada pedido.</p>
          </div>
          <div className="tabs">
            {(["Todos", "En preparación", "Listo para recoger", "Entregado"] as OrderStatus[]).map(
              (status) => (
                <button
                  key={status}
                  className={`tab ${tab === status ? "active" : ""}`}
                  onClick={() => setTab(status)}
                >
                  {status}
                  <span className={statusClass[status]}>
                    {tab === status ? filteredOrders.length :
                      orders.filter((o) => status === "Todos" || o.status === status).length}
                  </span>
                </button>
              )
            )}
          </div>
        </header>

        <section className="orders">
          {filteredOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order__row">
                <div>
                  <p className="eyebrow">Pedido {order.id}</p>
                  <h3>Pedido de supermercado</h3>
                  <p className="muted">{order.store}</p>
                </div>
                <div className={`badge ${statusClass[order.status].replace("badge ", "")}`}>
                  {order.status}
                </div>
              </div>
              <div className="order__row">
                <div className="order__info">
                  <span className="muted">Fecha del pedido</span>
                  <strong>{order.createdAt}</strong>
                </div>
                <div className="order__info">
                  <span className="muted">Fecha de entrega</span>
                  <strong>{order.deliveryAt}</strong>
                </div>
                <div className="order__info">
                  <span className="muted">Total</span>
                  <strong>${order.total.toFixed(2)}</strong>
                </div>
                <div className="order__actions">
                  <button className="ghost">Ver Detalles</button>
                  <button>Reordenar</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
