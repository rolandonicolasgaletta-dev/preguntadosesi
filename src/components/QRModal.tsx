import { X, QrCode, Copy, Check } from "lucide-react";
import { useState } from "react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export default function QRModal({ isOpen, onClose, appUrl }: QRModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar enlace:", err);
    }
  };

  // Generate QR code using public reliable API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-teal-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 top-4 right-4"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-full mb-4">
            <QrCode className="w-8 h-8" />
          </div>
          
          <h3 className="text-2xl font-bold font-display text-gray-800 mb-2">
            ¡Escaneá para Jugar!
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            Proyectá este código QR en el aula para que los estudiantes se sumen desde sus celulares de forma rápida.
          </p>

          {/* QR Code Container */}
          <div className="p-4 bg-teal-50/50 rounded-2xl border-2 border-teal-100/50 mb-6">
            <img
              src={qrCodeUrl}
              alt="Código QR del Juego"
              className="w-56 h-56 rounded-lg shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* URL box */}
          <div className="w-full flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-mono text-gray-600 break-all mb-4">
            <span className="flex-1 text-left truncate">{appUrl}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-sans font-medium transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            No requiere descargar nada. Al escanear, el juego se abre en el navegador.
          </p>
        </div>
      </div>
    </div>
  );
}
