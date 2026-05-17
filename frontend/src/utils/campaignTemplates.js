/**
 * Reusable festive / lifecycle WhatsApp message templates.
 * Placeholders use {{name}}, {{shopName}}, {{discount}}, {{code}}, {{offer}}
 * — replaced at send-time by the campaign launcher.
 */

export const CAMPAIGN_TEMPLATES = [
  {
    id: 'welcome',
    label: 'Welcome',
    icon: 'Sparkles',
    accent: 'from-cyan-500 to-blue-500',
    category: 'lifecycle',
    bestFor: ['new'],
    body:
      "Hi {{name}}, welcome to {{shopName}}! 🎉 Enjoy {{discount}}% off your first purchase with code {{code}}. We're here to help with phones, recharges, repairs and Govt. services.",
  },
  {
    id: 'birthday',
    label: 'Birthday treat',
    icon: 'Gift',
    accent: 'from-pink-500 to-rose-500',
    category: 'lifecycle',
    bestFor: ['birthday'],
    body:
      'Happy birthday, {{name}}! 🎂 Here is a special gift from {{shopName}} — {{discount}}% off any phone, accessory or service. Valid all month. Use code {{code}}.',
  },
  {
    id: 'inactive-nudge',
    label: 'Win-back (inactive)',
    icon: 'Heart',
    accent: 'from-amber-500 to-orange-500',
    category: 'lifecycle',
    bestFor: ['lapsed'],
    body:
      "Hi {{name}}, we miss you at {{shopName}}! 💛 Come back this week and get {{discount}}% off any service — repair, recharge, bill pay or accessory. Reply 'YES' and we'll set it up.",
  },
  {
    id: 'flash-sale',
    label: 'Flash sale',
    icon: 'Flame',
    accent: 'from-red-500 to-rose-600',
    category: 'promo',
    bestFor: ['engaged', 'vip', 'recent'],
    body:
      "🔥 {{shopName}} Flash Sale is LIVE — {{discount}}% off top phones &amp; accessories, today only. Tap the link in our bio or reply 'DEAL' to grab yours.",
  },
  {
    id: 'diwali',
    label: 'Diwali offer',
    icon: 'Sparkles',
    accent: 'from-yellow-500 to-orange-500',
    category: 'festive',
    bestFor: ['all', 'vip'],
    body:
      'Happy Diwali, {{name}}! ✨ Light up your festival with up to {{discount}}% off at {{shopName}}. EMI options + free home delivery. Offer ends Diwali night.',
  },
  {
    id: 'holi',
    label: 'Holi offer',
    icon: 'Sparkles',
    accent: 'from-fuchsia-500 to-pink-500',
    category: 'festive',
    bestFor: ['all'],
    body:
      "Happy Holi, {{name}}! 🎨 Add colour to your tech — {{discount}}% off phones &amp; accessories at {{shopName}}. Mention code {{code}} at checkout.",
  },
  {
    id: 'independence-day',
    label: 'Independence Day',
    icon: 'Flag',
    accent: 'from-emerald-500 to-blue-500',
    category: 'festive',
    bestFor: ['all'],
    body:
      "🇮🇳 Celebrate freedom with {{discount}}% off at {{shopName}}! From smartphones to repairs, this week is our biggest patriotic sale. Code {{code}}.",
  },
  {
    id: 'vip-thanks',
    label: 'VIP thank-you',
    icon: 'Crown',
    accent: 'from-violet-500 to-purple-600',
    category: 'lifecycle',
    bestFor: ['vip'],
    body:
      'Hi {{name}}, you are one of our most valued customers at {{shopName}}. 👑 A private offer: {{offer}}. Reply to claim — we will set it up personally.',
  },
  {
    id: 'product-followup',
    label: 'Product follow-up',
    icon: 'MessageCircle',
    accent: 'from-slate-700 to-slate-900',
    category: 'lifecycle',
    bestFor: ['hot'],
    body:
      'Hi {{name}}, just checking in on your enquiry. We have a special deal on it this week. Want me to send the price + availability?',
  },
];

/**
 * Replace placeholders with actual values. Unknown placeholders are kept as-is
 * so admins can spot what they forgot to fill in.
 */
export const renderTemplate = (body, vars = {}) =>
  body.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] != null && vars[key] !== '' ? String(vars[key]) : `{{${key}}}`
  );

/**
 * Build the wa.me URL for a single recipient.
 * Phone is normalised to E.164 without the leading '+' (wa.me convention).
 */
export const whatsappLink = (phone, text, defaultCountryCode = '91') => {
  const digits = String(phone || '').replace(/\D/g, '');
  const withCc = digits.length === 10 ? `${defaultCountryCode}${digits}` : digits;
  return `https://wa.me/${withCc}?text=${encodeURIComponent(text)}`;
};
