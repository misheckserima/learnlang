import { generateContent } from "./gemini";

export interface LearningContentRequest {
  category: string;
  subcategory?: string;
  contentType: string;
  cefrLevel: string;
  userProfile: {
    firstName: string;
    fieldOfLearning?: string;
    interests?: string[];
    preferredLearningStyle?: string;
  };
  targetLanguage: string;
}

export interface GeneratedContent {
  title: string;
  description: string;
  content: any;
  difficulty: string;
  estimatedTime: number; // minutes
}

export async function generateLearningContent(request: LearningContentRequest): Promise<GeneratedContent> {
  const prompt = buildContentPrompt(request);
  
  try {
    const response = await generateContent(prompt);
    const content = parseAIResponse(response, request.contentType);
    
    return {
      title: content.title || `${request.contentType} for ${request.category}`,
      description: content.description || `Learn ${request.contentType} in ${request.category}`,
      content: content.data,
      difficulty: mapCEFRToDifficulty(request.cefrLevel),
      estimatedTime: calculateEstimatedTime(request.contentType, request.cefrLevel)
    };
  } catch (error) {
    console.error("AI content generation failed:", error);
    return generateFallbackContent(request);
  }
}

function buildContentPrompt(request: LearningContentRequest): string {
  const { category, subcategory, contentType, cefrLevel, userProfile, targetLanguage } = request;
  
  let prompt = `Generate ${contentType} learning content for ${targetLanguage} language learning.
  
Context:
- Category: ${category}${subcategory ? ` > ${subcategory}` : ''}
- Content Type: ${contentType}
- CEFR Level: ${cefrLevel}
- User's Field: ${userProfile.fieldOfLearning || 'General'}
- User's Interests: ${userProfile.interests?.join(', ') || 'General topics'}
- Learning Style: ${userProfile.preferredLearningStyle || 'Mixed'}

Requirements:
- Content must be appropriate for ${cefrLevel} level
- Focus on ${category} domain${subcategory ? ` specifically ${subcategory}` : ''}
- Include practical, real-world applications
- Provide clear explanations and examples
- Consider the user's learning style: ${userProfile.preferredLearningStyle}

`;

  switch (contentType) {
    case 'terms':
      prompt += `Generate 15-20 technical terms related to ${category}${subcategory ? ` > ${subcategory}` : ''}.
      Format as JSON: {
        "title": "Technical Terms: [Topic]",
        "description": "Essential terminology for [field]",
        "data": [
          {
            "term": "word",
            "translation": "translated word",
            "definition": "clear definition",
            "example": "example sentence",
            "pronunciation": "phonetic guide",
            "difficulty": "beginner|intermediate|advanced"
          }
        ]
      }`;
      break;
      
    case 'vocabulary':
      prompt += `Generate 20-25 vocabulary words commonly used in ${category}${subcategory ? ` > ${subcategory}` : ''}.
      Format as JSON: {
        "title": "Vocabulary: [Topic]",
        "description": "Essential words for [field]",
        "data": [
          {
            "word": "word",
            "translation": "translated word",
            "partOfSpeech": "noun|verb|adjective|etc",
            "definition": "clear definition",
            "example": "example sentence",
            "synonyms": ["synonym1", "synonym2"],
            "difficulty": "beginner|intermediate|advanced"
          }
        ]
      }`;
      break;
      
    case 'sentences':
      prompt += `Generate 15-20 example sentences commonly used in ${category}${subcategory ? ` > ${subcategory}` : ''}.
      Format as JSON: {
        "title": "Sample Sentences: [Topic]",
        "description": "Common phrases and expressions",
        "data": [
          {
            "sentence": "example sentence",
            "translation": "translated sentence",
            "context": "when to use this",
            "breakdown": "grammatical explanation",
            "difficulty": "beginner|intermediate|advanced"
          }
        ]
      }`;
      break;
      
    case 'conversation':
      prompt += `Generate 3-5 realistic conversations that might occur in ${category}${subcategory ? ` > ${subcategory}` : ''} settings.
      Format as JSON: {
        "title": "Conversations: [Topic]",
        "description": "Real-world dialogues",
        "data": [
          {
            "title": "conversation title",
            "scenario": "description of situation",
            "dialogue": [
              {"speaker": "Person A", "text": "what they say", "translation": "translation"},
              {"speaker": "Person B", "text": "response", "translation": "translation"}
            ],
            "keyPhrases": ["phrase1", "phrase2"],
            "difficulty": "beginner|intermediate|advanced"
          }
        ]
      }`;
      break;
  }

  prompt += `\n\nRespond only with valid JSON. Ensure all content is appropriate for ${cefrLevel} level learners.`;
  
  return prompt;
}

