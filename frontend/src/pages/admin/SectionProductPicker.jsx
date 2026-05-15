import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Toast from '../../components/ui/Toast';

/**
 * Modal that lets admins pick which products belong to a section.
 *
 * Source of truth is the union of:
 *   - section.products[] (Section-side reference)
 *   - product.sections[] containing this section._id (Product-side reference)
 *
 * On save we diff the current selection against the initial set and POST
 * add-product / remove-product per change. Backend keeps both sides in sync.
 */
const SectionProductPicker = ({ section, onClose, onSaved }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // Selected = the working set the user is editing.
  // Initial = a snapshot taken when the modal opens — used to diff on save.
  const [selected, setSelected] = useState(new Set());
  const [initial, setInitial] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiService
      .getProducts({ limit: 500 })
      .then((res) => {
        if (!mounted) return;
        const list = res?.data?.products || [];
        setAllProducts(list);

        const sectionId = section._id?.toString();
        const linked = new Set();
        // Side A: section.products[] (may be IDs or populated objects)
        (section.products || []).forEach((p) => {
          const id = typeof p === 'string' ? p : p?._id?.toString?.();
          if (id) linked.add(id);
        });
        // Side B: product.sections[] containing this section
        list.forEach((p) => {
          const has = (p.sections || []).some(
            (s) => (s?._id?.toString?.() || s?.toString?.()) === sectionId
          );
          if (has) linked.add(p._id?.toString?.());
        });
        setSelected(new Set(linked));
        setInitial(new Set(linked));
      })
      .catch(() => Toast.error('Failed to load products'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [section]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (showOnlySelected && !selected.has(p._id)) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    });
  }, [allProducts, search, showOnlySelected, selected]);

  const diff = useMemo(() => {
    const toAdd = [...selected].filter((id) => !initial.has(id));
    const toRemove = [...initial].filter((id) => !selected.has(id));
    return { toAdd, toRemove };
  }, [selected, initial]);

  const handleSave = async () => {
    if (!diff.toAdd.length && !diff.toRemove.length) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      // Run adds and removes in parallel; collect failures
      const results = await Promise.allSettled([
        ...diff.toAdd.map((id) => apiService.addProductToSection(section._id, id)),
        ...diff.toRemove.map((id) =>
          apiService.removeProductFromSection(section._id, id)
        ),
      ]);
      const failed = results.filter((r) => r.status === 'rejected').length;
      if (failed) Toast.warning(`Saved with ${failed} error(s)`);
      else Toast.success(`Saved ${diff.toAdd.length + diff.toRemove.length} change(s)`);
      onSaved?.();
      onClose();
    } catch (e) {
      Toast.error('Failed to save section products');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 sm:px-7 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Manage products
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">
                {section.title || section.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selected.size} selected · Max for this style:{' '}
                <b>{section.maxProducts || 12}</b>
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex-shrink-0 w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Toolbar */}
          <div className="px-5 sm:px-7 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg px-3 flex-1">
              <Icon name="Search" size={16} className="text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or brand"
                className="flex-1 bg-transparent py-2 px-2 outline-none text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground select-none px-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlySelected}
                onChange={(e) => setShowOnlySelected(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Show only selected
            </label>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-2">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-100 animate-shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                <Icon name="PackageX" size={32} className="mx-auto mb-2 opacity-40" />
                {showOnlySelected
                  ? 'No products selected yet.'
                  : 'No products match your search.'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filtered.map((p) => {
                  const id = p._id;
                  const isSelected = selected.has(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => toggle(id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <Icon name="Check" size={12} />}
                        </div>
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                          <img
                            src={
                              p.images?.[0]?.url ||
                              'https://via.placeholder.com/100x100?text=No+image'
                            }
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://via.placeholder.com/100x100?text=No+image';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {p.brand} · ₹
                            {Number(p.price || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-7 py-3 border-t border-gray-100 flex items-center justify-between gap-3 bg-slate-50">
            <div className="text-xs text-muted-foreground">
              {diff.toAdd.length || diff.toRemove.length ? (
                <>
                  <span className="text-emerald-600 font-semibold">
                    +{diff.toAdd.length}
                  </span>{' '}
                  <span className="text-rose-600 font-semibold">
                    −{diff.toRemove.length}
                  </span>{' '}
                  pending
                </>
              ) : (
                'No changes'
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || (!diff.toAdd.length && !diff.toRemove.length)}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SectionProductPicker;
