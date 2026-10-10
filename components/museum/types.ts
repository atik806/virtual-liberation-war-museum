import type { Motif } from "@/types/content";

/** Localised, serialisable view models handed from the server page to the museum. */

export interface MuseumGallery {
  id: string;
  index: number;
  title: string;
  period: string;
  intro: string;
  tone: string;
  sensitive: boolean;
}

export interface MuseumExhibit {
  id: string;
  galleryIndex: number;
  slot: number;
  kind: string;
  motif: Motif;
  title: string;
  caption: string;
  body: string;
  sensitive: boolean;
  demo: boolean;
  events: { id: string; title: string; dateLabel: string }[];
  sources: string[];
}
