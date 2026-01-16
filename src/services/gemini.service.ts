
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // This assumes process.env.API_KEY is available in the execution environment.
    // In a real-world browser app, this key would be exposed. 
    // For this special "Applet" environment, we follow the instructions.
    if (!process.env.API_KEY) {
      console.warn("API_KEY environment variable not set. Using a placeholder. This will fail if not replaced.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });
  }

  async fetchNovelChapter(title: string): Promise<string> {
    const prompt = `Write the first chapter of a fictional novel titled "${title}". 
      The chapter must be immersive, well-detailed, and at least 1000 words long. 
      It should establish the main character, setting, and a hint of the central conflict. 
      Do not include any introductory text like "Here is the first chapter..." or "Chapter 1". 
      Begin directly with the narrative. Ensure the generated text is clean and contains no advertisements or external links.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
        }
      });
      
      const text = response.text;
      if (!text) {
        throw new Error('Received an empty response from the AI.');
      }
      return text;

    } catch (error) {
      console.error('Gemini API call failed:', error);
      // Re-throw a more user-friendly error
      throw new Error('The AI storyteller is currently resting. Please try again in a moment.');
    }
  }
}
