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

// Languages table - Only supporting 6 languages
export const languages = pgTable("languages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nativeName: varchar("native_name", { length: 100 }).notNull(),
  flagEmoji: varchar("flag_emoji", { length: 10 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userVocabularyProgress: many(userVocabularyProgress),
  userAchievements: many(userAchievements),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
  vocabularyWords: many(vocabularyWords),
  grammarExercises: many(grammarExercises),
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

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
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

export const insertVocabularyWordSchema = createInsertSchema(vocabularyWords).omit({
  id: true,
  createdAt: true,
});

export const insertGrammarExerciseSchema = createInsertSchema(grammarExercises).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

export type VocabularyWord = typeof vocabularyWords.$inferSelect;
export type InsertVocabularyWord = z.infer<typeof insertVocabularyWordSchema>;

export type GrammarExercise = typeof grammarExercises.$inferSelect;
export type InsertGrammarExercise = z.infer<typeof insertGrammarExerciseSchema>;

export type UserVocabularyProgress = typeof userVocabularyProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;