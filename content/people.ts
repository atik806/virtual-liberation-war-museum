import type { Person } from "@/types/content";

const birSreshthoBio = {
  bn: "মরণোত্তর বীরশ্রেষ্ঠ খেতাবে ভূষিত — বাংলাদেশের সর্বোচ্চ সামরিক বীরত্বসূচক সম্মান। বিস্তারিত জীবনী যাচাইকৃত সূত্র থেকে যোগ করা হবে।",
  en: "Posthumously awarded the Bir Sreshtho, Bangladesh's highest gallantry award. A full biography will be added from verified sources.",
};

export const people: Person[] = [
  {
    id: "sheikh-mujibur-rahman",
    name: { bn: "বঙ্গবন্ধু শেখ মুজিবুর রহমান", en: "Bangabandhu Sheikh Mujibur Rahman" },
    role: { bn: "আওয়ামী লীগ সভাপতি; বাংলাদেশের প্রথম রাষ্ট্রপতি", en: "President of the Awami League; first President of Bangladesh" },
    honour: "leader",
    bio: {
      bn: "ছয় দফা কর্মসূচির প্রবক্তা। ৭ মার্চ ১৯৭১-এর ভাষণে স্বাধীনতার সংগ্রামের ডাক দেন। যুদ্ধের পুরো সময় পাকিস্তানে বন্দি ছিলেন; ১০ জানুয়ারি ১৯৭২ দেশে ফেরেন।",
      en: "Architect of the Six-Point Programme. His speech of 7 March 1971 called for the struggle for independence. Imprisoned in Pakistan throughout the war; returned home on 10 January 1972.",
    },
    sourceIds: ["banglapedia"],
  },
  {
    id: "tajuddin-ahmad",
    name: { bn: "তাজউদ্দীন আহমদ", en: "Tajuddin Ahmad" },
    role: { bn: "মুজিবনগর সরকারের প্রধানমন্ত্রী", en: "Prime Minister of the Mujibnagar Government" },
    honour: "leader",
    bio: {
      bn: "যুদ্ধকালীন প্রবাসী সরকারের নেতৃত্ব দেন এবং মুক্তিযুদ্ধের রাজনৈতিক ও কূটনৈতিক কাঠামো গড়ে তোলেন।",
      en: "Led the wartime government in exile and built the political and diplomatic framework of the Liberation War.",
    },
    sourceIds: ["banglapedia"],
  },
  {
    id: "mag-osmani",
    name: { bn: "এম. এ. জি. ওসমানী", en: "M. A. G. Osmani" },
    role: { bn: "মুক্তিবাহিনীর প্রধান সেনাপতি", en: "Commander-in-Chief of the Mukti Bahini" },
    honour: "leader",
    bio: {
      bn: "মুক্তিবাহিনীকে এগারোটি সেক্টরে সংগঠিত করে যুদ্ধ পরিচালনা করেন।",
      en: "Organised the Mukti Bahini into eleven sectors and directed the war effort.",
    },
    sourceIds: ["banglapedia"],
  },
  { id: "mohiuddin-jahangir", name: { bn: "ক্যাপ্টেন মহিউদ্দিন জাহাঙ্গীর", en: "Captain Mohiuddin Jahangir" }, role: { bn: "সেনাবাহিনী, ৭ নম্বর সেক্টর", en: "Army, Sector 7" }, honour: "bir-sreshtho", bio: birSreshthoBio, sourceIds: ["banglapedia"], demo: true },
  { id: "mostafa-kamal", name: { bn: "সিপাহী মোস্তফা কামাল", en: "Sepoy Mostafa Kamal" }, role: { bn: "ইস্ট বেঙ্গল রেজিমেন্ট", en: "East Bengal Regiment" }, honour: "bir-sreshtho", bio: birSreshthoBio, sourceIds: ["banglapedia"], demo: true },
  { id: "ruhul-amin", name: { bn: "ইঞ্জিনরুম আর্টিফিসার মোহাম্মদ রুহুল আমিন", en: "Engine Room Artificer Mohammad Ruhul Amin" }, role: { bn: "নৌবাহিনী", en: "Navy" }, honour: "bir-sreshtho", bio: birSreshthoBio, sourceIds: ["banglapedia"], demo: true },
  { id: "matiur-rahman", name: { bn: "ফ্লাইট লেফটেন্যান্ট মতিউর রহমান", en: "Flight Lieutenant Matiur Rahman" }, role: { bn: "বিমানবাহিনী", en: "Air Force" }, honour: "bir-sreshtho", bio: birSreshthoBio, sourceIds: ["banglapedia"], demo: true },
  { id: "munshi-abdur-rouf", name: { bn: "ল্যান্স নায়েক মুন্সি আব্দুর রউফ", en: "Lance Naik Munshi Abdur Rouf" }, role: { bn: "ইপিআর", en: "East Pakistan Rifles" }, honour: "bir-sreshtho", bio: birSreshthoBio, sourceIds: ["banglapedia"], demo: true },
  { id: "nur-mohammad-sheikh", name: { bn: "ল্যান্স নায়েক নূর মোহাম্মদ শেখ", en: "Lance Naik Nur Mohammad Sheikh" }, role: { bn: "ইপিআর", en: "East Pakistan Rifles" }, honour: "bir-sreshtho", bio: birSreshthoBio, sourceIds: ["banglapedia"], demo: true },
  { id: "hamidur-rahman", name: { bn: "সিপাহী হামিদুর রহমান", en: "Sepoy Hamidur Rahman" }, role: { bn: "ইস্ট বেঙ্গল রেজিমেন্ট", en: "East Bengal Regiment" }, honour: "bir-sreshtho", bio: birSreshthoBio, sourceIds: ["banglapedia"], demo: true },
];
