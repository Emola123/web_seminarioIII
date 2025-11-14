export function useAuth() {
  const isLoggedIn = !!localStorage.getItem("token");

  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return { isLoggedIn, login, logout };
}
