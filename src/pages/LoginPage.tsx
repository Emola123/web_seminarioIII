import Login from "../components/Login/Login";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (data: any) => {
    const res = await authService.login(data.correo, data.contrasena);

    if (res?.token) {
      login(res.token);
      window.location.reload(); // actualizar para ir a HomePage
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return <Login onSubmit={handleLogin} />;
}
