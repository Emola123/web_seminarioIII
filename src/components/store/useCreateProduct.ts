import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ProductData {
  nombre: string;
  descripcion: string;
  fechaVencimiento: string;
  stock: string;
  precio: string;
  estado: string;
}

export const useCreateProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ProductData>({
    nombre: '',
    descripcion: '',
    fechaVencimiento: '',
    stock: '',
    precio: '',
    estado: 'En preparación',
  });
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; photo?: string } | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      const usuarioString = localStorage.getItem('usuario');
      if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        setUser({ name: usuario.nombre || 'Usuario', photo: usuario.foto });

        // Si no tenemos el ID de la tienda en el usuario, intentamos buscarlo
        if (!usuario.id_tienda && !usuario.store_id) {
          try {
            const response = await fetch(`http://localhost:8081/api/v1/stores/${usuario.id_usuario || usuario.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (response.ok) {
              const data = await response.json();
              if (data.data && data.data.id_tienda) {
                // Actualizamos el usuario en localStorage con el ID de la tienda
                const updatedUser = { ...usuario, id_tienda: data.data.id_tienda };
                localStorage.setItem('usuario', JSON.stringify(updatedUser));
                setUser({ name: updatedUser.nombre || 'Usuario', photo: updatedUser.foto });
              }
            }
          } catch (error) {
            console.error('Error fetching store data:', error);
          }
        }
      }
    };

    fetchStoreData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages([...images, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Obtener el usuario de localStorage
      const usuarioString = localStorage.getItem('usuario');
      if (!usuarioString) {
        alert('No hay sesión activa');
        setIsLoading(false);
        return;
      }
      const usuario = JSON.parse(usuarioString);

      // Validación básica de campos requeridos
      if (!productData.nombre || !productData.precio || !productData.fechaVencimiento) {
        alert('Por favor, completa los campos Nombre del Producto, Precio y Fecha de Vencimiento.');
        setIsLoading(false);
        return;
      }

      // Resolver ID de la tienda
      const storeId = usuario.id_tienda || usuario.store_id || (usuario.tienda && usuario.tienda.id_tienda);

      if (!storeId) {
        alert('Error: No se pudo identificar la tienda. Por favor, recarga la página o vuelve a iniciar sesión. Debug: ' + JSON.stringify(usuario));
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('nombre', productData.nombre);
      if (productData.descripcion) formData.append('descripcion', productData.descripcion);
      formData.append('precio', productData.precio);
      formData.append('fecha_vencimiento', productData.fechaVencimiento);
      if (productData.stock) formData.append('stock', productData.stock);
      formData.append('estado', productData.estado);
      formData.append('id_tienda', storeId.toString());

      // Adjuntar imagen (solo la primera, según el requerimiento 'imagen')
      if (images.length > 0) {
        formData.append('imagen', images[0]);
      }

      const response = await fetch('http://localhost:8081/api/v1/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Content-Type se establece automáticamente para FormData
        },
        body: formData,
      });

      if (response.ok) {
        alert('¡Producto publicado exitosamente!');
        // Limpiar formulario
        setProductData({
          nombre: '',
          descripcion: '',
          fechaVencimiento: '',
          stock: '',
          precio: '',
          estado: 'En preparación',
        });
        setImages([]);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo publicar el producto'}`);
      }
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al publicar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('login');
  };

  return {
    productData,
    setProductData,
    images,
    isLoading,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    user,
    handleLogout
  };
};
