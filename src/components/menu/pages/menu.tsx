import './menu.css';
import React, { useState, useEffect } from 'react';
import Cart from './Cart.tsx';
import Payment from './payment.tsx';
import PaymentMethod from './paymentMethod.tsx';
import { Routes, Route, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, DollarSign, Leaf, Heart, Check, ChevronDown, ShoppingCart, Menu } from 'lucide-react';
import { Product, CartStore, CartItem } from '../../../types/menu.types';
import { productService } from '../../../services/productService';
import { FilterItem } from '../components/MenuComponents';
import { Header } from '../../common/Header';
import { ProductCard } from '../components/ProductCard';
import { Login } from '../../auth/Login';
import { Register } from '../../auth/Register';
import { ForgotPassword } from '../../auth/ForgotPassword';
import { ResetPassword } from '../../auth/ResetPassword';
import { UserProfile } from '../../profile/UserProfile';
import { StoreProfile } from '../../profile/StoreProfile';
import { StoreRegistration } from '../../store/StoreRegistration';
import { CreateProduct } from '../../store/CreateProduct';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  onlyDonations: boolean;
  setOnlyDonations: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductClick: (product: Product) => void;
}



interface FilterToggleProps {
  title: string;
  icon: React.ReactElement;
  checked: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({ title, icon, checked, onToggle }) => (
  <div className="py-3 border-b border-gray-100 last:border-b-0">
    <div className="w-full flex justify-between items-center text-left p-3">
      <div className="flex items-center space-x-3 text-gray-600">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any, any>, { size: 20 }) : icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>
  </div>
);

const Pagination: React.FC = () => (
  <div className="flex justify-center items-center space-x-2 py-8">
    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
      <ChevronDown size={20} className="rotate-90" />
    </button>
    {[1, 2, 3, '...', 10].map((page, index) => (
      <button
        key={index}
        className={`w-8 h-8 rounded-full text-sm font-medium transition
          ${page === 1 ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}
          ${page === '...' ? 'cursor-default hover:bg-transparent' : ''}
        `}
        disabled={page === '...'}
      >
        {page}
      </button>
    ))}
    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
      <ChevronDown size={20} className="-rotate-90" />
    </button>
  </div>
);

const Home: React.FC<HomeProps> = ({ onlyDonations, setOnlyDonations, products, loading, error, onProductClick }) => (
  <main>
    <Header/>
    <div className="flex flex-col ml-auto lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 px-4 pt-6">
      <div className="mb-4 lg:mb-0">
        <h2 className="text-3xl font-bold text-gray-800">Resultados de búsqueda</h2>
        <p className="text-gray-500">Productos cerca de ti</p>
      </div>
      <div className="w-full lg:w-96 relative">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
        />
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-8 px-4 pb-8">
      <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0 h-fit">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <SlidersHorizontal size={20} />
          <span>Filtros</span>
        </h3>

        <div className="space-y-3">
          <FilterItem title="Categoría" icon={<Leaf />} selected dropdown>
            <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
              <Check size={14} />
            </div>
          </FilterItem>
          <FilterItem title="Precio" icon={<DollarSign />} dropdown />
          <FilterItem title="Cercanía" icon={<MapPin />} dropdown />
          <FilterToggle
            title="Solo donaciones"
            icon={<Heart />}
            checked={onlyDonations}
            onToggle={(e) => setOnlyDonations(e.target.checked)} 
          />
        </div>
      </aside>

      <section className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                Error cargando productos: {error}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {(products || []).filter(p => !onlyDonations || p.badge === 'Donación').map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onOpen={() => onProductClick(product)} 
                  />
                ))}
              </div>
              <Pagination />
            </>
          )}
      </section>
    </div>
  </main>
)

const App: React.FC = () => {
  const [onlyDonations, setOnlyDonations] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartStore[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartData(prev => {
      const itemId: string = `p-${product.id}`;
      const storeName: string = product.location || 'Tienda';
      const next: CartStore[] = prev.map(store => ({ ...store, items: [...store.items] }));

      let store: CartStore | undefined = next.find(s => s.store === storeName);
      if (!store) {
        store = { id: Date.now(), store: storeName, items: [] };
        next.push(store);
      }

      const existing: CartItem | undefined = store.items.find(i => i.itemId === itemId);
      
      if (existing) {
        existing.quantity = (existing.quantity || 0) + quantity;
      } else {
        const newItem: CartItem = {
          itemId,
          name: product.name,
          brand: product.brand || '',
          size: product.size || '',
          expiryDate: product.fecha_vencimiento || '',
          originalPrice: product.originalPrice ?? product.price ?? 0,
          salePrice: product.price ?? 0,
          quantity: quantity,
          imageUrl: product.imageUrl || ''
        };
        store.items.push(newItem);
      }

      return next;
    });
  };

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getAllProducts();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      <Routes>
        <Route path="/" element={
          <Home 
            onlyDonations={onlyDonations} 
            setOnlyDonations={setOnlyDonations} 
            products={products} 
            loading={loading} 
            error={error}
            onProductClick={setSelectedProduct}
          />
        } />
        <Route path="/cart" element={<Cart cartData={cartData} setCartData={setCartData} />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/method" element={<PaymentMethod cartData={cartData as any} setCartData={setCartData as any} />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/store-profile" element={<StoreProfile />} />
        
        {/* Store Routes */}
        <Route path="/store-registration" element={<StoreRegistration />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all scale-100">
            <div className="relative h-64">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={16} />
                    {selectedProduct.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">${selectedProduct.price}</p>
                  {selectedProduct.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">${selectedProduct.originalPrice}</p>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedProduct.descripcion || 'Sin descripción disponible.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 block">Stock disponible</span>
                  <span className="font-semibold text-gray-900">
                    {typeof selectedProduct.stock !== 'undefined' && selectedProduct.stock !== null ? selectedProduct.stock : '—'} unidades
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 block">Fecha de vencimiento</span>
                  <span className="font-semibold text-gray-900">
                    {selectedProduct.fecha_vencimiento || '—'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => { addToCart(selectedProduct, 1); setSelectedProduct(null); }} 
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium shadow-lg shadow-green-200 transition-all transform active:scale-[0.98]"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
