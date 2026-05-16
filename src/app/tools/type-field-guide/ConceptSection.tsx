import type { ReactNode } from 'react';

/**
 * The repeatable concept-section unit. Every concept in the guide is one of
 * these: a `//` eyebrow, a heading, a short stack of explanation, and one
 * interactive demo. Milestones 2 and 3 add the remaining five concepts by
 * rendering another <ConceptSection> with its own copy + demo — nothing here
 * needs to change to add a concept.
 *
 *   <ConceptSection eyebrow="line height" heading="Line height">
 *     <p className="tfg-prose">…</p>
 *     <p className="tfg-prose">…</p>
 *     <SomeDemo />
 *   </ConceptSection>
 *
 * Layout/prose classes (.tfg-*) live once in the guide page's <style> block.
 * This component is intentionally presentational and server-rendered; the
 * interactive demo passed as a child is its own client component.
 */
export function ConceptSection({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="tfg-concept">
      <p className="eyebrow tfg-concept__eyebrow">// {eyebrow}</p>
      <h2 className="heading heading--lg tfg-concept__heading">{heading}</h2>
      {children}
    </section>
  );
}
