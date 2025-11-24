import React from 'react';
import { MapPin } from 'lucide-react';
import { Product } from '../../../types/menu.types';

interface ProductCardProps {
  product: Product;
  onOpen: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen }) => {
  const isDonation = product.badge === "Donación";
  const hasOffer = product.badge === "Oferta";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/300x300/cccccc/333333?text=${product.name.substring(0, 10).replace(' ', '+')}`;
  };

  return (
    <div onClick={onOpen} className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />
        {product.badge && (
          <span className={`product-badge ${isDonation ? 'badge-donation' : 'badge-offer'}`}>
            {product.badge}
          </span>
        )}
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price-row">
          {isDonation ? (
            <span className="price-free">Gratis</span>
          ) : (
            <>
              <span className="price-current">${product.price}</span>
              {hasOffer && product.originalPrice && (
                <span className="price-original">${product.originalPrice}</span>
              )}
            </>
          )}
        </div>
        <div className="product-meta">
          {product.icon}
          <span className="product-location">{product.location}</span>
        </div>
        <div className="product-footer">
          <MapPin size={12} className="icon-pin" />
          <span>{product.distance || 'Cerca de ti'}</span>
        </div>
      </div>
    </div>
  );
};
