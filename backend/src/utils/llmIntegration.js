import axios from 'axios';

// 1. OpenRouter (Using a real model like Mistral or Llama)
const getOpenRouterRecommendation = async (prompt) => {
  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "mistralai/mistral-7b-instruct:free", // Free model
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: { "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    return response.data.choices[0].message.content;
  } catch (error) { return null; }
};

// 2. Groq (Fast and reliable)
const getGroqRecommendation = async (prompt) => {
  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}` }
    });
    return response.data.choices[0].message.content;
  } catch (error) { return null; }
};

// 3. Gemini (Google)
const getGeminiRecommendation = async (prompt) => {
  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) { return null; }
};

export const getRecommendationWithFailover = async (prompt) => {
  // Try Groq first (it's the fastest), then OpenRouter, then Gemini
  let res = await getGroqRecommendation(prompt);
  if (!res) res = await getOpenRouterRecommendation(prompt);
  if (!res) res = await getGeminiRecommendation(prompt);
  return res || "Try searching for similar engineering tools!";
};