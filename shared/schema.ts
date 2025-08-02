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
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: text("profile_image_url"),
  location: varchar("location", { length: 100 }),
  interests: text("interests").array(),
  fieldOfLearning: varchar("field_of_learning", { length: 100 }),
  currentStreak: integer("current_streak").default(0),
  totalPoints: integer("total_points").default(0),
  dailyGoalMinutes: integer("daily_goal_minutes").default(20),
  cefr_level: varchar("cefr_level", { length: 5 }).default("A1"), // A1, A2, B1, B2, C1, C2
  profileCompleted: boolean("profile_completed").default(false),
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

// Learning paths for personalized learning
export const learningPaths = pgTable("learning_paths", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  currentLevel: varchar("current_level", { length: 5 }).default("A1"),
  targetLevel: varchar("target_level", { length: 5 }).default("B2"),
  adaptiveDifficulty: decimal("adaptive_difficulty", { precision: 3, scale: 2 }).default("0.5"),
  weeklyGoalHours: integer("weekly_goal_hours").default(5),
  studyDays: integer("study_days").array().default(sql`ARRAY[1,2,3,4,5]`), // 1=Monday, 7=Sunday
  reminderTime: varchar("reminder_time", { length: 8 }).default("19:00:00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Study sessions tracking
export const studySessions = pgTable("study_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  sessionType: varchar("session_type", { length: 50 }).notNull(), // vocabulary, grammar, pronunciation, etc
  durationMinutes: integer("duration_minutes").notNull(),
  correctAnswers: integer("correct_answers").default(0),
  totalQuestions: integer("total_questions").default(0),
  difficultyLevel: varchar("difficulty_level", { length: 20 }),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Progress benchmarks
export const progressBenchmarks = pgTable("progress_benchmarks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
  cefrLevel: varchar("cefr_level", { length: 5 }).notNull(),
  skillType: varchar("skill_type", { length: 20 }).notNull(), // listening, reading, writing, speaking
  currentScore: decimal("current_score", { precision: 5, scale: 2 }).default("0"),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).default("100"),
  lastAssessment: timestamp("last_assessment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userVocabularyProgress: many(userVocabularyProgress),
  userAchievements: many(userAchievements),
  learningPaths: many(learningPaths),
  studySessions: many(studySessions),
  progressBenchmarks: many(progressBenchmarks),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
  vocabularyWords: many(vocabularyWords),
  grammarExercises: many(grammarExercises),
  learningPaths: many(learningPaths),
  studySessions: many(studySessions),
  progressBenchmarks: many(progressBenchmarks),
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

export const learningPathsRelations = relations(learningPaths, ({ one }) => ({
  user: one(users, { fields: [learningPaths.userId], references: [users.id] }),
  language: one(languages, { fields: [learningPaths.languageId], references: [languages.id] }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, { fields: [studySessions.userId], references: [users.id] }),
  language: one(languages, { fields: [studySessions.languageId], references: [languages.id] }),
}));

export const progressBenchmarksRelations = relations(progressBenchmarks, ({ one }) => ({
  user: one(users, { fields: [progressBenchmarks.userId], references: [users.id] }),
  language: one(languages, { fields: [progressBenchmarks.languageId], references: [languages.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
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

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  startedAt: true,
});

export const insertProgressBenchmarkSchema = createInsertSchema(progressBenchmarks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserProfileSchema = createInsertSchema(users).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  email: true,
  username: true,
}).extend({
  interests: z.array(z.string()).optional(),
  studyDays: z.array(z.number()).optional(),
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

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type ProgressBenchmark = typeof progressBenchmarks.$inferSelect;
export type InsertProgressBenchmark = z.infer<typeof insertProgressBenchmarkSchema>;

export type UserVocabularyProgress = typeof userVocabularyProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;