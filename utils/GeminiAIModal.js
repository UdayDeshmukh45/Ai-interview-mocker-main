import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Available generation models in order of preference with fallback support
const MODEL_CANDIDATES = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-2.5-pro",
];

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Execute Gemini call with automatic candidate fallback and retry
 */
export async function callGemini(prompt, responseMimeType = "application/json") {
  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.85,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: responseMimeType,
        },
        safetySettings,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        return text;
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed: ${err.message}. Trying next candidate...`);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to get response from Gemini AI models.");
}

/**
 * Helper to safely extract JSON data even if wrapped in markdown fences or comments
 */
export function safeExtractJson(text) {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/```$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```$/, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt to locate first '[' or '{' and last ']' or '}'
    const firstArr = cleaned.indexOf("[");
    const lastArr = cleaned.lastIndexOf("]");
    if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
      try {
        return JSON.parse(cleaned.substring(firstArr, lastArr + 1));
      } catch (_) {}
    }

    const firstObj = cleaned.indexOf("{");
    const lastObj = cleaned.lastIndexOf("}");
    if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
      try {
        return JSON.parse(cleaned.substring(firstObj, lastObj + 1));
      } catch (_) {}
    }

    throw err;
  }
}

/**
 * Generate interview questions based on job role, description and experience
 */
export async function generateInterviewQuestions({
  jobPosition,
  jobDesc,
  jobExperience,
  count = 5,
}) {
  const prompt = `You are an expert technical interviewer.
Job Position: ${jobPosition}
Job Description: ${jobDesc}
Years of Experience: ${jobExperience}

Generate exactly ${count} interview questions with comprehensive sample answers suitable for this role and experience level.
Return your response ONLY as a valid JSON array of objects, where each object has:
- "question": string (the interview question)
- "answer": string (the ideal expected answer)`;

  const raw = await callGemini(prompt, "application/json");
  const parsed = safeExtractJson(raw);

  // Normalize if output is wrapped in an object like { questions: [...] }
  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (parsed && typeof parsed === "object") {
    const possibleArray = Object.values(parsed).find((val) => Array.isArray(val));
    if (possibleArray) return possibleArray;
  }

  return [];
}

/**
 * Generate rating and constructive feedback on a user's answer
 */
export async function generateAnswerFeedback({
  question,
  expectedAnswer,
  userAnswer,
}) {
  const prompt = `You are an expert interview coach evaluating a candidate's answer.
Question: ${question}
Expected/Ideal Answer: ${expectedAnswer || "Provide a correct and comprehensive answer."}
Candidate's Answer: ${userAnswer}

Evaluate the candidate's answer.
Return your response ONLY as a JSON object with:
- "rating": string (e.g. "8/10", "4/5", or "Good")
- "feedback": string (constructive feedback in 3 to 5 sentences mentioning strengths and specific areas to improve)`;

  const raw = await callGemini(prompt, "application/json");
  const parsed = safeExtractJson(raw);
  return {
    rating: parsed?.rating ? String(parsed.rating) : "3/5",
    feedback: parsed?.feedback || "No specific feedback provided.",
  };
}

/**
 * Backward compatibility: export chatSession with sendMessage
 */
export const chatSession = {
  sendMessage: async (prompt) => {
    const text = await callGemini(prompt, "application/json");
    return {
      response: {
        text: () => text,
      },
    };
  },
};
