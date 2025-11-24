import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Menu } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
    <div className="flex items-center space-x-8">
      <Link to="/" className="text-2xl font-bold text-green-600 no-underline">Expirapp</Link>
    </div>
    <nav className="hidden lg:flex items-center gap-6 text-gray-600 text-sm font-bold">
      <a href="#" className="hover:text-green-600 transition-colors">Categorías</a>
      <a href="#" className="hover:text-green-600 transition-colors">Ofertas</a>
      <a href="#" className="hover:text-green-600 transition-colors">Donaciones</a>
      <a href="#" className="hover:text-green-600 transition-colors">Sobre Nosotros</a>
    </nav>
    <div className="flex items-center space-x-4">
      <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm">
        Iniciar Sesión
      </button>
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
        <Heart size={20} />
      </button>
      <Link to="/cart">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <ShoppingCart size={20} />
        </button>
      </Link>
      <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-500">
        <Menu size={20} />
      </button>
    </div>
  </header>
);

interface FilterItemProps {
  title: string;
  icon: ReactElement<any, any>;
  selected?: boolean;
  dropdown?: boolean;
  children?: React.ReactNode;
}

export const FilterItem: React.FC<FilterItemProps> = ({ title, icon, selected = false, dropdown = false, children }) => (
  <div className="filter-item">
    <button className={`filter-button ${selected ? 'selected' : ''}`}>
      <div className="filter-content">
        <div className="filter-icon-wrapper">
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any, any>, { size: 20 }) : icon}
        </div>
        <span className="filter-label">{title}</span>
      </div>
      {dropdown && <span className={`filter-chevron ${selected ? 'rotated' : ''}`}>▼</span>}
      {children}
    </button>
  </div>
);
