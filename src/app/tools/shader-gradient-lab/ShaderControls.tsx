'use client';
import { CONTROL_GROUPS } from '@/lib/shader-types';
import type { ControlSpec, ShaderConfig, ShaderProgram } from '@/lib/shader-types';

interface Props {
  program: ShaderProgram;
  config: ShaderConfig;
  onChange: (patch: Partial<ShaderConfig>) => void;
}

function fieldEnabled(program: ShaderProgram, field: keyof ShaderConfig): boolean {
  if (field === 'colors') return program.usesColorStops;
  return program.supportedFields.includes(field);
}

function fmt(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

export function ShaderControls({ program, config, onChange }: Props) {
  const renderControl = (c: ControlSpec) => {
    const enabled = fieldEnabled(program, c.field);
    const disabledAttr = enabled ? 'false' : 'true';

    let body: React.ReactNode;

    if (c.type === 'color-stops') {
      const colors = config.colors;
      body = (
        <div className="sg-stops">
          {colors.map((stop, i) => (
            <div className="sg-stop" key={i}>
              <input
                type="color"
                className="sg-stop__color"
                value={stop.color}
                disabled={!enabled}
                data-testid={`sg-color-${i}`}
                aria-label={`Color stop ${i + 1}`}
                onChange={(e) => {
                  const next = colors.map((s, j) =>
                    j === i ? { ...s, color: e.target.value } : s
                  );
                  onChange({ colors: next });
                }}
              />
              <button
                type="button"
                className="sg-stop__toggle"
                disabled={!enabled}
                data-testid={`sg-color-toggle-${i}`}
                data-on={stop.enabled ? 'true' : 'false'}
                aria-pressed={stop.enabled}
                onClick={() => {
                  const next = colors.map((s, j) =>
                    j === i ? { ...s, enabled: !s.enabled } : s
                  );
                  onChange({ colors: next });
                }}
              >
                {stop.enabled ? 'on' : 'off'}
              </button>
            </div>
          ))}
        </div>
      );
    } else if (c.type === 'color') {
      body = (
        <input
          type="color"
          className="sg-stop__color"
          value={config[c.field] as string}
          disabled={!enabled}
          data-testid={`sg-${c.field}-input`}
          aria-label={c.label}
          onChange={(e) => onChange({ [c.field]: e.target.value } as Partial<ShaderConfig>)}
        />
      );
    } else if (c.type === 'toggle') {
      const on = config[c.field] as boolean;
      body = (
        <button
          type="button"
          className="sg-toggle"
          disabled={!enabled}
          data-testid={`sg-${c.field}-toggle`}
          data-on={on ? 'true' : 'false'}
          aria-pressed={on}
          onClick={() => onChange({ [c.field]: !on } as Partial<ShaderConfig>)}
        >
          {on ? 'on' : 'off'}
        </button>
      );
    } else {
      const value = config[c.field] as number;
      body = (
        <input
          type="range"
          className="slider"
          min={c.min}
          max={c.max}
          step={c.step}
          value={value}
          disabled={!enabled}
          data-testid={`sg-${c.field}-slider`}
          aria-label={c.label}
          onChange={(e) =>
            onChange({ [c.field]: Number(e.target.value) } as Partial<ShaderConfig>)
          }
        />
      );
    }

    const showValue = c.type === 'slider';

    return (
      <div
        className="field sg-field"
        key={c.field}
        data-testid={`sg-control-${c.field}`}
        data-disabled={disabledAttr}
      >
        <label className="field__label">
          <span>{c.label}</span>
          {showValue && (
            <span className="field__value" data-testid={`sg-${c.field}-value`}>
              {fmt(config[c.field] as number)}
            </span>
          )}
        </label>
        {body}
      </div>
    );
  };

  return (
    <div className="sg-controls" data-testid="sg-controls">
      {CONTROL_GROUPS.map((group) => (
        <section className="sg-group" key={group.title}>
          <p className="sg-group__title">{group.title}</p>
          {group.controls.map(renderControl)}
        </section>
      ))}
    </div>
  );
}
