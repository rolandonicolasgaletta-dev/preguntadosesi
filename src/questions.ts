import { Question } from "./types";

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q-eje-1",
    category: "Cuidar el cuerpo",
    text: "¿Cuál de las siguientes afirmaciones describe mejor el eje de la ESI 'Cuidar el cuerpo y la salud'?",
    options: [
      "Se limita únicamente al estudio biológico del aparato reproductor.",
      "Considera la salud de forma integral, involucrando aspectos físicos, psicológicos, sociales y afectivos.",
      "Es una responsabilidad exclusiva del área de educación física y biología.",
      "Establece que el cuidado del cuerpo solo se refiere a la higiene personal."
    ],
    correctIndex: 1,
    explanation: "El cuidado del cuerpo en la ESI abarca una mirada integral del ser humano. Involucra no solo la biología, sino también la salud mental, el autoconocimiento, la autoestima, el respeto por los límites propios y ajenos, y las dimensiones afectivas y sociales del bienestar."
  },
  {
    id: "q-eje-2",
    category: "Valorar la afectividad",
    text: "En el marco de la ESI, ¿qué implica el eje 'Valorar la afectividad' en los vínculos escolares?",
    options: [
      "Ocultar las emociones para evitar conflictos entre compañeros.",
      "Que los docentes deben evaluar los sentimientos personales de cada alumno con una nota.",
      "Expresar y reflexionar sobre los sentimientos, promoviendo la empatía, la resolución de conflictos y el respeto.",
      "Fomentar que las decisiones importantes se tomen de forma impulsiva según las emociones del momento."
    ],
    correctIndex: 2,
    explanation: "Valorar la afectividad significa reconocer el lugar que ocupan las emociones y sentimientos en el aprendizaje y los vínculos. Promueve el desarrollo de la empatía, el cuidado mutuo, la solidaridad y capacidades para resolver tensiones de forma dialógica."
  },
  {
    id: "q-eje-3",
    category: "Garantizar la equidad de género",
    text: "¿Qué promueve principalmente el eje 'Garantizar la equidad de género'?",
    options: [
      "Dividir las tareas del hogar y de la escuela según el género tradicional.",
      "Reconocer que varones y mujeres tienen capacidades naturalmente idénticas para todo.",
      "Cuestionar los roles y estereotipos tradicionales de género para asegurar igualdad de derechos y oportunidades.",
      "Promover que no existan diferencias biológicas entre las personas."
    ],
    correctIndex: 2,
    explanation: "Este eje promueve la deconstrucción de estereotipos y prejuicios sobre lo que 'deben' hacer o sentir las personas en base a su género asignado. Busca asegurar que todos tengan las mismas oportunidades, derechos y un trato equitativo en la sociedad."
  },
  {
    id: "q-eje-4",
    category: "Respetar la diversidad",
    text: "¿Cuál es el propósito central del eje 'Respetar la diversidad' en la escuela?",
    options: [
      "Tolerar a quienes son diferentes siempre y cuando no expresen públicamente sus opiniones.",
      "Valorar la diversidad como una riqueza social, rechazando cualquier forma de discriminación por orientación sexual, identidad o cultura.",
      "Lograr que todos los estudiantes piensen y actúen de la misma manera para evitar conflictos.",
      "Estudiar únicamente las diferencias religiosas y lingüísticas de la población."
    ],
    correctIndex: 1,
    explanation: "Respetar la diversidad implica reconocer y valorar positivamente las diferencias humanas (étnicas, culturales, religiosas, de género u orientación sexual) como parte de la riqueza social, combatiendo toda forma de discriminación y bullying escolar."
  },
  {
    id: "q-eje-5",
    category: "Ejercer nuestros derechos",
    text: "En la ESI, ¿cómo se entiende el eje 'Ejercer nuestros derechos'?",
    options: [
      "Considerar que las y los jóvenes son sujetos de derecho, con capacidad de participar, opinar y ser escuchados.",
      "Aprender que los derechos de los jóvenes se adquieren recién al cumplir la mayoría de edad (18 años).",
      "Priorizar que las normas escolares de conducta están por encima de los derechos humanos básicos.",
      "Enseñar que los derechos solo conllevan obligaciones pero no libertades personales en el ámbito escolar."
    ],
    correctIndex: 0,
    explanation: "Este eje destaca que los niños, niñas y adolescentes son sujetos plenos de derechos, amparados por leyes nacionales e internacionales. La ESI fomenta su participación activa, la toma de decisiones informadas y la exigibilidad de sus derechos ante situaciones de vulneración."
  },
  {
    id: "q-ley-1",
    category: "Leyes y Derechos",
    text: "¿Qué establece de manera obligatoria la Ley Micaela (Ley N° 27.499 en Argentina)?",
    options: [
      "La enseñanza obligatoria de robótica y programación en escuelas secundarias públicas.",
      "La capacitación obligatoria en la temática de género y violencia contra las mujeres para todas las personas que integran los tres poderes del Estado.",
      "El cupo laboral equitativo para jóvenes profesionales sin experiencia en empresas privadas.",
      "La gratuidad del transporte público de pasajeros para estudiantes universitarios de bajos recursos."
    ],
    correctIndex: 1,
    explanation: "Sancionada en 2018, la Ley Micaela establece la capacitación obligatoria en género y violencia de género para todas las personas que se desempeñan en la función pública, en todos sus niveles y jerarquías dentro de los poderes Ejecutivo, Legislativo y Judicial."
  },
  {
    id: "q-ley-2",
    category: "Leyes y Derechos",
    text: "¿En qué año se sancionó la Ley de Matrimonio Igualitario en Argentina (Ley N° 26.618), convirtiendo al país en el primero de América Latina en reconocer este derecho?",
    options: [
      "En el año 1994, junto con la reforma constitucional.",
      "En el año 2003, con la asunción del nuevo gobierno constitucional.",
      "En el año 2010, permitiendo el matrimonio civil entre personas del mismo sexo con idénticos derechos y obligaciones.",
      "En el año 2015, con la unificación del Código Civil y Comercial de la Nación."
    ],
    correctIndex: 2,
    explanation: "La Ley N° 26.618 de Matrimonio Igualitario fue sancionada el 15 de julio de 2010. Esta ley modificó el Código Civil para permitir que contrayentes del mismo sexo accedan al matrimonio con los mismos derechos y obligaciones que las parejas de distinto sexo, incluyendo el derecho a la adopción."
  },
  {
    id: "q-ley-3",
    category: "Leyes y Derechos",
    text: "La Ley de Protección Integral para Prevenir, Sancionar y Erradicar la Violencia contra las Mujeres (Ley N° 26.485) define varios tipos de violencia. ¿Cuál describe la violencia 'simbólica'?",
    options: [
      "Es el daño físico directo provocado mediante el uso de la fuerza sobre el cuerpo.",
      "Es el menoscabo de los recursos económicos o patrimoniales de la mujer a través del control del dinero.",
      "Es aquella que a través de patrones estereotipados, mensajes, valores o símbolos transmita y reproduzca dominación, desigualdad y discriminación.",
      "Es la limitación de la libertad de tránsito de la mujer o el control de sus comunicaciones telefónicas o digitales."
    ],
    correctIndex: 2,
    explanation: "La violencia simbólica es aquella que, a través de mensajes, iconos, discursos, publicidades o estereotipos, naturaliza la subordinación, desigualdad o discriminación de las mujeres en la sociedad, influyendo de manera invisible pero estructural en las conductas cotidianas."
  },
  {
    id: "q-consentimiento-1",
    category: "Valorar la afectividad",
    text: "¿Cuál de las siguientes condiciones es INDISPENSABLE para que el consentimiento en una relación sea válido?",
    options: [
      "Haber guardado silencio ante una propuesta de actividad íntima.",
      "Haber dicho que sí en el pasado, lo cual asegura el acuerdo para cualquier encuentro posterior.",
      "Ser libre, entusiasta, específico, informado, y que pueda ser revocado o retirado en cualquier momento.",
      "Haber accedido bajo presión o insistencia constante de la pareja."
    ],
    correctIndex: 2,
    explanation: "El consentimiento válido debe ser activo, consciente y voluntario. Que haya sido entusiasta e informado en un momento no significa que lo sea para siempre; el consentimiento puede revocarse o retirarse en cualquier momento del encuentro, y eso debe ser respetado sin presiones."
  },
  {
    id: "q-grooming-1",
    category: "Ejercer nuestros derechos",
    text: "¿Qué es el 'grooming' y cómo se previene de forma segura?",
    options: [
      "Un software espía que roba contraseñas bancarias de las computadoras hogareñas.",
      "La acción en la cual un adulto contacta a un menor a través de internet con el fin de cometer un abuso, y se previene hablando con adultos de confianza y no compartiendo fotos ni datos íntimos.",
      "La sobrecarga de tareas y deberes escolares asignados en entornos virtuales de aprendizaje.",
      "Un método de publicidad digital dirigida que analiza los gustos de navegación de los adolescentes."
    ],
    correctIndex: 1,
    explanation: "El grooming es un delito que ocurre en entornos digitales cuando una persona adulta engaña a un menor haciéndose pasar por alguien de su edad o ganando su confianza para luego abusar de él. Se previene con la comunicación abierta en el aula y el hogar, configurando la privacidad y sabiendo que se puede pedir ayuda."
  }
];

export const FRIENDLY_ADJECTIVES = [
  "Atento", "Empático", "Respetuoso", "Curioso", "Solidario", "Amigable", 
  "Tolerante", "Compasivo", "Valiente", "Afectuoso", "Luminoso", "Unido"
];

export const FRIENDLY_ANIMALS = [
  "Búho", "Colibrí", "Delfín", "Zorro", "Puma", "Yaguareté", 
  "Cari", "Zorzal", "Nutria", "Gato", "Huemul", "Guanaco"
];

export function generateRandomNickname(): string {
  const adj = FRIENDLY_ADJECTIVES[Math.floor(Math.random() * FRIENDLY_ADJECTIVES.length)];
  const animal = FRIENDLY_ANIMALS[Math.floor(Math.random() * FRIENDLY_ANIMALS.length)];
  return `${animal} ${adj}`;
}
