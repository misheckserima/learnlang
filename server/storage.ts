import { 
  users, 
  languages,
  vocabularyWords,
  grammarExercises,
  achievements,
  userAchievements,
  userVocabularyProgress,
  learningPaths,
  studySessions,
  progressBenchmarks,
  type User, 
  type InsertUser,
  type Language,
  type InsertLanguage,
  type VocabularyWord,
  type InsertVocabularyWord,
  type GrammarExercise,
  type InsertGrammarExercise,
  type LearningPath,
  type InsertLearningPath,
  type StudySession,
  type InsertStudySession,
  type ProgressBenchmark,
  type InsertProgressBenchmark,
  updateUserProfileSchema,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  validatePassword(email: string, password: string): Promise<User | null>;
  updateUserProfile(userId: string, profileData: any): Promise<User>;

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

  // Learning Path methods
  getUserLearningPath(userId: string, languageId: string): Promise<LearningPath | undefined>;
  createLearningPath(insertPath: InsertLearningPath): Promise<LearningPath>;
  updateLearningPath(pathId: string, updateData: Partial<InsertLearningPath>): Promise<LearningPath>;

  // Study Session methods
  createStudySession(insertSession: InsertStudySession): Promise<StudySession>;
  getUserStudySessions(userId: string, limit?: number): Promise<StudySession[]>;

  // Progress Benchmark methods
  getUserProgressBenchmarks(userId: string, languageId?: string): Promise<ProgressBenchmark[]>;
  createProgressBenchmark(insertBenchmark: InsertProgressBenchmark): Promise<ProgressBenchmark>;
  updateProgressBenchmark(benchmarkId: string, updateData: Partial<InsertProgressBenchmark>): Promise<ProgressBenchmark>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { password, ...userData } = insertUser;
    
    if (!password) {
      throw new Error("Password is required");
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [user] = await db
      .insert(users)
      .values({ ...userData, passwordHash })
      .returning();
    return user;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
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
    const conditions = [eq(vocabularyWords.languageId, languageId)];
    
    if (difficulty) {
      conditions.push(eq(vocabularyWords.difficulty, difficulty));
    }

    return await db
      .select()
      .from(vocabularyWords)
      .where(and(...conditions))
      .orderBy(asc(vocabularyWords.word));
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
    const conditions = [eq(grammarExercises.languageId, languageId)];
    
    if (difficulty) {
      conditions.push(eq(grammarExercises.difficulty, difficulty));
    }

    return await db
      .select()
      .from(grammarExercises)
      .where(and(...conditions))
      .orderBy(asc(grammarExercises.grammarTopic));
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

  // Profile methods
  async updateUserProfile(userId: string, profileData: any): Promise<User> {
    const validatedData = updateUserProfileSchema.parse(profileData);
    const [user] = await db
      .update(users)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Learning Path methods
  async getUserLearningPath(userId: string, languageId: string): Promise<LearningPath | undefined> {
    const [path] = await db
      .select()
      .from(learningPaths)
      .where(and(
        eq(learningPaths.userId, userId),
        eq(learningPaths.languageId, languageId)
      ));
    return path || undefined;
  }

  async createLearningPath(insertPath: InsertLearningPath): Promise<LearningPath> {
    const [path] = await db
      .insert(learningPaths)
      .values(insertPath)
      .returning();
    return path;
  }

  async updateLearningPath(pathId: string, updateData: Partial<InsertLearningPath>): Promise<LearningPath> {
    const [path] = await db
      .update(learningPaths)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(learningPaths.id, pathId))
      .returning();
    return path;
  }

  // Study Session methods
  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const [session] = await db
      .insert(studySessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getUserStudySessions(userId: string, limit = 10): Promise<StudySession[]> {
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.startedAt))
      .limit(limit);
  }

  // Progress Benchmark methods
  async getUserProgressBenchmarks(userId: string, languageId?: string): Promise<ProgressBenchmark[]> {
    const conditions = [eq(progressBenchmarks.userId, userId)];
    
    if (languageId) {
      conditions.push(eq(progressBenchmarks.languageId, languageId));
    }

    return await db
      .select()
      .from(progressBenchmarks)
      .where(and(...conditions))
      .orderBy(desc(progressBenchmarks.lastAssessment));
  }

  async createProgressBenchmark(insertBenchmark: InsertProgressBenchmark): Promise<ProgressBenchmark> {
    const [benchmark] = await db
      .insert(progressBenchmarks)
      .values(insertBenchmark)
      .returning();
    return benchmark;
  }

  async updateProgressBenchmark(benchmarkId: string, updateData: Partial<InsertProgressBenchmark>): Promise<ProgressBenchmark> {
    const [benchmark] = await db
      .update(progressBenchmarks)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(progressBenchmarks.id, benchmarkId))
      .returning();
    return benchmark;
  }
}

export const storage = new DatabaseStorage();