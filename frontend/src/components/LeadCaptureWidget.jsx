import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './AppIcon';
import apiService from '../services/api';
import Toast from './ui/Toast';

const HIDDEN_ON_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/admin', '/chat'];

const LeadCaptureWidget = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  // Stay quiet on admin / auth pages where the widget would be noise.
  const shouldHide = HIDDEN_ON_PATHS.some((p) => pathname.startsWith(p));

  // Suppress for a session if the user already submitted or dismissed.
  const [dismissed, setDismissed] = useState(
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem('lead_done')
  );

  useEffect(() => {
    if (done) sessionStorage.setItem('lead_done', '1');
  }, [done]);

  if (shouldHide || dismissed) return null;

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '')))
      return 'Please enter a valid 10-digit Indian mobile number';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return Toast.error(err);
    setSubmitting(true);
    try {
      await apiService.request('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\D/g, ''),
          message: form.message.trim() || 'Quick callback requested from website',
          source: 'website',
        }),
      });
      setDone(true);
      Toast.success("We'll call you back shortly!");
    } catch (e) {
      Toast.error('Could not send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating trigger pill (bottom-right) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="hidden md:flex fixed bottom-6 right-6 z-30 items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold shadow-xl hover:shadow-2xl"
          >
            <Icon name="Phone" size={16} /> Get a callback
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              {!done ? (
                <>
                  <div className="px-6 py-5 bg-gradient-to-br from-orange-500 to-rose-500 text-white relative">
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
                    >
                      <Icon name="X" size={16} />
                    </button>
                    <div className="text-xs uppercase tracking-wider opacity-90">
                      Free callback
                    </div>
                    <h3 className="text-xl font-bold mt-1">
                      Talk to us in 30 seconds
                    </h3>
                    <p className="text-sm text-white/90 mt-1">
                      Get a personalised price, book a repair or check stock — we'll call you back.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Your name *
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Mobile number *
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        inputMode="tel"
                        placeholder="10-digit Indian mobile"
                        className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        What do you need? (optional)
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        rows={2}
                        placeholder="e.g. iPhone screen repair, recharge plan, PAN card help"
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 disabled:opacity-50"
                    >
                      {submitting ? 'Sending…' : 'Request callback'}
                    </button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Or message us directly on{' '}
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 font-semibold underline-offset-2 hover:underline"
                      >
                        WhatsApp
                      </a>
                    </p>
                  </form>
                </>
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Icon name="Check" size={28} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">
                    Thanks, {form.name?.split(' ')[0] || 'friend'}!
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We've got your number. Our team will call you back shortly.
                  </p>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setDismissed(true);
                    }}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeadCaptureWidget;
