import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertLanguageSchema,
  insertVocabularyWordSchema,
  insertGrammarExerciseSchema,
  insertLearningPathSchema,
  insertStudySessionSchema,
  insertProgressBenchmarkSchema,
  insertLearningStageSchema,
  insertUserConnectionSchema,
  insertVideoCallSessionSchema,
  updateUserProfileSchema,
} from "@shared/schema";
import { generateLearningPathway, generateVocabularySet } from "./gemini";
import { generateTeachingQuestions } from "./ai-teaching-questions";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Session configuration
  const PgSession = connectPgSimple(session);
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'learn-a-language-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiry on activity
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Keep secure from XSS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax', // Standard setting for same-origin
      path: '/'
    }
  }));

  // Middleware to extend session on each request
  app.use((req, res, next) => {
    if (req.session && req.session.userId) {
      req.session.touch();
    }
    next();
  });

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      
      // Remove sensitive data before sending response
      const { passwordHash, ...userResponse } = user;
      res.status(201).json({ user: userResponse, message: "Account created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.validatePassword(email, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.session.userId = user.id;
      
      // Remove sensitive data before sending response
      const { passwordHash, ...userResponse } = user;
      res.json({ user: userResponse, message: "Login successful" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data before sending response
      const { passwordHash, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
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

  // Profile routes
  app.put("/api/profile", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const profileData = updateUserProfileSchema.parse(req.body);
      const user = await storage.updateUserProfile(req.session.userId, profileData);
      
      // Remove sensitive data before sending response
      const { passwordHash, ...userResponse } = user;
      res.json({ user: userResponse, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Learning Path routes
  app.get("/api/learning-paths/:languageId", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const path = await storage.getUserLearningPath(req.session.userId, req.params.languageId);
      if (!path) {
        return res.json(null);
      }
      
      // Calculate progress statistics
      const stages = await storage.getLearningStages(path.id);
      const completedStages = stages.filter(stage => stage.isCompleted).length;
      const progressPercentage = stages.length > 0 ? (completedStages / stages.length) * 100 : 0;
      
      res.json({
        ...path,
        completedStages,
        totalStages: stages.length,
        progressPercentage
      });
    } catch (error) {
      console.error("Error fetching learning path:", error);
      res.status(500).json({ message: "Failed to fetch learning path" });
    }
  });

  app.post("/api/learning-paths", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const pathData = insertLearningPathSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      const path = await storage.createLearningPath(pathData);
      res.status(201).json(path);
    } catch (error) {
      console.error("Error creating learning path:", error);
      res.status(400).json({ message: "Invalid learning path data" });
    }
  });

  app.put("/api/learning-paths/:pathId", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const updateData = req.body;
      const path = await storage.updateLearningPath(req.params.pathId, updateData);
      res.json(path);
    } catch (error) {
      console.error("Error updating learning path:", error);
      res.status(400).json({ message: "Invalid learning path data" });
    }
  });

  // Study Session routes
  app.post("/api/study-sessions", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const sessionData = insertStudySessionSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(400).json({ message: "Invalid study session data" });
    }
  });

  app.get("/api/study-sessions", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const sessions = await storage.getUserStudySessions(req.session.userId, limit);
      res.json(sessions || []);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  // Progress Benchmark routes
  app.get("/api/progress-benchmarks", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const languageId = req.query.languageId as string;
      const benchmarks = await storage.getUserProgressBenchmarks(req.session.userId, languageId);
      res.json(benchmarks);
    } catch (error) {
      console.error("Error fetching progress benchmarks:", error);
      res.status(500).json({ message: "Failed to fetch progress benchmarks" });
    }
  });

  app.post("/api/progress-benchmarks", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const benchmarkData = insertProgressBenchmarkSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      const benchmark = await storage.createProgressBenchmark(benchmarkData);
      res.status(201).json(benchmark);
    } catch (error) {
      console.error("Error creating progress benchmark:", error);
      res.status(400).json({ message: "Invalid progress benchmark data" });
    }
  });

  // Learning Stage routes
  app.get("/api/learning-paths/:pathId/stages", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const stages = await storage.getLearningStages(req.params.pathId);
      res.json(stages || []);
    } catch (error) {
      console.error("Error fetching learning stages:", error);
      res.status(500).json({ message: "Failed to fetch learning stages" });
    }
  });

  app.post("/api/learning-paths/:pathId/generate", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const learningPath = await storage.getUserLearningPath(req.session.userId, req.body.languageId);
      if (!learningPath) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      // Get language information
      const language = await storage.getLanguages();
      const targetLanguage = language.find(l => l.id === req.body.languageId);
      if (!targetLanguage) {
        return res.status(404).json({ message: "Language not found" });
      }

      // Generate AI learning pathway
      const aiStages = await generateLearningPathway(
        targetLanguage.name,
        "English", // Default native language
        user.cefr_level || "A1",
        user.interests || [],
        user.fieldOfLearning
      );

      // Save stages to database
      const savedStages = [];
      for (let i = 0; i < aiStages.length; i++) {
        const stage = aiStages[i];
        const stageData = {
          learningPathId: learningPath.id,
          stageNumber: i + 1,
          title: stage.title,
          description: stage.description,
          difficulty: stage.difficulty,
          vocabularyData: stage.vocabularyWords,
          grammarTopics: stage.grammarTopics,
          culturalNotes: stage.culturalNotes,
          completionCriteria: stage.completionCriteria,
          isUnlocked: i === 0, // First stage is unlocked
          isCompleted: false
        };
        
        const savedStage = await storage.createLearningStage(stageData);
        savedStages.push(savedStage);
      }

      res.json({ stages: savedStages, message: "Learning pathway generated successfully" });
    } catch (error) {
      console.error("Error generating learning pathway:", error);
      res.status(500).json({ message: "Failed to generate learning pathway" });
    }
  });

  app.put("/api/learning-stages/:stageId/complete", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const stage = await storage.updateLearningStage(req.params.stageId, {
        isCompleted: true,
        completedAt: new Date()
      });

      // Unlock next stage
      await storage.unlockNextStage(stage.learningPathId, stage.stageNumber);

      res.json({ stage, message: "Stage completed successfully" });
    } catch (error) {
      console.error("Error completing stage:", error);
      res.status(500).json({ message: "Failed to complete stage" });
    }
  });

  // Friends/Connections routes
  app.get("/api/friends", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const connections = await storage.getUserConnections(req.session.userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  app.get("/api/friends/online", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const onlineFriends = await storage.getOnlineFriends(req.session.userId);
      res.json(onlineFriends);
    } catch (error) {
      console.error("Error fetching online friends:", error);
      res.status(500).json({ message: "Failed to fetch online friends" });
    }
  });

  app.post("/api/friends/connect", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const connectionData = insertUserConnectionSchema.parse({
        userId: req.session.userId,
        friendId: req.body.friendId,
        status: "pending"
      });

      const connection = await storage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      console.error("Error creating connection:", error);
      res.status(400).json({ message: "Invalid connection data" });
    }
  });

  app.put("/api/friends/:connectionId/status", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const connection = await storage.updateConnectionStatus(
        req.params.connectionId,
        req.body.status
      );
      res.json(connection);
    } catch (error) {
      console.error("Error updating connection status:", error);
      res.status(400).json({ message: "Failed to update connection status" });
    }
  });

  // Video Call routes
  app.post("/api/video-calls", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const callData = insertVideoCallSessionSchema.parse({
        initiatorId: req.session.userId,
        receiverId: req.body.receiverId,
        sessionId: req.body.sessionId || `call_${Date.now()}`,
        status: "pending"
      });

      const call = await storage.createVideoCallSession(callData);
      res.status(201).json(call);
    } catch (error) {
      console.error("Error creating video call:", error);
      res.status(400).json({ message: "Invalid video call data" });
    }
  });

  app.put("/api/video-calls/:callId/status", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const call = await storage.updateVideoCallStatus(
        req.params.callId,
        req.body.status
      );
      res.json(call);
    } catch (error) {
      console.error("Error updating video call status:", error);
      res.status(400).json({ message: "Failed to update video call status" });
    }
  });

  app.get("/api/video-calls/active", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const activeCalls = await storage.getActiveCallsForUser(req.session.userId);
      res.json(activeCalls);
    } catch (error) {
      console.error("Error fetching active calls:", error);
      res.status(500).json({ message: "Failed to fetch active calls" });
    }
  });

  // AI Content Generation routes
  app.post("/api/ai/vocabulary", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { language, topic, difficulty, count } = req.body;
      const vocabulary = await generateVocabularySet(language, topic, difficulty, count);
      res.json(vocabulary);
    } catch (error) {
      console.error("Error generating vocabulary:", error);
      res.status(500).json({ message: "Failed to generate vocabulary" });
    }
  });

  // Update user online status
  app.put("/api/users/online-status", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      await storage.updateUserOnlineStatus(req.session.userId, req.body.isOnline);
      res.json({ message: "Online status updated" });
    } catch (error) {
      console.error("Error updating online status:", error);
      res.status(500).json({ message: "Failed to update online status" });
    }
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  // Community and video call routes
  app.get("/api/community/matches", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // For now, return empty array - this would need proper implementation
      res.json([]);
    } catch (error) {
      console.error("Error fetching community matches:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/video-calls/initiate", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { partnerId } = req.body;
      if (!partnerId) {
        return res.status(400).json({ message: "Partner ID is required" });
      }

      // Mock response for now
      const callSession = {
        id: "call-" + Date.now(),
        teacherId: userId,
        learnerId: partnerId,
        status: "active",
        durationMinutes: 30
      };

      res.status(201).json(callSession);
    } catch (error) {
      console.error("Error initiating video call:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/video-calls/:callId/end", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      res.json({ message: "Call ended successfully" });
    } catch (error) {
      console.error("Error ending video call:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ai/generate-questions", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { interests } = req.body;
      
      // Generate teaching questions based on user interests
      const questions = await generateTeachingQuestions(interests || []);
      
      res.json({ questions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}