import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../../components/AppIcon';

/**
 * Standard header used by most section styles. Tightly designed so it doesn't
 * eat too much vertical space — the goal is to keep products visible.
 */
const SectionHeader = ({
  title,
  subtitle,
  icon,
  accent = 'from-violet-500 to-fuchsia-500',
  viewAllHref,
  compact = false,
}) => (
  <div className={`flex items-end justify-between gap-4 ${compact ? 'mb-3' : 'mb-5'}`}>
    <div className="flex items-center gap-3 min-w-0">
      {icon && (
        <div
          className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${accent} text-white flex items-center justify-center shadow-md`}
        >
          <Icon name={icon} size={20} />
        </div>
      )}
      <div className="min-w-0">
        <h2 className={`font-bold text-foreground truncate ${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl lg:text-3xl'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
    </div>
    {viewAllHref && (
      <Link
        to={viewAllHref}
        className="hidden sm:inline-flex flex-shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all whitespace-nowrap"
      >
        View all <Icon name="ArrowRight" size={14} />
      </Link>
    )}
  </div>
);

export default SectionHeader;
