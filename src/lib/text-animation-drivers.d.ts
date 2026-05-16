/* Hand-written type declaration for the single-source `.js` drivers module.
 * The runtime source lives in `text-animation-drivers.js` (authored as plain
 * dependency-free JS so milestone 2b can emit it verbatim as copy-paste code).
 * This declaration keeps the tool card's import typed without a build step. */

export type TaDriverKind =
  | 'typewriter'
  | 'terminal'
  | 'shuffle'
  | 'binary-decode'
  | 'random-reveal'
  | 'spotlight';

/** Per-kind tuning passed straight from a TextAnimation's `jsDriver` spec. */
export interface TaDriverParams {
  stepMs?: number;
  sweepMs?: number;
}

/** Cancels every timer/animation-frame the driver scheduled. */
export type TaDriverCleanup = () => void;

/**
 * Uniform driver signature. The driver owns `el`'s content, animates `text`,
 * and returns a cleanup that tears down all timers/frames.
 */
export type TaDriver = (
  el: HTMLElement,
  text: string,
  params?: TaDriverParams
) => TaDriverCleanup;

export declare const taDrivers: Record<TaDriverKind, TaDriver>;
