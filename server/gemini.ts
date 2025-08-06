import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface LearningStage {
  title: string;
  description: string;
  difficulty: string;
  vocabularyWords: any[];
  grammarTopics: any[];
  culturalNotes: string[];
  completionCriteria: any;
}

export interface VocabularyWord {
  word: string;
  translation: string;
  pronunciation: string;
  difficulty: string;
  context: string;
  example: string;
}

export async function generateLearningPathway(
  targetLanguage: string,
  nativeLanguage: string,
  cefrLevel: string,
  interests: string[],
  fieldOfLearning?: string | null
): Promise<LearningStage[]> {
  try {
    const systemPrompt = `
You are an expert language curriculum designer. Create a progressive learning pathway for ${targetLanguage} tailored to:
- Current level: ${cefrLevel}
- Interests: ${interests.join(", ")}
- Field of study: ${fieldOfLearning || "General"}
- Native language: ${nativeLanguage}

Generate 6-8 learning stages that build progressively. Each stage should include:
1. Title (engaging and descriptive)
2. Description (what the learner will achieve)
3. Difficulty level (beginner, intermediate, advanced)
4. 10-15 vocabulary words with translations, pronunciation, and example sentences
5. 3-5 grammar topics with explanations
6. Cultural notes (3-5 interesting facts)
7. Completion criteria (specific skills to master)

Make the content culturally rich and engaging. Focus on practical, real-world usage.
Respond with valid JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              difficulty: { type: "string" },
              vocabularyWords: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    word: { type: "string" },
                    translation: { type: "string" },
                    pronunciation: { type: "string" },
                    difficulty: { type: "string" },
                    context: { type: "string" },
                    example: { type: "string" }
                  },
                  required: ["word", "translation", "pronunciation", "difficulty", "context", "example"]
                }
              },
              grammarTopics: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    topic: { type: "string" },
                    explanation: { type: "string" },
                    examples: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["topic", "explanation", "examples"]
                }
              },
              culturalNotes: {
                type: "array",
                items: { type: "string" }
              },
              completionCriteria: {
                type: "object",
                properties: {
                  vocabularyMastery: { type: "number" },
                  grammarUnderstanding: { type: "number" },
                  practiceExercises: { type: "number" }
                },
                required: ["vocabularyMastery", "grammarUnderstanding", "practiceExercises"]
              }
            },
            required: ["title", "description", "difficulty", "vocabularyWords", "grammarTopics", "culturalNotes", "completionCriteria"]
          }
        }
      },
      contents: `Create a learning pathway for ${targetLanguage} based on the user profile.`
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    const stages: LearningStage[] = JSON.parse(rawJson);
    return stages;
  } catch (error) {
    console.error("Error generating learning pathway:", error);
    throw new Error(`Failed to generate learning pathway: ${error}`);
  }
}

export async function generateVocabularySet(
  language: string,
  topic: string,
  difficulty: string,
  count: number = 10
): Promise<VocabularyWord[]> {
  try {
    const systemPrompt = `
You are a vocabulary expert. Generate ${count} ${difficulty} level vocabulary words in ${language} related to ${topic}.
Each word should include:
- The word in the target language
- English translation
- Pronunciation guide (IPA or simplified)
- Difficulty level
- Context where it's commonly used
- Example sentence in the target language with English translation

Make the vocabulary practical and relevant to daily conversation.
Respond with valid JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              word: { type: "string" },
              translation: { type: "string" },
              pronunciation: { type: "string" },
              difficulty: { type: "string" },
              context: { type: "string" },
              example: { type: "string" }
            },
            required: ["word", "translation", "pronunciation", "difficulty", "context", "example"]
          }
        }
      },
      contents: `Generate vocabulary for ${topic} in ${language}.`
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    const vocabulary: VocabularyWord[] = JSON.parse(rawJson);
    return vocabulary;
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw new Error(`Failed to generate vocabulary: ${error}`);
  }
}

export async function generateContent(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate content: ${error}`);
  }
}

export async function generateGrammarExercise(
  language: string,
  grammarTopic: string,
  difficulty: string
): Promise<any> {
  try {
    const systemPrompt = `
Create a grammar exercise for ${language} focusing on ${grammarTopic} at ${difficulty} level.
Include:
- Clear explanation of the grammar rule
- 5-7 example sentences
- 5 practice questions with multiple choice answers
- Correct answers with explanations

Make it educational and engaging.
Respond with valid JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            topic: { type: "string" },
            explanation: { type: "string" },
            examples: {
              type: "array",
              items: { type: "string" }
            },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  },
                  correct: { type: "number" },
                  explanation: { type: "string" }
                },
                required: ["question", "options", "correct", "explanation"]
              }
            }
          },
          required: ["topic", "explanation", "examples", "questions"]
        }
      },
      contents: `Create a grammar exercise for ${grammarTopic} in ${language}.`
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Error generating grammar exercise:", error);
    throw new Error(`Failed to generate grammar exercise: ${error}`);
  }
}