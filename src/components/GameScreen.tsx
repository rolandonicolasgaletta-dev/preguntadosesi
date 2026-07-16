import { useState, useEffect, useRef } from "react";
import { Question } from "../types";
import { Timer, Award, Zap, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface GameScreenProps {
  questions: Question[];
  nickname: string;
  onFinishGame: (score: number, correctAnswersCount: number, history: any[]) => void;
  onExit: () => void;
}

export default function GameScreen({ questions, nickname, onFinishGame, onExit }: GameScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds limit
  const totalTime = 30;

  // History to pass to results
  const [answersHistory, setAnswersHistory] = useState<any[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (hasAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, hasAnswered]);

  const handleTimeOut = () => {
    setSelectedOption(null);
    setHasAnswered(true);
    setStreak(0);
    
    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        wasCorrect: false,
        selectedIndex: -1,
        scoreEarned: 0,
      },
    ]);
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    let earnedPoints = 0;

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      
      // Calculate score: 100 base + speed bonus + streak bonus
      const speedBonus = Math.round((timeLeft / totalTime) * 100);
      const streakBonus = nextStreak > 1 ? (nextStreak - 1) * 20 : 0;
      earnedPoints = 100 + speedBonus + streakBonus;
      
      setScore((prev) => prev + earnedPoints);
    } else {
      setStreak(0);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        wasCorrect: isCorrect,
        selectedIndex: idx,
        scoreEarned: earnedPoints,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      setTimeLeft(totalTime);
    } else {
      const correctAnswers = answersHistory.filter((h) => h.wasCorrect).length;
      onFinishGame(score, correctAnswers, answersHistory);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Cuidar el cuerpo":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Valorar la afectividad":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "Garantizar la equidad de género":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Respetar la diversidad":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Ejercer nuestros derechos":
        return "bg-teal-50 text-teal-700 border-teal-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const getOptionStyle = (idx: number) => {
    if (!hasAnswered) {
      return "border-slate-200 hover:border-teal-400 hover:bg-slate-50 text-gray-700 active:bg-teal-50/50";
    }

    const isCorrectOption = idx === currentQuestion.correctIndex;
    const isSelectedOption = idx === selectedOption;

    if (isCorrectOption) {
      return "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-400";
    }
    if (isSelectedOption && !isCorrectOption) {
      return "border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-400";
    }
    return "border-slate-100 bg-slate-50/50 text-gray-400 opacity-60";
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header info (Score, Progress, Streak) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-1.5 text-gray-600">
          <span className="text-xs font-semibold uppercase tracking-wider">Pregunta</span>
          <span className="text-sm font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
            {currentIdx + 1} de {questions.length}
          </span>
        </div>

        {streak > 1 && (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full animate-bounce">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold font-mono">Racha x{streak}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-600" />
          <span className="text-lg font-extrabold font-mono text-teal-800">{score}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 md:p-8 space-y-6">
        {/* Category Badge & Timer */}
        <div className="flex justify-between items-center">
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${getCategoryColor(currentQuestion.category)}`}>
            {currentQuestion.category}
          </span>

          {!hasAnswered ? (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold text-sm ${timeLeft <= 5 ? "bg-rose-50 text-rose-600 animate-pulse border border-rose-100" : "bg-slate-50 text-slate-700 border border-slate-100"}`}>
              <Timer className={`w-4 h-4 ${timeLeft <= 5 ? "text-rose-600" : "text-slate-500"}`} />
              <span>{timeLeft}s</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-400">Resuelto</span>
          )}
        </div>

        {/* Timer Progress Bar */}
        {!hasAnswered && (
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? "bg-rose-500" : "bg-teal-500"}`}
              style={{ width: `${(timeLeft / totalTime) * 100}%` }}
            />
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
          {currentQuestion.text}
        </h2>

        {/* Options List */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const letter = ["A", "B", "C", "D"][idx];
            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 text-left border-2 rounded-2xl transition duration-150 flex items-center gap-4 ${getOptionStyle(idx)}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${hasAnswered ? (idx === currentQuestion.correctIndex ? "bg-emerald-500 text-white" : selectedOption === idx ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-500") : "bg-slate-100 text-slate-600"}`}>
                  {letter}
                </span>
                <span className="flex-1 text-sm md:text-base font-medium leading-relaxed">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section (Inline explanation) */}
        {hasAnswered && (
          <div className="pt-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
            {/* Answer Status */}
            <div className="flex items-start gap-2.5">
              {selectedOption === currentQuestion.correctIndex ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
                  <span>¡Excelente! Respuesta correcta</span>
                </div>
              ) : selectedOption === null ? (
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-sm bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
                  <span>Se agotó el tiempo</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-sm bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
                  <span>Respuesta incorrecta</span>
                </div>
              )}
            </div>

            {/* Educational Explanation Box */}
            <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-100 text-xs md:text-sm text-gray-700 space-y-1">
              <span className="block font-bold text-teal-800 text-[11px] uppercase tracking-wider mb-1">
                Fundamento Educativo ESI
              </span>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>
                {currentIdx + 1 === questions.length ? "Finalizar y Ver Resultados" : "Siguiente Pregunta"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Exit confirmation button */}
      <div className="text-center">
        <button
          onClick={onExit}
          className="text-xs text-gray-400 hover:text-gray-600 transition"
        >
          Abandonar partida
        </button>
      </div>
    </div>
  );
}
