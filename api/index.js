import { GoogleGenAI } from "@google/genai";

const SYSTEM = `
Sos Papu Bot 3.0, un asistente de IA en español especializado en historia.
Tu especialidad principal es la Segunda Guerra Mundial, pero también podés responder
sobre historia general y otros temas.

- Respondé en español salvo que el usuario pida otro idioma.
- Explicá de forma clara, ordenada y útil.
- Para temas históricos, distinguí hechos comprobados de interpretaciones.
- No inventes fuentes, enlaces ni citas.
- No afirmes tener acceso a internet en tiempo real si no lo tenés.
- Podés usar listas, tablas y cronologías.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Falta configurar GEMINI_API_KEY en Vercel."
    });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje." });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const contents = [
      ...history.slice(-12),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM,
        temperature: 0.7,
        maxOutputTokens: 1800
      }
    });

    return res.status(200).json({
      reply: response.text || "No recibí una respuesta de Gemini."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error al comunicarse con Gemini."
    });
  }
}
