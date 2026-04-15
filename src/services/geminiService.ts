import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CostItem {
  item: string;
  cost: string;
}

export interface TravelOption {
  type: 'Budget' | 'Medium' | 'Luxury';
  costUSD: string;
  costINR: string;
  time: string;
  transportType: string;
  routeSteps: string[];
  isBestChoice?: boolean;
  detailedExplanation: string;
  precautions: string[];
  costBreakdown: CostItem[];
}

export interface PopularPlace {
  name: string;
  description: string;
}

export interface TravelData {
  popularPlaces: PopularPlace[];
}

export async function getPopularPlaces(state: string, city: string): Promise<PopularPlace[]> {
  const prompt = `Use Google Search to find all the most popular, best, and must-visit travel destinations in ${city}, ${state}. 
  Provide a comprehensive list of at least 10-12 real and accurate locations.
  For each destination, provide:
  1. The exact official name of the place.
  2. A brief, engaging description.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      toolConfig: { includeServerSideToolInvocations: true },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          popularPlaces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["name", "description"],
            },
          },
        },
        required: ["popularPlaces"],
      },
    },
  });

  const rawData = JSON.parse(response.text || "{}");
  
  return rawData.popularPlaces.map((place: any) => ({
    name: place.name,
    description: place.description,
  }));
}

export async function getTravelOptions(state: string, city: string, destination: string, startLocation: string): Promise<TravelOption[]> {
  const prompt = `Provide 3 smart travel options to reach "${destination}" in ${city}, ${state} starting from "${startLocation}".
  Options should be: Budget Friendly (public transport), Medium Comfort (mix), and Luxury (fastest/private).
  For each option, provide:
  - Estimated overall cost in BOTH USD and INR (e.g., "$10" and "₹830")
  - Travel time
  - Primary transport type
  - 3-4 route steps
  - A detailed explanation of the route (why this route, what to expect)
  - 3-4 specific precautions or tips for this specific route (e.g., safety, local scams to avoid, best time to leave).
  - A detailed cost breakdown of local rates (e.g., "Bus ticket: ₹20", "Auto Rickshaw: ₹150", "Metro: ₹40"). Provide these as a list of items and their approximate costs in INR.
  Identify which one is the "Best Choice" based on a balance of cost and time.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      toolConfig: { includeServerSideToolInvocations: true },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["Budget", "Medium", "Luxury"] },
                costUSD: { type: Type.STRING },
                costINR: { type: Type.STRING },
                time: { type: Type.STRING },
                transportType: { type: Type.STRING },
                routeSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                detailedExplanation: { type: Type.STRING },
                precautions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                costBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      cost: { type: Type.STRING },
                    },
                    required: ["item", "cost"],
                  },
                },
                isBestChoice: { type: Type.BOOLEAN },
              },
              required: ["type", "costUSD", "costINR", "time", "transportType", "routeSteps", "detailedExplanation", "precautions", "costBreakdown"],
            },
          },
        },
        required: ["options"],
      },
    },
  });

  const rawData = JSON.parse(response.text || "{}");
  return rawData.options;
}
