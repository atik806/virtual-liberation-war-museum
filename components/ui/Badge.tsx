import type { ReactNode } from "react";

const tones = {
  neutral: "border-line text-paper-dim",
  demo: "border-flame/40 text-flame",
  warn: "border-red/50 text-red",
  green: "border-green-bright/50 text-green-bright",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: keyof typeof tones }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}
