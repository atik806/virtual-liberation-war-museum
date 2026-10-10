"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { artDataUrl } from "@/lib/art";
import type { Motif } from "@/types/content";

/** CSS font stacks from next/font, so canvas text matches the site (incl. Bangla). */
function fontStack(variable: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

let fontsReady: Promise<unknown> | null = null;
function whenFontsReady(): Promise<unknown> {
  if (!fontsReady) {
    const serif = fontStack("--font-serif-bn", "serif");
    const sans = fontStack("--font-sans-bn", "sans-serif");
    fontsReady = Promise.all([
      document.fonts.load(`600 40px ${serif}`, "অআ Aa"),
      document.fonts.load(`400 24px ${sans}`, "অআ Aa"),
    ]).catch(() => undefined);
  }
  return fontsReady;
}

function makeCanvasTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, ctx: canvas.getContext("2d")!, texture };
}

/** Wraps text into lines that fit maxWidth. Splits on spaces (works for Bangla too). */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  return lines;
}

type Bundle = ReturnType<typeof makeCanvasTexture>;

/** Paints an illustration; returns a cancel function for unmount/re-render. */
function paintArt(bundle: Bundle, motif: Motif, tone: string, sensitive: boolean, warningLabel: string) {
  const { ctx, canvas, texture } = bundle;
  let cancelled = false;
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  texture.needsUpdate = true;

  const img = new Image();
  img.onload = async () => {
    if (cancelled) return;
    if (sensitive) ctx.filter = "blur(18px) grayscale(0.6)";
    ctx.drawImage(img, -20, -20, canvas.width + 40, canvas.height + 40);
    ctx.filter = "none";
    if (sensitive) {
      await whenFontsReady();
      if (cancelled) return;
      ctx.fillStyle = "rgba(17,16,14,0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#efe6d4";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 30px ${fontStack("--font-sans-bn", "sans-serif")}`;
      ctx.fillText(warningLabel, canvas.width / 2, canvas.height / 2);
    }
    texture.needsUpdate = true;
  };
  img.src = artDataUrl(motif, tone);
  return () => {
    cancelled = true;
  };
}

/** Illustration texture. Sensitive exhibits are blurred and marked until opened in the panel. */
export function useArtTexture(motif: Motif, tone: string, sensitive: boolean, warningLabel: string) {
  const bundle = useMemo(() => makeCanvasTexture(512, 384), []);
  useEffect(() => paintArt(bundle, motif, tone, sensitive, warningLabel), [bundle, motif, tone, sensitive, warningLabel]);
  useEffect(() => () => bundle.texture.dispose(), [bundle]);
  return bundle.texture;
}

interface LabelStyle {
  width?: number;
  height?: number;
  background?: string;
  color?: string;
  titleSize?: number;
}

function paintLabel(bundle: Bundle, title: string, subtitle: string, style: Required<LabelStyle>) {
  const { ctx, canvas, texture } = bundle;
  const { background, color, titleSize } = style;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${titleSize}px ${fontStack("--font-serif-bn", "serif")}`;
  const lines = wrap(ctx, title, canvas.width - 48, 2);
  const lineH = titleSize * 1.25;
  const top = canvas.height / 2 - ((lines.length - 1) * lineH) / 2 - (subtitle ? 18 : 0);
  lines.forEach((l, i) => ctx.fillText(l, canvas.width / 2, top + i * lineH));
  if (subtitle) {
    ctx.globalAlpha = 0.7;
    ctx.font = `400 ${Math.round(titleSize * 0.55)}px ${fontStack("--font-sans-bn", "sans-serif")}`;
    ctx.fillText(subtitle, canvas.width / 2, top + lines.length * lineH + 4);
    ctx.globalAlpha = 1;
  }
  texture.needsUpdate = true;
}

/** Wall plaque / hanging sign with a title and a smaller second line. */
export function useLabelTexture(
  title: string,
  subtitle: string,
  { width = 640, height = 200, background = "#efe6d4", color = "#1b1916", titleSize = 44 }: LabelStyle = {},
) {
  const bundle = useMemo(() => makeCanvasTexture(width, height), [width, height]);

  useEffect(() => {
    let cancelled = false;
    const style = { width, height, background, color, titleSize };
    paintLabel(bundle, title, subtitle, style);
    // Repaint once web fonts (Bangla) are ready.
    whenFontsReady().then(() => !cancelled && paintLabel(bundle, title, subtitle, style));
    return () => {
      cancelled = true;
    };
  }, [bundle, title, subtitle, width, height, background, color, titleSize]);

  useEffect(() => () => bundle.texture.dispose(), [bundle]);
  return bundle.texture;
}
