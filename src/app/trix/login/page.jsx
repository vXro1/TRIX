'use client';

import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function TrixLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('https://backend-hackathon-t4q9.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al iniciar sesión');
            }

            // Guardar token y datos del usuario
            if (typeof window !== 'undefined') {
                localStorage.setItem('trix_token', data.data.token);
                localStorage.setItem('trix_usuario', JSON.stringify(data.data));
            }

            setSuccess('¡Inicio de sesión exitoso!');

            // Redirigir según el rol del usuario
            setTimeout(() => {
                const rol = data.data.rol;
                let ruta = '/trix/vendedor'; // Por defecto vendedor

                if (rol === 'admin') {
                    ruta = '/trix/admin';
                } else if (rol === 'gerente') {
                    ruta = '/trix/Gerente';
                } else if (rol === 'vendedor') {
                    ruta = '/trix/vendedor';
                }

                window.location.href = ruta;
            }, 1500);

        } catch (err) {
            setError(err.message || 'Error al iniciar sesión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a1628 0%, #1a2840 50%, #276A7C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(103,186,205,0.25), transparent)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    animation: 'float 12s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(112,234,240,0.2), transparent)',
                    borderRadius: '50%',
                    filter: 'blur(90px)',
                    animation: 'float 15s ease-in-out infinite 2s'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(67,160,180,0.15), transparent)',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    animation: 'float 18s ease-in-out infinite 4s'
                }}></div>
            </div>

            {/* Decorative Grid */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(103,186,205,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(103,186,205,0.03) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            {/* Login Card */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '500px'
            }}>
                {/* Logo Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1.2rem',
                        marginBottom: '2rem',
                        animation: 'fadeInDown 0.8s ease-out'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: 'linear-gradient(135deg, rgba(103,186,205,0.2), rgba(112,234,240,0.2))',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 40px rgba(103,186,205,0.4), inset 0 0 20px rgba(112,234,240,0.1)',
                            border: '2px solid rgba(103,186,205,0.4)',
                            animation: 'glow 3s ease-in-out infinite',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: '-2px',
                                background: 'linear-gradient(135deg, #67BACD, #70EAF0)',
                                borderRadius: '20px',
                                opacity: 0,
                                animation: 'pulse 3s ease-in-out infinite',
                                filter: 'blur(10px)'
                            }}></div>
                            <span style={{
                                fontSize: '2.5rem',
                                fontWeight: '900',
                                background: 'linear-gradient(135deg, #67BACD 0%, #70EAF0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontFamily: 'Orbitron, sans-serif',
                                position: 'relative',
                                zIndex: 1
                            }}>T</span>
                        </div>
                        <div>
                            <span style={{
                                fontSize: '3rem',
                                fontWeight: '900',
                                background: 'linear-gradient(135deg, #67BACD 0%, #70EAF0 50%, #FFFFFF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontFamily: 'Orbitron, sans-serif',
                                letterSpacing: '4px',
                                display: 'block',
                                textShadow: '0 0 30px rgba(103,186,205,0.5)'
                            }}>RIX</span>
                        </div>
                    </div>
                    <div style={{
                        animation: 'fadeIn 1s ease-out 0.3s backwards'
                    }}>
                        <h1 style={{
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            color: '#FFFFFF',
                            marginBottom: '0.8rem',
                            fontFamily: 'Orbitron, sans-serif',
                            textShadow: '0 2px 20px rgba(103,186,205,0.5)'
                        }}>
                            Bienvenido de nuevo
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: 'rgba(255,255,255,0.7)',
                            fontFamily: 'Quicksand, sans-serif',
                            fontWeight: '500'
                        }}>
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(30px)',
                    borderRadius: '32px',
                    padding: '3rem',
                    border: '2px solid rgba(103,186,205,0.3)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(103,186,205,0.05)',
                    animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                    position: 'relative'
                }}>
                    {/* Shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        background: 'linear-gradient(135deg, transparent 0%, rgba(103,186,205,0.1) 50%, transparent 100%)',
                        borderRadius: '32px',
                        opacity: 0.5,
                        animation: 'shine 3s ease-in-out infinite'
                    }}></div>

                    <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
                        {/* Email Field */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.8rem',
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: '1rem',
                                fontFamily: 'Quicksand, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <Mail size={18} />
                                Correo Electrónico
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                    style={{
                                        width: '100%',
                                        padding: '1.3rem 1.3rem 1.3rem 3.5rem',
                                        borderRadius: '16px',
                                        border: '2px solid rgba(103,186,205,0.3)',
                                        fontSize: '1.05rem',
                                        fontFamily: 'Quicksand, sans-serif',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.08)',
                                        color: '#FFFFFF'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#67BACD';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(103,186,205,0.15), 0 0 30px rgba(103,186,205,0.3)';
                                        e.target.style.background = 'rgba(255,255,255,0.12)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(103,186,205,0.3)';
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.background = 'rgba(255,255,255,0.08)';
                                    }}
                                />
                                <Mail style={{
                                    position: 'absolute',
                                    left: '1.2rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1.3rem',
                                    height: '1.3rem',
                                    color: '#67BACD',
                                    pointerEvents: 'none'
                                }} />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.8rem',
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: '1rem',
                                fontFamily: 'Quicksand, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <Lock size={18} />
                                Contraseña
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '1.3rem 3.5rem 1.3rem 3.5rem',
                                        borderRadius: '16px',
                                        border: '2px solid rgba(103,186,205,0.3)',
                                        fontSize: '1.05rem',
                                        fontFamily: 'Quicksand, sans-serif',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.08)',
                                        color: '#FFFFFF'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#67BACD';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(103,186,205,0.15), 0 0 30px rgba(103,186,205,0.3)';
                                        e.target.style.background = 'rgba(255,255,255,0.12)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(103,186,205,0.3)';
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.background = 'rgba(255,255,255,0.08)';
                                    }}
                                />
                                <Lock style={{
                                    position: 'absolute',
                                    left: '1.2rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '1.3rem',
                                    height: '1.3rem',
                                    color: '#67BACD',
                                    pointerEvents: 'none'
                                }} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1.2rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(103,186,205,0.2)'}
                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                    {showPassword ? (
                                        <EyeOff style={{ width: '1.3rem', height: '1.3rem', color: '#67BACD' }} />
                                    ) : (
                                        <Eye style={{ width: '1.3rem', height: '1.3rem', color: '#67BACD' }} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                cursor: 'pointer',
                                fontFamily: 'Quicksand, sans-serif',
                                fontSize: '0.95rem',
                                color: 'rgba(255,255,255,0.8)',
                                transition: 'color 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
                                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                                <input type="checkbox" style={{
                                    cursor: 'pointer',
                                    width: '18px',
                                    height: '18px',
                                    accentColor: '#67BACD'
                                }} />
                                Recordarme
                            </label>
                            <a href="#" style={{
                                color: '#70EAF0',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                fontFamily: 'Quicksand, sans-serif',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#FFFFFF';
                                    e.target.style.textShadow = '0 0 20px rgba(112,234,240,0.8)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#70EAF0';
                                    e.target.style.textShadow = 'none';
                                }}>
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                padding: '1.2rem',
                                borderRadius: '16px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '2px solid rgba(239, 68, 68, 0.4)',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                animation: 'shake 0.5s ease-in-out'
                            }}>
                                <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: '#FF6B6B', flexShrink: 0 }} />
                                <p style={{
                                    margin: 0,
                                    color: '#FFE0E0',
                                    fontSize: '0.95rem',
                                    fontFamily: 'Quicksand, sans-serif',
                                    fontWeight: '600'
                                }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div style={{
                                padding: '1.2rem',
                                borderRadius: '16px',
                                background: 'rgba(34, 197, 94, 0.15)',
                                border: '2px solid rgba(34, 197, 94, 0.4)',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                animation: 'fadeIn 0.5s ease-out'
                            }}>
                                <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#4ADE80', flexShrink: 0 }} />
                                <p style={{
                                    margin: 0,
                                    color: '#D1FAE5',
                                    fontSize: '0.95rem',
                                    fontFamily: 'Quicksand, sans-serif',
                                    fontWeight: '600'
                                }}>
                                    {success}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.4rem',
                                borderRadius: '16px',
                                background: loading
                                    ? 'linear-gradient(135deg, #5EACBB, #70EAF0)'
                                    : 'linear-gradient(135deg, #276A7C, #67BACD, #70EAF0)',
                                color: '#FFFFFF',
                                fontSize: '1.15rem',
                                fontWeight: '700',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.4s ease',
                                boxShadow: '0 15px 40px rgba(103,186,205,0.5)',
                                fontFamily: 'Quicksand, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                opacity: loading ? 0.7 : 1,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(-3px) scale(1.02)';
                                    e.target.style.boxShadow = '0 20px 50px rgba(103,186,205,0.7)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 15px 40px rgba(103,186,205,0.5)';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '1.3rem',
                                        height: '1.3rem',
                                        border: '3px solid rgba(255,255,255,0.3)',
                                        borderTop: '3px solid #FFFFFF',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite'
                                    }}></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <Sparkles style={{ width: '1.3rem', height: '1.3rem' }} />
                                    Iniciar Sesión
                                    <LogIn style={{ width: '1.3rem', height: '1.3rem' }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        margin: '2.5rem 0'
                    }}>
                        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(103,186,205,0.4), transparent)' }}></div>
                        <span style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.9rem',
                            fontFamily: 'Quicksand, sans-serif',
                            fontWeight: '500'
                        }}>
                            ¿No tienes cuenta?
                        </span>
                        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(103,186,205,0.4), transparent)' }}></div>
                    </div>

                    {/* Register Link */}
                    <button style={{
                        width: '100%',
                        display: 'block',
                        textAlign: 'center',
                        padding: '1.2rem',
                        borderRadius: '16px',
                        border: '2px solid rgba(103,186,205,0.5)',
                        color: '#FFFFFF',
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Quicksand, sans-serif',
                        cursor: 'pointer',
                        background: 'rgba(103,186,205,0.05)'
                    }}
                        onClick={() => window.location.href = '/trix/registro'}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(19, 20, 20, 0.15)';
                            e.target.style.borderColor = '#67BACD';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 30px rgba(103,186,205,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(103,186,205,0.05)';
                            e.target.style.borderColor = 'rgba(103,186,205,0.5)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}>
                        Crear una cuenta nueva
                    </button>
                </div>

                {/* Back to Home */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <a href="/" style={{
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        fontFamily: 'Quicksand, sans-serif',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-block',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#70EAF0';
                            e.target.style.textShadow = '0 0 20px rgba(112,234,240,0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = 'rgba(255,255,255,0.6)';
                            e.target.style.textShadow = 'none';
                        }}>
                        ← Volver al inicio
                    </a>
                </div>
            </div>
            <style jsx>{`

                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Quicksand:wght@300;400;500;600;700&display=swap');


                @keyframes float {
                    0 %, 100 % {
                        transform: translateY(0px) rotate(0deg);
                    }
    33% {
                    transform: translateY(-30px) rotate(2deg); 
    }
                66% {
                    transform: translateY(-15px) rotate(-2deg); 
    }
}

                @keyframes floatReverse {
                    0 %, 100 % {
                        transform: translateY(0px) rotate(0deg) scale(1);
                    }
    50% {
                    transform: translateY(40px) rotate(-3deg) scale(1.05); 
    }
}

                @keyframes spin {
                    0 % { transform: rotate(0deg); }
    100% {transform: rotate(360deg); }
}

                @keyframes fadeIn {
                    from {
                    opacity: 0; 
    }
                to {
                    opacity: 1; 
    }
}

                @keyframes fadeInUp {
                    from {
                    opacity: 0;
                transform: translateY(40px);
    }
                to {
                    opacity: 1;
                transform: translateY(0);
    }
}

                @keyframes fadeInDown {
                    from {
                    opacity: 0;
                transform: translateY(-40px) scale(0.95);
    }
                to {
                    opacity: 1;
                transform: translateY(0) scale(1);
    }
}

                @keyframes glow {
                    0 %, 100 % {
                        box- shadow: 0 10px 40px rgba(103,186,205,0.4),
                inset 0 0 20px rgba(112,234,240,0.1),
                0 0 60px rgba(103,186,205,0.2);
    }
                50% {
                    box - shadow: 0 10px 60px rgba(103,186,205,0.7),
                inset 0 0 40px rgba(112,234,240,0.2),
                0 0 100px rgba(103,186,205,0.4);
    }
}

                @keyframes pulse {
                    0 %, 100 % {
                        opacity: 0;
                        transform: scale(1);
                    }
    50% {
                    opacity: 0.3;
                transform: scale(1.1);
    }
}

                @keyframes pulseRing {
                    0 % {
                        transform: scale(0.8);
                        opacity: 0.8;
                    }
    100% {
                    transform: scale(1.5);
                opacity: 0;
    }
}

                @keyframes shine {
                    0 % {
                        transform: translateX(-200 %) skewX(- 15deg); 
    }
                100% {
                    transform: translateX(200%) skewX(-15deg); 
    }
}

                @keyframes shake {
                    0 %, 100 % { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% {transform: translateX(-8px); }
                20%, 40%, 60%, 80% {transform: translateX(8px); }
}

                @keyframes slideIn {
                    from {
                    opacity: 0;
                transform: translateX(-20px);
    }
                to {
                    opacity: 1;
                transform: translateX(0);
    }
}

                @keyframes scaleIn {
                    from {
                    opacity: 0;
                transform: scale(0.8);
    }
                to {
                    opacity: 1;
                transform: scale(1);
    }
}

                @keyframes borderRotate {
                    0 % {
                        background- position: 0% 50%;
    }
                50% {
                    background - position: 100% 50%;
    }
                100% {
                    background - position: 0% 50%;
    }
}

                @keyframes ripple {
                    0 % {
                        transform: scale(0);
                        opacity: 0.8;
                    }
    100% {
                    transform: scale(2.5);
                opacity: 0;
    }
}


                .login-container {
                    min - height: 100vh;
                background-color: #0D1B23;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                position: relative;
                overflow: hidden;
                font-family: 'Quicksand', sans-serif;
}


                .bg-animated-elements {
                    position: fixed;
                inset: 0;
                overflow: hidden;
                pointer-events: none;
                z-index: 0;
}

                .bg-orb-1 {
                    position: absolute;
                top: 10%;
                left: 5%;
                width: 500px;
                height: 500px;
                background: radial-gradient(circle at center,
                rgba(103,186,205,0.35) 0%,
                rgba(103,186,205,0.15) 40%,
                transparent 70%);
                border-radius: 50%;
                filter: blur(80px);
                animation: float 12s ease-in-out infinite;
}

                .bg-orb-2 {
                    position: absolute;
                bottom: 20%;
                right: 10%;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle at center,
                rgba(112,234,240,0.25) 0%,
                rgba(112,234,240,0.12) 40%,
                transparent 70%);
                border-radius: 50%;
                filter: blur(90px);
                animation: floatReverse 15s ease-in-out infinite 2s;
}

                .bg-orb-3 {
                    position: absolute;
                top: 50%;
                left: 50%;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle at center,
                rgba(67,160,180,0.2) 0%,
                rgba(67,160,180,0.08) 50%,
                transparent 70%);
                border-radius: 50%;
                filter: blur(100px);
                animation: float 18s ease-in-out infinite 4s;
}

                .bg-orb-4 {
                    position: absolute;
                top: 30%;
                right: 25%;
                width: 350px;
                height: 350px;
                background: radial-gradient(circle at center,
                rgba(103,186,205,0.18) 0%,
                transparent 60%);
                border-radius: 50%;
                filter: blur(70px);
                animation: floatReverse 20s ease-in-out infinite 6s;
}

                /* Grid decorativa */
                .decorative-grid {
                    position: fixed;
                inset: 0;
                background-image:
                linear-gradient(rgba(103,186,205,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(103,186,205,0.04) 1px, transparent 1px);
                background-size: 50px 50px;
                pointer-events: none;
                z-index: 0;
}

                /* Puntos decorativos */
                .decorative-grid::before {
                    content: '';
                position: absolute;
                inset: 0;
                background-image:
                radial-gradient(circle, rgba(112,234,240,0.15) 2px, transparent 2px);
                background-size: 100px 100px;
                animation: float 25s ease-in-out infinite;
}

                .login-card-wrapper {
                    position: relative;
                z-index: 1;
                width: 100%;
                max-width: 520px;
}


                .logo-section {
                    text - align: center;
                margin-bottom: 3rem;
}

                .logo-container {
                    display: inline-flex;
                align-items: center;
                gap: 1.5rem;
                margin-bottom: 2rem;
                animation: fadeInDown 0.8s ease-out;
}

                .logo-icon-wrapper {
                    width: 75px;
                height: 75px;
                background: linear-gradient(135deg,
                rgba(103,186,205,0.25),
                rgba(112,234,240,0.25));
                border-radius: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow:
                0 10px 40px rgba(103,186,205,0.5),
                inset 0 0 20px rgba(112,234,240,0.15),
                0 0 80px rgba(103,186,205,0.3);
                border: 2px solid rgba(103,186,205,0.5);
                animation: glow 3s ease-in-out infinite;
                position: relative;
}

                .logo-icon-wrapper::before {
                    content: '';
                position: absolute;
                inset: -4px;
                background: linear-gradient(135deg, #67BACD, #70EAF0, #67BACD);
                background-size: 200% 200%;
                border-radius: 22px;
                opacity: 0;
                animation: pulse 3s ease-in-out infinite, borderRotate 4s ease infinite;
                filter: blur(12px);
                z-index: -1;
}

                .logo-icon-wrapper::after {
                    content: '';
                position: absolute;
                inset: -2px;
                background: inherit;
                border-radius: 22px;
                animation: pulseRing 3s ease-in-out infinite;
                opacity: 0;
}

                .logo-letter {
                    font - size: 2.8rem;
                font-weight: 900;
                background: linear-gradient(135deg,
                #67BACD 0%,
                #70EAF0 50%,
                #FFFFFF 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-family: 'Orbitron', sans-serif;
                position: relative;
                z-index: 1;
                text-shadow: 0 0 30px rgba(103,186,205,0.6);
}

                .logo-text {
                    font - size: 3.2rem;
                font-weight: 900;
                background: linear-gradient(135deg,
                #67BACD 0%,
                #70EAF0 40%,
                #FFFFFF 80%,
                #70EAF0 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-family: 'Orbitron', sans-serif;
                letter-spacing: 6px;
                display: block;
                animation: borderRotate 8s ease infinite;
                filter: drop-shadow(0 0 35px rgba(103,186,205,0.6));
}

                .welcome-section {
                    animation: fadeIn 1s ease-out 0.3s backwards;
}

                .welcome-title {
                    font - size: 2.4rem;
                font-weight: 800;
                color: #FFFFFF;
                margin-bottom: 1rem;
                font-family: 'Orbitron', sans-serif;
                text-shadow: 0 2px 25px rgba(103,186,205,0.6);
                letter-spacing: 1px;
}

                .welcome-subtitle {
                    font - size: 1.15rem;
                color: rgba(255,255,255,0.75);
                font-family: 'Quicksand', sans-serif;
                font-weight: 500;
                letter-spacing: 0.5px;
}

                .form-card {
                    background: rgba(255, 255, 255, 0.06);
                backdrop-filter: blur(40px) saturate(180%);
                -webkit-backdrop-filter: blur(40px) saturate(180%);
                border-radius: 32px;
                padding: 3.5rem;
                border: 2px solid rgba(103,186,205,0.35);
                box-shadow:
                0 30px 80px rgba(0,0,0,0.6),
                inset 0 0 40px rgba(103,186,205,0.08),
                0 0 100px rgba(103,186,205,0.15);
                animation: fadeInUp 0.8s ease-out 0.2s backwards;
                position: relative;
                overflow: hidden;
}

                .form-card::before {
                    content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(135deg,
                transparent 0%,
                rgba(103,186,205,0.15) 45%,
                rgba(112,234,240,0.15) 50%,
                rgba(103,186,205,0.15) 55%,
                transparent 100%);
                animation: shine 4s ease-in-out infinite;
                pointer-events: none;
}

                .form-card::after {
                    content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg,
                transparent,
                rgba(103,186,205,0.6),
                rgba(112,234,240,0.8),
                rgba(103,186,205,0.6),
                transparent);
                animation: shine 3s ease-in-out infinite;
}



                .form-group {
                    margin - bottom: 2rem;
                animation: slideIn 0.5s ease-out backwards;
}

                .form-group:nth-child(1) {
                    animation - delay: 0.3s;
}

                .form-group:nth-child(2) {
                    animation - delay: 0.4s;
}

                .form-label {
                    display: flex;
                align-items: center;
                gap: 0.6rem;
                margin-bottom: 1rem;
                color: #FFFFFF;
                font-weight: 700;
                font-size: 1.05rem;
                font-family: 'Quicksand', sans-serif;
                letter-spacing: 0.3px;
}

                .form-label svg {
                    filter: drop-shadow(0 0 4px rgba(103,186,205,0.6));
}

                .input-wrapper {
                    position: relative;
}

                .form-input {
                    width: 100%;
                padding: 1.4rem 1.4rem 1.4rem 3.8rem;
                border-radius: 18px;
                border: 2px solid rgba(103,186,205,0.35);
                font-size: 1.08rem;
                font-family: 'Quicksand', sans-serif;
                font-weight: 500;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                outline: none;
                box-sizing: border-box;
                background: rgba(255,255,255,0.09);
                color: #FFFFFF;
}

                .form-input::placeholder {
                    color: rgba(255,255,255,0.4);
                font-weight: 400;
}

                .form-input:focus {
                    border - color: #67BACD;
                box-shadow:
                0 0 0 5px rgba(103,186,205,0.18),
                0 0 35px rgba(103,186,205,0.4),
                inset 0 0 20px rgba(103,186,205,0.1);
                background: rgba(255,255,255,0.14);
                transform: translateY(-2px);
}

                .input-icon {
                    position: absolute;
                left: 1.3rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1.4rem;
                height: 1.4rem;
                color: #67BACD;
                pointer-events: none;
                filter: drop-shadow(0 0 6px rgba(103,186,205,0.5));
                transition: all 0.3s ease;
}

                .form-input:focus + .input-icon {
                    color: #70EAF0;
                transform: translateY(-50%) scale(1.1);
                filter: drop-shadow(0 0 10px rgba(112,234,240,0.8));
}

                .password-toggle {
                    position: absolute;
                right: 1.3rem;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.6rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                transition: all 0.3s ease;
}

                .password-toggle:hover {
                    background: rgba(103,186,205,0.25);
                transform: translateY(-50%) scale(1.1);
}

                .password-toggle svg {
                    width: 1.4rem;
                height: 1.4rem;
                color: #67BACD;
                filter: drop-shadow(0 0 4px rgba(103,186,205,0.5));
}


                .remember-forgot-section {
                    display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                flex-wrap: wrap;
                gap: 0.8rem;
                animation: slideIn 0.5s ease-out 0.5s backwards;
}

                .remember-label {
                    display: flex;
                align-items: center;
                gap: 0.7rem;
                cursor: pointer;
                font-family: 'Quicksand', sans-serif;
                font-size: 1rem;
                color: rgba(255,255,255,0.85);
                transition: all 0.3s ease;
                font-weight: 500;
}

                .remember-label:hover {
                    color: #FFFFFF;
                transform: translateX(2px);
}

                .remember-checkbox {
                    cursor: pointer;
                width: 20px;
                height: 20px;
                accent-color: #67BACD;
                transition: transform 0.2s ease;
}

                .remember-checkbox:hover {
                    transform: scale(1.15);
}

                .forgot-link {
                    color: #70EAF0;
                text-decoration: none;
                font-weight: 600;
                font-size: 1rem;
                font-family: 'Quicksand', sans-serif;
                transition: all 0.3s ease;
                position: relative;
}

                .forgot-link::after {
                    content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #70EAF0, #67BACD);
                transition: width 0.3s ease;
}

                .forgot-link:hover {
                    color: #FFFFFF;
                text-shadow: 0 0 25px rgba(112,234,240,0.9);
                transform: translateY(-2px);
}

                .forgot-link:hover::after {
                    width: 100%;
}

            

                .error-message {
                    padding: 1.3rem 1.5rem;
                border-radius: 18px;
                background: rgba(239, 68, 68, 0.18);
                border: 2px solid rgba(239, 68, 68, 0.5);
                margin-bottom: 1.8rem;
                display: flex;
                align-items: center;
                gap: 1.2rem;
                animation: shake 0.5s ease-in-out, scaleIn 0.4s ease-out;
}

                .error-icon {
                    width: 1.6rem;
                height: 1.6rem;
                color: #FF6B6B;
                flex-shrink: 0;
                filter: drop-shadow(0 0 8px rgba(255,107,107,0.6));
}

                .error-text {
                    margin: 0;
                color: #FFE0E0;
                font-size: 1rem;
                font-family: 'Quicksand', sans-serif;
                font-weight: 600;
                letter-spacing: 0.3px;
}

                .success-message {
                    padding: 1.3rem 1.5rem;
                border-radius: 18px;
                background: rgba(34, 197, 94, 0.18);
                border: 2px solid rgba(34, 197, 94, 0.5);
                margin-bottom: 1.8rem;
                display: flex;
                align-items: center;
                gap: 1.2rem;
                animation: fadeIn 0.5s ease-out, scaleIn 0.4s ease-out;
}

                .success-icon {
                    width: 1.6rem;
                height: 1.6rem;
                color: #4ADE80;
                flex-shrink: 0;
                filter: drop-shadow(0 0 8px rgba(74,222,128,0.6));
}

                .success-text {
                    margin: 0;
                color: #D1FAE5;
                font-size: 1rem;
                font-family: 'Quicksand', sans-serif;
                font-weight: 600;
                letter-spacing: 0.3px;
}

              

                .submit-button {
                    width: 100%;
                padding: 1.5rem 2rem;
                border-radius: 18px;
                background: linear-gradient(135deg,
                #276A7C 0%,
                #3d8b9d 25%,
                #67BACD 50%,
                #70EAF0 100%);
                background-size: 200% auto;
                color: #FFFFFF;
                font-size: 1.2rem;
                font-weight: 700;
                border: none;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow:
                0 15px 45px rgba(103,186,205,0.6),
                inset 0 1px 0 rgba(255,255,255,0.2);
                font-family: 'Quicksand', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                position: relative;
                overflow: hidden;
                letter-spacing: 0.5px;
                animation: slideIn 0.5s ease-out 0.6s backwards;
}

                .submit-button::before {
                    content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
}

                .submit-button:hover::before {
                    width: 300px;
                height: 300px;
}

                .submit-button:hover {
                    transform: translateY(-4px) scale(1.02);
                box-shadow:
                0 25px 60px rgba(103,186,205,0.8),
                0 0 50px rgba(112,234,240,0.5),
                inset 0 1px 0 rgba(255,255,255,0.3);
                background-position: right center;
}

                .submit-button:active {
                    transform: translateY(-2px) scale(1);
}

                .submit-button:disabled {
                    cursor: not-allowed;
                opacity: 0.7;
                transform: none;
}

                .submit-button:disabled:hover {
                    transform: none;
                box-shadow: 0 15px 45px rgba(103,186,205,0.6);
}

                .loading-spinner {
                    width: 1.4rem;
                height: 1.4rem;
                border: 3px solid rgba(255,255,255,0.35);
                border-top: 3px solid #FFFFFF;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
}

                .button-icon {
                    width: 1.4rem;
                height: 1.4rem;
                filter: drop-shadow(0 0 6px rgba(255,255,255,0.5));
}


                .divider {
                    display: flex;
                align-items: center;
                gap: 1.2rem;
                margin: 2.8rem 0;
}

                .divider-line {
                    flex: 1;
                height: 2px;
                background: linear-gradient(90deg,
                transparent,
                rgba(103,186,205,0.5),
                transparent);
}

                .divider-text {
                    color: rgba(255,255,255,0.65);
                font-size: 0.95rem;
                font-family: 'Quicksand', sans-serif;
                font-weight: 500;
                letter-spacing: 0.3px;
}

                .register-button {
                    width: 100%;
                display: block;
                text-align: center;
                padding: 1.3rem;
                border-radius: 18px;
                border: 2px solid rgba(103,186,205,0.5);
                color: #FFFFFF;
                font-size: 1.1rem;
                font-weight: 700;
                text-decoration: none;
                transition: all 0.4s ease;
                font-family: 'Quicksand', sans-serif;
                cursor: pointer;
                background: rgba(103,186,205,0.08);
                position: relative;
                overflow: hidden;
                letter-spacing: 0.3px;
}

                .register-button::before {
                    content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(103,186,205,0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
}

                .register-button:hover::before {
                    width: 400px;
                height: 400px;
}

                .register-button:hover {
                    background: rgba(103,186,205,0.18);
                border-color: #67BACD;
                transform: translateY(-3px);
                box-shadow:
                0 15px 40px rgba(103,186,205,0.4),
                inset 0 0 30px rgba(103,186,205,0.1);
                color: #70EAF0;
}

  

                .back-link-container {
                    text - align: center;
                margin-top: 3rem;
                animation: fadeIn 1s ease-out 0.8s backwards;
}

                .back-link {
                    color: rgba(255,255,255,0.65);
                text-decoration: none;
                font-size: 1rem;
                font-family: 'Quicksand', sans-serif;
                font-weight: 600;
                cursor: pointer;
                display: inline-block;
                transition: all 0.3s ease;
                position: relative;
                padding: 0.5rem 1rem;
                border-radius: 8px;
}

                .back-link::before {
                    content: '';
                position: absolute;
                inset: 0;
                background: rgba(103,186,205,0.1);
                border-radius: 8px;
                opacity: 0;
                transition: opacity 0.3s ease;
}

                .back-link:hover {
                    color: #70EAF0;
                text-shadow: 0 0 25px rgba(112,234,240,0.7);
                transform: translateX(-5px);
}

                .back-link:hover::before {
                    opacity: 1;
}


                @media (max-width: 768px) {
    .login - container {
                    padding: 1.5rem;
    }

                .form-card {
                    padding: 2.5rem 2rem;
                border-radius: 28px;
    }

                .logo-icon-wrapper {
                    width: 65px;
                height: 65px;
    }

                .logo-letter {
                    font - size: 2.4rem;
    }

                .logo-text {
                    font - size: 2.8rem;
                letter-spacing: 4px;
    }

                .welcome-title {
                    font - size: 2rem;
    }

                .welcome-subtitle {
                    font - size: 1rem;
    }

                .form-input {
                    padding: 1.2rem 1.2rem 1.2rem 3.5rem;
                font-size: 1rem;
    }

                .submit-button {
                    padding: 1.3rem 1.5rem;
                font-size: 1.1rem;
    }

                .remember-forgot-section {
                    flex - direction: column;
                align-items: flex-start;
                gap: 1rem;
    }

                .bg-orb-1,
                .bg-orb-2,
                .bg-orb-3,
                .bg-orb-4 {
                    width: 300px;
                height: 300px;
    }
}

                @media (max-width: 480px) {
    .login - container {
                    padding: 1rem;
    }

                .logo-section {
                    margin - bottom: 2rem;
    }

                .logo-container {
                    gap: 1rem;
                margin-bottom: 1.5rem;
    }

                .logo-icon-wrapper {
                    width: 55px;
                height: 55px;
    }

                .logo-letter {
                    font - size: 2rem;
    }

                .logo-text {
                    font - size: 2.2rem;
                letter-spacing: 3px;
    }

                .welcome-title {
                    font - size: 1.6rem;
    }

                .welcome-subtitle {
                    font - size: 0.95rem;
    }

                .form-card {
                    padding: 2rem 1.5rem;
                border-radius: 24px;
    }

                .form-group {
                    margin - bottom: 1.5rem;
    }

                .form-label {
                    font - size: 0.95rem;
    }

                .form-input {
                    padding: 1.1rem 1rem 1.1rem 3.2rem;
                font-size: 0.95rem;
                border-radius: 14px;
    }

                .input-icon {
                    width: 1.2rem;
                height: 1.2rem;
                left: 1.1rem;
    }

                .password-toggle {
                    right: 1rem;
                padding: 0.5rem;
    }

                .password-toggle svg {
                    width: 1.2rem;
                height: 1.2rem;
    }

                .submit-button {
                    padding: 1.2rem;
                font-size: 1rem;
                border-radius: 14px;
    }

                .register-button {
                    padding: 1.1rem;
                font-size: 1rem;
                border-radius: 14px;
    }

                .error-message,
                .success-message {
                    padding: 1.1rem 1.2rem;
                border-radius: 14px;
                font-size: 0.9rem;
    }

                .divider {
                    margin: 2rem 0;
    }

                .back-link-container {
                    margin - top: 2rem;
    }
}


                /* Estado de carga del botón */
                .submit-button.loading {
                    pointer - events: none;
                background: linear-gradient(135deg, #5EACBB, #70EAF0);
}

                /* Input con error */
                .form-input.error {
                    border - color: rgba(239, 68, 68, 0.6);
                box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
                animation: shake 0.5s ease-in-out;
}

                /* Input válido */
                .form-input.valid {
                    border - color: rgba(34, 197, 94, 0.6);
                box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}



                /* Efecto de brillo en el logo */
                .logo-icon-wrapper:hover {
                    transform: scale(1.08) rotate(5deg);
                box-shadow:
                0 15px 60px rgba(103,186,205,0.7),
                inset 0 0 40px rgba(112,234,240,0.3),
                0 0 100px rgba(103,186,205,0.5);
}

                /* Efecto de pulso en los iconos del formulario */
                @keyframes iconPulse {
                    0 %, 100 % {
                        transform: translateY(-50 %) scale(1);
                    }
    50% {
                    transform: translateY(-50%) scale(1.15);
    }
}

                .form-input:focus + .input-icon {
                    animation: iconPulse 1.5s ease-in-out infinite;
}



                /* Focus visible para navegación por teclado */
                .form-input:focus-visible,
                .submit-button:focus-visible,
                .register-button:focus-visible,
                .forgot-link:focus-visible,
                .back-link:focus-visible {
                    outline: 3px solid rgba(112,234,240,0.6);
                outline-offset: 3px;
}

                .remember-checkbox:focus-visible {
                    outline: 3px solid rgba(112,234,240,0.6);
                outline-offset: 2px;
}

/* ============================================
   ANIMACIONES DE ENTRADA ESCALONADAS
   ============================================ */

.form-card > * {
                    animation - fill - mode: backwards;
}


                @keyframes particleFloat {
                    0 % {
                        transform: translateY(0) translateX(0);
        opacity: 0;
                    }
    10% {
                    opacity: 1;
    }
                90% {
                    opacity: 1;
    }
                100% {
                    transform: translateY(-100vh) translateX(50px);
                opacity: 0;
    }
}

                .particle {
                    position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(103,186,205,0.8), transparent);
                border-radius: 50%;
                pointer-events: none;
                animation: particleFloat 15s linear infinite;
}

                .particle:nth-child(1) {left: 10%; animation-delay: 0s; }
                .particle:nth-child(2) {left: 30%; animation-delay: 2s; }
                .particle:nth-child(3) {left: 50%; animation-delay: 4s; }
                .particle:nth-child(4) {left: 70%; animation-delay: 6s; }
                .particle:nth-child(5) {left: 90%; animation-delay: 8s; }



                @media (prefers-color-scheme: dark) {
    .form - card {
                    background: rgba(255, 255, 255, 0.04);
                border-color: rgba(103,186,205,0.4);
    }

                .form-input {
                    background: rgba(255,255,255,0.06);
    }

                .form-input:focus {
                    background: rgba(255,255,255,0.1);
    }
}


                @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
                *::after {
                    animation - duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
    }
}



                .form-card,
                .submit-button,
                .register-button,
                .form-input,
                .logo-icon-wrapper {
                    will - change: transform;
}

                /* Optimización de GPU */
                .bg-orb-1,
                .bg-orb-2,
                .bg-orb-3,
                .bg-orb-4 {
                    transform: translateZ(0);
                backface-visibility: hidden;
}



                .form-input:-webkit-autofill,
                .form-input:-webkit-autofill:hover,
                .form-input:-webkit-autofill:focus {
                    -webkit - text - fill - color: #FFFFFF;
                -webkit-box-shadow: 0 0 0 1000px rgba(103,186,205,0.15) inset;
                transition: background-color 5000s ease-in-out 0s;
}

                ::-webkit-scrollbar {
                    width: 10px;
}

                ::-webkit-scrollbar-track {
                    background: rgba(10, 22, 40, 0.5);
}

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #67BACD, #70EAF0);
                border-radius: 10px;
}

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #70EAF0, #67BACD);
}

                /* ============================================
                   SELECCIÓN DE TEXTO
                   ============================================ */

                ::selection {
                    background: rgba(103,186,205,0.4);
                color: #FFFFFF;
}

                ::-moz-selection {
                    background: rgba(103,186,205,0.4);
                color: #FFFFFF;
}

           `}</style>
        </div>
    );
}

