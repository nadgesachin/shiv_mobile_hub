import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/api';
import Icon from '../../components/AppIcon';
import Toast from '../../components/ui/Toast';
import {
  CAMPAIGN_TEMPLATES,
  renderTemplate,
  whatsappLink,
} from '../../utils/campaignTemplates';

/* ──────────────────────────────────────────────────────────────────────
   Segment definitions — each takes a per-customer summary and returns
   true if the customer belongs in that segment. Order matters for the
   chip display.
   ──────────────────────────────────────────────────────────────────── */
const SEGMENTS = [
  {
    id: 'all',
    label: 'All customers',
    icon: 'Users',
    accent: 'from-slate-700 to-slate-900',
    match: () => true,
    description: 'Every customer who ever contacted you',
  },
  {
    id: 'hot',
    label: 'Hot leads',
    icon: 'Flame',
    accent: 'from-red-500 to-rose-600',
    match: (c) => c.lastEnquiryAgeDays <= 7 && c.openCount > 0,
    description: 'Enquired in last 7 days · status still open',
  },
  {
    id: 'new',
    label: 'New (30d)',
    icon: 'Sparkles',
    accent: 'from-cyan-500 to-blue-500',
    match: (c) => c.firstEnquiryAgeDays <= 30,
    description: 'First contacted you in the last 30 days',
  },
  {
    id: 'engaged',
    label: 'Engaged (2+)',
    icon: 'Heart',
    accent: 'from-fuchsia-500 to-pink-500',
    match: (c) => c.enquiryCount >= 2 && c.enquiryCount < 5,
    description: 'Repeat enquirers — 2 to 4 interactions',
  },
  {
    id: 'vip',
    label: 'VIP (5+)',
    icon: 'Crown',
    accent: 'from-violet-500 to-purple-600',
    match: (c) => c.enquiryCount >= 5,
    description: 'Your most loyal customers — 5+ interactions',
  },
  {
    id: 'lapsed',
    label: 'Lapsed (60d+)',
    icon: 'Clock',
    accent: 'from-amber-500 to-orange-500',
    match: (c) => c.lastEnquiryAgeDays >= 60,
    description: 'No contact in 60+ days — win-back candidates',
  },
  {
    id: 'converted',
    label: 'Converted',
    icon: 'CheckCircle',
    accent: 'from-emerald-500 to-teal-500',
    match: (c) => c.convertedCount > 0,
    description: 'Have at least one converted enquiry',
  },
];

const ageDays = (date) => {
  if (!date) return Infinity;
  const t = new Date(date).getTime();
  return Math.floor((Date.now() - t) / (24 * 3600 * 1000));
};

/* ──────────────────────────────────────────────────────────────────────
   Group raw enquiries into per-customer summaries (keyed by phone).
   ──────────────────────────────────────────────────────────────────── */
const summarise = (enquiries) => {
  const byPhone = new Map();
  for (const e of enquiries) {
    const key = (e.phone || '').replace(/\D/g, '');
    if (!key) continue;
    if (!byPhone.has(key)) {
      byPhone.set(key, {
        phone: key,
        names: new Set(),
        emails: new Set(),
        first: e.createdAt,
        last: e.createdAt,
        enquiryCount: 0,
        openCount: 0,
        convertedCount: 0,
        productNames: new Set(),
        statuses: {},
      });
    }
    const c = byPhone.get(key);
    if (e.name) c.names.add(e.name);
    if (e.email) c.emails.add(e.email);
    if (e.productName) c.productNames.add(e.productName);
    c.first =
      new Date(e.createdAt) < new Date(c.first) ? e.createdAt : c.first;
    c.last = new Date(e.createdAt) > new Date(c.last) ? e.createdAt : c.last;
    c.enquiryCount++;
    c.statuses[e.status || 'new'] = (c.statuses[e.status || 'new'] || 0) + 1;
    if (e.status === 'new' || e.status === 'contacted') c.openCount++;
    if (e.status === 'converted') c.convertedCount++;
  }
  return Array.from(byPhone.values()).map((c) => ({
    ...c,
    name: [...c.names][0] || 'Unknown',
    email: [...c.emails][0] || '',
    products: [...c.productNames].slice(0, 3).join(', '),
    firstEnquiryAgeDays: ageDays(c.first),
    lastEnquiryAgeDays: ageDays(c.last),
  }));
};

