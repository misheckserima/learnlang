import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTeachingQuestions(interests: string[]): Promise<string[]> {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 5 conversation starter questions that a language teacher could ask during a video call language exchange session. 

User's interests: ${interests.join(", ")}

Requirements:
- Questions should be engaging and relevant to the user's interests
- Suitable for intermediate to advanced language learners
- Encourage discussion and practice
- Should be open-ended to promote conversation
- Focus on practical, real-world topics

Return the questions as a simple array of strings.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response and extract questions
    const questions = text.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.?\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5); // Ensure we only return 5 questions

    return questions.length > 0 ? questions : [
      "What aspect of your field interests you the most?",
      "Can you describe a typical day in your work or studies?",
      "What challenges do you face in your area of interest?",
      "How do you stay updated with developments in your field?",
      "What advice would you give to someone starting in your area?"
    ];
  } catch (error) {
    console.error("Error generating teaching questions:", error);
    
    // Return fallback questions based on interests
    const fallbackQuestions = [
      "What aspect of your field interests you the most?",
      "Can you describe a typical day in your work or studies?", 
      "What challenges do you face in your area of interest?",
      "How do you stay updated with developments in your field?",
      "What advice would you give to someone starting in your area?"
    ];

    return fallbackQuestions;
  }
}