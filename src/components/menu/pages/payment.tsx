import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Store, LucideIcon } from 'lucide-react';
import './Payment.css';

// --- Interfaces de Tipado ---

/**
 * Define la estructura de una opción de entrega.
 * El icono es de tipo LucideIcon, que es lo que exporta 'lucide-react'.
 */
interface DeliveryOptionData {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    isDisabled: boolean;
}

/**
 * Props para el componente DeliveryOption.
 */
interface DeliveryOptionProps extends DeliveryOptionData {
    isSelected: boolean;
    onSelect: (id: string) => void;
}

// --- Subcomponentes ---

const Header: React.FC = () => (
    <header className="payment-header">
        <div className="header-content">
            {/* Usamos un enlace simple para simular la navegación, ajustado con clases de Tailwind */}
            <Link to="/" className="nav-logo-link">Expirapp</Link>
        </div>
    </header>
);

/**
 * Componente que representa una opción de método de entrega/recogida.
 */
const DeliveryOption: React.FC<DeliveryOptionProps> = ({
    id,
    icon: Icon,
    title,
    description,
    isDisabled,
    isSelected,
    onSelect
}) => {
    return (
        <label
            htmlFor={id}
            className={`delivery-option-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => !isDisabled && onSelect(id)}
        >
            <div className="option-content">
                {/* Icono */}
                <div className="option-icon-wrapper">
                    <Icon size={24} />
                </div>

                {/* Texto de la opción */}
                <div className="option-text">
                    <h3 className="option-title">{title}</h3>
                    <p className="option-description">{description}</p>
                </div>
            </div>

            {/* Radio Button Personalizado (solo visible si no está deshabilitado) */}
            {!isDisabled && (
                <div className="option-radio">
                    {isSelected && (
                        <div className="radio-inner"></div>
                    )}
                </div>
            )}

            {/* El input radio real, oculto */}
            <input
                type="radio"
                id={id}
                name="delivery_method"
                value={id}
                checked={isSelected}
                onChange={() => onSelect(id)}
                disabled={isDisabled}
                className="sr-only" // Ocultar visualmente
            />
        </label>
    );
};


// --- Componente Principal ---

const Payment: React.FC = () => {
    // Estado para la opción de entrega seleccionada
    const [selectedOption, setSelectedOption] = useState<string>('pickup');

    // Opciones de entrega (datos simulados tipados)
    const options: DeliveryOptionData[] = [
        {
            id: 'pickup',
            icon: Store,
            title: "Recoger en tienda",
            description: "Recoge tu pedido sin costo adicional en el punto de venta.",
            isDisabled: false,
        },
        {
            id: 'home_delivery_A',
            icon: Truck,
            title: "Envío a domicilio Estándar",
            description: "Recíbelo en la comodidad de tu casa. Tarifa: $5000",
            isDisabled: false,
        },
        {
            id: 'home_delivery_B',
            icon: Truck,
            title: "Envío no disponible",
            description: "Esta tienda no ofrece envío a domicilio para este pedido.",
            isDisabled: true,
        }
    ];

    const navigate = useNavigate();

    // Función para manejar la selección de una opción
    const handleSelect = (id: string) => {
        const option = options.find(opt => opt.id === id);
        if (option && !option.isDisabled) {
            setSelectedOption(id);
        }
    };

    // Determina si el botón Continuar debe estar habilitado
    const isContinueEnabled = !!selectedOption &&
        options.some(opt => opt.id === selectedOption && !opt.isDisabled);


    return (
        <div className="payment-page">
            <Header />

            <main className="payment-container">

                {/* Título */}
                <h2 className="payment-title">
                    Elige cómo recibir tu pedido
                </h2>

                {/* Lista de Opciones */}
                <div className="payment-options-list">
                    {options.map((option) => (
                        <DeliveryOption
                            key={option.id}
                            {...option}
                            isSelected={selectedOption === option.id}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>

                {/* Botón Continuar */}
                <div className="payment-actions">
                    <button
                        className="btn-continue"
                        disabled={!isContinueEnabled}
                        onClick={() => {
                            // Navegar a la selección de método de pago y pasar la opción seleccionada
                            if (isContinueEnabled) {
                                navigate('/payment/method', { state: { selectedOption } });
                            }
                        }}
                    >
                        Continuar
                    </button>
                </div>

                {/* Espacio para asegurar que el contenido no quede pegado al fondo */}
                <div className="spacer"></div>
            </main>
        </div>
    );
};

export default Payment;