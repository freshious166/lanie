
import { GoogleGenAI } from "@google/genai";
import { Vehicle } from "../types";

const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || "";
    }
  } catch (e) {}
  return "";
};

export const geminiService = {
  async analyzeVehicleHealth(vehicle: Vehicle) {
    const apiKey = getApiKey();
    if (!apiKey) return "AI analysis unavailable: Missing API Key.";

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Act as an expert automotive technician. Analyze this vehicle:
    Model: ${vehicle.year} ${vehicle.make} ${vehicle.model}
    Odometer: ${vehicle.odometer} miles
    Status: ${vehicle.status}
    
    Provide a short, 3-bullet point health summary and one urgent recommendation for maintenance based on this mileage and status.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("LaineFleet Gemini Error:", error);
      return "Unable to retrieve AI analysis at this time. Please check your connection.";
    }
  },

  async discoverWorkshops(query: string, location: { lat: number; lng: number }) {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find 5 high-quality automotive workshops or service centers specializing in ${query || 'general maintenance'} near my current location.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng
              }
            }
          }
        },
      });

      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // Map grounding chunks into a structured format
      const workshops = groundingChunks
        .filter(chunk => chunk.maps)
        .map((chunk, index) => ({
          id: `ws-${index}`,
          name: chunk.maps?.title || "Workshop",
          uri: chunk.maps?.uri || "#",
          description: text.split('\n').find(line => line.includes(chunk.maps?.title)) || "Professional automotive service."
        }));

      return { text, workshops };
    } catch (error) {
      console.error("Discovery Error:", error);
      return null;
    }
  },

  async askAssistant(question: string, context?: Vehicle) {
    const apiKey = getApiKey();
    if (!apiKey) return "Assistant unavailable: Missing API Key.";

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `User Question: ${question}
    ${context ? `Relevant Vehicle context: ${context.year} ${context.make} ${context.model} with ${context.odometer} miles.` : ''}
    Keep the answer concise, professional, and safety-oriented.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "I'm having trouble connecting to the LaineFleet cloud. Please try again in a few moments.";
    }
  }
};
