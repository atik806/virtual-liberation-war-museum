import type { Place, Sector } from "@/types/content";

export const places: Place[] = [
  { id: "dhaka", name: { bn: "ঢাকা", en: "Dhaka" }, coords: [90.4125, 23.8103] },
  { id: "racecourse", name: { bn: "রেসকোর্স ময়দান (সোহরাওয়ার্দী উদ্যান)", en: "Racecourse Maidan (Suhrawardy Udyan)" }, coords: [90.399, 23.735], minor: true },
  { id: "rayerbazar", name: { bn: "রায়েরবাজার", en: "Rayerbazar" }, coords: [90.359, 23.747], minor: true },
  { id: "chattogram", name: { bn: "চট্টগ্রাম", en: "Chattogram" }, coords: [91.8317, 22.3569] },
  { id: "kalurghat", name: { bn: "কালুরঘাট", en: "Kalurghat" }, coords: [91.864, 22.4], minor: true },
  { id: "mujibnagar", name: { bn: "মুজিবনগর (বৈদ্যনাথতলা, মেহেরপুর)", en: "Mujibnagar (Baidyanathtala, Meherpur)" }, coords: [88.61, 23.64] },
  { id: "jashore", name: { bn: "যশোর", en: "Jashore" }, coords: [89.213, 23.166] },
  { id: "khulna", name: { bn: "খুলনা", en: "Khulna" }, coords: [89.5403, 22.8456] },
  { id: "mongla", name: { bn: "মোংলা", en: "Mongla" }, coords: [89.6, 22.48] },
  { id: "sylhet", name: { bn: "সিলেট", en: "Sylhet" }, coords: [91.8687, 24.8949] },
  { id: "rajshahi", name: { bn: "রাজশাহী", en: "Rajshahi" }, coords: [88.6042, 24.3745] },
  { id: "rangpur", name: { bn: "রংপুর", en: "Rangpur" }, coords: [89.2752, 25.7439] },
  { id: "mymensingh", name: { bn: "ময়মনসিংহ", en: "Mymensingh" }, coords: [90.4073, 24.7471] },
  { id: "cumilla", name: { bn: "কুমিল্লা", en: "Cumilla" }, coords: [91.1809, 23.4607] },
  { id: "bhola", name: { bn: "ভোলা", en: "Bhola" }, coords: [90.6482, 22.6859] },
  { id: "kolkata", name: { bn: "কলকাতা (শরণার্থী শিবির)", en: "Kolkata (refugee camps)" }, coords: [88.3639, 22.5726], abroad: true },
  { id: "agartala", name: { bn: "আগরতলা (শরণার্থী শিবির)", en: "Agartala (refugee camps)" }, coords: [91.2868, 23.8315], abroad: true },
  { id: "meghalaya", name: { bn: "মেঘালয় (শরণার্থী শিবির)", en: "Meghalaya (refugee camps)" }, coords: [91.0, 25.45], abroad: true },
];

/**
 * The 11 sectors of the Liberation War. Anchors are approximate label positions
 * for the demo map, not boundaries. Sector 10 had no land area (naval commandos).
 */
export const sectors: Sector[] = [
  { number: 1, area: { bn: "চট্টগ্রাম, পার্বত্য চট্টগ্রাম", en: "Chattogram, Chittagong Hill Tracts" }, anchor: [92.0, 22.75] },
  { number: 2, area: { bn: "ঢাকা, কুমিল্লা, ফরিদপুর, নোয়াখালীর অংশ", en: "Dhaka, Cumilla, Faridpur, part of Noakhali" }, anchor: [90.75, 23.3] },
  { number: 3, area: { bn: "সিলেটের দক্ষিণাঞ্চল, ব্রাহ্মণবাড়িয়া, ময়মনসিংহের অংশ", en: "South Sylhet, Brahmanbaria, part of Mymensingh" }, anchor: [91.35, 24.25] },
  { number: 4, area: { bn: "সিলেটের পূর্বাঞ্চল", en: "East Sylhet" }, anchor: [92.2, 24.6] },
  { number: 5, area: { bn: "সিলেটের উত্তরাঞ্চল", en: "North Sylhet" }, anchor: [91.55, 25.1] },
  { number: 6, area: { bn: "রংপুর, দিনাজপুরের অংশ", en: "Rangpur, part of Dinajpur" }, anchor: [89.05, 25.95] },
  { number: 7, area: { bn: "রাজশাহী, পাবনা, বগুড়া, দিনাজপুরের অংশ", en: "Rajshahi, Pabna, Bogura, part of Dinajpur" }, anchor: [88.95, 24.85] },
  { number: 8, area: { bn: "কুষ্টিয়া, যশোর, খুলনা ও ফরিদপুরের অংশ", en: "Kushtia, Jashore, parts of Khulna and Faridpur" }, anchor: [89.15, 23.5] },
  { number: 9, area: { bn: "বরিশাল, পটুয়াখালী, খুলনার অংশ", en: "Barishal, Patuakhali, part of Khulna" }, anchor: [90.1, 22.35] },
  { number: 10, area: { bn: "নৌ-কমান্ডো (নির্দিষ্ট ভূখণ্ড নেই)", en: "Naval commandos (no fixed territory)" }, anchor: [91.0, 21.85] },
  { number: 11, area: { bn: "ময়মনসিংহ, টাঙ্গাইল", en: "Mymensingh, Tangail" }, anchor: [90.15, 24.95] },
];
