import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("ADVERTENCIA: GEMINI_API_KEY no está configurada en las variables de entorno.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint to generate educational ESI questions using Gemini 3.5 Flash
app.post("/api/gemini/generate-questions", async (req, res) => {
  try {
    const { topic, amount = 3 } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: "Falta el tema (topic) para la generación de preguntas." });
    }

    const ai = getGeminiAI();
    
    const systemInstruction = `Eres un docente experto en Educación Sexual Integral (ESI) y leyes de género y diversidad de Argentina (como la Ley 26.150 de ESI, Ley Micaela 27.499, Ley de Matrimonio Igualitario 26.618, Ley de Identidad de Género 26.743 y Ley de Protección Integral a las Mujeres 26.485).
Tu tarea es generar preguntas educativas de opción múltiple para estudiantes de escuela secundaria (adolescentes de 12 a 18 años).
Las preguntas deben ser:
- Rigurosas y precisas respecto de los marcos legales y sanitarios, sin inventar leyes o datos.
- Respetuosas, amigables, inclusivas, libres de prejuicios y con un enfoque de derechos y cuidado mutuo.
- Escritas en un lenguaje comprensible para jóvenes, evitando jerga innecesaria pero manteniendo la seriedad que requiere el tema.
- De opción múltiple con exactamente 4 opciones bien diferenciadas. Solo una debe ser correcta.
- Cada pregunta debe incluir una explicación pedagógica clara que enseñe algo valioso (por qué es correcta, qué promueve, etc.).

Debes clasificar cada pregunta en uno de los 5 ejes de la ESI o en la categoría 'Leyes y Derechos':
- 'Cuidar el cuerpo' (salud integral, autocuidado, límites, diversidad corporal, intimidad)
- 'Valorar la afectividad' (sentimientos, comunicación, empatía, resolución de conflictos, relaciones sanas, consentimiento)
- 'Garantizar la equidad de género' (igualdad de derechos, cuestionamiento de roles y estereotipos)
- 'Respetar la diversidad' (valoración de la diversidad sexual, identidad de género, no discriminación)
- 'Ejercer nuestros derechos' (participación ciudadana, derecho a opinar, pedir ayuda ante abusos, protección ante grooming)
- 'Leyes y Derechos' (Leyes argentinas específicas sobre género y diversidad)

Genera exactamente ${amount} preguntas sobre el tema solicitado: "${topic}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Genera ${amount} preguntas educativas de opción múltiple sobre el tema: "${topic}".`,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "La categoría exacta de la pregunta. Debe ser uno de estos valores: 'Cuidar el cuerpo', 'Valorar la afectividad', 'Garantizar la equidad de género', 'Respetar la diversidad', 'Ejercer nuestros derechos', 'Leyes y Derechos'."
              },
              text: {
                type: Type.STRING,
                description: "La pregunta de opción múltiple dirigida a estudiantes de secundaria."
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                },
                description: "Exactamente 4 opciones de respuesta en español de Argentina/neutro."
              },
              correctIndex: {
                type: Type.INTEGER,
                description: "El índice (0, 1, 2 o 3) de la opción de respuesta correcta."
              },
              explanation: {
                type: Type.STRING,
                description: "Una breve explicación cálida e instructiva del fundamento de la respuesta correcta (1-3 oraciones)."
              }
            },
            required: ["category", "text", "options", "correctIndex", "explanation"]
          },
          description: "Lista de preguntas sobre ESI para secundaria."
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se recibió respuesta de texto de Gemini.");
    }

    const questions = JSON.parse(text);
    
    // Add temporary unique IDs to the generated questions
    const processedQuestions = questions.map((q: any, index: number) => ({
      ...q,
      id: `gen-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`
    }));

    res.json({ questions: processedQuestions });
  } catch (error: any) {
    console.error("Error al generar preguntas con Gemini:", error);
    res.status(500).json({ error: "No se pudo generar las preguntas. Intenta de nuevo más tarde.", details: error.message });
  }
});

// Configure Vite middleware in development or serve static files in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configurando servidor Express con Vite en modo de desarrollo...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Servidor Express en modo de producción, sirviendo archivos estáticos...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de Preguntados ESI corriendo en puerto ${PORT}`);
  });
}

setupServer();
