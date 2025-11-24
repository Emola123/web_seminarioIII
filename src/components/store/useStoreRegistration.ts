import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreFormData } from '../../types/auth.types';

export const useStoreRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StoreFormData>({
    nombreUsuario: '',
    areaResponsable: '',
    direccion: '',
    telefono: '',
    correo: '',
    contrasena: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/v1/stores/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Tienda registrada:', data);
      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error en registro de tienda:', error);
    }
  };

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    handleSubmit
  };
};
