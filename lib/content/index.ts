import { events } from "@/content/events";
import { exhibits, galleries } from "@/content/galleries";
import { people } from "@/content/people";
import { places, sectors } from "@/content/places";
import { sources } from "@/content/sources";
import { stories } from "@/content/stories";
import type { L10n } from "@/types/content";
import type { AppLocale } from "@/i18n/routing";

/**
 * The only way components read content. Swap these bodies for API/CMS calls
 * later without touching the UI.
 */

export const tr = (value: L10n, locale: AppLocale) => value[locale];

const byId = <T extends { id: string }>(list: T[]) =>
  new Map(list.map((item) => [item.id, item]));

const sourceMap = byId(sources);
const placeMap = byId(places);
const personMap = byId(people);
const eventMap = byId(events);
const galleryMap = byId(galleries);
const exhibitMap = byId(exhibits);
const storyMap = byId(stories);

export const getSources = () => sources;
export const getSourcesByIds = (ids: string[]) =>
  ids.flatMap((id) => sourceMap.get(id) ?? []);

export const getPlaces = () => places;
export const getPlace = (id: string) => placeMap.get(id);
export const getSectors = () => sectors;

export const getPeople = () => people;
export const getPeopleByIds = (ids: string[]) =>
  ids.flatMap((id) => personMap.get(id) ?? []);

export const getEvents = () => events;
export const getEvent = (id: string) => eventMap.get(id);
export const getEventsByIds = (ids: string[]) =>
  ids.flatMap((id) => eventMap.get(id) ?? []);

export const getGalleries = () =>
  [...galleries].sort((a, b) => a.order - b.order);
export const getGallery = (id: string) => galleryMap.get(id);

export const getExhibits = () => exhibits;
export const getExhibit = (id: string) => exhibitMap.get(id);
export const getExhibitsForGallery = (galleryId: string) =>
  exhibits
    .filter((e) => e.galleryId === galleryId)
    .sort((a, b) => a.slot - b.slot);
export const getExhibitsForEvent = (eventId: string) =>
  exhibits.filter((e) => e.eventIds.includes(eventId));

export const getStories = () => stories;
export const getStory = (id: string) => storyMap.get(id);
export const getStoriesForEvent = (eventId: string) =>
  stories.filter((s) => s.sections.some((sec) => sec.eventId === eventId));
