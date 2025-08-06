import { db } from "./db";
import { languages } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if languages already exist
    const existingLanguages = await db.select().from(languages);
    
    if (existingLanguages.length === 0) {
      console.log("Seeding languages...");
      
      const languagesToSeed = [
        {
          code: "en",
          name: "English",
          nativeName: "English",
          flagEmoji: "🇺🇸",
          isActive: true
        },
        {
          code: "es",
          name: "Spanish", 
          nativeName: "Español",
          flagEmoji: "🇪🇸",
          isActive: true
        },
        {
          code: "fr",
          name: "French",
          nativeName: "Français", 
          flagEmoji: "🇫🇷",
          isActive: true
        },
        {
          code: "de",
          name: "German",
          nativeName: "Deutsch",
          flagEmoji: "🇩🇪", 
          isActive: true
        },
        {
          code: "zh",
          name: "Chinese",
          nativeName: "中文",
          flagEmoji: "🇨🇳",
          isActive: true
        },
        {
          code: "ru",
          name: "Russian", 
          nativeName: "Русский",
          flagEmoji: "🇷🇺",
          isActive: true
        }
      ];

      await db.insert(languages).values(languagesToSeed);
      console.log("Languages seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}