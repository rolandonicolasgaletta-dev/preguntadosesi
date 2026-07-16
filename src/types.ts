export interface Question {
  id: string;
  category: "Cuidar el cuerpo" | "Valorar la afectividad" | "Garantizar la equidad de género" | "Respetar la diversidad" | "Ejercer nuestros derechos" | "Leyes y Derechos";
  text: string;
  options: [string, string, string, string]; // exactly 4 options
  correctIndex: number; // 0 to 3
  explanation: string;
}

export interface ScoreRecord {
  id: string;
  nickname: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
}
