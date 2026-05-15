'use client';
import type { Moodboard } from '@/lib/moodboards';

interface MoodboardSpecimenProps {
  moodboard: Moodboard;
}

/**
 * SVG type-specimen card per moodboard.
 *
 * Shows a big "Aa" rendered in the moodboard's heading font (with a category-tuned
 * fallback stack so it still looks intentional when the real face isn't installed),
 * plus the heading + body font names rendered in mono.
 *
 * The accent shape varies by category — warm gets a sun arc, cool gets vending-glow
 * lines, soft gets a quiet circle, high-contrast gets a checker block. Same template,
 * just enough differentiation to read at a glance which moodboard is which.
 */
export function MoodboardSpecimen({ moodboard: mb }: MoodboardSpecimenProps) {
  const { specimen, fonts, category, id } = mb;
  const fontStack = `"${fonts.heading}", ${specimen.headingFallback}`;
  const isItalic = /serif|migra|editorial|instrument/i.test(fonts.heading);

  return (
    <svg
      viewBox="0 0 280 140"
      preserveAspectRatio="xMidYMid slice"
      className="mb-card__specimen"
      role="img"
      aria-label={`${mb.name} type specimen — ${fonts.heading} + ${fonts.body}`}
      data-specimen-id={id}
    >
      {/* Background */}
      <rect x="0" y="0" width="280" height="140" fill={specimen.bg} />

      {/* Category-specific accent geometry */}
      {category === 'warm' && (
        // Sun arc rising from the bottom-right
        <circle cx="240" cy="140" r="56" fill={specimen.accent} opacity="0.85" />
      )}
      {category === 'cool' && (
        // Vending-machine glow — three thin horizontal bars on the right
        <g fill={specimen.accent} opacity="0.85">
          <rect x="200" y="22" width="64" height="3" />
          <rect x="200" y="34" width="48" height="3" />
          <rect x="200" y="46" width="56" height="3" />
        </g>
      )}
      {category === 'soft' && (
        // Soft circle in the upper-right
        <circle cx="232" cy="42" r="34" fill={specimen.accent} opacity="0.7" />
      )}
      {category === 'high-contrast' && (
        // Checker block in the upper-right
        <g fill={specimen.accent}>
          <rect x="208" y="14" width="14" height="14" />
          <rect x="236" y="14" width="14" height="14" />
          <rect x="222" y="28" width="14" height="14" />
          <rect x="250" y="28" width="14" height="14" />
          <rect x="208" y="42" width="14" height="14" />
          <rect x="236" y="42" width="14" height="14" />
        </g>
      )}

      {/* Big "Aa" — the type sample */}
      <text
        x="20"
        y="92"
        fontFamily={fontStack}
        fontSize="68"
        fontWeight={category === 'high-contrast' || id === 'brutalist-office' ? 800 : 500}
        fontStyle={isItalic ? 'italic' : 'normal'}
        fill={specimen.fg}
        letterSpacing="-0.02em"
        data-testid="specimen-sample"
      >
        Aa
      </text>

      {/* Font names — small mono labels at the bottom */}
      <text
        x="20"
        y="118"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="9"
        fill={specimen.fg}
        opacity="0.85"
        letterSpacing="0.04em"
      >
        {fonts.heading.toUpperCase()}
      </text>
      <text
        x="20"
        y="130"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="9"
        fill={specimen.fg}
        opacity="0.6"
        letterSpacing="0.04em"
      >
        + {fonts.body}
      </text>
    </svg>
  );
}
