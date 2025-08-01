import {
  users,
  languages,
  userLanguages,
  lessons,
  userLessonProgress,
  vocabularyWords,
  userVocabularyProgress,
  grammarExercises,
  culturalStories,
  achievements,
  userAchievements,
  dailyActivity,
  studySessions,
  chatMessages,
  languageExchanges,
  type User,
  type InsertUser,
  type Language,
  type InsertLanguage,
  type UserLanguage,
  type InsertUserLanguage,
  type Lesson,
  type InsertLesson,
  type UserLessonProgress,
  type VocabularyWord,
  type InsertVocabularyWord,
  type UserVocabularyProgress,
  type GrammarExercise,
  type InsertGrammarExercise,
  type CulturalStory,
  type InsertCulturalStory,
  type Achievement,
  type UserAchievement,
  type DailyActivity,
  type StudySession,
  type InsertStudySession,
  type ChatMessage,
  type InsertChatMessage,
  type LanguageExchange,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, count, sum } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;

  // Language operations
  getLanguages(): Promise<Language[]>;
  getLanguage(id: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;

  // User language operations
  getUserLanguages(userId: string): Promise<(UserLanguage & { language: Language })[]>;
  getUserCurrentLanguage(userId: string): Promise<(UserLanguage & { language: Language }) | undefined>;
  createUserLanguage(userLanguage: InsertUserLanguage): Promise<UserLanguage>;
  updateUserLanguage(userId: string, languageId: string, updates: Partial<InsertUserLanguage>): Promise<UserLanguage>;
  setCurrentLanguage(userId: string, languageId: string): Promise<void>;

  // Lesson operations
  getLessons(languageId: string, level?: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User lesson progress
  getUserLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | undefined>;
  createOrUpdateUserLessonProgress(userId: string, lessonId: string, progress: Partial<UserLessonProgress>): Promise<UserLessonProgress>;

  // Vocabulary operations
  getVocabularyWords(languageId: string, difficulty?: string): Promise<VocabularyWord[]>;
  getRandomVocabularyWords(languageId: string, count: number): Promise<VocabularyWord[]>;
  createVocabularyWord(word: InsertVocabularyWord): Promise<VocabularyWord>;

  // User vocabulary progress
  getUserVocabularyProgress(userId: string, wordId: string): Promise<UserVocabularyProgress | undefined>;
  createOrUpdateUserVocabularyProgress(userId: string, wordId: string, progress: Partial<UserVocabularyProgress>): Promise<UserVocabularyProgress>;

  // Grammar exercises
  getGrammarExercises(languageId: string, difficulty?: string): Promise<GrammarExercise[]>;
  getRandomGrammarExercises(languageId: string, count: number): Promise<GrammarExercise[]>;
  createGrammarExercise(exercise: InsertGrammarExercise): Promise<GrammarExercise>;

  // Cultural stories
  getCulturalStories(languageId: string, level?: string): Promise<CulturalStory[]>;
  getCulturalStory(id: string): Promise<CulturalStory | undefined>;
  createCulturalStory(story: InsertCulturalStory): Promise<CulturalStory>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;

  // Daily activity
  getDailyActivity(userId: string, date: Date): Promise<DailyActivity | undefined>;
  createOrUpdateDailyActivity(userId: string, date: Date, activity: Partial<DailyActivity>): Promise<DailyActivity>;
  getUserStreak(userId: string): Promise<number>;

  // Study sessions
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession>;
  getUserStats(userId: string): Promise<{
    totalTimeMinutes: number;
    totalLessons: number;
    totalWords: number;
    currentStreak: number;
  }>;

  // Chat messages
  getChatMessages(languageId?: string, limit?: number): Promise<(ChatMessage & { user: User })[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Language exchange
  getLanguageExchangePartners(userId: string): Promise<LanguageExchange[]>;
  createLanguageExchange(exchange: Partial<LanguageExchange>): Promise<LanguageExchange>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Language operations
  async getLanguages(): Promise<Language[]> {
    return await db.select().from(languages).where(eq(languages.isActive, true)).orderBy(asc(languages.name));
  }

  async getLanguage(id: string): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.id, id));
    return language;
  }

  async createLanguage(language: InsertLanguage): Promise<Language> {
    const [newLanguage] = await db.insert(languages).values(language).returning();
    return newLanguage;
  }

  // User language operations
  async getUserLanguages(userId: string): Promise<(UserLanguage & { language: Language })[]> {
    const results = await db
      .select({
        id: userLanguages.id,
        userId: userLanguages.userId,
        languageId: userLanguages.languageId,
        level: userLanguages.level,
        progressPercentage: userLanguages.progressPercentage,
        totalLessonsCompleted: userLanguages.totalLessonsCompleted,
        totalWordsLearned: userLanguages.totalWordsLearned,
        totalTimeSpentMinutes: userLanguages.totalTimeSpentMinutes,
        isCurrent: userLanguages.isCurrent,
        createdAt: userLanguages.createdAt,
        updatedAt: userLanguages.updatedAt,
        language: languages,
      })
      .from(userLanguages)
      .innerJoin(languages, eq(userLanguages.languageId, languages.id))
      .where(eq(userLanguages.userId, userId))
      .orderBy(desc(userLanguages.isCurrent), desc(userLanguages.createdAt));
    
    return results as (UserLanguage & { language: Language })[];
  }

  async getUserCurrentLanguage(userId: string): Promise<(UserLanguage & { language: Language }) | undefined> {
    const [result] = await db
      .select({
        id: userLanguages.id,
        userId: userLanguages.userId,
        languageId: userLanguages.languageId,
        level: userLanguages.level,
        progressPercentage: userLanguages.progressPercentage,
        totalLessonsCompleted: userLanguages.totalLessonsCompleted,
        totalWordsLearned: userLanguages.totalWordsLearned,
        totalTimeSpentMinutes: userLanguages.totalTimeSpentMinutes,
        isCurrent: userLanguages.isCurrent,
        createdAt: userLanguages.createdAt,
        updatedAt: userLanguages.updatedAt,
        language: languages,
      })
      .from(userLanguages)
      .innerJoin(languages, eq(userLanguages.languageId, languages.id))
      .where(and(eq(userLanguages.userId, userId), eq(userLanguages.isCurrent, true)));
    
    return result as (UserLanguage & { language: Language }) | undefined;
  }

  async createUserLanguage(userLanguage: InsertUserLanguage): Promise<UserLanguage> {
    const [newUserLanguage] = await db.insert(userLanguages).values(userLanguage).returning();
    return newUserLanguage;
  }

  async updateUserLanguage(userId: string, languageId: string, updates: Partial<InsertUserLanguage>): Promise<UserLanguage> {
    const [userLanguage] = await db
      .update(userLanguages)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(userLanguages.userId, userId), eq(userLanguages.languageId, languageId)))
      .returning();
    return userLanguage;
  }

  async setCurrentLanguage(userId: string, languageId: string): Promise<void> {
    // First, set all user languages to not current
    await db
      .update(userLanguages)
      .set({ isCurrent: false, updatedAt: new Date() })
      .where(eq(userLanguages.userId, userId));

    // Then set the selected language as current
    await db
      .update(userLanguages)
      .set({ isCurrent: true, updatedAt: new Date() })
      .where(and(eq(userLanguages.userId, userId), eq(userLanguages.languageId, languageId)));
  }

  // Lesson operations
  async getLessons(languageId: string, level?: string): Promise<Lesson[]> {
    const query = db
      .select()
      .from(lessons)
      .where(and(
        eq(lessons.languageId, languageId),
        eq(lessons.isActive, true),
        level ? eq(lessons.level, level) : undefined
      ))
      .orderBy(asc(lessons.orderIndex));

    return await query;
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  // User lesson progress
  async getUserLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userLessonProgress)
      .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.lessonId, lessonId)));
    return progress;
  }

  async createOrUpdateUserLessonProgress(userId: string, lessonId: string, progress: Partial<UserLessonProgress>): Promise<UserLessonProgress> {
    const existing = await this.getUserLessonProgress(userId, lessonId);
    
    if (existing) {
      const [updated] = await db
        .update(userLessonProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.lessonId, lessonId)))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userLessonProgress)
        .values({ userId, lessonId, ...progress })
        .returning();
      return created;
    }
  }

  // Vocabulary operations
  async getVocabularyWords(languageId: string, difficulty?: string): Promise<VocabularyWord[]> {
    const query = db
      .select()
      .from(vocabularyWords)
      .where(and(
        eq(vocabularyWords.languageId, languageId),
        difficulty ? eq(vocabularyWords.difficulty, difficulty) : undefined
      ))
      .orderBy(asc(vocabularyWords.word));

    return await query;
  }

  async getRandomVocabularyWords(languageId: string, count: number): Promise<VocabularyWord[]> {
    return await db
      .select()
      .from(vocabularyWords)
      .where(eq(vocabularyWords.languageId, languageId))
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  async createVocabularyWord(word: InsertVocabularyWord): Promise<VocabularyWord> {
    const [newWord] = await db.insert(vocabularyWords).values(word).returning();
    return newWord;
  }

  // User vocabulary progress
  async getUserVocabularyProgress(userId: string, wordId: string): Promise<UserVocabularyProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userVocabularyProgress)
      .where(and(eq(userVocabularyProgress.userId, userId), eq(userVocabularyProgress.wordId, wordId)));
    return progress;
  }

  async createOrUpdateUserVocabularyProgress(userId: string, wordId: string, progress: Partial<UserVocabularyProgress>): Promise<UserVocabularyProgress> {
    const existing = await this.getUserVocabularyProgress(userId, wordId);
    
    if (existing) {
      const [updated] = await db
        .update(userVocabularyProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(and(eq(userVocabularyProgress.userId, userId), eq(userVocabularyProgress.wordId, wordId)))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userVocabularyProgress)
        .values({ userId, wordId, ...progress })
        .returning();
      return created;
    }
  }

  // Grammar exercises
  async getGrammarExercises(languageId: string, difficulty?: string): Promise<GrammarExercise[]> {
    const query = db
      .select()
      .from(grammarExercises)
      .where(and(
        eq(grammarExercises.languageId, languageId),
        difficulty ? eq(grammarExercises.difficulty, difficulty) : undefined
      ));

    return await query;
  }

  async getRandomGrammarExercises(languageId: string, count: number): Promise<GrammarExercise[]> {
    return await db
      .select()
      .from(grammarExercises)
      .where(eq(grammarExercises.languageId, languageId))
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  async createGrammarExercise(exercise: InsertGrammarExercise): Promise<GrammarExercise> {
    const [newExercise] = await db.insert(grammarExercises).values(exercise).returning();
    return newExercise;
  }

  // Cultural stories
  async getCulturalStories(languageId: string, level?: string): Promise<CulturalStory[]> {
    const query = db
      .select()
      .from(culturalStories)
      .where(and(
        eq(culturalStories.languageId, languageId),
        eq(culturalStories.isActive, true),
        level ? eq(culturalStories.level, level) : undefined
      ))
      .orderBy(desc(culturalStories.createdAt));

    return await query;
  }

  async getCulturalStory(id: string): Promise<CulturalStory | undefined> {
    const [story] = await db.select().from(culturalStories).where(eq(culturalStories.id, id));
    return story;
  }

  async createCulturalStory(story: InsertCulturalStory): Promise<CulturalStory> {
    const [newStory] = await db.insert(culturalStories).values(story).returning();
    return newStory;
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.isActive, true));
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const results = await db
      .select({
        id: userAchievements.id,
        userId: userAchievements.userId,
        achievementId: userAchievements.achievementId,
        earnedAt: userAchievements.earnedAt,
        achievement: achievements,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));
    
    return results as (UserAchievement & { achievement: Achievement })[];
  }

  // Daily activity
  async getDailyActivity(userId: string, date: Date): Promise<DailyActivity | undefined> {
    const dateStr = date.toISOString().split('T')[0];
    const [activity] = await db
      .select()
      .from(dailyActivity)
      .where(and(
        eq(dailyActivity.userId, userId),
        sql`DATE(${dailyActivity.date}) = ${dateStr}`
      ));
    return activity;
  }

  async createOrUpdateDailyActivity(userId: string, date: Date, activity: Partial<DailyActivity>): Promise<DailyActivity> {
    const existing = await this.getDailyActivity(userId, date);
    
    if (existing) {
      const [updated] = await db
        .update(dailyActivity)
        .set(activity)
        .where(eq(dailyActivity.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(dailyActivity)
        .values({ userId, date, ...activity })
        .returning();
      return created;
    }
  }

  async getUserStreak(userId: string): Promise<number> {
    const activities = await db
      .select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.goalMet, true)))
      .orderBy(desc(dailyActivity.date));

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const activity of activities) {
      const activityDate = new Date(activity.date);
      activityDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Study sessions
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession> {
    const [session] = await db
      .update(studySessions)
      .set(updates)
      .where(eq(studySessions.id, id))
      .returning();
    return session;
  }

  async getUserStats(userId: string): Promise<{
    totalTimeMinutes: number;
    totalLessons: number;
    totalWords: number;
    currentStreak: number;
  }> {
    const [timeStats] = await db
      .select({
        totalTimeMinutes: sum(studySessions.durationMinutes),
      })
      .from(studySessions)
      .where(eq(studySessions.userId, userId));

    const [lessonStats] = await db
      .select({
        totalLessons: count(),
      })
      .from(userLessonProgress)
      .where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.isCompleted, true)));

    const [wordStats] = await db
      .select({
        totalWords: count(),
      })
      .from(userVocabularyProgress)
      .where(and(eq(userVocabularyProgress.userId, userId), sql`${userVocabularyProgress.mastery} >= 80`));

    const currentStreak = await this.getUserStreak(userId);

    return {
      totalTimeMinutes: Number(timeStats.totalTimeMinutes) || 0,
      totalLessons: lessonStats.totalLessons || 0,
      totalWords: wordStats.totalWords || 0,
      currentStreak,
    };
  }

  // Chat messages
  async getChatMessages(languageId?: string, limit: number = 50): Promise<(ChatMessage & { user: User })[]> {
    const results = await db
      .select({
        id: chatMessages.id,
        content: chatMessages.content,
        userId: chatMessages.userId,
        languageId: chatMessages.languageId,
        createdAt: chatMessages.createdAt,
        translation: chatMessages.translation,
        isModerated: chatMessages.isModerated,
        user: users,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .where(languageId ? eq(chatMessages.languageId, languageId) : undefined)
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);

    return results as (ChatMessage & { user: User })[];
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Language exchange
  async getLanguageExchangePartners(userId: string): Promise<LanguageExchange[]> {
    return await db
      .select()
      .from(languageExchanges)
      .where(and(
        sql`(${languageExchanges.user1Id} = ${userId} OR ${languageExchanges.user2Id} = ${userId})`,
        eq(languageExchanges.status, "active")
      ));
  }

  async createLanguageExchange(exchange: Partial<LanguageExchange>): Promise<LanguageExchange> {
    const [newExchange] = await db.insert(languageExchanges).values(exchange as any).returning();
    return newExchange;
  }
}

export const storage = new DatabaseStorage();
