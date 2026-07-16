import { useState, FormEvent } from "react";
import { Question } from "../types";
import { 
  ArrowLeft, Plus, Trash2, Edit2, Sparkles, RotateCcw, 
  Check, Save, Loader2, AlertCircle, Eye, Info 
} from "lucide-react";

interface DocenteScreenProps {
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onEditQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onResetQuestions: () => void;
  onBack: () => void;
}

export default function DocenteScreen({
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onResetQuestions,
  onBack,
}: DocenteScreenProps) {
  // Tabs: "list" | "add" | "ai"
  const [activeTab, setActiveTab] = useState<"list" | "add" | "ai">("list");
  
  // New manual question form state
  const [category, setCategory] = useState<Question["category"]>("Cuidar el cuerpo");
  const [text, setText] = useState("");
  const [opt0, setOpt0] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);

  // AI states
  const [aiTopic, setAiTopic] = useState("");
  const [aiAmount, setAiAmount] = useState(3);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  // Messages
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !opt0.trim() || !opt1.trim() || !opt2.trim() || !opt3.trim() || !explanation.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const newQ: Question = {
      id: `manual-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      category,
      text: text.trim(),
      options: [opt0.trim(), opt1.trim(), opt2.trim(), opt3.trim()],
      correctIndex,
      explanation: explanation.trim(),
    };

    onAddQuestion(newQ);
    showNotification("Pregunta guardada con éxito.");
    
    // Reset manual form fields
    setText("");
    setOpt0("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setCorrectIndex(0);
    setExplanation("");
    setActiveTab("list");
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      setAiError("Por favor, indica un tema o palabra clave para generar.");
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    setGeneratedQuestions([]);

    try {
      const response = await fetch("/api/gemini/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          amount: aiAmount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error inesperado al llamar a la API.");
      }

      setGeneratedQuestions(data.questions || []);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "No se pudo generar preguntas con la IA. Verificá tu conexión o reintentá.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddGeneratedQuestion = (q: Question) => {
    onAddQuestion(q);
    setGeneratedQuestions((prev) => prev.filter((item) => item.id !== q.id));
    showNotification("Pregunta de IA agregada al banco de preguntas.");
  };

  const handleAddAllGenerated = () => {
    generatedQuestions.forEach((q) => {
      onAddQuestion(q);
    });
    setGeneratedQuestions([]);
    showNotification(`¡Se agregaron las ${generatedQuestions.length} preguntas de IA al banco!`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 pb-20">
      {/* Header and Back Button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 font-semibold text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al juego</span>
        </button>

        <h1 className="font-display font-bold text-lg text-slate-800">
          Panel de Control Docente
        </h1>
      </div>

      {/* Navigation tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => { setActiveTab("list"); setEditingId(null); }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition ${activeTab === "list" ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          Ver Banco ({questions.length})
        </button>
        <button
          onClick={() => { setActiveTab("add"); setEditingId(null); }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition ${activeTab === "add" ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <span className="flex items-center justify-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Pregunta</span>
          </span>
        </button>
        <button
          onClick={() => { setActiveTab("ai"); setEditingId(null); }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition ${activeTab === "ai" ? "bg-white text-teal-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <span className="flex items-center justify-center gap-1 text-teal-600">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500 fill-amber-500" />
            <span>Generar con IA</span>
          </span>
        </button>
      </div>

      {/* Notifications banner */}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: BANK LIST */}
      {activeTab === "list" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <p className="text-xs text-gray-500">
              Estas preguntas se mezclan aleatoriamente en cada partida de los estudiantes.
            </p>
            <button
              onClick={() => {
                if (confirm("¿Estás seguro de restablecer las preguntas por defecto? Esto borrará tus cambios locales.")) {
                  onResetQuestions();
                  showNotification("Se restablecieron las preguntas iniciales.");
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition"
              title="Restablecer preguntas originales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, qIndex) => {
              const isEditing = editingId === q.id;

              return (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        #{qIndex + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          if (confirm("¿Seguro que querés borrar esta pregunta del banco?")) {
                            onDeleteQuestion(q.id);
                            showNotification("Pregunta eliminada.");
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Eliminar pregunta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 leading-snug">
                    {q.text}
                  </p>

                  {/* Options status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctIndex;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${isCorrect ? "bg-emerald-50/50 border-emerald-200 text-emerald-800 font-semibold" : "bg-slate-50/50 border-slate-100 text-gray-600"}`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${isCorrect ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                            {["A", "B", "C", "D"][oIdx]}
                          </span>
                          <span className="truncate flex-1">{opt}</span>
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation drawer */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60 text-xs text-gray-600">
                    <span className="font-bold text-[10px] text-teal-800 uppercase block mb-0.5">
                      Fundamento pedagógico
                    </span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL ADD QUESTION */}
      {activeTab === "add" && (
        <form onSubmit={handleManualSubmit} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md space-y-4">
          <h2 className="font-display font-bold text-xl text-gray-800">Cargar Pregunta Manualmente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Categoría / Eje ESI
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Question["category"])}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none"
              >
                <option value="Cuidar el cuerpo">Cuidar el cuerpo</option>
                <option value="Valorar la afectividad">Valorar la afectividad</option>
                <option value="Garantizar la equidad de género">Garantizar la equidad de género</option>
                <option value="Respetar la diversidad">Respetar la diversidad</option>
                <option value="Ejercer nuestros derechos">Ejercer nuestros derechos</option>
                <option value="Leyes y Derechos">Leyes y Derechos</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                Opción de Respuesta Correcta
              </label>
              <select
                value={correctIndex}
                onChange={(e) => setCorrectIndex(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none"
              >
                <option value={0}>Opción A (Primera)</option>
                <option value={1}>Opción B (Segunda)</option>
                <option value={2}>Opción C (Tercera)</option>
                <option value={3}>Opción D (Cuarta)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
              Texto de la Pregunta
            </label>
            <textarea
              required
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="¿Qué establece la ley...?"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none resize-none text-gray-800 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
              Opciones de Respuesta
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-2 items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                  A
                </span>
                <input
                  required
                  type="text"
                  value={opt0}
                  onChange={(e) => setOpt0(e.target.value)}
                  placeholder="Opción A..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                  B
                </span>
                <input
                  required
                  type="text"
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  placeholder="Opción B..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                  C
                </span>
                <input
                  required
                  type="text"
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  placeholder="Opción C..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                  D
                </span>
                <input
                  required
                  type="text"
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  placeholder="Opción D..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
              Fundamento / Explicación Pedagógica
            </label>
            <textarea
              required
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explica de forma escolar por qué esta respuesta es correcta y qué valor/derecho promueve..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Pregunta en el Banco</span>
          </button>
        </form>
      )}

      {/* TAB 3: AI GENERATION */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md space-y-4">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-gray-800">Generar con Inteligencia Artificial</h2>
                <p className="text-xs text-gray-500">
                  Usa el modelo Gemini 3.5 para diseñar preguntas con rigor legal y tono escolar en segundos.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Escribí el tema o foco de la pregunta
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ej. Prevención de violencia en el noviazgo, o grooming para 1er año..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:outline-none text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Cantidad de preguntas a generar
                </label>
                <div className="flex gap-2">
                  {[1, 3, 5].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setAiAmount(amount)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${aiAmount === amount ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs" : "bg-white text-gray-600 border-gray-200 hover:bg-slate-50"}`}
                    >
                      {amount} {amount === 1 ? "Pregunta" : "Preguntas"}
                    </button>
                  ))}
                </div>
              </div>

              {aiError && (
                <div className="bg-rose-50 text-rose-800 border border-rose-200 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isAiLoading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-teal-600 hover:from-amber-600 hover:to-teal-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Diseñando preguntas pedagógicas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                    <span>Generar Preguntas con Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Loader educational cues */}
          {isAiLoading && (
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 space-y-2 animate-pulse">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4" />
                <span>¿Qué está haciendo el modelo de IA?</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600 pl-1 leading-relaxed">
                <li>Buscando y verificando referencias en las leyes 26.150 y Micaela.</li>
                <li>Escribiendo explicaciones escolares con empatía y enfoque constructivo.</li>
                <li>Diseñando 4 opciones con un único distractor pedagógico correcto.</li>
              </ul>
            </div>
          )}

          {/* Generated Questions Review List */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-display font-bold text-base text-teal-800">Preguntas Generadas por IA</h3>
                <button
                  onClick={handleAddAllGenerated}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  Agregar todas al banco
                </button>
              </div>

              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {generatedQuestions.map((gq) => (
                  <div key={gq.id} className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/40 rounded-full translate-x-12 -translate-y-12 -z-0" />
                    
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                        {gq.category}
                      </span>
                      <button
                        onClick={() => handleAddGeneratedQuestion(gq)}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprobar y Agregar</span>
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 relative z-10">
                      {gq.text}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs relative z-10">
                      {gq.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === gq.correctIndex;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border ${isCorrect ? "bg-emerald-50/50 border-emerald-200 text-emerald-800 font-bold" : "bg-slate-50 border-slate-100 text-gray-500"}`}
                          >
                            <span className="font-semibold">{["A", "B", "C", "D"][oIdx]}. </span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-gray-600 relative z-10">
                      <span className="font-bold text-[10px] text-teal-800 uppercase block mb-0.5">
                        Explicación propuesta por IA
                      </span>
                      {gq.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
