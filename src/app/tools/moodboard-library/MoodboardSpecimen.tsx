'use client';
import type { Moodboard } from '@/lib/moodboards';

interface MoodboardSpecimenProps {
  moodboard: Moodboard;
}

/**
 * SVG type-specimen card per moodboard.
 *
 * Shows a big "Aa" rendered in the moodboard's heading font (with a tuned
 * fallback stack so it still looks intentional when the real face isn't
 * installed), plus the heading + body font names rendered in mono.
 *
 * The accent shape is a function of the board's aesthetic family (its
 * `category` field). One designed shape per family: organic a sun arc,
 * maximal glow bars, minimal a soft circle, brutalist a checker, retro a
 * dot grid, editorial a drop-cap column. Every board, existing and future,
 * draws its specimen accent from its family, so the specimen expresses the
 * family taxonomy the same way the card label and the filter do. Adding a
 * board in a family gets the right specimen automatically.
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

      {/* Family-keyed accent geometry — one designed shape per aesthetic
          family. Re-homed from the old per-board keying: organic keeps the
          sun arc, maximal the glow bars, minimal the soft circle, brutalist
          the checker. retro and editorial are the two shapes designed for
          this milestone. */}
      {category === 'organic' && (
        // Sun arc rising from the bottom-right
        <g data-accent-family="organic" data-accent-shape="sun-arc">
          <circle cx="240" cy="140" r="56" fill={specimen.accent} opacity="0.85" />
        </g>
      )}
      {category === 'maximal' && (
        // Vending-machine glow — three thin horizontal bars on the right
        <g data-accent-family="maximal" data-accent-shape="glow-bars" fill={specimen.accent} opacity="0.85">
          <rect x="200" y="22" width="64" height="3" />
          <rect x="200" y="34" width="48" height="3" />
          <rect x="200" y="46" width="56" height="3" />
        </g>
      )}
      {category === 'minimal' && (
        // Soft circle in the upper-right
        <g data-accent-family="minimal" data-accent-shape="soft-circle">
          <circle cx="232" cy="42" r="34" fill={specimen.accent} opacity="0.7" />
        </g>
      )}
      {category === 'brutalist' && (
        // Checker block in the upper-right
        <g data-accent-family="brutalist" data-accent-shape="checker" fill={specimen.accent}>
          <rect x="208" y="14" width="14" height="14" />
          <rect x="236" y="14" width="14" height="14" />
          <rect x="222" y="28" width="14" height="14" />
          <rect x="250" y="28" width="14" height="14" />
          <rect x="208" y="42" width="14" height="14" />
          <rect x="236" y="42" width="14" height="14" />
        </g>
      )}
      {category === 'retro' && (
        // Dot grid — a 3x2 polka cluster in the upper-right (period, playful)
        <g data-accent-family="retro" data-accent-shape="dot-grid" fill={specimen.accent} opacity="0.85">
          <circle cx="214" cy="22" r="7" />
          <circle cx="238" cy="22" r="7" />
          <circle cx="262" cy="22" r="7" />
          <circle cx="214" cy="46" r="7" />
          <circle cx="238" cy="46" r="7" />
          <circle cx="262" cy="46" r="7" />
        </g>
      )}
      {category === 'editorial' && (
        // Drop-cap column — a block cap with measured rules and a ragged
        // last line, a magazine text-column abstraction
        <g data-accent-family="editorial" data-accent-shape="column-rule" fill={specimen.accent} opacity="0.85">
          <rect x="198" y="16" width="22" height="22" />
          <rect x="226" y="18" width="40" height="3" />
          <rect x="226" y="26" width="40" height="3" />
          <rect x="226" y="34" width="40" height="3" />
          <rect x="198" y="46" width="68" height="3" />
          <rect x="198" y="54" width="46" height="3" />
        </g>
      )}

      {/* Big "Aa" — the type sample */}
      <text
        x="20"
        y="92"
        fontFamily={fontStack}
        fontSize="68"
        fontWeight={category === 'brutalist' ? 800 : 500}
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
