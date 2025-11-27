import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, User, Store } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import './Header.css';

interface HeaderProps {
  variant?: 'default' | 'simple' | string;
  user?: { name: string; photo?: string; role?: string; storeId?: number; id_usuario?: number } | null;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNavigate?: (view: string) => void;
}

// 🔎 Función auxiliar para buscar tienda por usuario
async function fetchStoreIdByUserId(userId: number): Promise<number | null> {
  try {
    // Usamos ruta relativa para que el proxy de Vite la redirija
    const response = await fetch('/api/v1/stores');
    const result = await response.json();
    const tiendas = result.tiendas || [];

    const tienda = tiendas.find((t: any) => t.usuario?.id_usuario === userId);
    return tienda?.id_tienda ?? null;
  } catch (error) {
    console.error("Error al buscar tienda por usuario:", error);
    return null;
  }
}

export const Header: React.FC<HeaderProps> = ({ variant = 'default', user, onLogout, onProfileClick, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localUser, setLocalUser] = useState<{
    name: string;
    photo?: string;
    role?: string;
    storeId?: number;
    id_usuario?: number;
  } | null>(() => {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const u = JSON.parse(usuarioString);
        let role = u.rol || u.role;
        let storeId = u.id_tienda || u.storeId;
        let id_usuario = u.id_usuario;

        if (!role) {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const decoded: any = jwtDecode(token);
              role = decoded.role;
              if (!storeId) {
                storeId = decoded.storeId || decoded.id_tienda;
              }
              if (!id_usuario) {
                id_usuario = decoded.id_usuario || decoded.userId;
              }
            } catch (e) {
              console.error("Error decoding token during init", e);
            }
          }
        }

        if (role && typeof role === 'string') {
          role = role.toLowerCase().trim();
        }

        return { name: u.nombre, photo: u.foto, role, storeId, id_usuario };
      } catch (e) {
        console.error("Error parsing user from localStorage during init", e);
        return null;
      }
    }
    return null;
  });

  // 🔄 Si es vendedor y no tiene storeId, buscarlo en /stores
  useEffect(() => {
    if (localUser?.role === 'vendedor' && !localUser.storeId && localUser.id_usuario) {
      fetchStoreIdByUserId(localUser.id_usuario).then((storeId) => {
        if (storeId) {
          setLocalUser((prev) => prev ? { ...prev, storeId } : prev);
          localStorage.setItem('storeId', storeId.toString());
        }
      });
    }
  }, [localUser]);

  const activeUser = React.useMemo(() => {
    if (user) {
      if (!user.role && localUser?.role) {
        return { ...user, role: localUser.role, storeId: localUser.storeId, id_usuario: localUser.id_usuario };
      }
      return user;
    }
    return localUser;
  }, [user, localUser]);

  const isSeller = activeUser?.role === 'vendedor' || activeUser?.role === 'tienda';
  const isBuyer = activeUser?.role === 'comprador' || activeUser?.role === 'cliente';

  const handleLogoutInternal = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('storeId');
      setLocalUser(null);
      navigate('/login');
    }
  };

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      if (view === 'home') navigate('/');
      if (view === 'products') navigate('/');
      if (view === 'profile') {
        if (isSeller) {
          navigate(`/store-profile/${activeUser?.storeId ?? ''}`);
        } else {
          navigate('/profile');
        }
      }
      if (view === 'orders') navigate('/orders');
      if (view === 'inventory') navigate('/inventory');
      if (view === 'publicar') navigate('/publicar');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header-container">
      {/* Logo Section */}
      <div className="header-logo-section">
        <Link to="/" className="header-logo">
          <Store className="header-logo-icon" size={24} />
          Expirapp
        </Link>
      </div>

      {/* Navigation Section */}
      {variant !== 'simple' && (
        <nav className="header-nav lg:flex hidden">
          {activeUser && (
            <>
              <button
                onClick={() => navigate('/')}
                className={`header-nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Inicio
              </button>

              {isBuyer && (
                <>
                  <button
                    onClick={() => navigate('/orders')}
                    className={`header-nav-link ${isActive('/orders') ? 'active' : ''}`}
                  >
                    Pedidos
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className={`header-nav-link ${isActive('/cart') ? 'active' : ''}`}
                  >
                    Carrito
                  </button>
                </>
              )}

              {isSeller && (
                <>
                  <button
                    onClick={() => handleNavigation('inventory')}
                    className={`header-nav-link ${isActive('/inventory') ? 'active' : ''}`}
                  >
                    Inventario
                  </button> 

                  <button
                    onClick={() => handleNavigation('publicar')}
                    className={`header-nav-link ${isActive('/publicar') ? 'active' : ''}`}
                  >
                    Publicar
                  </button>
                </>
              )}

              <button
                onClick={() => navigate('/store-profile')}
                className={`header-nav-link ${isActive('/store-profile') ? 'active' : ''}`}
              >
                Perfil
              </button>
            </>
          )}
        </nav>
      )}

      {/* Actions Section */}
      <div className="header-actions">
        {activeUser ? (
          <>
            {isBuyer && (
              <Link to="/cart" className="mr-4">
                <button className="btn-icon">
                  <ShoppingCart size={20} />
                </button>
              </Link>
            )}
            <button onClick={handleLogoutInternal} className="btn-logout">
              Cerrar Sesión
            </button>
            <div className="avatar-container">
              {activeUser.photo ? (
                <img src={activeUser.photo} alt={activeUser.name} className="avatar-image" />
              ) : (
                <User size={16} />
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className="btn-login sm:inline-flex hidden"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
            <button className="btn-icon">
              <Heart size={20} />
            </button>
            <Link to="/cart">
              <button className="btn-icon">
                <ShoppingCart size={20} />
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};