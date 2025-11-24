import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { CheckCircle, MapPin, Store, Phone, Mail, Lock } from 'lucide-react';
import { Input } from '../common/Input';
import { authService } from '../../services/authService';
import { BuyerRegisterData, StoreRegisterData } from '../../types/auth.types';
import './Register.css';

type RegisterFormValues = {
  role: 'comprador' | 'vendedor';
  // Buyer fields
  buyerName: string;
  buyerEmail: string;
  buyerPassword: string;
  buyerAddress: string;
  // Store fields
  storeOwnerName: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  storePassword: string;
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormValues>({
    defaultValues: {
      role: 'comprador',
      buyerName: '',
      buyerEmail: '',
      buyerPassword: '',
      buyerAddress: '',
      storeOwnerName: '',
      storeName: '',
      storeAddress: '',
      storePhone: '',
      storeEmail: '',
      storePassword: '',
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const currentRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (data.role === 'comprador') {
        const buyerData: BuyerRegisterData = {
          fullName: data.buyerName,
          email: data.buyerEmail,
          password: data.buyerPassword,
          address: data.buyerAddress,
        };
        await authService.registerBuyer(buyerData);
        setSuccessMessage('¡Usuario creado con éxito! Redirigiendo al inicio de sesión...');
      } else {
        const storeData: StoreRegisterData = {
          nombreUsuario: data.storeOwnerName,
          areaResponsable: data.storeName,
          direccion: data.storeAddress,
          telefono: data.storePhone,
          correo: data.storeEmail,
          contrasena: data.storePassword,
        };
        await authService.registerStore(storeData);
        setSuccessMessage('¡Tienda registrada con éxito! Redirigiendo al inicio de sesión...');
      }

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <CheckCircle style={{ color: '#10B981' }} size={24} />
            <span className="register-logo-text">Expirapp</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="register-button-secondary"
          >
            Iniciar sesión
          </button>
        </div>

        <h1 className="register-title">Crea tu cuenta en Expirapp</h1>
        <p className="register-subtitle">
          {currentRole === 'comprador' 
            ? 'Únete a nuestra comunidad y empieza a disfrutar de productos de calidad a precios increíbles.'
            : 'Únete a Expirapp y empieza a vender productos próximos a vencer.'}
        </p>

        {successMessage && (
          <div className="alert-success">
            ✓ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert-error">
            ✕ {errorMessage}
          </div>
        )}

        <div className="role-container">
          <button
            type="button"
            onClick={() => setValue('role', 'comprador')}
            className={`role-button ${currentRole === 'comprador' ? 'active' : 'inactive'}`}
            disabled={isLoading}
          >
            👤 Soy Comprador
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'vendedor')}
            className={`role-button ${currentRole === 'vendedor' ? 'active' : 'inactive'}`}
            disabled={isLoading}
          >
            🏪 Soy Vendedor (Tengo una Tienda)
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {currentRole === 'comprador' && (
            <>
              <div className="field-container">
                <label className="input-label">Nombre completo</label>
                <Controller
                  name="buyerName"
                  control={control}
                  rules={{ required: 'El nombre es obligatorio' }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Introduce tu nombre y apellidos"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.buyerName && <p className="error-message">{errors.buyerName.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Correo electrónico</label>
                <Controller
                  name="buyerEmail"
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
                      placeholder="tu.correo@ejemplo.com"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.buyerEmail && <p className="error-message">{errors.buyerEmail.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Contraseña</label>
                <Controller
                  name="buyerPassword"
                  control={control}
                  rules={{ 
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                  }}
                  render={({ field }) => (
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Crea una contraseña segura"
                      value={field.value}
                      onChange={field.onChange}
                      showPasswordToggle={true}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                  )}
                />
                {errors.buyerPassword && <p className="error-message">{errors.buyerPassword.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Dirección principal</label>
                <Controller
                  name="buyerAddress"
                  control={control}
                  rules={{ required: 'La dirección es obligatoria' }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Ej: Calle Falsa 123, Springfield"
                      value={field.value}
                      onChange={field.onChange}
                      icon={<MapPin size={18} />}
                    />
                  )}
                />
                {errors.buyerAddress && <p className="error-message">{errors.buyerAddress.message}</p>}
              </div>
            </>
          )}

          {currentRole === 'vendedor' && (
            <>
              <div className="field-container">
                <label className="input-label">Nombre del responsable</label>
                <Controller
                  name="storeOwnerName"
                  control={control}
                  rules={{ required: 'El nombre del responsable es obligatorio' }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Ej: Juan Pérez"
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Store size={18} />}
                    />
                  )}
                />
                {errors.storeOwnerName && <p className="error-message">{errors.storeOwnerName.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Área responsable / Nombre del negocio</label>
                <Controller
                  name="storeName"
                  control={control}
                  rules={{ required: 'El nombre del negocio es obligatorio' }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Ej: Super Ahorro"
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Store size={18} />}
                    />
                  )}
                />
                {errors.storeName && <p className="error-message">{errors.storeName.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Dirección</label>
                <Controller
                  name="storeAddress"
                  control={control}
                  rules={{ required: 'La dirección es obligatoria' }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Ej: Av. Siempre Viva 742"
                      value={field.value}
                      onChange={field.onChange}
                      icon={<MapPin size={18} />}
                    />
                  )}
                />
                {errors.storeAddress && <p className="error-message">{errors.storeAddress.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Número de contacto</label>
                <Controller
                  name="storePhone"
                  control={control}
                  rules={{ required: 'El teléfono es obligatorio' }}
                  render={({ field }) => (
                    <Input
                      type="tel"
                      placeholder="Ej: 3012345678"
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Phone size={18} />}
                    />
                  )}
                />
                {errors.storePhone && <p className="error-message">{errors.storePhone.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Correo electrónico</label>
                <Controller
                  name="storeEmail"
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
                      placeholder="tu.tienda@correo.com"
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Mail size={18} />}
                    />
                  )}
                />
                {errors.storeEmail && <p className="error-message">{errors.storeEmail.message}</p>}
              </div>

              <div className="field-container">
                <label className="input-label">Contraseña</label>
                <Controller
                  name="storePassword"
                  control={control}
                  rules={{ 
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                  }}
                  render={({ field }) => (
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={field.value}
                      onChange={field.onChange}
                      icon={<Lock size={18} />}
                      showPasswordToggle={true}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                  )}
                />
                {errors.storePassword && <p className="error-message">{errors.storePassword.message}</p>}
              </div>
            </>
          )}

          <button
            type="submit"
            className="register-button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="register-footer">
          © 2024 Expirapp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};