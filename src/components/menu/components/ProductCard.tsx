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
    <div onClick={onOpen} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group cursor-pointer h-full flex flex-col">
      <div className="relative h-48 sm:h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={handleImageError}
        />
        {product.badge && (
          <span
            className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md
              ${isDonation ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'}
            `}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col space-y-1 flex-grow">
        <h3 className="text-base font-semibold text-gray-800 truncate">{product.name}</h3>
        <div className="flex items-end space-x-2">
          {isDonation ? (
            <span className="text-lg font-bold text-green-600">Gratis</span>
          ) : (
            <>
              <span className="text-lg font-bold text-gray-800">${product.price}</span>
              {hasOffer && product.originalPrice && (
                <span className="text-sm line-through text-gray-400">${product.originalPrice}</span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
          {product.icon}
          <span className="truncate">{product.location}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-400 mt-auto pt-2">
          <MapPin size={12} className="text-gray-400" />
          <span>{product.distance || 'Cerca de ti'}</span>
        </div>
      </div>
    </div>
  );
};
