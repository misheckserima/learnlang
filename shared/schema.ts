import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  jsonb,
  uuid,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: text("profile_image_url"),
  currentStreak: integer("current_streak").default(0),
  totalPoints: integer("total_points").default(0),
  dailyGoalMinutes: integer("daily_goal_minutes").default(20),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Languages table
export const languages = pgTable("languages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nativeName: varchar("native_name", { length: 100 }).notNull(),
  flagEmoji: varchar("flag_emoji", { length: 10 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User language progress
export const userLanguages = pgTable("user_languages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  level: varchar("level", { length: 10 }).default("A1"), // A1, A2, B1, B2, C1, C2
  progressPercentage: integer("progress_percentage").default(0),
  totalLessonsCompleted: integer("total_lessons_completed").default(0),
  totalWordsLearned: integer("total_words_learned").default(0),
  totalTimeSpentMinutes: integer("total_time_spent_minutes").default(0),
  isCurrent: boolean("is_current").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons
export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  level: varchar("level", { length: 10 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // vocabulary, grammar, pronunciation, culture
  content: jsonb("content").notNull(),
  orderIndex: integer("order_index").default(0),
  estimatedMinutes: integer("estimated_minutes").default(15),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User lesson progress
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  progressPercentage: integer("progress_percentage").default(0),
  isCompleted: boolean("is_completed").default(false),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vocabulary words
export const vocabularyWords = pgTable("vocabulary_words", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  word: varchar("word", { length: 200 }).notNull(),
  translation: varchar("translation", { length: 200 }).notNull(),
  pronunciation: text("pronunciation"),
  audioUrl: text("audio_url"),
  difficulty: varchar("difficulty", { length: 20 }).default("beginner"),
  category: varchar("category", { length: 50 }),
  exampleSentence: text("example_sentence"),
  exampleTranslation: text("example_translation"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User vocabulary progress
export const userVocabularyProgress = pgTable("user_vocabulary_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  wordId: uuid("word_id").notNull().references(() => vocabularyWords.id, { onDelete: "cascade" }),
  mastery: integer("mastery").default(0), // 0-100
  correctAnswers: integer("correct_answers").default(0),
  totalAttempts: integer("total_attempts").default(0),
  lastReviewed: timestamp("last_reviewed"),
  nextReview: timestamp("next_review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Grammar exercises
export const grammarExercises = pgTable("grammar_exercises", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // multiple_choice, fill_blank, sentence_building
  question: text("question").notNull(),
  questionTranslation: text("question_translation"),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options"), // for multiple choice
  explanation: text("explanation"),
  difficulty: varchar("difficulty", { length: 20 }).default("beginner"),
  grammarTopic: varchar("grammar_topic", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cultural stories
export const culturalStories = pgTable("cultural_stories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  content: text("content").notNull(),
  translation: text("translation"),
  level: varchar("level", { length: 10 }).notNull(),
  category: varchar("category", { length: 50 }),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  readingTimeMinutes: integer("reading_time_minutes").default(10),
  culturalNotes: text("cultural_notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 50 }),
  category: varchar("category", { length: 50 }),
  criteria: jsonb("criteria").notNull(),
  points: integer("points").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Daily activity tracking
export const dailyActivity = pgTable("daily_activity", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  minutesStudied: integer("minutes_studied").default(0),
  lessonsCompleted: integer("lessons_completed").default(0),
  wordsLearned: integer("words_learned").default(0),
  pointsEarned: integer("points_earned").default(0),
  goalMet: boolean("goal_met").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Study sessions
export const studySessions = pgTable("study_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: integer("duration_minutes"),
  activitiesCompleted: jsonb("activities_completed"),
  pointsEarned: integer("points_earned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community chat messages
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  languageId: uuid("language_id").references(() => languages.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  translation: text("translation"),
  isModerated: boolean("is_moderated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Language exchange partnerships
export const languageExchanges = pgTable("language_exchanges", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: uuid("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user2Id: uuid("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  user1TeachingLanguageId: uuid("user1_teaching_language_id").notNull().references(() => languages.id),
  user1LearningLanguageId: uuid("user1_learning_language_id").notNull().references(() => languages.id),
  status: varchar("status", { length: 20 }).default("pending"), // pending, active, completed, cancelled
  lastInteraction: timestamp("last_interaction"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userLanguages: many(userLanguages),
  userLessonProgress: many(userLessonProgress),
  userVocabularyProgress: many(userVocabularyProgress),
  userAchievements: many(userAchievements),
  dailyActivity: many(dailyActivity),
  studySessions: many(studySessions),
  chatMessages: many(chatMessages),
  languageExchangesAsUser1: many(languageExchanges, { relationName: "user1" }),
  languageExchangesAsUser2: many(languageExchanges, { relationName: "user2" }),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
  userLanguages: many(userLanguages),
  lessons: many(lessons),
  vocabularyWords: many(vocabularyWords),
  grammarExercises: many(grammarExercises),
  culturalStories: many(culturalStories),
  studySessions: many(studySessions),
  chatMessages: many(chatMessages),
}));

export const userLanguagesRelations = relations(userLanguages, ({ one }) => ({
  user: one(users, { fields: [userLanguages.userId], references: [users.id] }),
  language: one(languages, { fields: [userLanguages.languageId], references: [languages.id] }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  language: one(languages, { fields: [lessons.languageId], references: [languages.id] }),
  userLessonProgress: many(userLessonProgress),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, { fields: [userLessonProgress.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [userLessonProgress.lessonId], references: [lessons.id] }),
}));

export const vocabularyWordsRelations = relations(vocabularyWords, ({ one, many }) => ({
  language: one(languages, { fields: [vocabularyWords.languageId], references: [languages.id] }),
  userVocabularyProgress: many(userVocabularyProgress),
}));

export const userVocabularyProgressRelations = relations(userVocabularyProgress, ({ one }) => ({
  user: one(users, { fields: [userVocabularyProgress.userId], references: [users.id] }),
  word: one(vocabularyWords, { fields: [userVocabularyProgress.wordId], references: [vocabularyWords.id] }),
}));

export const grammarExercisesRelations = relations(grammarExercises, ({ one }) => ({
  language: one(languages, { fields: [grammarExercises.languageId], references: [languages.id] }),
}));

export const culturalStoriesRelations = relations(culturalStories, ({ one }) => ({
  language: one(languages, { fields: [culturalStories.languageId], references: [languages.id] }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

export const dailyActivityRelations = relations(dailyActivity, ({ one }) => ({
  user: one(users, { fields: [dailyActivity.userId], references: [users.id] }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, { fields: [studySessions.userId], references: [users.id] }),
  language: one(languages, { fields: [studySessions.languageId], references: [languages.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
  language: one(languages, { fields: [chatMessages.languageId], references: [languages.id] }),
}));

export const languageExchangesRelations = relations(languageExchanges, ({ one }) => ({
  user1: one(users, { fields: [languageExchanges.user1Id], references: [users.id], relationName: "user1" }),
  user2: one(users, { fields: [languageExchanges.user2Id], references: [users.id], relationName: "user2" }),
  user1TeachingLanguage: one(languages, { fields: [languageExchanges.user1TeachingLanguageId], references: [languages.id] }),
  user1LearningLanguage: one(languages, { fields: [languageExchanges.user1LearningLanguageId], references: [languages.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
  createdAt: true,
});

export const insertUserLanguageSchema = createInsertSchema(userLanguages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertVocabularyWordSchema = createInsertSchema(vocabularyWords).omit({
  id: true,
  createdAt: true,
});

export const insertGrammarExerciseSchema = createInsertSchema(grammarExercises).omit({
  id: true,
  createdAt: true,
});

export const insertCulturalStorySchema = createInsertSchema(culturalStories).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

export type UserLanguage = typeof userLanguages.$inferSelect;
export type InsertUserLanguage = z.infer<typeof insertUserLanguageSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type UserLessonProgress = typeof userLessonProgress.$inferSelect;

export type VocabularyWord = typeof vocabularyWords.$inferSelect;
export type InsertVocabularyWord = z.infer<typeof insertVocabularyWordSchema>;

export type UserVocabularyProgress = typeof userVocabularyProgress.$inferSelect;

export type GrammarExercise = typeof grammarExercises.$inferSelect;
export type InsertGrammarExercise = z.infer<typeof insertGrammarExerciseSchema>;

export type CulturalStory = typeof culturalStories.$inferSelect;
export type InsertCulturalStory = z.infer<typeof insertCulturalStorySchema>;

export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type DailyActivity = typeof dailyActivity.$inferSelect;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type LanguageExchange = typeof languageExchanges.$inferSelect;