const toCsv = (customers) => {
  const header = ['name', 'phone', 'email', 'enquiries', 'lastDays', 'products'];
  const rows = customers.map((c) =>
    [c.name, c.phone, c.email, c.enquiryCount, c.lastEnquiryAgeDays, c.products]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );
  return [header.join(','), ...rows].join('\n');
};

const downloadCsv = (filename, csv) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ──────────────────────────────────────────────────────────────────────
   Campaign composer modal — pick a template, fill vars, then for each
   selected customer renders a personalised wa.me link + 1-click Send.
   ──────────────────────────────────────────────────────────────────── */
const CampaignComposer = ({ recipients, segmentLabel, onClose, shopName }) => {
  const [templateId, setTemplateId] = useState(CAMPAIGN_TEMPLATES[0].id);
  const [discount, setDiscount] = useState('15');
  const [code, setCode] = useState('SAVE15');
  const [offer, setOffer] = useState('Free home delivery + 1yr warranty');
  const [body, setBody] = useState(CAMPAIGN_TEMPLATES[0].body);
  const [sentCount, setSentCount] = useState(0);

  const template = CAMPAIGN_TEMPLATES.find((t) => t.id === templateId);

  useEffect(() => {
    setBody(template?.body || '');
  }, [templateId]);

  const previewFor = (c) =>
    renderTemplate(body, {
      name: c.name?.split(' ')[0] || 'there',
      shopName,
      discount,
      code,
      offer,
    });

  const openOne = (c) => {
    const text = previewFor(c);
    window.open(whatsappLink(c.phone, text), '_blank');
    setSentCount((n) => n + 1);
  };

  const openAll = () => {
    // Browsers block batch popups beyond ~3-5. Be honest about it.
    let opened = 0;
    for (const c of recipients) {
      const w = window.open(whatsappLink(c.phone, previewFor(c)), '_blank');
      if (w) opened++;
    }
    setSentCount((n) => n + opened);
    if (opened < recipients.length) {
      Toast.warning(
        `Browser opened ${opened}/${recipients.length} tabs. Use 'Send' per row for the rest, or allow popups for this site.`
      );
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
          className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          <div className="px-5 sm:px-7 py-4 border-b border-gray-100 flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                WhatsApp campaign
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Send to <span className="text-primary">{recipients.length}</span> ·{' '}
                {segmentLabel}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
              aria-label="Close"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 overflow-hidden">
            {/* Left: template + variables */}
            <div className="px-5 sm:px-7 py-4 border-r border-gray-100 overflow-y-auto">
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Template
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {CAMPAIGN_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      templateId === t.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-br ${t.accent} text-white flex items-center justify-center mb-2`}
                    >
                      <Icon name={t.icon} size={16} />
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {t.label}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                      {t.category}
                    </div>
                  </button>
                ))}
              </div>

              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Message body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full text-sm bg-slate-50 rounded-xl p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Discount %
                  </label>
                  <input
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full mt-1 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Code</label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full mt-1 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">
                    Offer (VIP template)
                  </label>
                  <input
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    className="w-full mt-1 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-1">
                  Preview (first recipient)
                </div>
                <p className="text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed">
                  {recipients[0] ? previewFor(recipients[0]) : '—'}
                </p>
              </div>
            </div>

            {/* Right: recipient list with per-row Send */}
            <div className="flex flex-col overflow-hidden">
              <div className="px-5 sm:px-7 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="text-sm font-semibold text-foreground">
                  Recipients
                </div>
                <button
                  onClick={openAll}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Open all in tabs
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2">
                {recipients.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No customers in this segment.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {recipients.map((c) => (
                      <li
                        key={c.phone}
                        className="flex items-center gap-3 py-2.5 px-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {c.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            +91 {c.phone} · {c.enquiryCount} enquir
                            {c.enquiryCount === 1 ? 'y' : 'ies'}
                          </div>
                        </div>
                        <button
                          onClick={() => openOne(c)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 inline-flex items-center gap-1"
                        >
                          <Icon name="Send" size={12} />
                          Send
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="px-5 sm:px-7 py-3 border-t border-gray-100 bg-slate-50 text-xs text-muted-foreground">
                Opened so far: <b className="text-foreground">{sentCount}</b> /{' '}
                {recipients.length}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ──────────────────────────────────────────────────────────────────────
   Main page
   ──────────────────────────────────────────────────────────────────── */
const CustomerSegments = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSegmentId, setActiveSegmentId] = useState('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [shopName, setShopName] = useState('Shiv Mobile Hub');

  useEffect(() => {
    let mounted = true;
    Promise.all([
      apiService.request('/enquiries', { method: 'GET' }).catch(() => ({})),
      apiService.getPublicSettings().catch(() => ({})),
    ])
      .then(([eRes, sRes]) => {
        if (!mounted) return;
        const list = eRes?.data || eRes?.enquiries || [];
        setEnquiries(Array.isArray(list) ? list : []);
        const name =
          sRes?.data?.businessName ||
          sRes?.data?.shopName ||
          sRes?.businessName ||
          'Shiv Mobile Hub';
        setShopName(name);
      })
      .catch(() => Toast.error('Failed to load customer data'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const customers = useMemo(() => summarise(enquiries), [enquiries]);
  const activeSegment =
    SEGMENTS.find((s) => s.id === activeSegmentId) || SEGMENTS[0];

  const filteredCustomers = useMemo(() => {
    let list = customers.filter((c) => activeSegment.match(c));
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.phone?.includes(q) ||
          c.email?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.enquiryCount - a.enquiryCount);
  }, [customers, activeSegment, search]);

  const counts = useMemo(() => {
    const out = {};
    for (const seg of SEGMENTS) {
      out[seg.id] = customers.filter((c) => seg.match(c)).length;
    }
    return out;
  }, [customers]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Customer segments
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Group customers automatically and launch WhatsApp campaigns in one
            click.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadCsv(`${activeSegment.id}-customers.csv`, toCsv(filteredCustomers))}
            disabled={!filteredCustomers.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-slate-50 disabled:opacity-50"
          >
            <Icon name="Download" size={14} /> Export CSV
          </button>
          <button
            onClick={() => setComposerOpen(true)}
            disabled={!filteredCustomers.length}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            <Icon name="Send" size={14} /> Launch campaign
          </button>
        </div>
      </div>

      {/* Segment chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
        {SEGMENTS.map((s) => {
          const isActive = activeSegmentId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSegmentId(s.id)}
              className={`text-left p-3 rounded-2xl border transition-all ${
                isActive
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center mb-2`}
              >
                <Icon name={s.icon} size={16} />
              </div>
              <div className="text-xs font-semibold text-foreground">{s.label}</div>
              <div className="text-lg font-bold text-foreground mt-0.5">
                {counts[s.id] ?? 0}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search + segment description */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 flex-1">
          <Icon name="Search" size={16} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or email"
            className="flex-1 bg-transparent py-2 px-2 outline-none text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground self-center sm:max-w-md">
          {activeSegment.description}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading customers…
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-10 text-center">
            <Icon
              name="UsersRound"
              size={36}
              className="mx-auto mb-2 text-muted-foreground opacity-40"
            />
            <div className="text-sm text-muted-foreground">
              No customers in this segment yet.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold text-right">Enq.</th>
                  <th className="px-4 py-3 font-semibold">Last contact</th>
                  <th className="px-4 py-3 font-semibold">Interested in</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.phone} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.name}
                      {c.email && (
                        <div className="text-xs text-muted-foreground">
                          {c.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      +91 {c.phone}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-xs font-semibold">
                        {c.enquiryCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {c.lastEnquiryAgeDays === Infinity
                        ? '—'
                        : `${c.lastEnquiryAgeDays}d ago`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs line-clamp-1 max-w-[260px]">
                      {c.products || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={whatsappLink(c.phone, `Hi ${c.name?.split(' ')[0] || 'there'}, this is ${shopName}.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Icon name="MessageCircle" size={12} /> WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {composerOpen && (
        <CampaignComposer
          recipients={filteredCustomers}
          segmentLabel={activeSegment.label}
          shopName={shopName}
          onClose={() => setComposerOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerSegments;
