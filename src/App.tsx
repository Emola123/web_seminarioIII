import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrdersPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isLoggedIn } = useAuth();
  const path = window.location.pathname;

  if (!isLoggedIn && path === "/register") return <RegisterPage />;
  if (!isLoggedIn) return <LoginPage />;

  if (path === "/inventario") return <InventoryPage />;
  if (path === "/pedidos") return <OrdersPage />;

  return <HomePage />;
}
