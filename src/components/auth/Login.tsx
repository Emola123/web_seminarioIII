import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { Input } from '../common/Input';
import { LoginFormData } from '../../types/auth.types';
import { authService } from '../../services/authService';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('🔐 Iniciando login...');
      const { role } = await authService.login(data);
      
      console.log('✅ Login exitoso, rol:', role);
      
      // Obtener datos completos del usuario
      const token = localStorage.getItem('token');
      const usuarioBase = JSON.parse(localStorage.getItem('usuario') || '{}');
      const userId = usuarioBase.id_usuario;
      
      console.log('👤 User ID:', userId);
      console.log('🎭 Rol detectado:', role);
      
      // Si es tienda/vendedor, obtener el id_tienda
      if (role === 'tienda' || role === 'vendedor') {
        console.log('🏪 Usuario es tienda, obteniendo id_tienda...');
        
        try {
          // Usamos ruta relativa para que el proxy de Vite maneje CORS
          const storesResponse = await fetch('/api/v1/stores', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (storesResponse.ok) {
            const storesData = await storesResponse.json();
            console.log('📦 Tiendas obtenidas:', storesData);
            
            const tiendas = storesData.tiendas || [];
            const miTienda = tiendas.find((t: any) => 
              t.usuario?.id_usuario === userId || 
              t.id_usuario === userId
            );
            
            if (miTienda) {
              console.log('✅ Tienda encontrada:', miTienda);
              
              // Actualizar localStorage con datos completos de la tienda
              const usuarioCompleto = {
                ...usuarioBase,
                id_tienda: miTienda.id_tienda,
                area_responsable: miTienda.area_responsable,
                direccion: miTienda.direccion,
                telefono: miTienda.telefono,
                rol: role
              };
              
              console.log('💾 Guardando usuario completo:', usuarioCompleto);
              localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
            } else {
              console.warn('⚠️ No se encontró tienda para este usuario');
            }
          } else {
            console.error('❌ Error al obtener tiendas:', storesResponse.status);
          }
        } catch (err) {
          console.error('❌ Error al buscar tienda:', err);
        }
      } else {
        console.log('👤 Usuario es comprador, no se necesita id_tienda');
        // Para compradores, asegurar que el rol esté guardado
        const usuarioCompleto = {
          ...usuarioBase,
          rol: role
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
      }
      
      // Simular un pequeño delay para mejor UX
      setTimeout(() => {
        setIsLoading(false);
        console.log('🎯 Redirigiendo al home...');
        navigate('/');
      }, 1000);

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al iniciar sesión');
      setIsLoading(false);
      console.error('❌ Error en login:', error);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="icon-container">
            <div className="icon-bg">
              <Clock style={{ color: '#10B981' }} size={32} />
            </div>
          </div>
          
          <h1 className="login-title">Bienvenido a Expirapp</h1>
          <p className="login-subtitle">
            Inicia sesión para encontrar grandes ofertas en productos cercanos a su fecha de vencimiento
          </p>

          {errorMessage && (
            <div className="alert-error">
              ✕ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field-container">
              <label className="input-label">
                Correo electrónico
              </label>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                }}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.email && (
                <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>
              )}
            </div>

            <div className="field-container">
              <label className="input-label">
                Contraseña
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'La contraseña es obligatoria' }}
                render={({ field }) => (
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Introduce tu contraseña"
                    value={field.value}
                    onChange={field.onChange}
                    showPasswordToggle={true}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}
              />
              {errors.password && (
                <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>
              )}
            </div>

            <div className="checkbox-container">
              <label className="checkbox-label">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <input
                      {...field}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="checkbox-input"
                    />
                  )}
                />
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="link-button"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="login-footer">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="link-button"
              style={{ fontWeight: '500' }}
            >
              Crear una cuenta nueva
            </button>
          </p>
        </div>
      </div>

      {/* Círculo de carga superpuesto */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
};