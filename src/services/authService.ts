export const authService = {
  login: async (correo: string, contrasena: string) => {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });
    return await res.json();
  },

  register: async (
    nombre: string,
    correo: string,
    contrasena: string,
    rol: string
  ) => {
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contrasena, rol }),
    });
    return await res.json();
  },
};
