import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ 
  apiKey: process.env.AI_ENGINE_KEY || "" 
});

export const RESUME_MODEL = "gemini-3-flash-preview";
export const CHAT_MODEL = "gemini-3-flash-preview";
