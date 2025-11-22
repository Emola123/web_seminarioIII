import { useAuth } from "../../hooks/useAuth";
import "./TopBar.css";

interface TopBarProps {
  currentPath: string;
}

export default function TopBar({ currentPath }: TopBarProps) {
  const { logout } = useAuth();

  const handleNavigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.location.href = path;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="topbar">
      <div className="topbar__brand" onClick={() => handleNavigate("/")}>
        <span className="topbar__logo">Inventario+ </span>
        <span className="topbar__divider">|</span>
        <span className="topbar__subtitle">Panel</span>
      </div>
      <nav className="topbar__nav">
        <button
          className={`topbar__link ${currentPath === "/" ? "active" : ""}`}
          onClick={() => handleNavigate("/")}
        >
          Inicio
        </button>
        <button
          className={`topbar__link ${currentPath === "/inventario" ? "active" : ""}`}
          onClick={() => handleNavigate("/inventario")}
        >
          Inventario
        </button>
        <button
          className={`topbar__link ${currentPath === "/pedidos" ? "active" : ""}`}
          onClick={() => handleNavigate("/pedidos")}
        >
          Historial de pedidos
        </button>
      </nav>
      <div className="topbar__actions">
        <button className="topbar__logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
