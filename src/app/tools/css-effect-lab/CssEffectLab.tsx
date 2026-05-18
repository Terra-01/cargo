'use client';
import { useMemo, useState } from 'react';
import { effects, defaults, type Effect, type KnobValues } from './effects';
import { ExportPanel } from './ExportPanel';

type Backdrop = 'dark' | 'light';

// The realistic preview target. `card` for effects where the surrounding
// context is the effect (a real heading + line of text); `shape` for
// effects whose point is shape-following (a non-rectangular silhouette
// box-shadow could not trace); `panel` for effects whose recipe paints its
// own background (grain over gradient) — same content, but no forced
// surface, so the recipe's gradient shows and the preview stays honest.
function PreviewTarget({ effect }: { effect: Effect }) {
  if (effect.target === 'shape') {
    return (
      <div className={`fx-shape ${effect.selector}`} data-testid="fx-target">
        <span className="fx-shape__label">clip-path silhouette</span>
      </div>
    );
  }
  if (effect.target === 'panel') {
    return (
      <article className={`fx-panel ${effect.selector}`} data-testid="fx-target">
        <p className="fx-panel__eyebrow">{'// release'}</p>
        <h3 className="fx-panel__title">Ship Saturday</h3>
        <p className="fx-panel__text">
          A grainy gradient kills the flat banding that makes CSS gradients
          look cheap.
        </p>
      </article>
    );
  }
  return (
    <article className={`fx-card ${effect.selector}`} data-testid="fx-target">
      <p className="fx-card__eyebrow">{'// pricing'}</p>
      <h3 className="fx-card__title">Pro plan</h3>
      <p className="fx-card__text">
        Everything in Starter, plus unlimited projects, custom domains, and
        priority support.
      </p>
    </article>
  );
}

export function CssEffectLab() {
  const [effectId, setEffectId] = useState(effects[0].id);
  const [values, setValues] = useState<KnobValues>(() => defaults(effects[0]));
  const [backdrop, setBackdrop] = useState<Backdrop>(
    effects[0].arrivalBackdrop ?? 'dark'
  );

  const effect = useMemo(
    () => effects.find((e) => e.id === effectId) ?? effects[0],
    [effectId]
  );

  const pickEffect = (e: Effect) => {
    setEffectId(e.id);
    setValues(defaults(e)); // each effect arrives as a working recipe
    setBackdrop(e.arrivalBackdrop ?? 'dark'); // on a surface where it reads
  };

  const setKnob = (id: string, value: number | string) =>
    setValues((v) => ({ ...v, [id]: value }));

  const recipe = useMemo(() => effect.build(values), [effect, values]);

  return (
    <div className="fx">
      {/* Effect picker — adding the remaining four effects is just adding
          them to the `effects` array. */}
      <div className="fx-picker" role="tablist" aria-label="Effect" data-testid="fx-picker">
        {effects.map((e) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={e.id === effectId}
            className={`fx-picker__tab ${e.id === effectId ? 'fx-picker__tab--active' : ''}`}
            onClick={() => pickEffect(e)}
            data-testid={`fx-tab-${e.id}`}
          >
            {e.name}
          </button>
        ))}
      </div>

      <p className="fx-blurb">{effect.blurb}</p>

      <div className="lab">
        <div className="lab__panel panel" data-testid="lab-panel">
          <p className="panel__title"><span>controls</span></p>

          <div className="field">
            <label className="field__label"><span>backdrop</span></label>
            <div className="fx-seg" role="group" aria-label="Preview backdrop">
              {(['dark', 'light'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  className={`fx-seg__opt ${backdrop === b ? 'fx-seg__opt--active' : ''}`}
                  onClick={() => setBackdrop(b)}
                  data-testid={`backdrop-${b}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {effect.knobs.map((k) =>
            k.kind === 'color' ? (
              <div className="field" key={k.id}>
                <label className="field__label" htmlFor={`knob-${k.id}`}>
                  <span>{k.label}</span>
                  <span className="field__value">{String(values[k.id])}</span>
                </label>
                <div className="fx-color">
                  <input
                    id={`knob-${k.id}`}
                    type="color"
                    value={String(values[k.id])}
                    onChange={(e) => setKnob(k.id, e.target.value)}
                    data-testid={`knob-${k.id}`}
                  />
                </div>
              </div>
            ) : (
              <div className="field" key={k.id}>
                <label className="field__label" htmlFor={`knob-${k.id}`}>
                  <span>{k.label}</span>
                  <span className="field__value">
                    {Number(values[k.id])}{k.unit}
                  </span>
                </label>
                <input
                  id={`knob-${k.id}`}
                  type="range"
                  className="slider"
                  min={k.min}
                  max={k.max}
                  step={k.step}
                  value={Number(values[k.id])}
                  onChange={(e) => setKnob(k.id, Number(e.target.value))}
                  data-testid={`knob-${k.id}`}
                />
              </div>
            )
          )}
        </div>

        <div className="lab__preview-wrap">
          <div className="fx-stage" data-backdrop={backdrop} data-testid="fx-stage">
            {/* The single source of truth: the preview renders the exact
                CSS string the export shows and the user copies. No char in
                a generated recipe needs HTML-escaping inside <style>. */}
            <style data-testid="fx-style">{recipe.css}</style>
            <PreviewTarget effect={effect} />
          </div>
        </div>

        <div className="lab__code-wrap">
          {/* Remount per effect so a section's "copied" confirmation never
              bleeds onto a different effect's export. */}
          <ExportPanel key={effect.id} sections={recipe.sections} />
        </div>
      </div>
    </div>
  );
}
