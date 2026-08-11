/**
 * The project's minimum touch-target size, in CSS pixels. Controls are authored
 * to this via `min-height: 44px` (and friends) in the components themselves.
 */
export const TOUCH_FLOOR = 44;

/**
 * The threshold assertions should compare against.
 *
 * `boundingBox()` returns the *rendered* rect, which is subject to sub-pixel
 * layout rounding — and returns a fractionally smaller number for an element
 * that is genuinely 44px by CSS. Two separate assertions have failed on
 * `43.999969482421875 >= 44`: a button inside the toast's slide-in transform
 * (chromium) and an accordion tab (firefox). Those are rounding artefacts, not
 * undersized controls.
 *
 * Half a pixel of slack absorbs the artefact while still failing anything
 * actually below the floor — the next real size down (40px, the previous
 * default) misses by 3.5px.
 */
export const TOUCH_FLOOR_MIN = TOUCH_FLOOR - 0.5;
