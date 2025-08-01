import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertLanguageSchema,
  insertVocabularyWordSchema,
  insertGrammarExerciseSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

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