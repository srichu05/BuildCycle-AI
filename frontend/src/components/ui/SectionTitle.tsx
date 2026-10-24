import React from 'react';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  highlightText?: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
  theme?: 'dark' | 'light';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  highlightText,
  description,
  alignment = 'left',
  theme = 'light',
  className = '',
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }[alignment];

  const isDark = theme === 'dark';

  return (
    <div className={`relative mb-8 md:mb-12 max-w-3xl ${alignClass} ${className}`}>
      {subtitle && (
        <div className="mb-3.5 inline-block">
          <span
            className={
              isDark
                ? 'sub-title-badge-white text-xs md:text-sm font-semibold tracking-wider uppercase'
                : 'sub-title-badge text-xs md:text-sm font-semibold tracking-wider uppercase'
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {subtitle}
          </span>
        </div>
      )}

      <h2
        className={`text-3xl sm:text-4xl lg:text-[44px] font-bold leading-tight tracking-tight ${
          isDark ? 'text-white' : 'text-[#1c503a]'
        }`}
      >
        {highlightText ? (
          <>
            {title}{' '}
            <span className="text-[#097e51] relative inline-block">
              {highlightText}
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-2 text-[#dfb163] opacity-80"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q 50 0, 100 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </>
        ) : (
          title
        )}
      </h2>

      {description && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
