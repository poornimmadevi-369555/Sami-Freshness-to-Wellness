import React, { useState } from 'react';
import { Sparkles, Ticket, Check, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OffersProps {
  onApplyCoupon: (code: string) => void;
  activeCouponCode: string | null;
}

export default function Offers({ onApplyCoupon, activeCouponCode }: OffersProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const coupons = [
    {
      code: 'FRESH20',
      discount: '20% OFF',
      minSpend: '₹300',
      desc: 'Save 20% on fresh, locally grown veggies & premium bakery favorites.',
      badge: 'Bestseller',
    },
    {
      code: 'GREENMORNING',
      discount: '₹50 FLAT',
      minSpend: '₹150',
      desc: 'Flat discount on early morning orders containing farm-fresh milk & eggs.',
      badge: 'Super Saver',
    },
    {
      code: 'FIRSTFLY',
      discount: 'FREE DELIVERY',
      minSpend: 'Any amount',
      desc: 'No delivery fee on your first organic basket to taste the change.',
      badge: 'New User Only',
    },
  ];

  const handleCopy = (code: string, idx: number) => {
    onApplyCoupon(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-3xl bg-neutral-50 px-6 py-10 md:px-12 border border-emerald-900/5">
      <div className="mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="text-emerald-600 animate-pulse" size={20} />
          <span className="font-sans text-xs font-semibold tracking-widest text-emerald-800 uppercase">
            Exclusive Deals
          </span>
        </div>
        <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Weekly Savings & Offers
        </h2>
        <p className="mt-3 text-neutral-600 max-w-lg mx-auto text-sm">
          Get maximum value out of your fresh organic picks. Click any organic coupon below to apply it to your cart instantly!
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon, idx) => {
          const isActive = activeCouponCode === coupon.code;
          return (
            <motion.div
              key={coupon.code}
              whileHover={{ y: -4 }}
              id={`coupon-card-${coupon.code}`}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 transition-all ${
                isActive
                  ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-500'
                  : 'border-emerald-900/10'
              }`}
            >
              {/* Premium coupon cutout aesthetic */}
              <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-50 border-r border-emerald-900/10" />
              <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-50 border-l border-emerald-900/10" />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 border border-emerald-600/10 px-2.5 py-0.5 text-3xs font-semibold tracking-wider text-emerald-800 uppercase">
                    {coupon.badge}
                  </span>
                  <Ticket size={16} className={isActive ? 'text-emerald-600' : 'text-neutral-400'} />
                </div>

                <div className="mt-4">
                  <span className="font-serif text-2xl font-black text-emerald-800">{coupon.discount}</span>
                  <p className="mt-1 text-2xs text-neutral-400 font-medium tracking-wide font-sans">
                    ON ORDERS OVER {coupon.minSpend}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500 leading-relaxed min-h-[3rem]">
                    {coupon.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => handleCopy(coupon.code, idx)}
                  id={`apply-coupon-btn-${coupon.code}`}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-emerald-50 text-neutral-800 hover:text-emerald-800 border border-neutral-200 hover:border-emerald-600/20'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check size={14} className="stroke-[3px]" />
                      <span>Applied!</span>
                    </>
                  ) : copiedIndex === idx ? (
                    <>
                      <Check size={14} />
                      <span>Activating...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-emerald-800 font-bold uppercase tracking-wider">
                        {coupon.code}
                      </span>
                      <span className="text-neutral-400 font-normal">| Apply</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust reassurance banner */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-emerald-900/5 pt-8 text-neutral-500 text-xs text-center md:text-justify lg:mx-auto max-w-3xl">
        <div className="flex items-center gap-2">
          <Leaf className="text-emerald-700 h-4 w-4" />
          <span>100% Pesticide Free</span>
        </div>
        <div className="hidden sm:inline-block text-neutral-300">|</div>
        <div className="flex items-center gap-2">
          <Leaf className="text-emerald-700 h-4 w-4" />
          <span>Locally Sourced Daily</span>
        </div>
        <div className="hidden sm:inline-block text-neutral-300">|</div>
        <div className="flex items-center gap-2">
          <Leaf className="text-emerald-700 h-4 w-4" />
          <span>Eco-Friendly Sacks & Packing</span>
        </div>
      </div>
    </div>
  );
}
