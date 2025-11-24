import { useForm } from "react-hook-form";
import InputField from "./InputField";
import "./FormPublication.css";
import { Header } from "../common/Header";


function FormPublication() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    window.alert("Enviado correctamente!");
  };

  return (
    <div className="publication-page">
      <div className="publication-card">
        {/* CABECERA CENTRALIZADA */}
        <div className="mb-6">
            <Header variant="simple" />
        </div>

        {/* TÍTULO PRINCIPAL */}
        <h1 className="publication-title">Crear Nueva Publicación</h1>

        {/* GRID DOS COLUMNAS: FORM + PANEL DE FOTOS */}
        <div className="publication-grid">
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <form onSubmit={handleSubmit(onSubmit)} className="publication-form">
            {/* NOMBRE DEL PRODUCTO */}
            <InputField
              label="Nombre del Producto"
              placeholder="Ej: Leche Deslactosada"
              {...register("title", {
                required: "El título es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
              error={errors.title?.message as string | undefined}
            />

            {/* DESCRIPCIÓN */}
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="textarea"
                placeholder="Breve descripción del producto"
                {...register("description", {
                  required: "La descripción es obligatoria",
                })}
              />
              {errors.description && (
                <span className="error-text">
                  {errors.description.message as string}
                </span>
              )}
            </div>

            {/* CATEGORÍA */}
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="select"
                {...register("category", {
                  required: "Selecciona una categoría",
                })}
              >
                <option value="Lácteos">Lácteos</option>
                <option value="Carnes">Carnes</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Panadería">Panadería</option>
                <option value="Snacks">Snacks</option>
              </select>
              {errors.category && (
                <span className="error-text">
                  {errors.category.message as string}
                </span>
              )}
            </div>

            {/* FECHA DE VENCIMIENTO Y CANTIDAD */}
            <div className="form-row">
              <InputField
                label="Fecha de Vencimiento"
                type="date"
                {...register("expiryDate", {
                  required: "La fecha de vencimiento es obligatoria",
                })}
                error={errors.expiryDate?.message as string | undefined}
              />

              <InputField
                label="Cantidad"
                type="number"
                placeholder="Unidades"
                {...register("quantity", {
                  required: "La cantidad es obligatoria",
                  valueAsNumber: true,
                  min: { value: 1, message: "Debe ser al menos 1" },
                })}
                error={errors.quantity?.message as string | undefined}
              />
            </div>

            {/* PRECIOS */}
            <div className="form-row">
              <InputField
                label="Precio Original"
                type="number"
                placeholder="$0.00"
                {...register("originalPrice", {
                  required: "El precio original es obligatorio",
                  valueAsNumber: true,
                  min: { value: 0, message: "No puede ser negativo" },
                })}
                error={errors.originalPrice?.message as string | undefined}
              />

              <InputField
                label="Precio con Descuento"
                type="number"
                placeholder="$0.00"
                {...register("discountPrice", {
                  required: "El precio con descuento es obligatorio",
                  valueAsNumber: true,
                  min: { value: 0, message: "No puede ser negativo" },
                })}
                error={errors.discountPrice?.message as string | undefined}
              />
            </div>

            {/* DONACIÓN */}
            <div className="form-group checkbox-group">
              <input
                id="donation"
                type="checkbox"
                className="checkbox-input"
                {...register("donation")}
              />
              <label htmlFor="donation" className="checkbox-label">
                Marcar como Donación
              </label>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="form-actions">
              <button type="button" className="btn btn-ghost">
                Cancelar
              </button>
              <button type="button" className="btn btn-secondary">
                Guardar Borrador
              </button>
              <button type="submit" className="btn btn-primary">
                Publicar
              </button>
            </div>
          </form>

          {/* COLUMNA DERECHA: SUBIR FOTOGRAFÍAS */}
          <section className="upload-panel">
            <div className="upload-card">
              <h2 className="upload-title">Subir Fotografías</h2>
              <p className="upload-text">
                Arrastra y suelta o haz clic para seleccionar las imágenes del
                producto.
              </p>

              <button type="button" className="upload-button">
                Seleccionar Archivos
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default FormPublication;
