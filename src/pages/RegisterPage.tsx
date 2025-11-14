import Register from "../components/Register/Register";

export default function RegisterPage() {
  const handleRegister = (data: any) => {
    console.log("Datos de registro:", data);
    alert("Usuario registrado (prueba)");
  };

  return <Register onSubmit={handleRegister} />;
}
