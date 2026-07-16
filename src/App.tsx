import { useState, useEffect } from "react";
import { Question } from "./types";
import { DEFAULT_QUESTIONS } from "./questions";
import WelcomeScreen from "./components/WelcomeScreen";
import GameScreen from "./components/GameScreen";
import ResultsScreen from "./components/ResultsScreen";
import DocenteScreen from "./components/DocenteScreen";
import QRModal from "./components/QRModal";
import { QrCode, Sparkles } from "lucide-react";

export default function App() {
  // Screen views: "welcome" | "quiz" | "results" | "docente"
  const [screen, setScreen] = useState<"welcome" | "quiz" | "results" | "docente">("welcome");
  
  // Game state
  const [nickname, setNickname] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<any[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);

  // Questions Bank State (Loaded from localStorage or defaults)
  const [questionsBank, setQuestionsBank] = useState<Question[]>([]);

  // QR Modal open state
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Load questions bank on mount
  useEffect(() => {
    const saved = localStorage.getItem("esi_questions_bank");
    if (saved) {
      try {
        setQuestionsBank(JSON.parse(saved));
      } catch (err) {
        console.error("Error al cargar banco de preguntas, usando por defecto:", err);
        setQuestionsBank(DEFAULT_QUESTIONS);
      }
    } else {
      setQuestionsBank(DEFAULT_QUESTIONS);
      localStorage.setItem("esi_questions_bank", JSON.stringify(DEFAULT_QUESTIONS));
    }
  }, []);

  // Sync questions bank to localStorage on update
  const saveQuestions = (newBank: Question[]) => {
    setQuestionsBank(newBank);
    localStorage.setItem("esi_questions_bank", JSON.stringify(newBank));
  };

  // Add a new question to bank
  const handleAddQuestion = (newQ: Question) => {
    const updated = [newQ, ...questionsBank];
    saveQuestions(updated);
  };

  // Edit existing question
  const handleEditQuestion = (editedQ: Question) => {
    const updated = questionsBank.map((q) => (q.id === editedQ.id ? editedQ : q));
    saveQuestions(updated);
  };

  // Delete a question from bank
  const handleDeleteQuestion = (id: string) => {
    const updated = questionsBank.filter((q) => q.id !== id);
    saveQuestions(updated);
  };

  // Reset to original default questions
  const handleResetQuestions = () => {
    saveQuestions(DEFAULT_QUESTIONS);
  };

  // Setup random 10 questions for a new play session
  const handleStartGame = (userNickname: string) => {
    setNickname(userNickname);
    
    // Select 10 random questions from bank (or less if the bank is smaller)
    const shuffled = [...questionsBank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    
    setGameQuestions(selected);
    setScreen("quiz");
  };

  const handleFinishGame = (finalScore: number, correctAnswersCount: number, history: any[]) => {
    setScore(finalScore);
    setCorrectCount(correctAnswersCount);
    setAnswersHistory(history);
    setScreen("results");
  };

  const handleRestart = () => {
    handleStartGame(nickname);
  };

  const handleGoHome = () => {
    setScreen("welcome");
    setScore(0);
    setCorrectCount(0);
    setAnswersHistory([]);
    setGameQuestions([]);
  };

  // Get current App URL for QR projection
  // AI Studio injects APP_URL at runtime, fallback to window.location.href
  const appUrl = window.location.origin || window.location.href;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans antialiased flex flex-col justify-between py-6 px-4 sm:py-12">
      
      {/* Floating QR Quick Launcher inside welcome screen context */}
      {screen === "welcome" && (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block">
          <button
            onClick={() => setIsQrOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg transition transform hover:scale-105"
          >
            <QrCode className="w-5 h-5" />
            <span>Código QR del Aula</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center">
        {screen === "welcome" && (
          <WelcomeScreen
            onStartGame={handleStartGame}
            onOpenDocente={() => setScreen("docente")}
            onOpenQR={() => setIsQrOpen(true)}
          />
        )}

        {screen === "quiz" && (
          <GameScreen
            questions={gameQuestions}
            nickname={nickname}
            onFinishGame={handleFinishGame}
            onExit={handleGoHome}
          />
        )}

        {screen === "results" && (
          <ResultsScreen
            nickname={nickname}
            score={score}
            correctAnswersCount={correctCount}
            totalQuestionsCount={gameQuestions.length}
            history={answersHistory}
            questions={gameQuestions}
            onRestart={handleRestart}
            onGoHome={handleGoHome}
          />
        )}

        {screen === "docente" && (
          <DocenteScreen
            questions={questionsBank}
            onAddQuestion={handleAddQuestion}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onResetQuestions={handleResetQuestions}
            onBack={() => setScreen("welcome")}
          />
        )}
      </main>

      {/* Footer Branding (Subtle, professional and clean) */}
      <footer className="mt-8 text-center text-xs text-gray-400 font-medium">
        <p>© {new Date().getFullYear()} Preguntados ESI — Herramienta Pedagógica para Escuela Secundaria</p>
        <p className="mt-1">Educación Sexual Integral · Ley 26.150 · Respeto, Cuidado y Derechos</p>
      </footer>

      {/* QR Code Projector Modal */}
      <QRModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        appUrl={appUrl}
      />
    </div>
  );
}
