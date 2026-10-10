import type { Story } from "@/types/content";

/**
 * Both stories are fictional composites written for the demo, set against real
 * events. They must be replaced by (or clearly kept apart from) real, consented
 * testimony before launch.
 */
export const stories: Story[] = [
  {
    id: "across-the-river",
    title: { bn: "নদীর ওপারে", en: "Across the River" },
    dek: {
      bn: "যশোরের এক পরিবারের শরণার্থী শিবিরে যাওয়া আর ঘরে ফেরার গল্প।",
      en: "A family from Jashore leaves for a refugee camp — and, one December, comes home.",
    },
    type: "refugee",
    readingMinutes: 4,
    contentWarning: {
      bn: "এই গল্পে সহিংসতা ও মৃত্যুর উল্লেখ আছে।",
      en: "This story mentions violence and death.",
    },
    fictional: true,
    sourceIds: ["demo-illustration", "raghavan"],
    sections: [
      {
        heading: { bn: "এপ্রিল, যশোর", en: "April, Jashore" },
        body: {
          bn: "রাতে গ্রামের ওপারে আগুন দেখা যায়। মা চালের পোঁটলা বাঁধেন, বাবা ছোট্ট রেডিওটা কাপড়ে মুড়ে নেন। দাদি বলেন, ভিটে ছেড়ে কোথাও যাবেন না — শেষ পর্যন্ত তাঁকেও কোলে করে নিতে হয়।",
          en: "At night, fires glow beyond the village. Mother ties up a bundle of rice; Father wraps the small radio in cloth. Grandmother says she will not leave the homestead — in the end, she has to be carried.",
        },
        placeId: "jashore",
        eventId: "operation-searchlight",
        motif: "radio",
      },
      {
        heading: { bn: "সীমান্তের পথ", en: "The road to the border" },
        body: {
          bn: "তিন দিন হাঁটা। দিনে বাঁশঝাড়ে লুকিয়ে থাকা, রাতে ধানক্ষেতের আল ধরে চলা। আরও হাজারো মানুষ একই পথে — কারও কাঁধে শিশু, কারও হাতে শুধু একটা ঘটি।",
          en: "Three days on foot. Hiding in bamboo groves by day, walking the paddy ridges by night. Thousands more on the same road — some carrying children, some carrying only a water pot.",
        },
        eventId: "refugee-exodus",
        motif: "path",
      },
      {
        heading: { bn: "শিবিরের বর্ষা", en: "Monsoon in the camp" },
        body: {
          bn: "কলকাতার কাছে শিবিরে পলিথিনের ছাউনি বৃষ্টিতে ভেসে যায়। কলেরা ছড়িয়ে পড়ে। ছোট বোনটা আর ভালো হয় না। সেদিন রাতে বাবা রেডিওতে স্বাধীন বাংলা বেতারের গান চালিয়ে দেন, কেউ কোনো কথা বলে না।",
          en: "Near Kolkata, the plastic roofs of the camp give way to the rain. Cholera spreads. The youngest sister does not recover. That night Father turns on the radio to the songs of Swadhin Bangla Betar, and no one speaks.",
        },
        placeId: "kolkata",
        eventId: "refugee-exodus",
        motif: "boat",
      },
      {
        heading: { bn: "ডিসেম্বর, ঘরে ফেরা", en: "December, coming home" },
        body: {
          bn: "বিজয়ের খবর আসে রেডিওতে। ফেরার পথে একই ধানক্ষেত, একই নদী — কিন্তু এবার মাথা উঁচু করে হাঁটা। বাড়িটা পুড়ে গেছে, তবু উঠোনের আমগাছটা দাঁড়িয়ে আছে।",
          en: "News of victory comes over the radio. The same paddy fields and the same river on the way back — but this time they walk with their heads high. The house has burned, yet the mango tree in the courtyard still stands.",
        },
        placeId: "jashore",
        eventId: "victory-day",
        motif: "flag",
      },
    ],
  },
  {
    id: "beside-the-radio",
    title: { bn: "রেডিওর পাশে", en: "Beside the Radio" },
    dek: {
      bn: "অবরুদ্ধ ঢাকায় এক কিশোরী গোপনে বেতার শোনে, আর অপেক্ষা করে যুদ্ধে যাওয়া ভাইয়ের জন্য।",
      en: "In occupied Dhaka, a teenage girl listens secretly to a forbidden radio and waits for the brother who went to war.",
    },
    type: "family",
    readingMinutes: 4,
    fictional: true,
    sourceIds: ["demo-illustration", "banglapedia"],
    sections: [
      {
        heading: { bn: "৭ মার্চ", en: "7 March" },
        body: {
          bn: "ভাইয়া তাকে কাঁধে তুলে রেসকোর্সের ভিড়ের ওপর দিয়ে মঞ্চটা দেখায়। ভাষণ শেষে চারদিক থেকে স্লোগান ওঠে। বাড়ি ফিরে ভাইয়া অনেক রাত পর্যন্ত জেগে থাকে।",
          en: "Her brother lifts her onto his shoulders so she can see the stage over the Racecourse crowd. When the speech ends, slogans rise all around. That night he stays awake until very late.",
        },
        placeId: "racecourse",
        eventId: "march-7-speech",
        motif: "microphone",
      },
      {
        heading: { bn: "একটি চিরকুট", en: "A note" },
        body: {
          bn: "মে মাসের এক সকালে ভাইয়ার বিছানা খালি। বালিশের নিচে একটা চিরকুট: “মাকে বলিস, দেশ স্বাধীন করে ফিরব।”",
          en: "One morning in May, her brother's bed is empty. Under the pillow is a note: “Tell Mother I will come back when the country is free.”",
        },
        placeId: "dhaka",
        motif: "letter",
      },
      {
        heading: { bn: "নিষিদ্ধ বেতার", en: "The forbidden radio" },
        body: {
          bn: "প্রতি সন্ধ্যায় জানালা বন্ধ করে, আওয়াজ কমিয়ে, পুরো পরিবার স্বাধীন বাংলা বেতার শোনে। প্রতিটা গেরিলা অভিযানের খবরে সে ভাবে, ভাইয়া কি ওখানে ছিল?",
          en: "Every evening, windows shut and volume low, the family listens to Swadhin Bangla Betar. With every report of a guerrilla raid she wonders: was he there?",
        },
        placeId: "dhaka",
        eventId: "kalurghat-broadcast",
        motif: "radio",
      },
      {
        heading: { bn: "১৬ ডিসেম্বর", en: "16 December" },
        body: {
          bn: "রাস্তায় মানুষের ঢল, হাতে হাতে লাল-সবুজ পতাকা। সন্ধ্যায় দরজায় কড়া নাড়ে কেউ — রোগা, ধুলোমাখা, কিন্তু হাসিটা চেনা।",
          en: "The streets fill with people and red-and-green flags. In the evening someone knocks at the door — thin, covered in dust, but with a smile she knows.",
        },
        placeId: "racecourse",
        eventId: "victory-day",
        motif: "flag",
      },
    ],
  },
];
