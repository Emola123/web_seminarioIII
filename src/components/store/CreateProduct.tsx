import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { Header } from '../common/Header';
import { useCreateProduct } from './useCreateProduct';
import './CreateProduct.css';

export const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const {
    productData,
    setProductData,
    images,
    isLoading,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    user,
    handleLogout
  } = useCreateProduct();

  return (
    <div className="create-product-container">
      {/* Header */}
      <Header 
        variant="default" 
        user={user}
        onLogout={handleLogout}
      />

      {/* Content */}
      <div className="create-product-content">
        <h1 className="create-product-title">Crear Nueva Publicación</h1>

        <div className="create-product-grid">
          {/* Left Column */}
          <div>
            <div className="create-product-card">
              {/* Nombre del Producto (nombre) */}
              <div className="form-group">
                <label className="form-label">Nombre del Producto (*)</label>
                <input
                  type="text"
                  placeholder="Ej: Leche Deslactosada"
                  value={productData.nombre}
                  onChange={(e) => setProductData({ ...productData, nombre: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Descripción (descripcion) */}
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  placeholder="Breve descripción del producto"
                  value={productData.descripcion}
                  onChange={(e) => setProductData({ ...productData, descripcion: e.target.value })}
                  className="form-textarea"
                />
              </div>

              {/* Fecha de Vencimiento (fecha_vencimiento) */}
              <div className="form-group">
                <label className="form-label">Fecha de Vencimiento (*)</label>
                <input
                  type="date"
                  value={productData.fechaVencimiento}
                  onChange={(e) => setProductData({ ...productData, fechaVencimiento: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Campos divididos: Stock y Precio */}
              <div className="form-row">
                
                {/* Stock (stock) */}
                <div>
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    placeholder="Unidades disponibles"
                    value={productData.stock}
                    onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                {/* Precio (precio) - Unificado */}
                <div>
                  <label className="form-label">Precio de Venta (*)</label>
                  <input
                    type="number"
                    placeholder="$0.00"
                    value={productData.precio}
                    onChange={(e) => setProductData({ ...productData, precio: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Estado (estado) - Nuevo campo con lista desplegable */}
              <div className="form-group">
                <label className="form-label">Estado de Publicación</label>
                <select
                  value={productData.estado}
                  onChange={(e) => setProductData({ ...productData, estado: e.target.value })}
                  className="form-select"
                >
                  <option value="En preparación">En preparación</option>
                  <option value="Listo para recoger">Listo para recoger</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </div>
              
            </div>
          </div>

          {/* Right Column - Images */}
          <div>
            <div className="create-product-card">
              <label className="form-label">Subir Fotografías</label>
              <p className="upload-hint">
                Arrastra y suelta o haz clic para seleccionar las imágenes del producto
              </p>

              <label className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={48} className="upload-icon" />
                <p className="upload-text">
                  Seleccionar Archivos
                </p>
              </label>

              {images.length > 0 && (
                <div className="image-preview-container">
                  {images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                      />
                      <button
                        className="btn-remove-image"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button
            className="btn-cancel"
            onClick={() => navigate('/store-profile')}
          >
            Cancelar
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
};