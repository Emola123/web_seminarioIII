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
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      setUser({ name: usuario.nombre || 'Usuario', photo: usuario.foto });
    }
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
      
      const payload = {
        nombre: productData.nombre,
        descripcion: productData.descripcion || undefined,
        precio: parseFloat(productData.precio),
        fecha_vencimiento: productData.fechaVencimiento,
        stock: productData.stock ? parseInt(productData.stock) : undefined,
        estado: productData.estado,
        id_tienda: usuario.id_tienda,
      };

      const response = await fetch('http://localhost:8081/api/v1/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
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
