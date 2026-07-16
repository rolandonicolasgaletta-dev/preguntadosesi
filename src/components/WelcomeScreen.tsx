import { useState, FormEvent } from "react";
import { Play, Sparkles, BookOpen, QrCode, Settings } from "lucide-react";
import { generateRandomNickname } from "../questions";

interface WelcomeScreenProps {
  onStartGame: (nickname: string) => void;
  onOpenDocente: () => void;
  onOpenQR: () => void;
}

export default function WelcomeScreen({ onStartGame, onOpenDocente, onOpenQR }: WelcomeScreenProps) {
  const [alias, setAlias] = useState("");
  
  const handleRandomize = () => {
    setAlias(generateRandomNickname());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalAlias = alias.trim() || generateRandomNickname();
    onStartGame(finalAlias);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-teal-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
      {/* Decorative Header Banner */}
      <div className="relative bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500 p-8 text-white text-center">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full -translate-x-6 -translate-y-6" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 translate-y-8" />
        
        <div className="flex justify-center gap-1.5 mb-2">
          <span className="bg-white/20 text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            Secundaria
          </span>
          <span className="bg-white/20 text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            ESI
          </span>
        </div>
        
        <h1 className="text-4xl font-extrabold font-display tracking-tight mb-2 drop-shadow-xs">
          Preguntados ESI
        </h1>
        
        <p className="text-teal-50 text-sm max-w-xs mx-auto">
          Aprendé, reflexioná y divertite jugando sobre derechos, diversidad, cuidado y vínculos saludables.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Quick actions for projection & administration */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-full transition border border-teal-100"
          >
            <QrCode className="w-4 h-4" />
            <span>Código QR del aula</span>
          </button>
          <button
            onClick={onOpenDocente}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-full transition border border-slate-100"
          >
            <Settings className="w-4 h-4" />
            <span>Panel Docente</span>
          </button>
        </div>

        {/* Alias Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700">
              Ingresá tu nombre o alias para jugar:
            </label>
            <div className="flex gap-2">
              <input
                id="nickname"
                type="text"
                maxLength={25}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej. Búho Empático, Sofi..."
                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium focus:border-teal-400 focus:outline-none transition text-gray-800"
              />
              <button
                type="button"
                onClick={handleRandomize}
                className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold transition flex items-center justify-center gap-1 border border-amber-100"
                title="Generar alias divertido"
              >
                <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                <span className="hidden sm:inline text-sm">Aleatorio</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>¡Comenzar a Jugar!</span>
          </button>
        </form>

        {/* ESI Pedagogy Info Accordion/Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>¿Qué vamos a repasar hoy?</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
              <span className="text-teal-500 font-bold">♥</span>
              <span>Afectividad y empatía</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
              <span className="text-emerald-500 font-bold">🛡</span>
              <span>Cuidado de la salud</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
              <span className="text-indigo-500 font-bold">🌈</span>
              <span>Respeto a la diversidad</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-slate-100">
              <span className="text-amber-500 font-bold">⚖</span>
              <span>Leyes de género</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 text-center pt-1">
            Cada partida tiene 10 preguntas al azar con tiempo límite de 30s. ¡Suma más puntos quien responde más rápido!
          </p>
        </div>
      </div>
    </div>
  );
}
