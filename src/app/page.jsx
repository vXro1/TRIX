'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart3, Package, TrendingUp, Database, Sparkles, Zap,
  Shield, Users, ArrowRight, CheckCircle2, ShoppingBag,
  LineChart, Award, Menu, X, ChevronDown, Layers, Brain,
  Target, Eye, Rocket, Globe, LogIn, UserPlus
} from 'lucide-react';

export default function TrixLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !observerRefs.current.includes(el)) {
      observerRefs.current.push(el);
    }
  };

  const teamMembers = [
    { name: "Veronica Manciaa", role: "Integrante 1", specialty: "Frontend Developer/UI/UX Developer" },
    { name: "Bryan David yepes", role: "Integrante 2", specialty: "Arquitectura de Software" },
    { name: "Stiven Ordoñez", role: "Integrante 3", specialty: "Desarrollador de IA" },
  ];

  const handleLogin = () => {
    window.location.href = '/trix/login';
  };

  const handleRegister = () => {
    window.location.href = '/trix/registro';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      color: '#000000',
      overflow: 'hidden',
      position: 'relative'
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
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(103,186,205,0.12), transparent)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 12s ease-in-out infinite',
          transform: `translateY(${scrollY * 0.2}px)`
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(112,234,240,0.12), transparent)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          animation: 'float 15s ease-in-out infinite 2s',
          transform: `translateY(${-scrollY * 0.15}px)`
        }}></div>
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(94,172,187,0.1), transparent)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'float 18s ease-in-out infinite 4s',
          transform: `translateY(${scrollY * 0.1}px)`
        }}></div>
      </div>

      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(25px)',
        borderBottom: '1px solid rgba(103, 186, 205, 0.15)',
        boxShadow: scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.08)' : '0 2px 20px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '85px'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <div style={{
                width: '55px',
                height: '55px',
                background: 'linear-gradient(135deg, rgba(103,186,205,0.1), rgba(112,234,240,0.1))',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(103,186,205,0.25)',
                border: '2px solid rgba(103,186,205,0.3)',
                transition: 'all 0.4s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(103,186,205,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(103,186,205,0.25)';
                }}>
                <img
                  src="/img/trix.png"
                  alt="TRIX"
                  style={{
                    width: '10vw',       // ocupa 10% del ancho de la pantalla
                    maxWidth: '60px',    // nunca será más grande que 60px
                    height: 'auto',      // mantiene la proporción
                    objectFit: 'contain'
                  }}
                  className="glow"
                />

              </div>
              <span style={{
                fontSize: '2.2rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #276A7C 0%, #67BACD 50%, #70EAF0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '3px'
              }}>
                TRIX
              </span>
            </div>

            {/* Desktop Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }} className="desktop-menu">
              {['Inicio', 'Quiénes Somos', 'Misión', 'Funcionalidades', 'Contacto'].map((item, idx) => (
                <a key={idx} href={`#${item.toLowerCase().replace(' ', '-').replace('é', 'e').replace('ó', 'o')}`} style={{
                  color: '#333333',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  position: 'relative',
                  fontWeight: '600',
                  fontFamily: 'Quicksand, sans-serif',
                  fontSize: '1.05rem'
                }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#276A7C';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#333333';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                  {item}
                </a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-menu">
              <button
                onClick={handleLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 2rem',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  color: '#276A7C',
                  fontWeight: '700',
                  border: '2px solid #276A7C',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: 'Quicksand, sans-serif',
                  fontSize: '1.05rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.background = 'rgba(103,186,205,0.08)';
                  e.target.style.boxShadow = '0 8px 25px rgba(103,186,205,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = '#FFFFFF';
                  e.target.style.boxShadow = 'none';
                }}>
                <LogIn style={{ width: '1.2rem', height: '1.2rem' }} />
                Iniciar Sesión
              </button>

              <button
                onClick={handleRegister}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 2.2rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #276A7C, #67BACD)',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 25px rgba(103,186,205,0.35)',
                  fontFamily: 'Quicksand, sans-serif',
                  fontSize: '1.05rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 35px rgba(103,186,205,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(103,186,205,0.35)';
                }}>
                <UserPlus style={{ width: '1.2rem', height: '1.2rem' }} />
                Registrarse
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
              className="mobile-menu-btn">
              {mobileMenuOpen ?
                <X style={{ width: '2rem', height: '2rem', color: '#276A7C' }} /> :
                <Menu style={{ width: '2rem', height: '2rem', color: '#276A7C' }} />
              }
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div style={{
              display: 'none',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.5rem 0',
              borderTop: '1px solid rgba(103,186,205,0.2)',
              animation: 'fadeInDown 0.3s ease'
            }}
              className="mobile-menu-dropdown">
              {['Inicio', 'Quiénes Somos', 'Misión', 'Funcionalidades', 'Contacto'].map((item, idx) => (
                <a key={idx}
                  href={`#${item.toLowerCase().replace(' ', '-').replace('é', 'e').replace('ó', 'o')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: '#333333',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '1.1rem',
                    padding: '0.5rem 0'
                  }}>
                  {item}
                </a>
              ))}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(103,186,205,0.2)'
              }}>
                <button
                  onClick={handleLogin}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    color: '#276A7C',
                    fontWeight: '700',
                    border: '2px solid #276A7C',
                    cursor: 'pointer',
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '1.05rem'
                  }}>
                  Iniciar Sesión
                </button>
                <button
                  onClick={handleRegister}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #276A7C, #67BACD)',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '1.05rem'
                  }}>
                  Registrarse
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio"
        ref={addToRefs}
        style={{
          position: 'relative',
          paddingTop: '12rem',
          paddingBottom: '8rem',
          padding: '12rem 2rem 8rem 2rem',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
          {/* Badge */}
          <div style={{
            marginBottom: '2.5rem',
            opacity: isVisible['inicio'] ? 1 : 0,
            transform: isVisible['inicio'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.85rem 1.8rem',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(112,234,240,0.12), rgba(103,186,205,0.12))',
              border: '2px solid rgba(103,186,205,0.25)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 4px 20px rgba(103,186,205,0.15)'
            }}>
              <Brain style={{ width: '1.3rem', height: '1.3rem', color: '#276A7C' }} />
              <span style={{
                fontSize: '1rem',
                color: '#276A7C',
                fontWeight: '700',
                fontFamily: 'Quicksand, sans-serif'
              }}>
                Impulsado por Inteligencia Artificial
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontWeight: '900',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #276A7C 0%, #67BACD 50%, #70EAF0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Orbitron, sans-serif',
            letterSpacing: '5px',
            lineHeight: '1.1',
            opacity: isVisible['inicio'] ? 1 : 0,
            transform: isVisible['inicio'] ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}>
            TRIX
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '2rem',
            color: '#276A7C',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: '600',
            letterSpacing: '3px',
            opacity: isVisible['inicio'] ? 1 : 0,
            transform: isVisible['inicio'] ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
          }}>
            Escanea • Analiza • Predice
          </p>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            color: '#444444',
            marginBottom: '4rem',
            maxWidth: '65rem',
            margin: '0 auto 4rem auto',
            lineHeight: '1.8',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: '500',
            padding: '0 2rem',
            opacity: isVisible['inicio'] ? 1 : 0,
            transform: isVisible['inicio'] ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s'
          }}>
            La plataforma web que transforma tus datos de inventario en decisiones inteligentes mediante análisis predictivo en tiempo real
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '0 2rem',
            opacity: isVisible['inicio'] ? 1 : 0,
            transform: isVisible['inicio'] ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s'
          }}>
            <button
              onClick={handleLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1.4rem 3rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #276A7C, #67BACD)',
                color: '#FFFFFF',
                fontSize: '1.25rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 12px 35px rgba(103,186,205,0.4)',
                fontFamily: 'Quicksand, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px) scale(1.05)';
                e.target.style.boxShadow = '0 18px 45px rgba(103,186,205,0.55)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 12px 35px rgba(103,186,205,0.4)';
              }}>
              Iniciar Sesión
              <LogIn style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>

            <button
              onClick={handleRegister}
              style={{
                padding: '1.4rem 3rem',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '3px solid #276A7C',
                color: '#276A7C',
                fontSize: '1.25rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'Quicksand, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.background = 'rgba(103,186,205,0.08)';
                e.target.style.borderColor = '#67BACD';
                e.target.style.boxShadow = '0 8px 25px rgba(103,186,205,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = '#FFFFFF';
                e.target.style.borderColor = '#276A7C';
                e.target.style.boxShadow = 'none';
              }}>
              Crear Cuenta
            </button>
          </div>

          {/* Hero Visual */}
          <div style={{
            marginTop: '7rem',
            position: 'relative',
            padding: '0 2rem',
            opacity: isVisible['inicio'] ? 1 : 0,
            transform: isVisible['inicio'] ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.95)',
            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1s'
          }}>
            <div style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '28px',
              padding: '2.5rem',
              border: '3px solid rgba(103,186,205,0.25)',
              boxShadow: '0 30px 70px rgba(103,186,205,0.2)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: 'linear-gradient(135deg, rgba(103,186,205,0.04), rgba(112,234,240,0.04))',
                zIndex: 0
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=700&fit=crop&q=90"
                  alt="Dashboard Analytics"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.12)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section id="quienes-somos"
        ref={addToRefs}
        style={{
          padding: '10rem 2rem',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(103,186,205,0.02) 100%)'
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '6rem',
            opacity: isVisible['quienes-somos'] ? 1 : 0,
            transform: isVisible['quienes-somos'] ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '0.6rem 1.8rem',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(103,186,205,0.12), rgba(112,234,240,0.12))',
              border: '2px solid rgba(103,186,205,0.25)',
              marginBottom: '2rem'
            }}>
              <span style={{
                color: '#276A7C',
                fontWeight: '700',
                fontSize: '1rem',
                fontFamily: 'Quicksand, sans-serif'
              }}>Nuestro Equipo</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: '900',
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, #276A7C, #67BACD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '2px'
            }}>
              Quiénes Somos
            </h2>

            <p style={{
              fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
              color: '#555555',
              maxWidth: '55rem',
              margin: '0 auto',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: '500',
              lineHeight: '1.8'
            }}>
              Somos un grupo de desarrolladores y analistas apasionados que creamos <strong style={{ color: '#276A7C' }}>TRIX</strong> para ayudar a empresas retail a optimizar su inventario usando IA y análisis de datos en tiempo real.
            </p>
          </div>

          {/* Team Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            marginBottom: '6rem'
          }}>
            {teamMembers.map((member, idx) => (
              <div key={idx} style={{
                position: 'relative',
                opacity: isVisible['quienes-somos'] ? 1 : 0,
                transform: isVisible['quienes-somos'] ? 'translateY(0)' : 'translateY(50px)',
                transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.15}s`
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  border: '2px solid rgba(103,186,205,0.2)',
                  height: '100%',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  boxShadow: '0 10px 35px rgba(103,186,205,0.12)',
                  textAlign: 'center'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-15px)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(103,186,205,0.25)';
                    e.currentTarget.style.borderColor = 'rgba(112,234,240,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 35px rgba(103,186,205,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(103,186,205,0.2)';
                  }}>
                  {/* Avatar Placeholder */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(103,186,205,0.2), rgba(112,234,240,0.2))',
                    border: '4px solid rgba(103,186,205,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(103,186,205,0.2)'
                  }}>
                    <Users style={{ width: '3.5rem', height: '3.5rem', color: '#276A7C' }} />
                  </div>

                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: '#000000',
                    marginBottom: '0.8rem',
                    fontFamily: 'Orbitron, sans-serif'
                  }}>
                    {member.name}
                  </h3>

                  <p style={{
                    fontSize: '1.1rem',
                    color: '#276A7C',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    fontFamily: 'Quicksand, sans-serif'
                  }}>
                    {member.role}
                  </p>

                  <p style={{
                    color: '#666666',
                    fontSize: '0.95rem',
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: '500'
                  }}>
                    {member.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Teaser */}
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '2px solid rgba(103,186,205,0.2)',
            boxShadow: '0 15px 45px rgba(103,186,205,0.15)',
            opacity: isVisible['quienes-somos'] ? 1 : 0,
            transform: isVisible['quienes-somos'] ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 1s ease 0.6s'
          }}>
            <Rocket style={{
              width: '3.5rem',
              height: '3.5rem',
              color: '#276A7C',
              marginBottom: '1.5rem',
              display: 'inline-block'
            }} />
            <p style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
              color: '#444444',
              maxWidth: '50rem',
              margin: '0 auto',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: '600',
              lineHeight: '1.8'
            }}>
              Nuestro objetivo es <span style={{ color: '#276A7C', fontWeight: '800' }}>democratizar el acceso</span> a tecnología de punta para que cualquier negocio pueda competir en el mercado actual
            </p>
          </div>
        </div>
      </section>

      {/* Misión Section */}
      <section id="mision"
        ref={addToRefs}
        style={{
          padding: '10rem 2rem',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(180deg, rgba(103,186,205,0.02) 0%, #FFFFFF 100%)'
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '6rem',
            opacity: isVisible['mision'] ? 1 : 0,
            transform: isVisible['mision'] ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '0.6rem 1.8rem',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(103,186,205,0.12), rgba(112,234,240,0.12))',
              border: '2px solid rgba(103,186,205,0.25)',
              marginBottom: '2rem'
            }}>
              <span style={{
                color: '#276A7C',
                fontWeight: '700',
                fontSize: '1rem',
                fontFamily: 'Quicksand, sans-serif'
              }}>Nuestra Razón de Ser</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: '900',
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, #276A7C, #67BACD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '2px'
            }}>
              Nuestra Misión
            </h2>
          </div>

          {/* Mission Statement */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(25px)',
            borderRadius: '32px',
            padding: '5rem 4rem',
            border: '3px solid rgba(103,186,205,0.25)',
            boxShadow: '0 25px 60px rgba(103,186,205,0.2)',
            marginBottom: '5rem',
            position: 'relative',
            overflow: 'hidden',
            opacity: isVisible['mision'] ? 1 : 0,
            transform: isVisible['mision'] ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 1s ease 0.2s'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(103,186,205,0.03), rgba(112,234,240,0.03))',
              zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Target style={{
                width: '4rem',
                height: '4rem',
                color: '#276A7C',
                marginBottom: '2rem',
                display: 'inline-block'
              }} />

              <p style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                color: '#333333',
                maxWidth: '60rem',
                margin: '0 auto',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: '600',
                lineHeight: '1.9',
                marginBottom: '2rem'
              }}>
                Proporcionar a las empresas retail una <span style={{
                  background: 'linear-gradient(135deg, #276A7C, #67BACD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '800'
                }}>herramienta inteligente</span> que les permita tomar decisiones basadas en datos, reduciendo costos y maximizando la eficiencia operativa
              </p>

              <p style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                color: '#666666',
                maxWidth: '55rem',
                margin: '0 auto',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: '500',
                lineHeight: '1.8'
              }}>
                Creemos que cada negocio, sin importar su tamaño, merece acceso a tecnología de clase mundial para competir en el mercado digital
              </p>
            </div>
          </div>

          {/* Mission Values */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {[
              {
                icon: Eye,
                title: "Visión Clara",
                description: "Convertirnos en la plataforma líder de gestión inteligente de inventario en Latinoamérica"
              },
              {
                icon: Layers,
                title: "Innovación Constante",
                description: "Evolucionar continuamente nuestras soluciones con las últimas tecnologías en IA"
              },
              {
                icon: Shield,
                title: "Compromiso Total",
                description: "Garantizar seguridad, confiabilidad y soporte excepcional a nuestros clientes"
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} style={{
                  opacity: isVisible['mision'] ? 1 : 0,
                  transform: isVisible['mision'] ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.8s ease ${0.4 + idx * 0.15}s`
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '3rem 2.5rem',
                    border: '2px solid rgba(103,186,205,0.2)',
                    height: '100%',
                    transition: 'all 0.5s ease',
                    cursor: 'pointer',
                    boxShadow: '0 10px 35px rgba(103,186,205,0.12)',
                    textAlign: 'center'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px)';
                      e.currentTarget.style.boxShadow = '0 20px 55px rgba(103,186,205,0.25)';
                      e.currentTarget.style.borderColor = 'rgba(112,234,240,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 35px rgba(103,186,205,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(103,186,205,0.2)';
                    }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '1.5rem',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(103,186,205,0.15), rgba(112,234,240,0.15))',
                      border: '2px solid rgba(103,186,205,0.3)',
                      marginBottom: '2rem',
                      boxShadow: '0 8px 25px rgba(103,186,205,0.2)'
                    }}>
                      <Icon style={{ width: '2.8rem', height: '2.8rem', color: '#276A7C' }} />
                    </div>

                    <h3 style={{
                      fontSize: '1.6rem',
                      fontWeight: '900',
                      color: '#000000',
                      marginBottom: '1.5rem',
                      fontFamily: 'Orbitron, sans-serif'
                    }}>
                      {value.title}
                    </h3>

                    <p style={{
                      color: '#666666',
                      fontSize: '1.05rem',
                      lineHeight: '1.8',
                      fontFamily: 'Quicksand, sans-serif',
                      fontWeight: '500'
                    }}>
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section id="funcionalidades"
        ref={addToRefs}
        style={{
          padding: '10rem 2rem',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(103,186,205,0.03) 100%)'
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '6rem',
            opacity: isVisible['funcionalidades'] ? 1 : 0,
            transform: isVisible['funcionalidades'] ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '0.6rem 1.8rem',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(103,186,205,0.12), rgba(112,234,240,0.12))',
              border: '2px solid rgba(103,186,205,0.25)',
              marginBottom: '2rem'
            }}>
              <span style={{
                color: '#276A7C',
                fontWeight: '700',
                fontSize: '1rem',
                fontFamily: 'Quicksand, sans-serif'
              }}>Qué Hacemos</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: '900',
              marginBottom: '2.5rem',
              background: 'linear-gradient(135deg, #276A7C, #67BACD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '2px'
            }}>
              Funcionalidades Clave
            </h2>

            <p style={{
              fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
              color: '#555555',
              maxWidth: '55rem',
              margin: '0 auto',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: '500',
              lineHeight: '1.8'
            }}>
              Herramientas potentes diseñadas para llevar tu gestión de inventario al siguiente nivel
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '6rem'
          }}>
            {[
              {
                Icon: Package,
                title: "Escaneo Inteligente",
                desc: "Reconocimiento automático de productos desde cualquier dispositivo móvil o tablet. Captura instantánea de códigos de barras y actualización en tiempo real.",
                gradient: 'linear-gradient(135deg, #276A7C, #67BACD)'
              },
              {
                Icon: BarChart3,
                title: "Análisis de Rotación",
                desc: "KPIs en tiempo real organizados por categoría, talla y género. Identifica productos de alta y baja rotación con visualizaciones intuitivas.",
                gradient: 'linear-gradient(135deg, #67BACD, #70EAF0)'
              },
              {
                Icon: Brain,
                title: "Predicciones con IA",
                desc: "Algoritmos de machine learning que predicen demanda futura y generan sugerencias automáticas de compras y estrategias de descuento.",
                gradient: 'linear-gradient(135deg, #70EAF0, #5EACBB)'
              },
              {
                Icon: Database,
                title: "Dashboard Interactivo",
                desc: "Visualización completa de ventas, stock disponible y tendencias de mercado en un panel centralizado y fácil de navegar.",
                gradient: 'linear-gradient(135deg, #5EACBB, #276A7C)'
              }
            ].map((feature, idx) => {
              const Icon = feature.Icon;
              return (
                <div key={idx} style={{
                  position: 'relative',
                  opacity: isVisible['funcionalidades'] ? 1 : 0,
                  transform: isVisible['funcionalidades'] ? 'translateY(0)' : 'translateY(50px)',
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.15}s`
                }}>
                  <div style={{
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '28px',
                    padding: '3rem',
                    border: '2px solid rgba(103,186,205,0.2)',
                    height: '100%',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(103,186,205,0.12)',
                    overflow: 'hidden'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-15px)';
                      e.currentTarget.style.boxShadow = '0 25px 65px rgba(103,186,205,0.3)';
                      e.currentTarget.style.borderColor = 'rgba(112,234,240,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(103,186,205,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(103,186,205,0.2)';
                    }}>
                    {/* Gradient Background Decoration */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      right: '-30%',
                      width: '200px',
                      height: '200px',
                      background: feature.gradient,
                      borderRadius: '50%',
                      opacity: 0.08,
                      filter: 'blur(60px)',
                      zIndex: 0
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{
                        display: 'inline-flex',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        background: feature.gradient,
                        marginBottom: '2.5rem',
                        boxShadow: '0 10px 30px rgba(103,186,205,0.3)'
                      }}>
                        <Icon style={{ width: '3rem', height: '3rem', color: 'white' }} />
                      </div>

                      <h3 style={{
                        fontSize: '1.8rem',
                        fontWeight: '900',
                        color: '#000000',
                        marginBottom: '1.5rem',
                        fontFamily: 'Orbitron, sans-serif'
                      }}>
                        {feature.title}
                      </h3>

                      <p style={{
                        color: '#666666',
                        lineHeight: '1.9',
                        fontFamily: 'Quicksand, sans-serif',
                        marginBottom: '2.5rem',
                        fontSize: '1.08rem',
                        fontWeight: '500'
                      }}>
                        {feature.desc}
                      </p>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#276A7C',
                        transition: 'all 0.3s ease',
                        fontWeight: '700'
                      }}>
                        <span style={{
                          fontSize: '1rem',
                          fontFamily: 'Quicksand, sans-serif'
                        }}>
                          Explorar más
                        </span>
                        <ArrowRight style={{
                          width: '1.2rem',
                          height: '1.2rem',
                          marginLeft: '0.6rem',
                          transition: 'transform 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Benefits */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '4rem 3rem',
            border: '2px solid rgba(103,186,205,0.2)',
            boxShadow: '0 15px 45px rgba(103,186,205,0.15)',
            opacity: isVisible['funcionalidades'] ? 1 : 0,
            transform: isVisible['funcionalidades'] ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 1s ease 0.6s'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '900',
              color: '#276A7C',
              marginBottom: '3rem',
              textAlign: 'center',
              fontFamily: 'Orbitron, sans-serif'
            }}>
              Beneficios Adicionales
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {[
                { icon: Award, text: "Reduce costos operativos significativamente" },
                { icon: LineChart, text: "Optimiza inventario en tiempo real" },
                { icon: ShoppingBag, text: "Previene quiebres de stock automáticamente" },
                { icon: TrendingUp, text: "Aumenta márgenes con precios dinámicos" },
                { icon: Globe, text: "Integración con sistemas existentes" },
                { icon: BarChart3, text: "Reportes personalizados instantáneos" }
              ].map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    border: '2px solid rgba(103,186,205,0.15)',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(112,234,240,0.5)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(103,186,205,0.2)';
                      e.currentTarget.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(103,186,205,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}>
                    <div style={{
                      padding: '0.9rem',
                      background: 'linear-gradient(135deg, rgba(103,186,205,0.12), rgba(112,234,240,0.12))',
                      borderRadius: '14px',
                      border: '2px solid rgba(103,186,205,0.25)',
                      flexShrink: 0
                    }}>
                      <Icon style={{
                        width: '2rem',
                        height: '2rem',
                        color: '#276A7C'
                      }} />
                    </div>
                    <span style={{
                      color: '#333333',
                      fontFamily: 'Quicksand, sans-serif',
                      fontWeight: '600',
                      fontSize: '1.05rem'
                    }}>{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto"
        ref={addToRefs}
        style={{
          padding: '10rem 2rem',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(180deg, rgba(103,186,205,0.03) 0%, #FFFFFF 100%)'
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '5rem',
            opacity: isVisible['contacto'] ? 1 : 0,
            transform: isVisible['contacto'] ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '0.6rem 1.8rem',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(103,186,205,0.12), rgba(112,234,240,0.12))',
              border: '2px solid rgba(103,186,205,0.25)',
              marginBottom: '2rem'
            }}>
              <span style={{
                color: '#276A7C',
                fontWeight: '700',
                fontSize: '1rem',
                fontFamily: 'Quicksand, sans-serif'
              }}>Hablemos</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: '900',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #276A7C, #67BACD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '2px'
            }}>
              Contáctanos
            </h2>

            <p style={{
              fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
              color: '#555555',
              maxWidth: '55rem',
              margin: '0 auto',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: '500',
              lineHeight: '1.8'
            }}>
              ¿Tienes preguntas? Nuestro equipo está listo para ayudarte
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(25px)',
            borderRadius: '32px',
            padding: '4rem 3rem',
            border: '2px solid rgba(103,186,205,0.2)',
            boxShadow: '0 20px 55px rgba(103,186,205,0.18)',
            maxWidth: '45rem',
            margin: '0 auto',
            opacity: isVisible['contacto'] ? 1 : 0,
            transform: isVisible['contacto'] ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 1s ease 0.2s'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.2rem',
                color: '#333333',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: '600'
              }}>
                📧 Email: <a href="mailto:contacto@trix.com" style={{
                  color: '#276A7C',
                  textDecoration: 'none',
                  fontWeight: '700'
                }}>contacto@trix.com</a>
              </p>

              <p style={{
                fontSize: '1.2rem',
                color: '#333333',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: '600'
              }}>
                📞 Teléfono: <a href="tel:+123456789" style={{
                  color: '#276A7C',
                  textDecoration: 'none',
                  fontWeight: '700'
                }}>+1 (234) 567-89</a>
              </p>

              <div style={{
                marginTop: '1rem',
                paddingTop: '2rem',
                borderTop: '2px solid rgba(103,186,205,0.2)'
              }}>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#666666',
                  marginBottom: '1.5rem',
                  fontFamily: 'Quicksand, sans-serif',
                  fontWeight: '500'
                }}>
                  Síguenos en redes sociales
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                  {['LinkedIn', 'Twitter', 'GitHub', 'Instagram'].map((social, idx) => (
                    <a key={idx} href="#" style={{
                      padding: '1rem',
                      background: 'linear-gradient(135deg, rgba(103,186,205,0.12), rgba(112,234,240,0.12))',
                      borderRadius: '14px',
                      border: '2px solid rgba(103,186,205,0.25)',
                      color: '#276A7C',
                      textDecoration: 'none',
                      fontFamily: 'Quicksand, sans-serif',
                      fontWeight: '700',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(103,186,205,0.3)';
                        e.target.style.borderColor = 'rgba(112,234,240,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.borderColor = 'rgba(103,186,205,0.25)';
                      }}>
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '6rem 2rem 3rem 2rem',
        borderTop: '2px solid rgba(103,186,205,0.15)',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(180deg, rgba(103,186,205,0.02) 0%, #FFFFFF 100%)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '4rem',
            marginBottom: '4rem'
          }}>
            {/* Logo Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                  width: '55px',
                  height: '55px',
                  background: 'linear-gradient(135deg, rgba(103,186,205,0.1), rgba(112,234,240,0.1))',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(103,186,205,0.2)',
                  border: '2px solid rgba(103,186,205,0.3)'
                }}>
                  <img
                    src="https://i.ibb.co/fYxk8PZ/logo-trix.png"
                    alt="TRIX"
                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                  />
                </div>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #276A7C, #67BACD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: '2px'
                }}>RIX</span>
              </div>
              <p style={{
                color: '#666666',
                fontSize: '1rem',
                lineHeight: '1.8',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: '500'
              }}>
                Transformando el futuro del retail con inteligencia artificial y análisis predictivo
              </p>
            </div>

            {/* Links Columns */}
            {[
              { title: 'Producto', items: ['Funcionalidades', 'Precios', 'Integraciones', 'API'] },
              { title: 'Empresa', items: ['Sobre nosotros', 'Carreras', 'Blog', 'Prensa'] },
              { title: 'Legal', items: ['Privacidad', 'Términos', 'Seguridad', 'Cookies'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 style={{
                  color: '#000000',
                  fontWeight: '800',
                  marginBottom: '1.5rem',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '1.2rem'
                }}>{section.title}</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a href="#" style={{
                        color: '#666666',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Quicksand, sans-serif',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#276A7C';
                          e.target.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#666666';
                          e.target.style.transform = 'translateX(0)';
                        }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div style={{
            paddingTop: '3rem',
            borderTop: '2px solid rgba(103,186,205,0.15)',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#666666',
              fontSize: '1rem',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: '500'
            }}>
              © 2025 TRIX. Todos los derechos reservados. Hecho con ❤️ para revolucionar el retail
            </p>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700;800&display=swap');

        /* ============= RESET & BASE ============= */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          background: #FFFFFF;
          overflow-x: hidden;
          font-family: 'Quicksand', sans-serif;
        }

        /* ============= ANIMATIONS ============= */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
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
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(103,186,205,0.3);
          }
          50% {
            box-shadow: 0 0 35px rgba(103,186,205,0.6), 0 0 50px rgba(112,234,240,0.4);
          }
        }

        /* ============= BUTTON EFFECTS ============= */
        button {
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
          z-index: -1;
        }

        button:hover::before {
          width: 400px;
          height: 400px;
        }

        button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%);
          transition: transform 0.7s;
        }

        button:hover::after {
          transform: translateX(100%);
        }

        button:active {
          transform: scale(0.97);
        }

        /* ============= LINK EFFECTS ============= */
        a {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        nav a::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #276A7C, #67BACD);
          transform: translateX(-50%);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        nav a:hover::before {
          width: 100%;
        }

        footer a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #276A7C, #67BACD);
          transition: width 0.3s ease;
        }

        footer a:hover::after {
          width: 100%;
        }

        /* ============= IMAGE EFFECTS ============= */
        img {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        img:hover {
          transform: scale(1.02);
        }

        /* ============= SCROLLBAR ============= */
        ::-webkit-scrollbar {
          width: 14px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(103,186,205,0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #276A7C, #67BACD);
          border-radius: 10px;
          border: 3px solid #FFFFFF;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #67BACD, #70EAF0);
        }

        /* ============= GLASSMORPHISM ============= */
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(103,186,205,0.2);
          box-shadow: 0 10px 40px rgba(103,186,205,0.15);
        }

        /* ============= UTILITY CLASSES ============= */
        .text-gradient {
          background: linear-gradient(135deg, #276A7C, #67BACD);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .shadow-glow {
          box-shadow: 0 10px 40px rgba(103,186,205,0.2);
          transition: box-shadow 0.4s ease;
        }

        .shadow-glow:hover {
          box-shadow: 0 20px 60px rgba(103,186,205,0.35), 
                      0 0 40px rgba(112,234,240,0.25);
        }

        /* ============= RESPONSIVE DESIGN ============= */
        
        /* Desktop Menu - Hide on Mobile */
        @media (max-width: 968px) {
          .desktop-menu {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: block !important;
          }
          
          .mobile-menu-dropdown {
            display: flex !important;
          }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          h1 {
            font-size: clamp(3.5rem, 10vw, 6rem) !important;
            letter-spacing: 3px !important;
          }
          
          h2 {
            font-size: clamp(2.5rem, 7vw, 4rem) !important;
          }

          section {
            padding: 8rem 1.5rem !important;
          }
        }

        /* Mobile Large */
        @media (max-width: 768px) {
          h1 {
            font-size: 3.5rem !important;
            letter-spacing: 2px !important;
          }
          
          h2 {
            font-size: 2.5rem !important;
          }
          
          p {
            font-size: 1.05rem !important;
          }

          button {
            font-size: 1.1rem !important;
            padding: 1.3rem 2.5rem !important;
          }

          section {
            padding: 6rem 1.5rem !important;
          }

          nav {
            height: 75px !important;
          }
        }

        /* Mobile Medium */
        @media (max-width: 640px) {
          section {
            padding: 5rem 1.25rem !important;
          }
          
          h1 {
            font-size: 3rem !important;
            letter-spacing: 1px !important;
          }
          
          h2 {
            font-size: 2rem !important;
          }

          button {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 1rem !important;
            padding: 1.2rem 2rem !important;
          }

          /* Make CTA buttons stack vertically */
          section > div > div:has(button) {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }

        /* Mobile Small */
        @media (max-width: 480px) {
          nav {
            padding: 0 1rem !important;
          }
          
          h1 {
            font-size: 2.5rem !important;
            letter-spacing: 0.5px !important;
          }

          h2 {
            font-size: 1.75rem !important;
          }

          h3 {
            font-size: 1.4rem !important;
          }
          
          p {
            font-size: 1rem !important;
          }

          button {
            padding: 1.1rem 1.8rem !important;
            font-size: 0.95rem !important;
          }

          section {
            padding: 4rem 1rem !important;
          }

          /* Adjust grid layouts */
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 375px) {
          h1 {
            font-size: 2rem !important;
          }

          h2 {
            font-size: 1.5rem !important;
          }

          section {
            padding: 3.5rem 0.875rem !important;
          }

          button {
            font-size: 0.9rem !important;
            padding: 1rem 1.5rem !important;
          }
        }

        /* ============= REDUCED MOTION ============= */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ============= PRINT STYLES ============= */
        @media print {
          nav, footer, button {
            display: none !important;
          }
          
          section {
            page-break-inside: avoid;
          }
        }

        /* ============= HIGH CONTRAST MODE ============= */
        @media (prefers-contrast: high) {
          * {
            border-color: #000000 !important;
          }
          
          button {
            border: 3px solid #000000 !important;
          }
        }

        /* ============= DARK MODE SUPPORT ============= */
        @media (prefers-color-scheme: dark) {
          /* Keep light theme - TRIX branding requires it */
          /* This prevents automatic dark mode conversion */
        }

        /* ============= FOCUS STATES FOR ACCESSIBILITY ============= */
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid #67BACD;
          outline-offset: 4px;
        }

        /* ============= TOUCH DEVICE OPTIMIZATION ============= */
        @media (hover: none) and (pointer: coarse) {
          /* Larger tap targets for mobile */
          button,
          a {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Remove hover effects on touch devices */
          *:hover {
            transform: none !important;
          }
        }

        /* ============= PERFORMANCE OPTIMIZATIONS ============= */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        /* ============= SELECTION STYLING ============= */
        ::selection {
          background: rgba(103,186,205,0.3);
          color: #276A7C;
        }

        ::-moz-selection {
          background: rgba(103,186,205,0.3);
          color: #276A7C;
        }

        /* ============= LOADING STATES ============= */
        @keyframes skeleton-loading {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .skeleton {
          background: linear-gradient(90deg, 
            rgba(103,186,205,0.1) 0%, 
            rgba(103,186,205,0.2) 50%, 
            rgba(103,186,205,0.1) 100%);
          background-size: 200px 100%;
          animation: skeleton-loading 1.5s ease-in-out infinite;
        }

        /* ============= CARD HOVER EFFECTS ============= */
        .card-hover {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-12px);
          box-shadow: 0 25px 60px rgba(103,186,205,0.3);
        }

        /* ============= GRADIENT ANIMATIONS ============= */
        .animated-gradient {
          background: linear-gradient(135deg, 
            #276A7C 0%, 
            #67BACD 25%,
            #70EAF0 50%,
            #67BACD 75%,
            #276A7C 100%);
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }

        /* ============= ICON ANIMATIONS ============= */
        @keyframes icon-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .icon-hover:hover {
          animation: icon-bounce 0.6s ease;
        }

        /* ============= TEXT EFFECTS ============= */
        .text-shimmer {
          background: linear-gradient(90deg, 
            #276A7C 0%, 
            #67BACD 25%, 
            #70EAF0 50%, 
            #67BACD 75%, 
            #276A7C 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        /* ============= BACKDROP FILTER FALLBACK ============= */
        @supports not (backdrop-filter: blur(20px)) {
          .glass,
          nav {
            background: rgba(255, 255, 255, 0.95) !important;
          }
        }

        /* ============= SAFE AREA INSETS (iPhone X+) ============= */
        @supports (padding: max(0px)) {
          nav,
          section,
          footer {
            padding-left: max(1.5rem, env(safe-area-inset-left));
            padding-right: max(1.5rem, env(safe-area-inset-right));
          }
        }

        /* ============= LANDSCAPE MOBILE OPTIMIZATION ============= */
        @media (max-height: 500px) and (orientation: landscape) {
          section {
            padding: 3rem 1.5rem !important;
          }
          
          h1 {
            font-size: 2.5rem !important;
          }
          
          h2 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}