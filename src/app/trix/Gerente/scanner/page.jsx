"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
  NotFoundException
} from "@zxing/library";

/**
 * QRScannerPage
 * - Escanea SOLO códigos QR (BarcodeFormat.QR_CODE)
 * - Soporta cámara en tiempo real y subida de imagen
 */
export default function QRScannerPage() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Crear hints para forzar solo QR codes
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);

    // Instanciar lector con hints
    codeReaderRef.current = new BrowserMultiFormatReader(hints);

    return () => {
      // cleanup on unmount
      stopScanning();
      if (codeReaderRef.current) {
        try { codeReaderRef.current.reset(); } catch (e) { /* ignore */ }
        codeReaderRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanning = async () => {
    setError("");
    setResult("");
    if (!codeReaderRef.current) return setError("No hay lector disponible");

    try {
      const devices = await codeReaderRef.current.listVideoInputDevices();
      if (!devices || devices.length === 0) {
        setError("No se encontró ninguna cámara");
        return;
      }

      const deviceId = devices[0].deviceId; // puedes elegir otro si quieres mostrar selector
      setScanning(true);

      // decodeFromVideoDevice maneja la lectura continua y llama al callback por cada lectura
      codeReaderRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (resultObj, err) => {
          if (resultObj) {
            // resultado detectado
            setResult(resultObj.getText());
          } else if (err && !(err instanceof NotFoundException)) {
            // errores distintos a NotFound (que es normal cuando no detecta nada en un frame)
            console.error(err);
            setError(String(err));
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError("Error iniciando la cámara: " + (err.message || err));
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    setError("");
    // reset detiene cualquier decodeFromVideoDevice en el reader y libera cámara
    try {
      codeReaderRef.current?.reset();
    } catch (e) {
      console.warn("error al resetear lector:", e);
    }
    // además, si el elemento video tiene stream, detener manualmente (por seguridad)
    try {
      const stream = videoRef.current?.srcObject;
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch (e) {
      // ignore
    }
  };

  // Procesar imagen subida por archivo
  const handleFile = async (e) => {
    setError("");
    setResult("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!codeReaderRef.current) return setError("Lector no inicializado");

    try {
      // Crear imagen desde file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        try {
          // decodeFromImage puede lanzar si no encuentra QR
          const res = await codeReaderRef.current.decodeFromImage(img);
          setResult(res.getText());
        } catch (err) {
          if (err instanceof NotFoundException) {
            setError("No se detectó un código QR en la imagen");
          } else {
            console.error(err);
            setError("Error al decodificar imagen: " + (err.message || err));
          }
        } finally {
          URL.revokeObjectURL(img.src);
        }
      };
      img.onerror = () => {
        setError("No se pudo cargar la imagen");
        URL.revokeObjectURL(img.src);
      };
    } catch (err) {
      console.error(err);
      setError("Error al procesar el archivo");
    } finally {
      // limpiar input para permitir subir mismo archivo otra vez si es necesario
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Escáner QR (solo QR)</h1>

      <div className="w-full max-w-2xl space-y-4">
        {/* Video preview */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200">
          <video
            ref={videoRef}
            className="w-full h-64 sm:h-96 object-cover bg-black"
            playsInline
            muted
          />
          {/* overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-32 border-4 border-white/40 rounded-lg backdrop-blur-sm" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={startScanning}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition"
            disabled={scanning}
            title="Iniciar cámara y escanear QR"
          >
            {scanning ? "Escaneando..." : "Iniciar cámara"}
          </button>

          <button
            onClick={stopScanning}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow hover:scale-105 transition"
            title="Detener cámara"
          >
            Detener
          </button>

          <label
            className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold cursor-pointer shadow"
            title="Subir imagen con QR"
          >
            Subir imagen
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => { setResult(""); setError(""); }}
            className="px-3 py-2 rounded-full bg-slate-200 text-slate-800 font-medium shadow hover:scale-105 transition"
            title="Limpiar"
          >
            Limpiar
          </button>
        </div>

        {/* Resultado */}
        <div className="p-4 rounded-xl bg-white shadow-md border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-2">Resultado</h2>

          {result ? (
            <div className="break-words text-sm text-emerald-700 font-medium">
              {result}
            </div>
          ) : (
            <div className="text-sm text-slate-500">Aún no se ha detectado ningún QR</div>
          )}

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>

        {/* Nota: video permissions */}
        <div className="text-xs text-slate-500">
          Nota: el escáner usa la cámara del dispositivo (pide permisos). Si no funciona, prueba subir la imagen con el QR.
        </div>
      </div>
    </div>
  );
}
