import { 
  users, 
  languages,
  vocabularyWords,
  grammarExercises,
  achievements,
  userAchievements,
  userVocabularyProgress,
  type User, 
  type InsertUser,
  type Language,
  type InsertLanguage,
  type VocabularyWord,
  type InsertVocabularyWord,
  type GrammarExercise,
  type InsertGrammarExercise,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Language methods
  getLanguages(): Promise<Language[]>;
  createLanguage(insertLanguage: InsertLanguage): Promise<Language>;

  // Vocabulary methods
  getVocabularyWords(languageId: string, difficulty?: string): Promise<VocabularyWord[]>;
  getRandomVocabularyWords(languageId: string, count: number): Promise<VocabularyWord[]>;
  createVocabularyWord(insertWord: InsertVocabularyWord): Promise<VocabularyWord>;

  // Grammar methods
  getGrammarExercises(languageId: string, difficulty?: string): Promise<GrammarExercise[]>;
  getRandomGrammarExercises(languageId: string, count: number): Promise<GrammarExercise[]>;
  createGrammarExercise(insertExercise: InsertGrammarExercise): Promise<GrammarExercise>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Language methods
  async getLanguages(): Promise<Language[]> {
    return await db
      .select()
      .from(languages)
      .where(eq(languages.isActive, true))
      .orderBy(asc(languages.name));
  }

  async createLanguage(insertLanguage: InsertLanguage): Promise<Language> {
    const [language] = await db
      .insert(languages)
      .values(insertLanguage)
      .returning();
    return language;
  }

  // Vocabulary methods
  async getVocabularyWords(languageId: string, difficulty?: string): Promise<VocabularyWord[]> {
    let query = db
      .select()
      .from(vocabularyWords)
      .where(eq(vocabularyWords.languageId, languageId));

    if (difficulty) {
      query = query.where(eq(vocabularyWords.difficulty, difficulty));
    }

    return await query.orderBy(asc(vocabularyWords.word));
  }

  async getRandomVocabularyWords(languageId: string, count: number): Promise<VocabularyWord[]> {
    return await db
      .select()
      .from(vocabularyWords)
      .where(eq(vocabularyWords.languageId, languageId))
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  async createVocabularyWord(insertWord: InsertVocabularyWord): Promise<VocabularyWord> {
    const [word] = await db
      .insert(vocabularyWords)
      .values(insertWord)
      .returning();
    return word;
  }

  // Grammar methods
  async getGrammarExercises(languageId: string, difficulty?: string): Promise<GrammarExercise[]> {
    let query = db
      .select()
      .from(grammarExercises)
      .where(eq(grammarExercises.languageId, languageId));

    if (difficulty) {
      query = query.where(eq(grammarExercises.difficulty, difficulty));
    }

    return await query.orderBy(asc(grammarExercises.grammarTopic));
  }

  async getRandomGrammarExercises(languageId: string, count: number): Promise<GrammarExercise[]> {
    return await db
      .select()
      .from(grammarExercises)
      .where(eq(grammarExercises.languageId, languageId))
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  async createGrammarExercise(insertExercise: InsertGrammarExercise): Promise<GrammarExercise> {
    const [exercise] = await db
      .insert(grammarExercises)
      .values(insertExercise)
      .returning();
    return exercise;
  }
}

export const storage = new DatabaseStorage();