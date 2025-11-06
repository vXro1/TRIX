'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Send, Bot, User, Loader, Sparkles, TrendingUp,
    Package, DollarSign, AlertTriangle, X, BarChart3,
    Lightbulb, ShoppingBag, MessageSquare
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const ChatIAPredicciones = () => {
    const [mensajes, setMensajes] = useState([
        {
            tipo: 'bot',
            contenido: '¡Hola! Soy tu asistente de análisis comercial. Puedo ayudarte con información sobre inventario, ventas, productos y tendencias. ¿Qué te gustaría saber?',
            timestamp: new Date()
        }
    ]);
    const [inputPregunta, setInputPregunta] = useState('');
    const [cargando, setCargando] = useState(false);
    const [token, setToken] = useState('');
    const messagesEndRef = useRef(null);

    const sugerencias = [
        { icon: Package, texto: '¿Cuántos productos tengo en inventario?', color: '#276A7C' },
        { icon: TrendingUp, texto: '¿Cuáles son las categorías más vendidas?', color: '#67BACD' },
        { icon: DollarSign, texto: '¿Cuál es el total de ingresos?', color: '#06D6A0' },
        { icon: ShoppingBag, texto: '¿Qué productos necesitan reabastecimiento?', color: '#FFD166' },
        { icon: BarChart3, texto: 'Dame un análisis de las sucursales', color: '#9D4EDD' }
    ];

    useEffect(() => {
        // CORRECCIÓN: Leer el token con el nombre correcto 'trix_token'
        const storedToken = localStorage.getItem('trix_token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            // Si no hay token, redirigir al login
            console.error('No hay token disponible');
            const errorMsg = {
                tipo: 'bot',
                contenido: 'No se encontró un token válido. Por favor, inicia sesión nuevamente.',
                esError: true,
                timestamp: new Date()
            };
            setMensajes(prev => [...prev, errorMsg]);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const enviarPregunta = async (pregunta) => {
        if (!pregunta.trim() || cargando) return;

        // Verificar que hay token antes de enviar
        if (!token) {
            const errorMsg = {
                tipo: 'bot',
                contenido: 'No hay token de autenticación. Por favor, inicia sesión nuevamente.',
                esError: true,
                timestamp: new Date()
            };
            setMensajes(prev => [...prev, errorMsg]);
            return;
        }

        const nuevoPregunta = {
            tipo: 'usuario',
            contenido: pregunta,
            timestamp: new Date()
        };

        setMensajes(prev => [...prev, nuevoPregunta]);
        setInputPregunta('');
        setCargando(true);

        try {
            const response = await fetch(`${API_BASE_URL}/ia/chat-inteligente`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pregunta,
                    contexto: {
                        timestamp: new Date().toISOString(),
                        usuario: 'web-app'
                    }
                })
            });

            const data = await response.json();

            // Manejar respuestas según el código de estado
            if (!response.ok) {
                if (response.status === 401) {
                    // Token inválido o expirado
                    localStorage.removeItem('trix_token');
                    localStorage.removeItem('trix_usuario');
                    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                }
                throw new Error(data.mensaje || 'Error al procesar la pregunta');
            }

            // Verificar la estructura de la respuesta
            if (data.success && data.respuestaIA) {
                const respuestaBot = {
                    tipo: 'bot',
                    contenido: data.respuestaIA.respuesta || data.respuesta || 'Respuesta recibida',
                    datosRelevantes: data.respuestaIA.datosRelevantes,
                    sugerencias: data.respuestaIA.sugerenciasAccion,
                    endpoint: data.respuestaIA.endpointSugerido,
                    timestamp: new Date()
                };
                setMensajes(prev => [...prev, respuestaBot]);
            } else if (data.respuesta) {
                // Formato alternativo de respuesta
                const respuestaBot = {
                    tipo: 'bot',
                    contenido: data.respuesta,
                    timestamp: new Date()
                };
                setMensajes(prev => [...prev, respuestaBot]);
            } else {
                throw new Error('Formato de respuesta no reconocido');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = {
                tipo: 'bot',
                contenido: error.message || 'Lo siento, ocurrió un error al procesar tu pregunta. Por favor intenta nuevamente.',
                esError: true,
                timestamp: new Date()
            };
            setMensajes(prev => [...prev, errorMsg]);
            
            // Si es error de autenticación, sugerir relogin
            if (error.message.includes('sesión')) {
                setTimeout(() => {
                    window.location.href = '/trix/login';
                }, 2000);
            }
        } finally {
            setCargando(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarPregunta(inputPregunta);
        }
    };

    const formatearNumero = (num) => {
        if (typeof num !== 'number') return num;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="chat-container">
            <style>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: rgba(245, 245, 245, 0.9);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .header {
          background-color: #FFFFFF;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background-color: #276A7C;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(112, 234, 240, 0.4);
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #276A7C;
          margin: 0;
        }
        .subtitle {
          font-size: 14px;
          color: #333333;
          margin: 4px 0 0 0;
          opacity: 0.7;
        }
        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        .mensaje-wrapper {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          align-items: flex-start;
        }
        .mensaje-wrapper-end {
          justify-content: flex-end;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .avatar-bot {
          background-color: #276A7C;
        }
        .avatar-usuario {
          background-color: #67BACD;
        }
        .mensaje {
          max-width: 70%;
          padding: 16px;
          border-radius: 16px;
          position: relative;
          animation: fadeIn 0.3s ease;
        }
        .mensaje-bot {
          background-color: #FFFFFF;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .mensaje-usuario {
          background-color: #276A7C;
          color: #FFFFFF;
        }
        .mensaje-error {
          background-color: #fee;
          border: 1px solid rgba(255, 107, 107, 0.9);
        }
        .mensaje-texto {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
        }
        .datos-relevantes {
          margin-top: 16px;
          padding: 12px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .datos-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #276A7C;
          margin-bottom: 12px;
        }
        .datos-grid {
          display: grid;
          gap: 8px;
        }
        .dato-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        .dato-label {
          color: #64748b;
          text-transform: capitalize;
        }
        .dato-value {
          font-weight: 600;
          color: #276A7C;
        }
        .sugerencias-accion {
          margin-top: 16px;
          padding: 12px;
          background-color: #fefce8;
          border-radius: 8px;
          border: 1px solid #fde047;
        }
        .sugerencias-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #854d0e;
          margin-bottom: 8px;
        }
        .sugerencias-list {
          margin: 0;
          padding-left: 20px;
        }
        .sugerencia-item {
          font-size: 14px;
          color: #713f12;
          margin-bottom: 6px;
        }
        .timestamp {
          display: block;
          font-size: 11px;
          opacity: 0.6;
          margin-top: 8px;
        }
        .cargando {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #276A7C;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        .sugerencias-rapidas {
          padding: 20px 24px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        .sugerencias-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #276A7C;
          margin-bottom: 12px;
        }
        .sugerencias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
        }
        .sugerencia-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background-color: #FFFFFF;
          border: 1px solid #C0C0C0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: #333333;
          text-align: left;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .sugerencia-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        .input-area {
          padding: 20px 24px;
          background-color: #FFFFFF;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .input {
          flex: 1;
          padding: 14px 18px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .input:focus {
          border-color: #276A7C;
        }
        .enviar-btn {
          padding: 14px 20px;
          background-color: #276A7C;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .enviar-btn:hover:not(:disabled) {
          background-color: #1f5563;
          transform: translateY(-1px);
        }
        .enviar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

            <div className="header">
                <div className="header-content">
                    <div className="header-icon">
                        <Sparkles size={24} color="#70EAF0" />
                    </div>
                    <div>
                        <h1 className="title">Chat Inteligente con IA</h1>
                        <p className="subtitle">Análisis comercial en tiempo real</p>
                    </div>
                </div>
            </div>

            <div className="chat-area">
                {mensajes.map((mensaje, index) => (
                    <div
                        key={index}
                        className={`mensaje-wrapper ${mensaje.tipo === 'usuario' ? 'mensaje-wrapper-end' : ''}`}
                    >
                        {mensaje.tipo === 'bot' && (
                            <div className="avatar avatar-bot">
                                <Bot size={20} color="#FFFFFF" />
                            </div>
                        )}

                        <div className={`mensaje ${mensaje.tipo === 'usuario' ? 'mensaje-usuario' : 'mensaje-bot'} ${mensaje.esError ? 'mensaje-error' : ''}`}>
                            <p className="mensaje-texto">{mensaje.contenido}</p>

                            {mensaje.datosRelevantes && (
                                <div className="datos-relevantes">
                                    <div className="datos-header">
                                        <BarChart3 size={16} />
                                        <span>Datos Relevantes</span>
                                    </div>
                                    {typeof mensaje.datosRelevantes === 'object' ? (
                                        <div className="datos-grid">
                                            {Object.entries(mensaje.datosRelevantes).map(([key, value]) => (
                                                <div key={key} className="dato-item">
                                                    <span className="dato-label">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                    </span>
                                                    <span className="dato-value">
                                                        {typeof value === 'number' ? formatearNumero(value) : value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{mensaje.datosRelevantes}</p>
                                    )}
                                </div>
                            )}

                            {mensaje.sugerencias && mensaje.sugerencias.length > 0 && (
                                <div className="sugerencias-accion">
                                    <div className="sugerencias-header">
                                        <Lightbulb size={16} />
                                        <span>Recomendaciones</span>
                                    </div>
                                    <ul className="sugerencias-list">
                                        {mensaje.sugerencias.map((sug, i) => (
                                            <li key={i} className="sugerencia-item">{sug}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <span className="timestamp">
                                {mensaje.timestamp.toLocaleTimeString('es-CO', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        {mensaje.tipo === 'usuario' && (
                            <div className="avatar avatar-usuario">
                                <User size={20} color="#FFFFFF" />
                            </div>
                        )}
                    </div>
                ))}

                {cargando && (
                    <div className="mensaje-wrapper">
                        <div className="avatar avatar-bot">
                            <Bot size={20} color="#FFFFFF" />
                        </div>
                        <div className="mensaje mensaje-bot cargando">
                            <Loader size={20} color="#276A7C" className="spinner" />
                            <span>Analizando...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {mensajes.length <= 1 && (
                <div className="sugerencias-rapidas">
                    <p className="sugerencias-title">
                        <MessageSquare size={16} />
                        Preguntas sugeridas:
                    </p>
                    <div className="sugerencias-grid">
                        {sugerencias.map((sug, index) => {
                            const Icon = sug.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => enviarPregunta(sug.texto)}
                                    className="sugerencia-btn"
                                >
                                    <Icon size={18} color={sug.color} />
                                    <span>{sug.texto}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="input-area">
                <input
                    type="text"
                    value={inputPregunta}
                    onChange={(e) => setInputPregunta(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta aquí..."
                    className="input"
                    disabled={cargando}
                />
                <button
                    onClick={() => enviarPregunta(inputPregunta)}
                    className="enviar-btn"
                    disabled={!inputPregunta.trim() || cargando}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatIAPredicciones;