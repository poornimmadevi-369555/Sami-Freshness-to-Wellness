import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import ProductCard from './components/ProductCard';
import Offers from './components/Offers';
import ContactForm from './components/ContactForm';
import CartDrawer from './components/CartDrawer';
import {
  ShoppingBasket,
  Search,
  Leaf,
  Sparkles,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Safe load cart state from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('samisfreshness_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'offers' | 'contact'>('home');
  const [showSearchClear, setShowSearchClear] = useState(false);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('samisfreshness_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle section triggers
  const handleScrollToSegment = (id: string, segment: 'home' | 'products' | 'offers' | 'contact') => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveTab(segment);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      }
      return prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const handleApplyCoupon = (code: string) => {
    setActiveCoupon(code);
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
  };

  // Filtered Products List
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate cart counts
  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* EXCLUSIVE TOP ACTION NOTIFIER */}
      <div id="top-promo-bar" className="bg-emerald-950 px-4 py-2.5 text-center text-3xs font-semibold tracking-widest text-emerald-100 uppercase sm:text-2xs">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={11} className="text-emerald-400" />
          USE CODE <strong className="font-mono text-white">FRESH20</strong> TO GET 20% OFF ON HARVEST BASKETS OVER ₹300!
        </span>
      </div>

      {/* HEADER & EMBEDDED NAVIGATION */}
      <header
        id="app-header"
        className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/90 shadow-2xs backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Brand Identity */}
          <div
            id="brand-logo"
            onClick={() => handleScrollToSegment('home-hero-anchor', 'home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-sm text-white transition-transform active:scale-95">
              <Leaf size={18} className="fill-white" />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-lg font-black tracking-tight text-neutral-900 leading-none italic">
                Sami's Freshness to Wellness
              </h1>
              <span className="text-4xs font-bold uppercase tracking-widest text-emerald-700 font-sans block mt-0.5">
                Hand-harvested daily
              </span>
            </div>
          </div>


          {/* Nav Anchors */}
          <nav id="header-nav" className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-neutral-900">
            <button
              onClick={() => handleScrollToSegment('home-hero-anchor', 'home')}
              className={`transition-all duration-300 cursor-pointer pb-1 ${
                activeTab === 'home' ? 'opacity-100 border-b-1.5 border-emerald-600' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => handleScrollToSegment('products-section-anchor', 'products')}
              className={`transition-all duration-300 cursor-pointer pb-1 ${
                activeTab === 'products' ? 'opacity-100 border-b-1.5 border-emerald-600' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleScrollToSegment('offers-section-anchor', 'offers')}
              className={`transition-all duration-300 cursor-pointer pb-1 ${
                activeTab === 'offers' ? 'opacity-100 border-b-1.5 border-emerald-600' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Seasonal
            </button>
            <button
              onClick={() => handleScrollToSegment('contact-section-anchor', 'contact')}
              className={`transition-all duration-300 cursor-pointer pb-1 ${
                activeTab === 'contact' ? 'opacity-100 border-b-1.5 border-emerald-600' : 'opacity-60 hover:opacity-100'
              }`}
            >
              Support
            </button>
          </nav>

          {/* User welcome & Floating Cart Trigger */}
          <div className="flex items-center gap-4">
            {/* User welcome (Quiet profile notation) */}
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-4xs font-bold uppercase tracking-wider text-neutral-400">
                Connected Fresh Customer
              </span>
              <span className="text-2xs font-semibold text-neutral-600 truncate max-w-[160px]">
                Pooh17115@gmail.com
              </span>
            </div>

            {/* Cart Trigger Button */}
            <button
              id="global-cart-trigger"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 border border-emerald-600/10 transition-transform active:scale-95 hover:bg-emerald-100/70 shadow-3xs cursor-pointer"
            >
              <ShoppingBasket size={18} className="text-emerald-700" />
              <span className="hidden sm:inline font-sans font-semibold">My Basket</span>
              {totalItemsInCart > 0 && (
                <span
                  id="cart-items-badge"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white shadow-2xs"
                >
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FLOATING TAB NAV */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-2xl bg-white/95 border border-emerald-900/10 p-1.5 shadow-lg backdrop-blur-md">
        <button
          onClick={() => handleScrollToSegment('home-hero-anchor', 'home')}
          className={`px-3 py-2 rounded-xl text-3xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'home' ? 'bg-emerald-700 text-white shadow-xs' : 'text-neutral-500 hover:bg-neutral-50'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => handleScrollToSegment('products-section-anchor', 'products')}
          className={`px-3 py-2 rounded-xl text-3xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'products' ? 'bg-emerald-700 text-white shadow-xs' : 'text-neutral-500 hover:bg-neutral-50'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => handleScrollToSegment('offers-section-anchor', 'offers')}
          className={`px-3 py-2 rounded-xl text-3xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'offers' ? 'bg-emerald-700 text-white shadow-xs' : 'text-neutral-500 hover:bg-neutral-50'
          }`}
        >
          Offers
        </button>
        <button
          onClick={() => handleScrollToSegment('contact-section-anchor', 'contact')}
          className={`px-3 py-2 rounded-xl text-3xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'contact' ? 'bg-emerald-700 text-white shadow-xs' : 'text-neutral-500 hover:bg-neutral-50'
          }`}
        >
          Contact
        </button>
      </div>

      {/* HERO BANNER SECTION */}
      <section id="home-hero-anchor" className="relative overflow-hidden bg-neutral-100/50 border-b border-neutral-200 pt-20 pb-16 md:py-24">
        {/* Decorative backdrop */}
        <div className="absolute inset-0 opacity-5 mix-blend-multiply pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
            alt="Fruits background"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-left">
            <div className="flex items-center gap-2 mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              <span>Locally Sourced Organic</span>
            </div>
            <h2 className="font-serif text-4xl font-normal tracking-tight text-neutral-900 sm:text-6xl max-w-lg leading-[1.1]">
              The Garden's Best, Delivered Today.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed">
              Ethically harvested from family farms across the region. Freshness you can taste in every single bite.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => handleScrollToSegment('products-section-anchor', 'products')}
                className="flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold tracking-wide text-white hover:bg-emerald-700 shadow-md shadow-emerald-700/10 transition-colors cursor-pointer"
              >
                <span>Explore the Harvest</span>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => handleScrollToSegment('offers-section-anchor', 'offers')}
                className="rounded-full border border-neutral-300 bg-white/5 hover:bg-neutral-50 px-7 py-3 text-sm font-semibold tracking-wide text-neutral-800 transition-colors cursor-pointer"
              >
                View Promotions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED STATS BANNER */}
      <section id="stats-ribbon" className="border-b border-emerald-900/5 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center divide-x divide-emerald-950/5">
            <div>
              <span className="block font-serif text-xl font-bold text-emerald-900">100%</span>
              <span className="text-4xs font-bold uppercase tracking-wider text-neutral-400">Pesticide Free</span>
            </div>
            <div>
              <span className="block font-serif text-xl font-bold text-emerald-900">45+</span>
              <span className="text-4xs font-bold uppercase tracking-wider text-neutral-400">Local Farmers</span>
            </div>
            <div>
              <span className="block font-serif text-xl font-bold text-emerald-900">60 Min</span>
              <span className="text-4xs font-bold uppercase tracking-wider text-neutral-400">Cold Chain Delivery</span>
            </div>
            <div>
              <span className="block font-serif text-xl font-bold text-emerald-900">5.0 ★</span>
              <span className="text-4xs font-bold uppercase tracking-wider text-neutral-400">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CATALOG AREA */}
      <main id="products-section-anchor" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* CATALOG HEADER CONTROLS */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-emerald-950/5 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <TrendingUp size={14} />
              <span>Healthy Choices</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-black text-neutral-900 sm:text-3xl">
              Browse Organic Pantry
            </h2>
            <p className="mt-1.5 text-xs text-neutral-500">
              Filter by crop type or find specific ingredients instantly. All rates are inclusive of packaging.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs">
            <label htmlFor="pantry-search" className="sr-only">Search Pantry</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              id="pantry-search"
              placeholder="Search apples, butter, bread..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchClear(e.target.value.length > 0);
              }}
              className="w-full rounded-xl border border-emerald-900/10 py-2.5 pl-10 pr-10 text-xs text-neutral-900 transition-colors focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 bg-white shadow-3xs"
            />
            {showSearchClear && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchClear(false);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700"
                title="Clear input"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY SELECTOR CHIPS */}
        <div className="mt-6 flex flex-wrap gap-2">
          {['all', 'fruits', 'vegetables', 'root-vegetables', 'imported-fruits', 'dairy', 'bakery'].map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`cat-chip-${category}`}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-3xs font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 border border-emerald-600/5 text-emerald-800 hover:bg-emerald-100/50'
                }`}
              >
                {category === 'all' && '🌿 All produce'}
                {category === 'fruits' && '🍎 Fruits'}
                {category === 'vegetables' && '🥬 Vegetables'}
                {category === 'root-vegetables' && '🥕 Root Crops'}
                {category === 'imported-fruits' && '🥝 Exotic Imports'}
                {category === 'dairy' && '🥛 Diary & Eggs'}
                {category === 'bakery' && '🥖 Artisanal Bakery'}
              </button>
            );
          })}
        </div>

        {/* SEASONAL SPOTLIGHT (Root Crops & Exotic Imports) */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div 
              onClick={() => setSelectedCategory('root-vegetables')}
              className="group relative h-48 overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-6 cursor-pointer hover:border-emerald-600/30 transition-all shadow-3xs"
            >
              <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-25 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1590005354167-6da97870c913?auto=format&fit=crop&q=80&w=600" 
                  alt="Roots background" 
                  className="w-full h-full object-cover underline-none shadow-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase select-none">
                    Local Harvest
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-normal text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    The Subterranean Vault
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                    Nutrient-dense root crops, sweet potatoes, vibrant beetroots, and organic garlic pulled fresh from the soil.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 tracking-wide">
                  <span>Browse Roots ({PRODUCTS.filter(p => p.category === 'root-vegetables').length} items)</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div 
              onClick={() => setSelectedCategory('imported-fruits')}
              className="group relative h-48 overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-6 cursor-pointer hover:border-emerald-600/30 transition-all shadow-3xs"
            >
              <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-25 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1527325678964-54921661f92e?auto=format&fit=crop&q=80&w=600" 
                  alt="Exotic fruits background" 
                  className="w-full h-full object-cover underline-none shadow-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase select-none">
                    Imported Fresh
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-normal text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    Exotics & Global Imports
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                    Superfruits, ripe kiwis, anti-oxidant packed wild berries, and rare Indonesia mangosteens.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 tracking-wide">
                  <span>Explore Exotic Vault ({PRODUCTS.filter(p => p.category === 'imported-fruits').length} items)</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS GRID */}
        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-800/10 p-12 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <Search size={22} />
              </span>
              <h3 className="mt-4 font-serif text-base font-bold text-neutral-900">
                No organic pantry items match
              </h3>
              <p className="mt-1.5 text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                We couldn't locate any products matching "{searchQuery}". Double-check your spelling or choose a different crop category above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowSearchClear(false);
                }}
                className="mt-5 rounded-xl border border-emerald-600/20 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div id="products-grid" className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const cartQty = cart.find((item) => item.product.id === product.id)?.quantity || 0;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={cartQty}
                    onAddToCart={handleAddToCart}
                    onUpdateCartQuantity={handleUpdateCartQuantity}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* OFFERS BANNER SECTION */}
        <div id="offers-section-anchor" className="mt-20 scroll-mt-24">
          <Offers activeCouponCode={activeCoupon} onApplyCoupon={handleApplyCoupon} />
        </div>

        {/* CONTACT SECTION PANEL */}
        <div id="contact-section-anchor" className="mt-20 border-t border-emerald-950/5 pt-20 scroll-mt-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Stay in touch
                </span>
                <h3 className="mt-1 font-serif text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                  We Love Hearing From Our Community
                </h3>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed max-w-md">
                Sami's Freshness to Wellness is committed to sustaining family farming practices. Our delivery loops span multiple sectors. If you want wholesale supplies, bulk holiday baskets, or have crop complaints, let us know directly.
              </p>

              <div className="space-y-4 text-xs font-semibold text-neutral-700">
                <div role="text" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-600/5">
                    <Phone size={14} />
                  </div>
                  <span>Call support: +91 98765 43210</span>
                </div>
                <div role="text" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-600/5">
                    <Mail size={14} />
                  </div>
                  <span>Customer care: info@freshnesstowellness.com</span>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer id="app-footer" className="bg-neutral-900 text-neutral-400 mt-28 border-t border-emerald-800/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-neutral-800 pb-8">
            <div className="flex items-center gap-2 select-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
                <Leaf size={16} className="fill-white" />
              </div>
              <div>
                <span className="font-serif text-base font-extrabold tracking-tight text-white block">
                  Sami's Freshness to Wellness
                </span>
                <span className="text-4xs uppercase font-extrabold text-neutral-500 tracking-wider">
                  Delivered fresh with care
                </span>
              </div>
            </div>
            
            <div role="navigation" aria-label="Footer Navigation" className="flex flex-wrap justify-center gap-6 text-2xs md:text-xs font-semibold uppercase tracking-wider text-neutral-300">
              <button
                onClick={() => handleScrollToSegment('home-hero-anchor', 'home')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleScrollToSegment('products-section-anchor', 'products')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Catalog
              </button>
              <button
                onClick={() => handleScrollToSegment('offers-section-anchor', 'offers')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Weekly Savings
              </button>
              <button
                onClick={() => handleScrollToSegment('contact-section-anchor', 'contact')}
                className="hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Contact support
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-3xs font-medium text-neutral-500">
            <p>© 2026 Sami's Freshness to Wellness. Engineered to highest organic standards.</p>
            <div className="flex items-center gap-2">
              <span>Customer inbox mapped:</span>
              <span className="rounded-md bg-neutral-800 px-2 py-1 font-mono text-neutral-300">
                Pooh17115@gmail.com
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* RENDER EMBEDDED SHOPPING CART DRAW PANEL */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        activeCouponCode={activeCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onApplyCoupon={handleApplyCoupon}
      />
    </div>
  );
}
