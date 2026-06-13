import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingBasket, X, Trash2, Plus, Minus, CreditCard, Sparkles, Truck, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  activeCouponCode: string | null;
  onRemoveCoupon: () => void;
  onApplyCoupon: (code: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  activeCouponCode,
  onRemoveCoupon,
  onApplyCoupon,
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'placed'>('cart');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Delivery: ₹40, but FREE if grand total >= 300 or code FIRSTFLY
  const isFreeDelivery = subtotal >= 300 || activeCouponCode === 'FIRSTFLY';
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 40;

  // Coupon Discount
  let discount = 0;
  if (activeCouponCode === 'FRESH20' && subtotal >= 300) {
    discount = Math.round(subtotal * 0.2);
  } else if (activeCouponCode === 'GREENMORNING' && subtotal >= 150) {
    discount = 50;
  }

  const grandTotal = subtotal - discount + deliveryFee;

  const handleApplyCustomCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();
    if (cleanCode === 'FRESH20') {
      if (subtotal < 300) {
        setCouponError('Requires min. spend of ₹300.');
      } else {
        onApplyCoupon(cleanCode);
        setCouponError('');
      }
    } else if (cleanCode === 'GREENMORNING') {
      if (subtotal < 150) {
        setCouponError('Requires min. spend of ₹150.');
      } else {
        onApplyCoupon(cleanCode);
        setCouponError('');
      }
    } else if (cleanCode === 'FIRSTFLY') {
      onApplyCoupon(cleanCode);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code.');
    }
  };

  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('checkout');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) return;
    setCheckoutStep('placed');
  };

  const handleReset = () => {
    onClearCart();
    setCheckoutStep('cart');
    setAddress('');
    setPhone('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-emerald-950/10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-emerald-950/5 p-5">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="text-emerald-700" size={20} />
                <h2 className="font-serif text-lg font-bold text-neutral-900">
                  {checkoutStep === 'cart' && 'Your Market Basket'}
                  {checkoutStep === 'checkout' && 'Secure Checkout'}
                  {checkoutStep === 'placed' && 'Order Authenticated!'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
                title="Close slideover"
              >
                <X size={20} />
              </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-5">
              {checkoutStep === 'cart' && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center p-6">
                      <div className="rounded-full bg-emerald-50 p-6 text-emerald-700">
                        <ShoppingBasket size={48} className="stroke-[1.5]" />
                      </div>
                      <h3 className="mt-4 font-serif text-lg font-bold text-neutral-900">
                        Your basket is empty
                      </h3>
                      <p className="mt-2 text-xs text-neutral-500 max-w-xs leading-relaxed">
                        Add pure, locally sourced dairy, fresh greens or sweet summer harvest fruits to unlock safe delivery.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold tracking-wide text-white transition-all hover:bg-emerald-700 shadow-xs cursor-pointer"
                      >
                        Start Browsing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Products List */}
                      <div className="divide-y divide-emerald-950/5">
                        {cartItems.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex py-4 gap-4 items-center justify-between"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="h-16 w-16 rounded-xl object-cover border border-emerald-900/5"
                            />
                            <div className="flex-1">
                              <h4 className="font-serif text-sm font-semibold text-neutral-900 leading-tight">
                                {item.product.name}
                              </h4>
                              <p className="text-3xs text-neutral-400 font-medium font-sans">
                                ₹{item.product.price} / {item.product.unit}
                              </p>
                              {/* Quantity control */}
                              <div className="flex items-center gap-1.5 mt-2">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="rounded-full border border-neutral-200 bg-white p-1 text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                                  title="Reduce quantity"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-6 text-center text-xs font-bold font-serif text-neutral-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="rounded-full border border-neutral-200 bg-white p-1 text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                                  title="Increase quantity"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <span className="font-serif text-sm font-bold text-neutral-950">
                                ₹{item.product.price * item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, 0)}
                                className="text-neutral-400 hover:text-red-600 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Coupon Code Input */}
                      <div className="border-t border-emerald-950/5 pt-4">
                        <h4 className="text-2xs font-bold uppercase tracking-wider text-emerald-900/80 mb-2">
                          Apply Store Coupon
                        </h4>
                        {activeCouponCode ? (
                          <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 border border-emerald-600/10">
                            <div className="flex items-center gap-2 text-emerald-800">
                              <Sparkles size={14} className="stroke-[2.5]" />
                              <span className="font-mono text-xs font-black tracking-wider uppercase">
                                {activeCouponCode}
                              </span>
                              <span className="text-2xs font-medium">Applied Successfully</span>
                            </div>
                            <button
                              onClick={onRemoveCoupon}
                              className="text-2xs font-semibold text-emerald-700 hover:text-red-600 underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleApplyCustomCoupon} className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value);
                                setCouponError('');
                              }}
                              placeholder="e.g. FRESH20"
                              className="flex-1 rounded-xl border border-emerald-900/10 px-3.5 py-2 text-xs font-mono uppercase tracking-widest focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                            />
                            <button
                              type="submit"
                              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 cursor-pointer"
                            >
                              Apply
                            </button>
                          </form>
                        )}
                        {couponError && (
                          <p className="mt-1 text-3xs font-medium text-red-600">{couponError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'checkout' && (
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
                  <div className="rounded-xl bg-emerald-50/50 p-4 border border-emerald-600/10">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Truck size={16} />
                      <span className="font-serif text-sm font-bold">Delivery Summary</span>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-600">
                      We support early-morning delivery zones between 6:00 AM - 9:00 AM. Fast, cold-insulated boxes.
                    </p>
                  </div>

                  {/* Phone Num */}
                  <div>
                    <label htmlFor="checkout-phone" className="block text-2xs font-semibold tracking-wider text-emerald-900/80 uppercase">
                      Contact Cell Number
                    </label>
                    <input
                      type="tel"
                      id="checkout-phone"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 block w-full rounded-xl border border-emerald-900/10 px-3.5 py-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>

                  {/* Full Delivery Address */}
                  <div>
                    <label htmlFor="checkout-address" className="block text-2xs font-semibold tracking-wider text-emerald-900/80 uppercase">
                      Exact Delivery Address
                    </label>
                    <textarea
                      id="checkout-address"
                      required
                      rows={3}
                      placeholder="e.g. Flat 304, Green Meadows, Indira Nagar, Delhi"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5 block w-full rounded-xl border border-emerald-900/10 px-3.5 py-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>

                  {/* Payment Re-assurance */}
                  <div>
                    <label className="block text-2xs font-semibold tracking-wider text-emerald-950/80 uppercase mb-2">
                      Payment Mode Selected
                    </label>
                    <div className="flex gap-3">
                      <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-emerald-600/20 bg-emerald-50/20 p-3">
                        <CreditCard className="text-emerald-700" size={16} />
                        <div>
                          <p className="text-xs font-bold text-neutral-900">Cash on Delivery</p>
                          <p className="text-3xs text-neutral-500">Pay at crop doorstep</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {checkoutStep === 'placed' && (
                <div className="flex h-full flex-col items-center justify-center text-center p-2">
                  <div className="rounded-full bg-emerald-50 p-6 text-emerald-700 animate-bounce">
                    <Check size={40} className="stroke-[3]" />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-bold text-neutral-900">
                    Harvest Dispatched!
                  </h3>
                  <p className="mt-2.5 text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                    A secure receipt and tracker was initiated. Our farm-coordinators are packing your box right now with utmost hygiene care.
                  </p>

                  <div className="mt-6 w-full rounded-2xl bg-neutral-50 border border-emerald-900/5 p-4 text-left divide-y divide-neutral-100">
                    <div className="flex justify-between py-2 text-xs">
                      <span className="text-neutral-400">Recipient cell:</span>
                      <span className="font-semibold text-neutral-800">{phone}</span>
                    </div>
                    <div className="flex justify-between py-2 text-xs">
                      <span className="text-neutral-400">Destination:</span>
                      <span className="font-semibold text-neutral-800 line-clamp-1 truncate max-w-[180px]">
                        {address}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-xs">
                      <span className="text-neutral-400">Settlement sum:</span>
                      <span className="font-bold text-emerald-800">₹{grandTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="mt-8 w-full rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer"
                  >
                    Done & Close Basket
                  </button>
                </div>
              )}
            </div>

            {/* DRAWER FOOTER (FOR PRICING OUTCOMES) */}
            {checkoutStep !== 'placed' && cartItems.length > 0 && (
              <div className="border-t border-emerald-950/5 bg-neutral-50 p-5">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Produce Subtotal:</span>
                    <span className="font-mono font-medium text-neutral-900">₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span className="flex items-center gap-1">
                        <Sparkles size={11} /> Coupon Discount:
                      </span>
                      <span className="font-mono font-bold">-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-500">
                    <span>Delivered Logistics:</span>
                    <span className="font-mono font-medium text-neutral-900">
                      {deliveryFee === 0 ? (
                        <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
                          FREE
                        </span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-emerald-950/10 pt-2 text-sm font-bold text-neutral-900">
                    <span>Grand Settlement:</span>
                    <span className="font-serif text-base font-black text-emerald-800">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  {checkoutStep === 'checkout' && (
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="rounded-xl border border-neutral-200 bg-white px-3 text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={checkoutStep === 'cart' ? handleStartCheckout : (e) => handlePlaceOrder(e as any)}
                    disabled={checkoutStep === 'checkout' && (!address.trim() || !phone.trim())}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-xs font-bold tracking-wide text-white transition-all shadow-md active:scale-98 cursor-pointer ${
                      checkoutStep === 'checkout' && (!address.trim() || !phone.trim())
                        ? 'bg-neutral-300 shadow-none cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/10'
                    }`}
                  >
                    {checkoutStep === 'cart' ? (
                      <>
                        <span>Proceed to Delivery</span>
                        <ChevronRight size={14} />
                      </>
                    ) : (
                      <>
                        <Check size={14} className="stroke-[3px]" />
                        <span>Place Cash on Delivery Order (₹{grandTotal})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
