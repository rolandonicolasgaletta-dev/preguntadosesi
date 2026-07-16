import { Award, RotateCcw, Home, Sparkles, Check, X, Trophy } from "lucide-react";
import { Question, ScoreRecord } from "../types";
import { useEffect, useState } from "react";

interface ResultsScreenProps {
  nickname: string;
  score: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  history: { questionId: string; wasCorrect: boolean; selectedIndex: number; scoreEarned: number }[];
  questions: Question[];
  onRestart: () => void;
  onGoHome: () => void;
}

export default function ResultsScreen({
  nickname,
  score,
  correctAnswersCount,
  totalQuestionsCount,
  history,
  questions,
  onRestart,
  onGoHome,
}: ResultsScreenProps) {
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);

  // Save score to local storage and load leaderboard
  useEffect(() => {
    const saved = localStorage.getItem("esi_leaderboard");
    let currentLeaderboard: ScoreRecord[] = saved ? JSON.parse(saved) : [];

    // Add current score
    const newRecord: ScoreRecord = {
      id: `record-${Date.now()}`,
      nickname,
      score,
      correctAnswers: correctAnswersCount,
      totalQuestions: totalQuestionsCount,
      date: new Date().toLocaleDateString("es-AR"),
    };

    currentLeaderboard.push(newRecord);
    // Sort descending by score, keep top 10
    currentLeaderboard.sort((a, b) => b.score - a.score);
    currentLeaderboard = currentLeaderboard.slice(0, 10);

    localStorage.setItem("esi_leaderboard", JSON.stringify(currentLeaderboard));
    setLeaderboard(currentLeaderboard);
  }, [nickname, score, correctAnswersCount, totalQuestionsCount]);

  const getMotivationalMessage = () => {
    const percentage = (correctAnswersCount / totalQuestionsCount) * 100;
    if (percentage === 100) {
      return {
        title: "¡Impecable! 🏆",
        text: "¡Excelente! Demostraste un conocimiento perfecto sobre tus derechos, cuidado integral y leyes de género. ¡Sos un referente de ESI en el aula!",
        color: "text-emerald-700 bg-emerald-50 border-emerald-100",
      };
    } else if (percentage >= 70) {
      return {
        title: "¡Muy bien! 🌟",
        text: "¡Excelente desempeño! Demostrás un gran conocimiento sobre los ejes de la ESI y el respeto por la diversidad. ¡Seguí promoviendo la empatía!",
        color: "text-teal-700 bg-teal-50 border-teal-100",
      };
    } else if (percentage >= 40) {
      return {
        title: "¡Buen esfuerzo! 👍",
        text: "¡Vas por buen camino! Lograste responder varias preguntas correctamente. Un breve repaso de las explicaciones te ayudará a consolidar tus derechos cotidianos.",
        color: "text-amber-700 bg-amber-50 border-amber-100",
      };
    } else {
      return {
        title: "¡Seguí aprendiendo! 💪",
        text: "¡La ESI es un camino de aprendizaje continuo! Conocer nuestros derechos, leyes y cuidado personal nos protege a todos. ¡Volvé a intentarlo para superarte!",
        color: "text-indigo-700 bg-indigo-50 border-indigo-100",
      };
    }
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Score Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-teal-500 to-indigo-600 p-8 text-white text-center space-y-3 relative">
          <div className="absolute top-2 left-2 text-white/10">
            <Trophy className="w-24 h-24" />
          </div>
          
          <div className="inline-block p-4 bg-white/15 rounded-full backdrop-blur-xs mb-2">
            <Award className="w-10 h-10 text-amber-300" />
          </div>

          <h1 className="text-3xl font-extrabold font-display">¡Partida Completada!</h1>
          <p className="text-teal-100 text-sm">Felicitaciones, <strong>{nickname}</strong></p>
          
          <div className="grid grid-cols-2 gap-4 pt-4 max-w-xs mx-auto">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="block text-xs text-teal-200">Puntaje Total</span>
              <span className="text-2xl font-black font-mono text-amber-300">{score}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
              <span className="block text-xs text-teal-200">Aciertos</span>
              <span className="text-2xl font-black font-mono">
                {correctAnswersCount}/{totalQuestionsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Motivational summary */}
        <div className="p-6">
          <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${motivation.color}`}>
            <span className="block font-bold text-base mb-1">{motivation.title}</span>
            <p>{motivation.text}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-4">
        <div className="flex items-center gap-2 text-teal-800 font-bold">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-display text-lg">Tabla de Posiciones del Aula</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {leaderboard.map((record, index) => {
            const isMe = record.nickname === nickname && record.score === score;
            return (
              <div
                key={record.id}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition ${isMe ? "bg-teal-50 text-teal-900 font-semibold border border-teal-100" : "text-gray-700"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-mono font-bold text-sm ${index === 0 ? "text-amber-500 text-base" : index === 1 ? "text-slate-400" : index === 2 ? "text-amber-700" : "text-gray-400"}`}>
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </span>
                  <span className="truncate max-w-[150px]">{record.nickname}</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-xs text-gray-400">{record.correctAnswers}/{record.totalQuestions} aciertos</span>
                  <span className="font-mono font-bold text-teal-700">{record.score} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Review Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-4">
        <h3 className="font-display font-bold text-lg text-gray-800">Repaso de Respuestas</h3>
        
        <div className="space-y-3">
          {history.map((record, index) => {
            const q = questions.find((item) => item.id === record.questionId);
            if (!q) return null;

            return (
              <details
                key={index}
                className="group border border-slate-100 rounded-2xl bg-slate-50/50 p-3 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-start justify-between gap-3 cursor-pointer select-none">
                  <div className="flex gap-2.5 items-start">
                    <span className="mt-0.5">
                      {record.wasCorrect ? (
                        <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 border border-emerald-200" />
                      ) : (
                        <X className="w-4 h-4 text-rose-600 bg-rose-50 rounded-full p-0.5 border border-rose-200" />
                      )}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                        {q.category}
                      </span>
                      <p className="text-sm font-medium text-gray-700 group-open:text-teal-700 transition duration-150">
                        {q.text}
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform duration-150">
                    ▼
                  </span>
                </summary>

                <div className="mt-3 pt-3 border-t border-slate-100/60 text-xs text-gray-600 space-y-2 animate-in slide-in-from-top-1">
                  <p>
                    <strong>Respuesta Correcta:</strong>{" "}
                    <span className="text-emerald-700 font-semibold">{q.options[q.correctIndex]}</span>
                  </p>
                  {!record.wasCorrect && record.selectedIndex >= 0 && (
                    <p>
                      <strong>Tu respuesta:</strong>{" "}
                      <span className="text-rose-700 font-semibold">{q.options[record.selectedIndex]}</span>
                    </p>
                  )}
                  <div className="bg-teal-50/30 p-2.5 rounded-xl border border-teal-50 text-gray-700 leading-relaxed">
                    <span className="font-bold text-[10px] text-teal-800 uppercase block mb-0.5">
                      Fundamento pedagógico
                    </span>
                    {q.explanation}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex-1 py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Jugar Otra Vez</span>
        </button>

        <button
          onClick={onGoHome}
          className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl shadow-sm transition flex items-center justify-center gap-2 border border-slate-200"
        >
          <Home className="w-5 h-5" />
          <span>Volver al Inicio</span>
        </button>
      </div>
    </div>
  );
}
