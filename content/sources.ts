import type { Source } from "@/types/content";

/**
 * Reference works the demo content points to. Real publications, but the demo
 * texts have not been checked line-by-line against them — verify before launch.
 */
export const sources: Source[] = [
  {
    id: "lwm",
    title: "Liberation War Museum, Dhaka",
    publisher: "Muktijuddha Jadughar Trust",
    url: "https://www.liberationwarmuseumbd.org",
  },
  {
    id: "banglapedia",
    title: "Banglapedia: National Encyclopedia of Bangladesh",
    publisher: "Asiatic Society of Bangladesh",
    url: "https://en.banglapedia.org",
  },
  {
    id: "dalilpatra",
    title:
      "Bangladesher Swadhinata Juddha: Dalilpatra (History of Bangladesh War of Independence: Documents)",
    author: "Hasan Hafizur Rahman (ed.)",
    publisher: "Ministry of Information, Government of Bangladesh",
    year: 1982,
  },
  {
    id: "raghavan",
    title: "1971: A Global History of the Creation of Bangladesh",
    author: "Srinath Raghavan",
    publisher: "Harvard University Press",
    year: 2013,
  },
  {
    id: "bass",
    title: "The Blood Telegram: Nixon, Kissinger, and a Forgotten Genocide",
    author: "Gary J. Bass",
    publisher: "Alfred A. Knopf",
    year: 2013,
  },
  {
    id: "mascarenhas",
    title: "Genocide",
    author: "Anthony Mascarenhas",
    publisher: "The Sunday Times (London), 13 June 1971",
    year: 1971,
  },
  {
    id: "demo-illustration",
    title: "Demo illustrations and fictional composite stories",
    publisher: "Virtual Liberation War Museum (demo build)",
    note: {
      bn: "এই ডেমোর ছবিগুলো প্রতীকী অলংকরণ, আর্কাইভের ছবি নয়। গল্পগুলো কাল্পনিক সমন্বিত বিবরণ, কোনো ব্যক্তির সাক্ষ্য নয়।",
      en: "Images in this demo are symbolic illustrations, not archival photographs. Stories are fictional composites, not the testimony of any person.",
    },
  },
];
