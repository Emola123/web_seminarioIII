import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, EyeOff, Trash2, ChevronDown } from 'lucide-react';
import { Header } from '../common/Header';
import './InventoryManagement.css';

interface Product {
  id: number;
  nombre: string;
  sku: string;
  fecha_caducidad: string;
  precio_original: number;
  precio_oferta: number;
  stock: number;
  estado: 'Activo' | 'Agotado';
  imagen_url?: string;
}

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const usuarioString = localStorage.getItem('usuario');
      
      console.log('=== INICIO DEBUG INVENTARIO ===');
      console.log('📦 Token existe:', !!token);
      console.log('📦 Usuario string completo:', usuarioString);
      
      if (!usuarioString) {
        console.error('❌ No hay usuario en localStorage');
        setLoading(false);
        return;
      }

      const usuario = JSON.parse(usuarioString);
      console.log('👤 Usuario parseado completo:', JSON.stringify(usuario, null, 2));
      console.log('👤 Claves del usuario:', Object.keys(usuario));
      
      // Buscar id_tienda en diferentes posibles ubicaciones
      let storeId = usuario.id_tienda || usuario.idTienda || usuario.tienda_id || usuario.storeId;
      
      console.log('🏪 Store ID extraído:', storeId);
      console.log('🏪 Tipo de Store ID:', typeof storeId);
      
      // Si no hay id_tienda, intentar obtenerlo del perfil de tienda
      if (!storeId) {
        console.warn('⚠️ No se encontró id_tienda directamente, intentando obtenerlo del backend...');
        
        const userId = usuario.id_usuario || usuario.idUsuario;
        console.log('👤 Intentando con user ID:', userId);
        
        if (userId) {
          try {
            // Obtener el perfil de usuario para conseguir el id_tienda
            const userResponse = await fetch(`http://localhost:8081/api/v1/users/${userId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              console.log('✅ Datos de usuario desde backend:', userData);
              storeId = userData.data?.id_tienda || userData.id_tienda;
              console.log('🏪 Store ID obtenido del backend:', storeId);
              
              // Actualizar localStorage con el id_tienda
              if (storeId) {
                const updatedUser = { ...usuario, id_tienda: storeId };
                localStorage.setItem('usuario', JSON.stringify(updatedUser));
                console.log('✅ localStorage actualizado con id_tienda');
              }
            }
          } catch (err) {
            console.error('❌ Error al obtener datos de usuario:', err);
          }
        }
      }

      if (!storeId) {
        console.error('❌ No se pudo obtener id_tienda de ninguna fuente');
        console.error('❌ Usuario completo:', usuario);
        alert('No se encontró el ID de la tienda. Por favor, cierra sesión y vuelve a iniciar.');
        setLoading(false);
        return;
      }

      const url = `http://localhost:8081/api/v1/stores/${storeId}/products`;
      console.log('🌐 URL completa:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const responseText = await response.text();
      console.log('📄 Response text (raw):', responseText);

      if (response.ok) {
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('✅ Datos parseados:', data);
          console.log('✅ data.data?.productos length:', data.data?.productos?.length);
        } catch (parseError) {
          console.error('❌ Error al parsear JSON:', parseError);
          setLoading(false);
          return;
        }
        
        const productsList = data.data?.productos || [];
        console.log('📦 Cantidad de productos:', productsList.length);
        
        if (productsList.length > 0) {
          console.log('📦 Primer producto (ejemplo):', productsList[0]);
        }
        
        const mappedProducts = productsList.map((p: any) => ({
          id: p.id_producto,
          nombre: p.nombre || '',
          sku: p.sku || `SKU-${p.id_producto}`,
          fecha_caducidad: p.fecha_vencimiento || '',
          precio_original: p.precio_original || p.precio || 0,
          precio_oferta: p.precio || 0,
          stock: p.stock || 0,
          estado: (p.stock || 0) > 0 ? 'Activo' : 'Agotado',
          imagen_url: p.imagen_url || ''
        }));

        console.log('✅ Productos mapeados finales:', mappedProducts);
        console.log('📊 Total de productos mapeados:', mappedProducts.length);
        
        setProducts(mappedProducts);
        console.log('=== FIN DEBUG INVENTARIO ===');
      } else {
        console.error('❌ Response no OK');
        console.error('❌ Status:', response.status);
        console.error('❌ Response body:', responseText);
      }
    } catch (error) {
      console.error('❌ Error capturado en catch:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId: number) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleToggleVisibility = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      // Endpoint placeholder
      await fetch(`http://localhost:8081/api/v1/products/${productId}/toggle-visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Recargar productos
      loadProducts();
    } catch (error) {
      console.error('Error al cambiar visibilidad:', error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Endpoint placeholder
      await fetch(`http://localhost:8081/api/v1/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Recargar productos
      loadProducts();
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !filterDate || product.fecha_caducidad === filterDate;
    const matchesStatus = !filterStatus || product.estado === filterStatus;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)}€`;
  };

  return (
    <div className="inventory-container">
      <Header variant="default" user={{ name: 'Tienda' }} onLogout={() => navigate('/login')} />

      <div className="inventory-content">
        <div className="inventory-header">
          <h1 className="inventory-title">Gestión de Inventario</h1>
          <button className="btn-add-product" onClick={() => navigate('/create-product')}>
            <Plus size={20} />
            Añadir Nuevo Producto
          </button>
        </div>

        {/* Filters */}
        <div className="inventory-filters">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="">Fecha de caducidad</option>
            <option value="2024-12-25">25/12/2024</option>
            <option value="2024-12-22">22/12/2024</option>
          </select>

          <select 
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Categoría</option>
            <option value="lacteos">Lácteos</option>
            <option value="panaderia">Panadería</option>
            <option value="quesos">Quesos</option>
          </select>

          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Estado</option>
            <option value="Activo">Activo</option>
            <option value="Agotado">Agotado</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-state">Cargando productos...</div>
        ) : (
          <>
            <div className="inventory-table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>SKU</th>
                    <th>Fecha Cad.</th>
                    <th>Precio Orig.</th>
                    <th>Precio Oferta</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-cell">
                            <div className="product-image">
                              {product.imagen_url ? (
                                <img src={product.imagen_url} alt={product.nombre} />
                              ) : (
                                <div className="product-placeholder">📦</div>
                              )}
                            </div>
                            <span className="product-name">{product.nombre}</span>
                          </div>
                        </td>
                        <td>{product.sku}</td>
                        <td className={new Date(product.fecha_caducidad) < new Date() ? 'date-expired' : 'date-warning'}>
                          {formatDate(product.fecha_caducidad)}
                        </td>
                        <td>{formatPrice(product.precio_original)}</td>
                        <td className="price-offer">{formatPrice(product.precio_oferta)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`status-badge status-${product.estado.toLowerCase()}`}>
                            {product.estado}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button 
                              className="action-btn action-edit"
                              onClick={() => handleEdit(product.id)}
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              className="action-btn action-hide"
                              onClick={() => handleToggleVisibility(product.id)}
                              title="Ocultar"
                            >
                              <EyeOff size={18} />
                            </button>
                            <button 
                              className="action-btn action-delete"
                              onClick={() => handleDelete(product.id)}
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="empty-state">
                        No se encontraron productos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button className="pagination-btn" disabled={currentPage === 1}>
                <ChevronDown size={20} className="rotate-90" />
              </button>
              <button className="pagination-page active">1</button>
              <button className="pagination-page">2</button>
              <button className="pagination-page">3</button>
              <span className="pagination-dots">...</span>
              <button className="pagination-page">10</button>
              <button className="pagination-btn">
                <ChevronDown size={20} className="-rotate-90" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;