import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="grain border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg text-paper-dim text-pretty">{lead}</p>}
        {children}
      </div>
    </header>
  );
}
