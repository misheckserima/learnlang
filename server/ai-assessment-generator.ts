import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'listening';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
}

export interface GeneratedAssessment {
  id: string;
  testType: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit: number;
  learningStageId?: string;
}

export async function generateAssessmentTest(
  testType: string,
  targetLanguage: string,
  cefrLevel: string,
  questionCount: number = 10,
  stageContent?: any
): Promise<GeneratedAssessment> {
  try {
    const systemPrompt = `
You are an expert language assessment designer. Create a comprehensive ${testType} test for ${targetLanguage} at ${cefrLevel} level.

Generate ${questionCount} questions that test:
- Vocabulary comprehension and usage
- Grammar knowledge and application
- Reading comprehension
- Cultural understanding
- Practical language skills

Question types should include:
1. Multiple choice (4 options each)
2. Fill in the blank
3. Translation exercises
4. Context-based comprehension

For each question provide:
- Clear, unambiguous question text
- Correct answer
- Brief explanation of why the answer is correct
- Appropriate difficulty level
- Context that makes the question relevant

${stageContent ? `Base questions on this learning content: ${JSON.stringify(stageContent)}` : ''}

The test should have an 80% passing threshold and 20-minute time limit.
Respond with valid JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: `${systemPrompt}\n\nGenerate a ${testType} assessment for ${targetLanguage} at ${cefrLevel} level with ${questionCount} questions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            testType: { type: "string" },
            timeLimit: { type: "number" },
            passingScore: { type: "number" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string", enum: ["multiple_choice", "fill_blank", "translation", "listening"] },
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  },
                  correctAnswer: { type: "string" },
                  explanation: { type: "string" },
                  difficulty: { type: "string" }
                },
                required: ["id", "type", "question", "correctAnswer", "explanation", "difficulty"]
              }
            }
          },
          required: ["testType", "timeLimit", "passingScore", "questions"]
        }
      }
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from AI model");
    }

    const assessmentData = JSON.parse(rawJson);
    
    return {
      id: `test_${Date.now()}`,
      testType,
      questions: assessmentData.questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `q_${index + 1}`
      })),
      passingScore: assessmentData.passingScore || 80,
      timeLimit: assessmentData.timeLimit || 20,
      learningStageId: stageContent?.stageId
    };

  } catch (error) {
    console.error("Error generating assessment test:", error);
    throw new Error(`Failed to generate assessment: ${error}`);
  }
}

export async function evaluateAssessment(
  questions: AssessmentQuestion[],
  answers: Record<string, string>,
  timeSpent: number
): Promise<{
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  feedback: string;
  nextSteps: string[];
}> {
  const totalQuestions = questions.length;
  let correctAnswers = 0;
  const incorrectQuestions: string[] = [];

  // Evaluate answers
  questions.forEach(question => {
    const userAnswer = answers[question.id]?.trim().toLowerCase();
    const correctAnswer = question.correctAnswer.trim().toLowerCase();
    
    if (question.type === 'multiple_choice') {
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      } else {
        incorrectQuestions.push(question.question);
      }
    } else if (question.type === 'fill_blank' || question.type === 'translation') {
      // More flexible matching for open-ended questions
      if (userAnswer && correctAnswer.includes(userAnswer) || userAnswer === correctAnswer) {
        correctAnswers++;
      } else {
        incorrectQuestions.push(question.question);
      }
    }
  });

  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= 80;

  let feedback = "";
  let nextSteps: string[] = [];

  if (passed) {
    feedback = `Excellent work! You scored ${score}% and have demonstrated strong understanding of the material. You're ready to move to the next level.`;
    nextSteps = [
      "Continue to the next learning stage",
      "Practice speaking with community members",
      "Review any challenging concepts"
    ];
  } else {
    feedback = `You scored ${score}%. You need 80% to pass. Focus on the areas where you made mistakes and try again.`;
    nextSteps = [
      "Review the learning materials again",
      "Practice vocabulary with flashcards",
      "Take the spaced repetition quiz",
      "Retake the assessment when ready"
    ];
  }

  return {
    score,
    passed,
    correctAnswers,
    totalQuestions,
    feedback,
    nextSteps
  };
}