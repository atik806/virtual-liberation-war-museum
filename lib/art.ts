import type { Motif } from "@/types/content";

/**
 * Symbolic illustrations used in place of archival media in the demo. They are
 * deliberately abstract: no faces, no depictions of violence, nothing that
 * could be mistaken for a historical photograph.
 *
 * Returns standalone SVG markup (4:3) so the same art renders in the DOM and
 * on canvas textures in the 3D museum.
 */

const PAPER = "#efe6d4";
const INK = "#1b1916";
const RED = "#c8323f";
const GREEN = "#1f6b50";

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (shift: number) => {
    const v = (n >> shift) & 255;
    const out = amount < 0 ? v * (1 + amount) : v + (255 - v) * amount;
    return Math.round(out).toString(16).padStart(2, "0");
  };
  return `#${ch(16)}${ch(8)}${ch(0)}`;
}

const lines = (x: number, y: number, w: number, count: number, gap: number, color: string, op = 0.5) =>
  Array.from({ length: count }, (_, i) => {
    const len = i % 3 === 2 ? w * 0.7 : w;
    return `<rect x="${x}" y="${y + i * gap}" width="${len}" height="3" rx="1.5" fill="${color}" opacity="${op}"/>`;
  }).join("");

const motifs: Record<Motif, (tone: string) => string> = {
  "shaheed-minar": () => `
    <circle cx="200" cy="140" r="64" fill="${RED}" opacity="0.9"/>
    <g fill="${PAPER}">
      <rect x="168" y="96" width="14" height="140"/><rect x="190" y="84" width="20" height="152"/><rect x="218" y="96" width="14" height="140"/>
      <rect x="140" y="128" width="12" height="108"/><rect x="248" y="128" width="12" height="108"/>
      <path d="M186 84 h28 l-6 -14 h-16z"/>
    </g>
    <rect x="100" y="236" width="200" height="10" fill="${PAPER}" opacity="0.8"/>`,
  microphone: () => `
    <g fill="none" stroke="${PAPER}" stroke-width="5" stroke-linecap="round" opacity="0.8">
      <path d="M130 110 q-24 40 0 80"/><path d="M110 92 q-40 58 0 116"/>
      <path d="M270 110 q24 40 0 80"/><path d="M290 92 q40 58 0 116"/>
    </g>
    <rect x="178" y="80" width="44" height="86" rx="22" fill="${PAPER}"/>
    <g stroke="${INK}" stroke-width="2" opacity="0.4">${[96, 108, 120, 132, 144].map((y) => `<line x1="182" x2="218" y1="${y}" y2="${y}"/>`).join("")}</g>
    <path d="M166 150 q34 46 68 0" fill="none" stroke="${PAPER}" stroke-width="6"/>
    <rect x="196" y="186" width="8" height="40" fill="${PAPER}"/><rect x="164" y="226" width="72" height="10" rx="5" fill="${PAPER}"/>`,
  radio: () => `
    <rect x="96" y="98" width="208" height="128" rx="14" fill="${PAPER}"/>
    <rect x="112" y="114" width="104" height="96" rx="8" fill="${INK}" opacity="0.15"/>
    <g fill="${INK}" opacity="0.45">${Array.from({ length: 6 }, (_, i) => `<rect x="120" y="${122 + i * 14}" width="88" height="5" rx="2"/>`).join("")}</g>
    <circle cx="258" cy="140" r="22" fill="${RED}"/><circle cx="258" cy="140" r="6" fill="${PAPER}"/>
    <rect x="232" y="182" width="52" height="10" rx="5" fill="${INK}" opacity="0.3"/>
    <line x1="140" y1="98" x2="112" y2="52" stroke="${PAPER}" stroke-width="4"/>
    <g fill="none" stroke="${PAPER}" stroke-width="3" opacity="0.6"><path d="M98 46 q14 -14 28 0"/><path d="M88 36 q24 -24 48 0"/></g>`,
  letter: () => `
    <g transform="rotate(-6 200 150)">
      <rect x="104" y="84" width="192" height="132" rx="4" fill="${PAPER}"/>
      ${lines(124, 108, 150, 7, 15, INK, 0.35)}
    </g>
    <path d="M250 196 l26 -10 l-4 26z" fill="${RED}" opacity="0.85"/>`,
  map: (tone) => `
    <path d="M150 52 l40 6 l22 30 l40 -4 l10 34 l-16 30 l28 40 l-14 36 l-40 14 l-36 -12 l-30 16 l-26 -40 l10 -34 l-24 -30 l14 -46z" fill="${shade(tone, 0.35)}" stroke="${PAPER}" stroke-width="3"/>
    <g stroke="${PAPER}" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.7" fill="none"><path d="M150 120 l90 10"/><path d="M180 70 l20 160"/><path d="M130 190 l120 -30"/></g>
    <g fill="${RED}">${[[176, 112], [214, 150], [160, 176], [236, 96], [204, 214]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`).join("")}</g>`,
  flame: () => `
    <ellipse cx="200" cy="246" rx="70" ry="10" fill="${INK}" opacity="0.4"/>
    <rect x="166" y="196" width="68" height="50" rx="4" fill="${PAPER}" opacity="0.9"/>
    <path d="M200 60 C240 110 250 140 236 170 C226 192 174 192 164 170 C150 140 168 112 200 60z" fill="#f2a33a"/>
    <path d="M200 104 C222 134 226 154 216 172 C208 186 192 186 184 172 C176 154 182 134 200 104z" fill="#fbe3a0"/>`,
  boat: (tone) => `
    <circle cx="300" cy="70" r="24" fill="${PAPER}" opacity="0.5"/>
    <path d="M100 176 q100 34 200 0 l-22 26 h-156z" fill="${INK}" opacity="0.75"/>
    <path d="M196 70 v104" stroke="${PAPER}" stroke-width="4"/>
    <path d="M200 74 q56 40 0 94z" fill="${PAPER}" opacity="0.9"/>
    <g fill="none" stroke="${shade(tone, 0.45)}" stroke-width="4">${[214, 230, 246].map((y) => `<path d="M40 ${y} q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/>`).join("")}</g>`,
  crowd: () => {
    const heads: string[] = [];
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 12; i++) {
        const x = 30 + i * 30 + (row % 2) * 15;
        const y = 140 + row * 30;
        const op = 0.45 + row * 0.15;
        heads.push(`<circle cx="${x}" cy="${y}" r="10" fill="${PAPER}" opacity="${op}"/><rect x="${x - 13}" y="${y + 10}" width="26" height="22" rx="10" fill="${PAPER}" opacity="${op}"/>`);
      }
    }
    return `<circle cx="200" cy="74" r="36" fill="${RED}" opacity="0.85"/>${heads.join("")}`;
  },
  newspaper: () => `
    <rect x="86" y="50" width="228" height="200" fill="${PAPER}"/>
    <rect x="104" y="66" width="192" height="24" fill="${INK}" opacity="0.85"/>
    <rect x="104" y="100" width="192" height="3" fill="${INK}" opacity="0.6"/>
    ${lines(104, 116, 56, 8, 14, INK, 0.35)}${lines(172, 116, 56, 8, 14, INK, 0.35)}
    <rect x="240" y="116" width="56" height="64" fill="${INK}" opacity="0.2"/>${lines(240, 192, 56, 3, 14, INK, 0.35)}`,
  flag: () => `
    <line x1="92" y1="40" x2="92" y2="262" stroke="${PAPER}" stroke-width="6"/>
    <rect x="95" y="52" width="210" height="126" fill="${GREEN}"/>
    <circle cx="189.5" cy="115" r="42" fill="${RED}"/>`,
  path: (tone) => `
    <path d="M40 260 C120 220 110 170 190 150 S300 110 360 40" fill="none" stroke="${shade(tone, 0.4)}" stroke-width="22" stroke-linecap="round"/>
    <g fill="${PAPER}">${[[86, 236], [138, 202], [190, 160], [244, 138], [292, 100], [334, 62]].map(([x, y], i) => `<g opacity="${0.5 + i * 0.08}"><circle cx="${x}" cy="${y - 22}" r="6"/><rect x="${x - 5}" y="${y - 15}" width="10" height="20" rx="4"/></g>`).join("")}</g>`,
  book: () => `
    <path d="M200 88 C170 72 128 70 96 80 V226 C128 216 170 218 200 234z" fill="${PAPER}"/>
    <path d="M200 88 C230 72 272 70 304 80 V226 C272 216 230 218 200 234z" fill="${PAPER}" opacity="0.85"/>
    ${lines(112, 100, 70, 7, 16, INK, 0.3)}${lines(216, 100, 70, 7, 16, INK, 0.3)}
    <path d="M200 88 v146" stroke="${INK}" stroke-width="2" opacity="0.5"/>`,
  cyclone: () => `
    <g fill="none" stroke="${PAPER}" stroke-linecap="round" opacity="0.85">
      <path d="M200 150 m-10 0 a10 10 0 1 1 20 0 a30 30 0 1 1 -60 0 a50 50 0 1 1 100 0 a70 70 0 1 1 -140 0" stroke-width="7"/>
    </g>`,
  ballot: () => `
    <rect x="124" y="120" width="152" height="118" rx="6" fill="${PAPER}"/>
    <rect x="164" y="132" width="72" height="8" rx="4" fill="${INK}" opacity="0.6"/>
    <g transform="rotate(-8 200 90)"><rect x="168" y="44" width="64" height="88" fill="${PAPER}" opacity="0.92"/>${lines(178, 60, 44, 4, 14, INK, 0.35)}<path d="M186 110 l8 8 l16 -18" fill="none" stroke="${GREEN}" stroke-width="5"/></g>`,
  candle: () => `
    ${[120, 170, 230, 280].map((x, i) => {
      const h = [70, 96, 84, 60][i];
      return `<rect x="${x - 10}" y="${240 - h}" width="20" height="${h}" rx="3" fill="${PAPER}"/><path d="M${x} ${222 - h} c10 12 8 20 0 22 c-8 -2 -10 -10 0 -22z" fill="#f2a33a"/>`;
    }).join("")}
    <rect x="80" y="240" width="240" height="8" rx="4" fill="${PAPER}" opacity="0.5"/>`,
  music: () => `
    <g fill="${PAPER}">
      <ellipse cx="150" cy="214" rx="24" ry="17"/><ellipse cx="256" cy="194" rx="24" ry="17"/>
      <rect x="168" y="80" width="8" height="134"/><rect x="274" y="60" width="8" height="134"/>
      <path d="M168 80 L282 60 V88 L168 108z"/>
    </g>
    <circle cx="96" cy="84" r="20" fill="${RED}" opacity="0.8"/>`,
};

export function artSvg(motif: Motif, tone: string): string {
  const bgTop = shade(tone, 0.12);
  const bgBottom = shade(tone, -0.45);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bgTop}"/><stop offset="1" stop-color="${bgBottom}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/>${motifs[motif](tone)}<rect width="400" height="300" fill="none" stroke="${PAPER}" stroke-opacity="0.15" stroke-width="8"/></svg>`;
}

export const artDataUrl = (motif: Motif, tone: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(artSvg(motif, tone))}`;
