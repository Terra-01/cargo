import type { Metadata } from 'next';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import { workedExamples } from '@/lib/spec-pressure-test';
import { WorkedExample } from './WorkedExample';
import { SelfCheck } from './SelfCheck';

export const metadata: Metadata = {
  title: 'The Spec Pressure-Test — Cargo',
  description:
    'Learn to spot the gaps in a feature spec before an AI coding agent fills them in wrongly.',
};

export default function SpecPressureTestPage() {
  const tool = tools.find((t) => t.id === 'spec-pressure-test')!;

  return (
    <main className="container">
      <div className="tool-page">
        <style>{`
          .spt-prose {
            font-size: var(--text-md);
            line-height: 1.75;
            color: var(--text-muted);
            max-width: 66ch;
            margin-bottom: var(--space-5);
          }
          .spt-prose:last-of-type { margin-bottom: 0; }
          .spt-prose strong { color: var(--text); font-weight: 600; }
          .spt-intro { margin-bottom: var(--space-4); }

          .spt-example {
            margin-top: var(--space-20);
            padding-top: var(--space-12);
            border-top: 1px solid var(--border);
          }
          .spt-example__eyebrow { margin-bottom: var(--space-4); }
          .spt-example__heading {
            margin-bottom: var(--space-6);
            max-width: 28ch;
          }
          .spt-example__lead {
            font-size: var(--text-md);
            line-height: 1.75;
            color: var(--text-muted);
            max-width: 66ch;
            margin: var(--space-6) 0 var(--space-12);
          }

          .spt-brief {
            margin: 0;
            background: var(--surface-muted);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
          }
          .spt-brief__label {
            font-family: var(--font-mono);
            font-size: var(--text-xs);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: var(--space-3);
          }
          .spt-brief__text {
            font-size: var(--text-md);
            line-height: 1.7;
            color: var(--text);
            max-width: 70ch;
          }

          .spt-chains {
            display: flex;
            flex-direction: column;
            gap: var(--space-16);
          }
          .spt-chain {
            padding-top: var(--space-12);
            border-top: 1px solid var(--border);
          }
          .spt-chain:first-child { padding-top: 0; border-top: 0; }
          .spt-chain__head { margin-bottom: var(--space-6); }
          .spt-chain__eyebrow { margin-bottom: var(--space-2); }
          .spt-chain__blurb {
            font-size: var(--text-sm);
            line-height: 1.6;
            color: var(--text-muted);
            max-width: 60ch;
          }

          .spt-flow { display: block; }

          .spt-stage {
            background: var(--surface);
            border: 1px solid var(--border);
            border-left-width: 3px;
            border-radius: var(--radius-md);
            padding: var(--space-5) var(--space-6);
          }
          .spt-stage--gap { border-left-color: var(--border-strong); }
          .spt-stage--assumption { border-left-color: var(--accent); }
          .spt-stage--consequence {
            border-left-color: var(--accent);
            background: var(--accent-soft);
          }

          .spt-stage__label {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: var(--space-3);
            margin-bottom: var(--space-3);
          }
          .spt-stage__tag {
            font-family: var(--font-mono);
            font-size: var(--text-xs);
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--text-muted);
          }
          .spt-stage--assumption .spt-stage__tag,
          .spt-stage--consequence .spt-stage__tag { color: var(--accent); }
          .spt-stage__caption {
            font-family: var(--font-mono);
            font-size: var(--text-xs);
            color: var(--text-muted);
          }
          .spt-stage__text {
            font-size: var(--text-md);
            line-height: 1.7;
            color: var(--text);
            max-width: 72ch;
          }

          .spt-connector {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            padding: var(--space-3) 0;
            font-family: var(--font-mono);
            font-size: var(--text-xs);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--text-muted);
          }
          .spt-connector__line {
            width: 1px;
            height: var(--space-5);
            background: var(--border-strong);
          }
          .spt-connector__arrow {
            color: var(--accent);
            font-size: var(--text-sm);
            line-height: 1;
          }

          /* Mode framing + self-check (Mode 2) */
          .spt-mode {
            margin-top: var(--space-20);
            padding-top: var(--space-12);
            border-top: 1px solid var(--border);
          }
          .spt-mode + .spt-example {
            margin-top: var(--space-10);
            padding-top: 0;
            border-top: 0;
          }
          .spt-mode__eyebrow { margin-bottom: var(--space-4); }
          .spt-mode__heading { margin-bottom: var(--space-6); max-width: 28ch; }
          .spt-mode__lead {
            font-size: var(--text-md);
            line-height: 1.75;
            color: var(--text-muted);
            max-width: 66ch;
          }

          .spt-check {
            display: flex;
            flex-direction: column;
            gap: var(--space-12);
            margin-top: var(--space-12);
          }
          .spt-check__dim {
            padding-top: var(--space-10);
            border-top: 1px solid var(--border);
          }
          .spt-check__dim:first-child { padding-top: 0; border-top: 0; }
          .spt-check__eyebrow { margin-bottom: var(--space-3); }
          .spt-check__question {
            font-size: var(--text-lg);
            line-height: 1.6;
            color: var(--text);
            max-width: 64ch;
            margin-bottom: var(--space-5);
          }

          .spt-disclosure {
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--surface);
          }
          .spt-disclosure__summary {
            cursor: pointer;
            list-style: none;
            display: flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-4) var(--space-5);
            font-family: var(--font-mono);
            font-size: var(--text-xs);
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--text-muted);
            transition: color var(--t-fast) var(--ease);
          }
          .spt-disclosure__summary::-webkit-details-marker { display: none; }
          .spt-disclosure__summary::before {
            content: '+';
            color: var(--accent);
            font-weight: 600;
          }
          .spt-disclosure[open] .spt-disclosure__summary::before {
            content: '\\2212';
          }
          .spt-disclosure__summary:hover { color: var(--text); }
          .spt-disclosure__body {
            padding: var(--space-6) var(--space-5) var(--space-5);
            border-top: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: var(--space-10);
          }
          .spt-disclosure__body .spt-chain {
            padding-top: 0;
            border-top: 0;
          }
          .spt-linked__from {
            font-family: var(--font-mono);
            font-size: var(--text-xs);
            color: var(--text-muted);
            margin-bottom: var(--space-3);
          }

          .spt-check__closer {
            margin-top: var(--space-16);
            padding-top: var(--space-12);
            border-top: 1px solid var(--border);
            font-size: var(--text-md);
            line-height: 1.75;
            color: var(--text-muted);
            max-width: 66ch;
          }
        `}</style>

        <Link href="/" className="tool-page__back">back to the workshop</Link>
        <header className="tool-page__header">
          <p className="eyebrow tool-page__eyebrow">
            {'// '}{tool.category} · cargo/{tool.number}
          </p>
          <h1 className="tool-page__title">{tool.title}</h1>
          <p className="tool-page__desc">
            One hard skill: spotting what is missing from a feature spec before
            you hand it to an AI coding agent.
          </p>
        </header>

        <section className="spt-intro">
          <p className="spt-prose">
            <strong>
              Most AI coding failures are not model failures. They are
              under-specified handoffs.
            </strong>{' '}
            The agent is handed a spec with gaps in it, fills those gaps to keep
            moving, and fills them with the most common pattern rather than the
            one you meant. The code looks right. It runs. The wrong decision is
            buried inside it.
          </p>
          <p className="spt-prose">
            So the skill that matters is not prompting. It is reading your own
            spec and seeing the holes before the agent does. This tool teaches
            that one skill, by pressure-testing a real spec until every gap is
            visible.
          </p>
          <p className="spt-prose">
            The unit is a causal chain: <strong>the gap</strong> you left leads
            to <strong>the assumption</strong> the agent makes leads to{' '}
            <strong>the consequence</strong> that ships. A checklist scolds. A
            chain teaches, because you watch the gap become the failure.
          </p>
          <p className="spt-prose">
            This tool has two modes. The <strong>worked examples</strong> teach
            the habit on four real specs. The <strong>self-check</strong>, at
            the end, is where you turn it on your own.
          </p>
        </section>

        <section className="spt-mode" data-testid="spt-mode-examples">
          <p className="eyebrow spt-mode__eyebrow">
            {'// mode 01 · worked examples'}
          </p>
          <h2 className="heading heading--lg spt-mode__heading">
            Watch four specs break
          </h2>
          <p className="spt-mode__lead">
            Four real, deliberately under-specified specs. Each looks
            reasonable. For each of the eight dimensions, the gap it left, the
            assumption that fills it, and the concrete failure that ships.
          </p>
        </section>

        {workedExamples.map((example) => (
          <WorkedExample key={example.id} example={example} />
        ))}

        <SelfCheck />
      </div>
    </main>
  );
}
