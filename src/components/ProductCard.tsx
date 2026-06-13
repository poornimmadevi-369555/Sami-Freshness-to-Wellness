import React from 'react';
import { Product } from '../types';
import { Star, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
}

export default function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateCartQuantity,
}: ProductCardProps) {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/20 hover:shadow-md"
    >
      {/* Product Image and Badge */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 p-4">
        {product.badge && (
          <span
            id={`badge-${product.id}`}
            className="absolute top-4 left-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-xs select-none"
          >
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover rounded-[20px] transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 bottom-4 h-12 bg-linear-to-t from-black/10 to-transparent rounded-b-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-6 pt-2">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          <span>{product.category}</span>
          <div className="flex items-center gap-0.5 text-amber-500 font-semibold text-xs">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          id={`product-title-${product.id}`}
          className="mt-1 font-serif text-lg font-normal tracking-tight text-neutral-900 group-hover:text-emerald-700 min-h-[2.5rem] line-clamp-2"
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="mt-1 flex-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-neutral-100 pt-4">
          <div className="flex flex-col">
            <span
              id={`product-price-${product.id}`}
              className="font-serif text-lg font-black text-emerald-700"
            >
              ₹{product.price}
            </span>
            <span className="text-[10px] text-neutral-400 font-semibold tracking-wide">
              per {product.unit}
            </span>
          </div>

          <div>
            {quantityInCart > 0 ? (
              <div
                id={`cart-qty-ctrl-${product.id}`}
                className="flex items-center gap-1 rounded-full bg-neutral-50 p-1 border border-neutral-200"
              >
                <button
                  onClick={() => onUpdateCartQuantity(product.id, quantityInCart - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 border border-neutral-100 shadow-2xs transition-transform active:scale-90 hover:bg-neutral-50 cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center font-serif text-sm font-bold text-neutral-900">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onUpdateCartQuantity(product.id, quantityInCart + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 border border-neutral-100 shadow-2xs transition-transform active:scale-90 hover:bg-neutral-50 cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <motion.button
                id={`add-btn-${product.id}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAddToCart(product)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700 cursor-pointer"
                title="Add to cart"
              >
                <Plus size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
