import { z } from "zod";

/** Every user-facing string exists in Bangla (primary) and English. */
export const l10n = z.object({ bn: z.string().min(1), en: z.string().min(1) });
export type L10n = z.infer<typeof l10n>;

export const datePrecision = z.enum(["day", "month", "year", "approx"]);
export type DatePrecision = z.infer<typeof datePrecision>;

export const eventCategory = z.enum([
  "political",
  "military",
  "human-cost",
  "international",
  "refugees",
  "culture",
]);
export type EventCategory = z.infer<typeof eventCategory>;

/** Illustration motifs drawn by lib/art.ts. Placeholders for real archival media. */
export const motif = z.enum([
  "shaheed-minar",
  "microphone",
  "radio",
  "letter",
  "map",
  "flame",
  "boat",
  "crowd",
  "newspaper",
  "flag",
  "path",
  "book",
  "cyclone",
  "ballot",
  "candle",
  "music",
]);
export type Motif = z.infer<typeof motif>;

const id = z.string().regex(/^[a-z0-9-]+$/, "ids are kebab-case");

export const sourceSchema = z.object({
  id,
  title: z.string(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().int().optional(),
  url: z.string().url().optional(),
  note: l10n.optional(),
});
export type Source = z.infer<typeof sourceSchema>;

export const placeSchema = z.object({
  id,
  name: l10n,
  /** [longitude, latitude] */
  coords: z.tuple([z.number(), z.number()]),
  /** Outside present-day Bangladesh (refugee camps, etc). */
  abroad: z.boolean().optional(),
  /** Sits right next to a larger place; label only shown when selected. */
  minor: z.boolean().optional(),
});
export type Place = z.infer<typeof placeSchema>;

export const sectorSchema = z.object({
  number: z.number().int().min(1).max(11),
  area: l10n,
  /** Approximate label anchor, not a boundary. */
  anchor: z.tuple([z.number(), z.number()]),
});
export type Sector = z.infer<typeof sectorSchema>;

export const personSchema = z.object({
  id,
  name: l10n,
  role: l10n,
  honour: z.enum(["bir-sreshtho", "leader"]),
  bio: l10n,
  sourceIds: z.array(id).min(1),
  demo: z.boolean().optional(),
});
export type Person = z.infer<typeof personSchema>;

export const eventSchema = z.object({
  id,
  date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
  precision: datePrecision,
  category: eventCategory,
  title: l10n,
  summary: l10n,
  placeIds: z.array(id),
  personIds: z.array(id).default([]),
  sourceIds: z.array(id).min(1),
  sensitive: z.boolean().optional(),
  demo: z.boolean().optional(),
});
export type TimelineEvent = z.infer<typeof eventSchema>;

export const gallerySchema = z.object({
  id,
  order: z.number().int(),
  title: l10n,
  period: l10n,
  intro: l10n,
  /** Wall tint in the 3D museum and accent in 2D. */
  tone: z.string().regex(/^#[0-9a-f]{6}$/i),
  sensitive: z.boolean().optional(),
});
export type Gallery = z.infer<typeof gallerySchema>;

export const exhibitSchema = z.object({
  id,
  galleryId: id,
  /** Wall slot 0-3 inside the gallery room (0/1 left wall, 2/3 right wall). */
  slot: z.number().int().min(0).max(3),
  kind: z.enum(["photo", "artefact", "document", "audio", "map"]),
  motif,
  title: l10n,
  caption: l10n,
  body: l10n,
  eventIds: z.array(id),
  sourceIds: z.array(id).min(1),
  sensitive: z.boolean().optional(),
  demo: z.boolean().optional(),
});
export type Exhibit = z.infer<typeof exhibitSchema>;

export const storySectionSchema = z.object({
  heading: l10n,
  body: l10n,
  placeId: id.optional(),
  eventId: id.optional(),
  motif,
});

export const storySchema = z.object({
  id,
  title: l10n,
  dek: l10n,
  type: z.enum(["refugee", "family", "fighter", "witness"]),
  readingMinutes: z.number().int().positive(),
  contentWarning: l10n.optional(),
  sections: z.array(storySectionSchema).min(1),
  sourceIds: z.array(id).min(1),
  /** Fictional composite written for the demo. Never presented as testimony. */
  fictional: z.boolean(),
});
export type Story = z.infer<typeof storySchema>;
export type StorySection = z.infer<typeof storySectionSchema>;
