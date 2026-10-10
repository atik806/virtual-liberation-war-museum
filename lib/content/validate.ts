import { events } from "@/content/events";
import { exhibits, galleries } from "@/content/galleries";
import { people } from "@/content/people";
import { places, sectors } from "@/content/places";
import { sources } from "@/content/sources";
import { stories } from "@/content/stories";
import {
  eventSchema,
  exhibitSchema,
  gallerySchema,
  personSchema,
  placeSchema,
  sectorSchema,
  sourceSchema,
  storySchema,
} from "@/types/content";

/**
 * Validates every content file against its schema and checks that every
 * cross-reference resolves. Returns a list of human-readable problems.
 * Runs as part of `npm test` and before every `npm run build`.
 */
export function validateContent(): string[] {
  const problems: string[] = [];

  const check = <T>(
    label: string,
    list: T[],
    schema: { safeParse: (v: unknown) => { success: boolean; error?: { message: string } } },
  ) => {
    list.forEach((item, i) => {
      const result = schema.safeParse(item);
      if (!result.success) problems.push(`${label}[${i}]: ${result.error?.message}`);
    });
  };

  check("sources", sources, sourceSchema);
  check("places", places, placeSchema);
  check("sectors", sectors, sectorSchema);
  check("people", people, personSchema);
  check("events", events, eventSchema);
  check("galleries", galleries, gallerySchema);
  check("exhibits", exhibits, exhibitSchema);
  check("stories", stories, storySchema);

  const ids = {
    source: new Set(sources.map((s) => s.id)),
    place: new Set(places.map((p) => p.id)),
    person: new Set(people.map((p) => p.id)),
    event: new Set(events.map((e) => e.id)),
    gallery: new Set(galleries.map((g) => g.id)),
  };

  const unique = (label: string, list: { id: string }[]) => {
    const seen = new Set<string>();
    for (const { id } of list) {
      if (seen.has(id)) problems.push(`${label}: duplicate id "${id}"`);
      seen.add(id);
    }
  };
  unique("sources", sources);
  unique("places", places);
  unique("people", people);
  unique("events", events);
  unique("galleries", galleries);
  unique("exhibits", exhibits);
  unique("stories", stories);

  const ref = (owner: string, kind: keyof typeof ids, refs: string[] = []) => {
    for (const r of refs) {
      if (!ids[kind].has(r)) problems.push(`${owner}: unknown ${kind} "${r}"`);
    }
  };

  for (const p of people) ref(`person ${p.id}`, "source", p.sourceIds);
  for (const e of events) {
    ref(`event ${e.id}`, "source", e.sourceIds);
    ref(`event ${e.id}`, "place", e.placeIds);
    ref(`event ${e.id}`, "person", e.personIds);
  }
  for (const x of exhibits) {
    ref(`exhibit ${x.id}`, "source", x.sourceIds);
    ref(`exhibit ${x.id}`, "event", x.eventIds);
    ref(`exhibit ${x.id}`, "gallery", [x.galleryId]);
  }
  for (const s of stories) {
    ref(`story ${s.id}`, "source", s.sourceIds);
    s.sections.forEach((sec, i) => {
      if (sec.placeId) ref(`story ${s.id} §${i}`, "place", [sec.placeId]);
      if (sec.eventId) ref(`story ${s.id} §${i}`, "event", [sec.eventId]);
    });
  }

  // Two exhibits cannot hang on the same wall slot.
  const slots = new Set<string>();
  for (const x of exhibits) {
    const key = `${x.galleryId}:${x.slot}`;
    if (slots.has(key)) problems.push(`exhibit ${x.id}: slot ${key} already taken`);
    slots.add(key);
  }

  // Events must be chronological (the timeline relies on it).
  for (let i = 1; i < events.length; i++) {
    if (events[i].date < events[i - 1].date) {
      problems.push(`events out of order at "${events[i].id}"`);
    }
  }

  // Placeholder markers must never ship.
  const all = JSON.stringify({ sources, places, people, events, galleries, exhibits, stories });
  if (all.includes("[[PLACEHOLDER")) problems.push("content contains [[PLACEHOLDER]] markers");

  return problems;
}
