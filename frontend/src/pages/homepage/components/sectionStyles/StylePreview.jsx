import React from 'react';

/**
 * Tiny visual mockup of each section layout, rendered as a grid of div tiles.
 * Used in the admin section form so admins can see what they're picking.
 * Pure presentation — no business logic.
 */
const Tile = ({ className = '' }) => (
  <div className={`bg-gradient-to-br from-slate-200 to-slate-300 rounded ${className}`} />
);

const Accent = ({ className = '', gradient = 'from-violet-400 to-fuchsia-400' }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded ${className}`} />
);

const layouts = {
  MultiColumnGrid: (
    <div className="grid grid-cols-6 gap-1 p-2 h-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <Tile key={i} className="aspect-square" />
      ))}
    </div>
  ),
  CompactGrid: (
    <div className="grid grid-cols-8 gap-0.5 p-2 h-full">
      {Array.from({ length: 16 }).map((_, i) => (
        <Tile key={i} className="aspect-square" />
      ))}
    </div>
  ),
  DualRowCarousel: (
    <div className="flex flex-col gap-1 p-2 h-full">
      <div className="flex gap-1 overflow-hidden flex-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Tile key={i} className="flex-1 aspect-[3/4]" />
        ))}
      </div>
      <div className="flex gap-1 overflow-hidden flex-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Tile key={i} className="flex-1 aspect-[3/4]" />
        ))}
      </div>
    </div>
  ),
  HeroBannerGrid: (
    <div className="grid grid-cols-12 gap-1 p-2 h-full">
      <Accent className="col-span-5 row-span-2" gradient="from-purple-400 to-indigo-500" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Tile key={i} className="col-span-3 aspect-square" />
      ))}
    </div>
  ),
  DealOfTheDay: (
    <div className="grid grid-cols-12 gap-1 p-2 h-full">
      <Accent className="col-span-5 row-span-2" gradient="from-orange-400 to-rose-500" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Tile key={i} className="col-span-2 aspect-square" />
      ))}
    </div>
  ),
  TopPicks: (
    <div className="grid grid-cols-3 gap-1 p-2 h-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-1 bg-slate-100 rounded p-1">
          <Accent className="w-4 h-4 flex-shrink-0" gradient="from-amber-400 to-orange-500" />
          <Tile className="flex-1 h-6" />
        </div>
      ))}
    </div>
  ),
  BrandShowcase: (
    <div className="grid grid-cols-3 gap-1 p-2 h-full">
      {Array.from({ length: 3 }).map((_, col) => (
        <div key={col} className="bg-white border border-slate-200 rounded p-1">
          <Accent
            className="h-2 mb-1"
            gradient="from-indigo-400 to-blue-500"
          />
          <div className="grid grid-cols-2 gap-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Tile key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  FlashSale: (
    <div className="flex flex-col gap-1 p-2 h-full">
      <Accent className="h-4 flex-shrink-0" gradient="from-red-500 to-pink-500" />
      <div className="grid grid-cols-6 gap-1 flex-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <Tile key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  ),
  HorizontalScroll: (
    <div className="flex flex-col gap-1 p-2 h-full justify-center">
      <div className="flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Tile key={i} className="flex-1 aspect-[3/4]" />
        ))}
      </div>
    </div>
  ),
  MegaBanner: (
    <div className="flex flex-col gap-1 p-2 h-full">
      <Accent className="h-6 flex-shrink-0" gradient="from-emerald-400 to-teal-500" />
      <div className="grid grid-cols-6 gap-1 flex-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <Tile key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  ),
};

const StylePreview = ({ style, className = '' }) => (
  <div
    className={`relative w-full h-32 sm:h-36 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden ${className}`}
    aria-hidden
  >
    {layouts[style] || layouts.HorizontalScroll}
  </div>
);

export default StylePreview;
