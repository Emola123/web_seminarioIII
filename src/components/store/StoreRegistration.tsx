import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Store, MapPin, Phone, Mail, Lock, CreditCard } from 'lucide-react';
import { Input } from '../common/Input';
import { useStoreRegistration } from './useStoreRegistration';
import './StoreRegistration.css';

export const StoreRegistration: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    handleSubmit
  } = useStoreRegistration();

  return (
    <div className="store-registration-container">
      <div className="store-registration-card">
        <div className="store-logo-section">
          <Clock className="store-logo-icon" size={24} />
          <span className="store-logo-text">Expirapp</span>
        </div>

        <h1 className="store-title">Registra tu tienda</h1>
        <p className="store-subtitle">
          Únete a Expirapp y empieza a vender productos próximos a vencer.
        </p>

        <div>
          <div className="form-grid-two-cols">
            <div className="form-grid-item">
              <label className="form-label">
                Nombre del negocio
              </label>
              <Input
                type="text"
                placeholder="Ej: Super Ahorro"
                value={formData.nombreUsuario}
                onChange={(e) => setFormData({ ...formData, nombreUsuario: e.target.value })}
                icon={<Store size={18} />}
              />
            </div>

            <div className="form-grid-item">
              <label className="form-label">
                NIT o identificación
              </label>
              <Input
                type="text"
                placeholder="Tu número de identificación"
                value={formData.areaResponsable}
                onChange={(e) => setFormData({ ...formData, areaResponsable: e.target.value })}
                icon={<CreditCard size={18} />}
              />
            </div>
          </div>

          <div className="form-field-container">
            <label className="form-label">
              Dirección física del local
            </label>
            <Input
              type="text"
              placeholder="Ej: Av. Siempre Viva 742"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              icon={<MapPin size={18} />}
            />
          </div>

          <div className="form-grid-two-cols">
            <div className="form-grid-item">
              <label className="form-label">
                Número de contacto
              </label>
              <Input
                type="tel"
                placeholder="Ej: 3012345678"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                icon={<Phone size={18} />}
              />
            </div>

            <div className="form-grid-item">
              <label className="form-label">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tu.tienda@correo.com"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                icon={<Mail size={18} />}
              />
            </div>
          </div>

          <div className="form-field-container">
            <label className="form-label">
              Contraseña
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              icon={<Lock size={18} />}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="btn-submit"
          >
            Crear cuenta
          </button>
        </div>

        <p className="store-footer">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="btn-link"
          >
            Inicia sesión
          </button>
        </p>

        <p className="store-copyright">
          © 2024 Expirapp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};