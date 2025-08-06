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
  learningStages,
  userConnections,
  videoCallSessions,
  userLearningContent,
  flashcards,
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
  type LearningStage,
  type InsertLearningStage,
  type UserConnection,
  type InsertUserConnection,
  type VideoCallSession,
  type InsertVideoCallSession,
  type UserLearningContent,
  type InsertUserLearningContent,
  type Flashcard,
  type InsertFlashcard,
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

  // Learning Stage methods
  getLearningStages(learningPathId: string): Promise<LearningStage[]>;
  createLearningStage(insertStage: InsertLearningStage): Promise<LearningStage>;
  updateLearningStage(stageId: string, updateData: Partial<InsertLearningStage>): Promise<LearningStage>;
  unlockNextStage(learningPathId: string, currentStageNumber: number): Promise<void>;

  // User Connection methods
  getUserConnections(userId: string): Promise<UserConnection[]>;
  getOnlineFriends(userId: string): Promise<UserConnection[]>;
  createConnection(insertConnection: InsertUserConnection): Promise<UserConnection>;
  updateConnectionStatus(connectionId: string, status: string): Promise<UserConnection>;
  updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void>;

  // Video Call methods
  createVideoCallSession(insertCall: InsertVideoCallSession): Promise<VideoCallSession>;
  updateVideoCallStatus(callId: string, status: string): Promise<VideoCallSession>;
  getActiveCallsForUser(userId: string): Promise<VideoCallSession[]>;

  // User Learning Content methods
  getUserLearningContent(userId: string, languageId: string): Promise<UserLearningContent[]>;
  createUserLearningContent(insertContent: InsertUserLearningContent): Promise<UserLearningContent>;
  updateLearningContentProgress(contentId: string, masteryLevel: number): Promise<UserLearningContent>;

  // Flashcard methods
  getUserFlashcards(userId: string, dueOnly?: boolean): Promise<Flashcard[]>;
  createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcardReview(flashcardId: string, grade: number): Promise<Flashcard>;
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

  // Learning Stage methods
  async getLearningStages(learningPathId: string): Promise<LearningStage[]> {
    return await db
      .select()
      .from(learningStages)
      .where(eq(learningStages.learningPathId, learningPathId))
      .orderBy(asc(learningStages.stageNumber));
  }

  async createLearningStage(insertStage: InsertLearningStage): Promise<LearningStage> {
    const [stage] = await db
      .insert(learningStages)
      .values(insertStage)
      .returning();
    return stage;
  }

  async updateLearningStage(stageId: string, updateData: Partial<InsertLearningStage>): Promise<LearningStage> {
    const [stage] = await db
      .update(learningStages)
      .set(updateData)
      .where(eq(learningStages.id, stageId))
      .returning();
    return stage;
  }

  async unlockNextStage(learningPathId: string, currentStageNumber: number): Promise<void> {
    await db
      .update(learningStages)
      .set({ isUnlocked: true })
      .where(
        and(
          eq(learningStages.learningPathId, learningPathId),
          eq(learningStages.stageNumber, currentStageNumber + 1)
        )
      );
  }

  // User Connection methods
  async getUserConnections(userId: string): Promise<UserConnection[]> {
    return await db
      .select()
      .from(userConnections)
      .where(
        and(
          eq(userConnections.userId, userId),
          eq(userConnections.status, "accepted")
        )
      )
      .orderBy(desc(userConnections.lastSeen));
  }

  async getOnlineFriends(userId: string): Promise<UserConnection[]> {
    return await db
      .select()
      .from(userConnections)
      .where(
        and(
          eq(userConnections.userId, userId),
          eq(userConnections.status, "accepted"),
          eq(userConnections.isOnline, true)
        )
      )
      .orderBy(desc(userConnections.lastSeen));
  }

  async createConnection(insertConnection: InsertUserConnection): Promise<UserConnection> {
    const [connection] = await db
      .insert(userConnections)
      .values(insertConnection)
      .returning();
    return connection;
  }

  async updateConnectionStatus(connectionId: string, status: string): Promise<UserConnection> {
    const [connection] = await db
      .update(userConnections)
      .set({ status })
      .where(eq(userConnections.id, connectionId))
      .returning();
    return connection;
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await db
      .update(userConnections)
      .set({ 
        isOnline,
        lastSeen: new Date()
      })
      .where(
        eq(userConnections.friendId, userId)
      );
  }

  // Video Call methods
  async createVideoCallSession(insertCall: InsertVideoCallSession): Promise<VideoCallSession> {
    const [call] = await db
      .insert(videoCallSessions)
      .values(insertCall)
      .returning();
    return call;
  }

  async updateVideoCallStatus(callId: string, status: string): Promise<VideoCallSession> {
    const [call] = await db
      .update(videoCallSessions)
      .set({ 
        status,
        ...(status === "active" && { startedAt: new Date() }),
        ...(status === "ended" && { endedAt: new Date() })
      })
      .where(eq(videoCallSessions.id, callId))
      .returning();
    return call;
  }

  async getActiveCallsForUser(userId: string): Promise<VideoCallSession[]> {
    return await db
      .select()
      .from(videoCallSessions)
      .where(
        and(
          sql`(${videoCallSessions.initiatorId} = ${userId} OR ${videoCallSessions.receiverId} = ${userId})`,
          sql`${videoCallSessions.status} IN ('pending', 'active')`
        )
      )
      .orderBy(desc(videoCallSessions.createdAt));
  }

  // User Learning Content methods
  async getUserLearningContent(userId: string, languageId: string): Promise<UserLearningContent[]> {
    return await db
      .select()
      .from(userLearningContent)
      .where(
        and(
          eq(userLearningContent.userId, userId),
          eq(userLearningContent.languageId, languageId)
        )
      )
      .orderBy(desc(userLearningContent.createdAt));
  }

  async createUserLearningContent(insertContent: InsertUserLearningContent): Promise<UserLearningContent> {
    const [content] = await db
      .insert(userLearningContent)
      .values(insertContent)
      .returning();
    return content;
  }

  async updateLearningContentProgress(contentId: string, masteryLevel: number): Promise<UserLearningContent> {
    const [content] = await db
      .update(userLearningContent)
      .set({
        masteryLevel,
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        reviewCount: sql`${userLearningContent.reviewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(userLearningContent.id, contentId))
      .returning();
    return content;
  }

  // Flashcard methods
  async getUserFlashcards(userId: string, dueOnly: boolean = false): Promise<Flashcard[]> {
    const conditions = [eq(flashcards.userId, userId), eq(flashcards.isArchived, false)];
    
    if (dueOnly) {
      conditions.push(sql`${flashcards.nextReview} <= NOW()`);
    }

    return await db
      .select()
      .from(flashcards)
      .where(and(...conditions))
      .orderBy(asc(flashcards.nextReview));
  }

  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const [flashcard] = await db
      .insert(flashcards)
      .values(insertFlashcard)
      .returning();
    return flashcard;
  }

  async updateFlashcardReview(flashcardId: string, grade: number): Promise<Flashcard> {
    // SM-2 spaced repetition algorithm
    const [currentCard] = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.id, flashcardId));

    if (!currentCard) throw new Error("Flashcard not found");

    let easinessFactor = currentCard.easinessFactor || 2.5;
    let interval = currentCard.interval || 1;
    let repetitions = currentCard.repetitions || 0;

    if (grade >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easinessFactor);
      }
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easinessFactor = easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easinessFactor < 1.3) easinessFactor = 1.3;

    const nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

    const [flashcard] = await db
      .update(flashcards)
      .set({
        easinessFactor,
        interval,
        repetitions,
        lastReviewed: new Date(),
        nextReview,
      })
      .where(eq(flashcards.id, flashcardId))
      .returning();

    return flashcard;
  }
}

export const storage = new DatabaseStorage();