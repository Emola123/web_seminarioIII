import TopBar from "../components/TopBar/TopBar";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="page">
      <TopBar currentPath={window.location.pathname} />
      <main className="page__content">
        <section className="hero">
          <div>
            <p className="eyebrow">Panel de operaciones</p>
            <h1>Bienvenido al sistema de inventario</h1>
            <p className="lead">
              Navega entre tu inventario y el historial de pedidos para seguir el
              estado de tus productos, fechas de caducidad y entregas.
            </p>
            <div className="hero__actions">
              <button onClick={() => (window.location.href = "/inventario")}>Ir al inventario</button>
              <button
                className="ghost"
                onClick={() => (window.location.href = "/pedidos")}
              >
                Ver pedidos
              </button>
            </div>
          </div>
          <div className="hero__card">
            <p className="hero__label">Resumen rápido</p>
            <div className="hero__stats">
              <div>
                <span className="stat__number">82</span>
                <span className="stat__label">Productos activos</span>
              </div>
              <div>
                <span className="stat__number">6</span>
                <span className="stat__label">Pedidos pendientes</span>
              </div>
              <div>
                <span className="stat__number">12</span>
                <span className="stat__label">Próximos a caducar</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
