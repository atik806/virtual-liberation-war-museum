import { artDataUrl } from "@/lib/art";
import type { Motif } from "@/types/content";

/** Symbolic illustration standing in for archival media. Always labelled. */
export function ExhibitArt({
  motif,
  tone,
  label,
  alt,
  className = "",
  priority = false,
}: {
  motif: Motif;
  tone: string;
  label: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`relative overflow-hidden rounded-xl bg-ink-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL, nothing to optimise */}
      <img
        src={artDataUrl(motif, tone)}
        alt={alt}
        width={400}
        height={300}
        loading={priority ? "eager" : "lazy"}
        className="aspect-[4/3] h-auto w-full object-cover"
      />
      <span className="absolute right-2 bottom-2 rounded-full bg-ink/75 px-2 py-0.5 text-[11px] tracking-wide text-paper-dim">
        {label}
      </span>
    </figure>
  );
}
