import React, { useState } from 'react';
import { Send, CheckCircle2, User, Mail, MessageSquare, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    validateEmail(formData.email) &&
    formData.message.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset form variables
      setFormData({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
    }, 1200);
  };

  return (
    <div id="contact" className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm md:p-10">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900">
          Contact Support
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Have queries about delivery zones or local produce sources? Fill out the brief form below and our family team will response.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-8 rounded-2xl bg-emerald-50/50 p-6 text-center border border-emerald-600/15"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <CheckCircle2 size={24} className="stroke-[2.5px]" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-neutral-900">
              Message Transmitted!
            </h3>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
              We appreciate your feedback and warmth. Our dispatch coordinators will verify your message scope and write back to your inbox within 2 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-xl border border-emerald-600/20 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 cursor-pointer"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Name Input */}
            <div>
              <label htmlFor="contact-name" className="block text-2xs font-semibold tracking-wider text-emerald-900/80 uppercase">
                Your Full Name
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  required
                  className={`block w-full rounded-xl border py-3 pl-10 pr-4 text-sm transition-all focus:ring-1 focus:outline-hidden ${
                    touched.name && formData.name.trim().length < 2
                      ? 'border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-red-500'
                      : 'border-emerald-900/10 focus:border-emerald-600 focus:ring-emerald-600'
                  }`}
                />
              </div>
              {touched.name && formData.name.trim().length < 2 && (
                <p id="err-name" className="mt-1.5 text-3xs font-medium text-red-600">
                  Please enter a name with at least 2 characters.
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="contact-email" className="block text-2xs font-semibold tracking-wider text-emerald-900/80 uppercase">
                Email Address
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-3xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  required
                  className={`block w-full rounded-xl border py-3 pl-10 pr-4 text-sm transition-all focus:ring-1 focus:outline-hidden ${
                    touched.email && !validateEmail(formData.email)
                      ? 'border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-red-500'
                      : 'border-emerald-900/10 focus:border-emerald-600 focus:ring-emerald-600'
                  }`}
                />
              </div>
              {touched.email && !validateEmail(formData.email) && (
                <p id="err-email" className="mt-1.5 text-3xs font-medium text-red-600">
                  Please input a valid organic email address.
                </p>
              )}
            </div>

            {/* Message Area */}
            <div>
              <label htmlFor="contact-message" className="block text-2xs font-semibold tracking-wider text-emerald-900/80 uppercase">
                Your Message
              </label>
              <div className="relative mt-1.5 rounded-xl shadow-3xs">
                <div className="pointer-events-none absolute top-3 left-0.5 flex items-center pl-3 text-neutral-400">
                  <MessageSquare size={16} />
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Write your shopping queries, fresh crop guidelines, or checkout issue here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onBlur={() => setTouched({ ...touched, message: true })}
                  required
                  className={`block w-full rounded-xl border py-3 pl-10 pr-4 text-sm transition-all focus:ring-1 focus:outline-hidden ${
                    touched.message && formData.message.trim().length < 10
                      ? 'border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-red-500'
                      : 'border-emerald-900/10 focus:border-emerald-600 focus:ring-emerald-600'
                  }`}
                />
              </div>
              {touched.message && formData.message.trim().length < 10 && (
                <p id="err-msg" className="mt-1.5 text-3xs font-medium text-red-600">
                  Message should be at least 10 letters to describe accurately.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              id="submit-contact-btn"
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold tracking-wide text-white transition-all shadow-md cursor-pointer select-none active:scale-98 ${
                isFormValid && !loading
                  ? 'bg-emerald-600 shadow-emerald-700/15 hover:bg-emerald-700'
                  : 'bg-neutral-300 cursor-not-allowed shadow-none'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
