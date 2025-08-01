import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertLanguageSchema,
  insertUserLanguageSchema,
  insertLessonSchema,
  insertVocabularyWordSchema,
  insertGrammarExerciseSchema,
  insertCulturalStorySchema,
  insertChatMessageSchema,
  insertStudySessionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const connectedClients = new Map<string, WebSocket>();

  wss.on('connection', (ws, req) => {
    const userId = req.url?.split('?userId=')[1];
    if (userId) {
      connectedClients.set(userId, ws);
    }

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat') {
          // Save message to database
          const chatMessage = await storage.createChatMessage({
            userId: message.userId,
            languageId: message.languageId,
            content: message.content,
            translation: message.translation,
          });

          // Broadcast to all connected clients
          const broadcastMessage = JSON.stringify({
            type: 'chat',
            message: chatMessage,
            user: await storage.getUser(message.userId),
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMessage);
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        connectedClients.delete(userId);
      }
    });
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Language routes
  app.get("/api/languages", async (req, res) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });

  app.post("/api/languages", async (req, res) => {
    try {
      const languageData = insertLanguageSchema.parse(req.body);
      const language = await storage.createLanguage(languageData);
      res.status(201).json(language);
    } catch (error) {
      console.error("Error creating language:", error);
      res.status(400).json({ message: "Invalid language data" });
    }
  });

  // User language routes
  app.get("/api/users/:userId/languages", async (req, res) => {
    try {
      const userLanguages = await storage.getUserLanguages(req.params.userId);
      res.json(userLanguages);
    } catch (error) {
      console.error("Error fetching user languages:", error);
      res.status(500).json({ message: "Failed to fetch user languages" });
    }
  });

  app.get("/api/users/:userId/languages/current", async (req, res) => {
    try {
      const currentLanguage = await storage.getUserCurrentLanguage(req.params.userId);
      res.json(currentLanguage);
    } catch (error) {
      console.error("Error fetching current language:", error);
      res.status(500).json({ message: "Failed to fetch current language" });
    }
  });

  app.post("/api/users/:userId/languages", async (req, res) => {
    try {
      const userLanguageData = insertUserLanguageSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const userLanguage = await storage.createUserLanguage(userLanguageData);
      res.status(201).json(userLanguage);
    } catch (error) {
      console.error("Error creating user language:", error);
      res.status(400).json({ message: "Invalid user language data" });
    }
  });

  app.put("/api/users/:userId/languages/:languageId/current", async (req, res) => {
    try {
      await storage.setCurrentLanguage(req.params.userId, req.params.languageId);
      res.json({ message: "Current language updated" });
    } catch (error) {
      console.error("Error setting current language:", error);
      res.status(500).json({ message: "Failed to set current language" });
    }
  });

  app.put("/api/users/:userId/languages/:languageId", async (req, res) => {
    try {
      const updates = insertUserLanguageSchema.partial().parse(req.body);
      const userLanguage = await storage.updateUserLanguage(
        req.params.userId,
        req.params.languageId,
        updates
      );
      res.json(userLanguage);
    } catch (error) {
      console.error("Error updating user language:", error);
      res.status(400).json({ message: "Invalid user language data" });
    }
  });

  // Lesson routes
  app.get("/api/languages/:languageId/lessons", async (req, res) => {
    try {
      const { level } = req.query;
      const lessons = await storage.getLessons(
        req.params.languageId,
        level as string
      );
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(400).json({ message: "Invalid lesson data" });
    }
  });

  // User lesson progress routes
  app.get("/api/users/:userId/lessons/:lessonId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserLessonProgress(
        req.params.userId,
        req.params.lessonId
      );
      res.json(progress);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  app.post("/api/users/:userId/lessons/:lessonId/progress", async (req, res) => {
    try {
      const progress = await storage.createOrUpdateUserLessonProgress(
        req.params.userId,
        req.params.lessonId,
        req.body
      );
      res.json(progress);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update lesson progress" });
    }
  });

  // Vocabulary routes
  app.get("/api/languages/:languageId/vocabulary", async (req, res) => {
    try {
      const { difficulty } = req.query;
      const words = await storage.getVocabularyWords(
        req.params.languageId,
        difficulty as string
      );
      res.json(words);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      res.status(500).json({ message: "Failed to fetch vocabulary" });
    }
  });

  app.get("/api/languages/:languageId/vocabulary/random", async (req, res) => {
    try {
      const count = parseInt(req.query.count as string) || 10;
      const words = await storage.getRandomVocabularyWords(req.params.languageId, count);
      res.json(words);
    } catch (error) {
      console.error("Error fetching random vocabulary:", error);
      res.status(500).json({ message: "Failed to fetch random vocabulary" });
    }
  });

  app.post("/api/vocabulary", async (req, res) => {
    try {
      const wordData = insertVocabularyWordSchema.parse(req.body);
      const word = await storage.createVocabularyWord(wordData);
      res.status(201).json(word);
    } catch (error) {
      console.error("Error creating vocabulary word:", error);
      res.status(400).json({ message: "Invalid vocabulary data" });
    }
  });

  // Grammar exercise routes
  app.get("/api/languages/:languageId/grammar", async (req, res) => {
    try {
      const { difficulty } = req.query;
      const exercises = await storage.getGrammarExercises(
        req.params.languageId,
        difficulty as string
      );
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching grammar exercises:", error);
      res.status(500).json({ message: "Failed to fetch grammar exercises" });
    }
  });

  app.get("/api/languages/:languageId/grammar/random", async (req, res) => {
    try {
      const count = parseInt(req.query.count as string) || 5;
      const exercises = await storage.getRandomGrammarExercises(req.params.languageId, count);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching random grammar exercises:", error);
      res.status(500).json({ message: "Failed to fetch random grammar exercises" });
    }
  });

  app.post("/api/grammar", async (req, res) => {
    try {
      const exerciseData = insertGrammarExerciseSchema.parse(req.body);
      const exercise = await storage.createGrammarExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      console.error("Error creating grammar exercise:", error);
      res.status(400).json({ message: "Invalid grammar exercise data" });
    }
  });

  // Cultural stories routes
  app.get("/api/languages/:languageId/stories", async (req, res) => {
    try {
      const { level } = req.query;
      const stories = await storage.getCulturalStories(
        req.params.languageId,
        level as string
      );
      res.json(stories);
    } catch (error) {
      console.error("Error fetching cultural stories:", error);
      res.status(500).json({ message: "Failed to fetch cultural stories" });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await storage.getCulturalStory(req.params.id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const storyData = insertCulturalStorySchema.parse(req.body);
      const story = await storage.createCulturalStory(storyData);
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(400).json({ message: "Invalid story data" });
    }
  });

  // User stats routes
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Study session routes
  app.post("/api/study-sessions", async (req, res) => {
    try {
      const sessionData = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(400).json({ message: "Invalid study session data" });
    }
  });

  app.put("/api/study-sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateStudySession(req.params.id, req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating study session:", error);
      res.status(500).json({ message: "Failed to update study session" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const { languageId, limit } = req.query;
      const messages = await storage.getChatMessages(
        languageId as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  // Daily activity routes
  app.post("/api/users/:userId/daily-activity", async (req, res) => {
    try {
      const { date, ...activityData } = req.body;
      const activity = await storage.createOrUpdateDailyActivity(
        req.params.userId,
        new Date(date),
        activityData
      );
      res.json(activity);
    } catch (error) {
      console.error("Error updating daily activity:", error);
      res.status(500).json({ message: "Failed to update daily activity" });
    }
  });

  app.get("/api/users/:userId/streak", async (req, res) => {
    try {
      const streak = await storage.getUserStreak(req.params.userId);
      res.json({ streak });
    } catch (error) {
      console.error("Error fetching user streak:", error);
      res.status(500).json({ message: "Failed to fetch user streak" });
    }
  });

  // Achievements routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  return httpServer;
}
