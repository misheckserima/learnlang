import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertLanguageSchema,
  insertVocabularyWordSchema,
  insertGrammarExerciseSchema,
} from "@shared/schema";
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
      tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

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

  return httpServer;
}