function parseAIResponse(response: string, contentType: string): any {
  try {
    // Clean the response to extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No valid JSON found in response");
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw error;
  }
}

function mapCEFRToDifficulty(cefrLevel: string): string {
  switch (cefrLevel) {
    case 'A1':
    case 'A2':
      return 'beginner';
    case 'B1':
    case 'B2':
      return 'intermediate';
    case 'C1':
    case 'C2':
      return 'advanced';
    default:
      return 'beginner';
  }
}

function calculateEstimatedTime(contentType: string, cefrLevel: string): number {
  const baseTime = {
    'terms': 20,
    'vocabulary': 25,
    'sentences': 15,
    'conversation': 30
  };
  
  const multiplier = {
    'A1': 1.0,
    'A2': 1.2,
    'B1': 1.5,
    'B2': 1.8,
    'C1': 2.0,
    'C2': 2.5
  };
  
  return Math.round((baseTime[contentType] || 20) * (multiplier[cefrLevel] || 1.0));
}

function generateFallbackContent(request: LearningContentRequest): GeneratedContent {
  // Fallback content when AI generation fails
  const fallbackData = {
    terms: [
      {
        term: "Example Term",
        translation: "Translated Term",
        definition: "A sample definition for learning purposes",
        example: "This is an example sentence using the term.",
        pronunciation: "/ɪɡˈzæmpəl/",
        difficulty: mapCEFRToDifficulty(request.cefrLevel)
      }
    ],
    vocabulary: [
      {
        word: "Learn",
        translation: "Aprender",
        partOfSpeech: "verb",
        definition: "To acquire knowledge or skill",
        example: "I want to learn a new language.",
        synonyms: ["study", "acquire"],
        difficulty: mapCEFRToDifficulty(request.cefrLevel)
      }
    ],
    sentences: [
      {
        sentence: "I am learning this topic.",
        translation: "Estoy aprendiendo este tema.",
        context: "When studying new material",
        breakdown: "Subject + auxiliary verb + main verb + object",
        difficulty: mapCEFRToDifficulty(request.cefrLevel)
      }
    ],
    conversation: [
      {
        title: "Basic Introduction",
        scenario: "Meeting someone new in a professional setting",
        dialogue: [
          { speaker: "Person A", text: "Hello, nice to meet you.", translation: "Hola, mucho gusto." },
          { speaker: "Person B", text: "Nice to meet you too!", translation: "¡Mucho gusto también!" }
        ],
        keyPhrases: ["nice to meet you", "hello"],
        difficulty: mapCEFRToDifficulty(request.cefrLevel)
      }
    ]
  };

  return {
    title: `${request.contentType} for ${request.category}`,
    description: `Basic ${request.contentType} content for ${request.category}`,
    content: fallbackData[request.contentType] || fallbackData.vocabulary,
    difficulty: mapCEFRToDifficulty(request.cefrLevel),
    estimatedTime: calculateEstimatedTime(request.contentType, request.cefrLevel)
  };
}

export async function generateFlashcardsFromContent(content: any, contentType: string): Promise<Array<{front: string, back: string, cardType: string}>> {
  const flashcards: Array<{front: string, back: string, cardType: string}> = [];
  
  if (contentType === 'terms' && Array.isArray(content)) {
    content.forEach(term => {
      flashcards.push({
        front: term.term,
        back: `${term.translation}\n\n${term.definition}`,
        cardType: 'vocabulary'
      });
    });
  } else if (contentType === 'vocabulary' && Array.isArray(content)) {
    content.forEach(word => {
      flashcards.push({
        front: word.word,
        back: `${word.translation}\n\n${word.definition}`,
        cardType: 'vocabulary'
      });
    });
  } else if (contentType === 'sentences' && Array.isArray(content)) {
    content.forEach(sentence => {
      flashcards.push({
        front: sentence.sentence,
        back: sentence.translation,
        cardType: 'sentence'
      });
    });
  }
  
  return flashcards;
}