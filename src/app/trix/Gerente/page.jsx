'use client';
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Store,
  User,
  DollarSign,
  BarChart3,
  ShoppingCart,
  PackageCheck,
  LogOut,
  QrCode,
  MessageSquare,
  Send,
  Sparkles,
  Calendar,
  Percent,
  Zap,
  Activity,
  Brain,
  Cpu,
  Loader,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  X,
  TrendingDown,
  Target,
  LineChart
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const DashboardGerente = () => {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({ nombre: 'Admin', rol: 'gerente' });
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensajeChat, setMensajeChat] = useState('');
  const [cargandoChat, setCargandoChat] = useState(false);
  const [respuestaIA, setRespuestaIA] = useState(null);
  const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);
  const [historiaMensajes, setHistoriaMensajes] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    valorInventario: { valorTotal: 125000000, cantidadProductos: 4580 },
    rotacion: { promedioRotacion: 2.8, rotacionOptima: 3.5 },
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Aquí puedes llamar a las APIs reales
      // const response = await fetch(`${API_BASE_URL}/sucursales/comparar-rendimiento`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      // setDashboardData(data);
      
      setTimeout(() => setLoading(false), 1500);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  const consultarIA = async (tipo) => {
    setCargandoChat(true);
    setAnalisisSeleccionado(tipo);
    setChatAbierto(true);
    
    setTimeout(() => {
      setRespuestaIA({
        respuestaIA: {
          analisis: `Análisis completo de ${tipo} generado por TRIX IA`,
          datos: 'Información procesada exitosamente',
          acciones: ['Acción 1', 'Acción 2', 'Acción 3']
        }
      });
      setCargandoChat(false);
    }, 2000);
  };

  const enviarMensajeChat = () => {
    if (!mensajeChat.trim()) return;
    
    setHistoriaMensajes(prev => [...prev, 
      { tipo: 'usuario', texto: mensajeChat },
      { tipo: 'ia', data: { mensaje: 'Procesando tu consulta con TRIX Neural Engine...' } }
    ]);
    setMensajeChat('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      enviarMensajeChat();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const cerrarSesion = () => {
    window.location.href = '/trix/login';
  };

  const irAPredicciones = () => {
    window.location.href = '/trix/Gerente/prediciones';
  };

  const menuItems = [
    { href: '/trix/Gerente/productos', icon: Package, label: 'Productos', color: '#276A7C' },
    { href: '/trix/Gerente/inventario', icon: BarChart3, label: 'Inventario', color: '#67BACD' },
    { href: '/trix/Gerente/reportes', icon: ShoppingCart, label: 'Reportes', color: '#5EACBB' },
    { href: '/trix/Gerente/sucursal', icon: Store, label: 'Sucursales', color: '#276A7C' },
    { href: '/trix/Gerente/scanner', icon: QrCode, label: 'Scanner QR', color: '#70EAF0' }
  ];

  const statsCards = [
    { 
      title: 'Valor Inventario', 
      value: formatCurrency(dashboardData.valorInventario?.valorTotal || 0),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: '#67BACD'
    },
    { 
      title: 'Productos Totales', 
      value: dashboardData.valorInventario?.cantidadProductos || 0,
      change: '+8.2%',
      trend: 'up',
      icon: Package,
      color: '#276A7C'
    },
    { 
      title: 'Rotación Promedio', 
      value: dashboardData.rotacion?.promedioRotacion?.toFixed(1) || '0',
      change: '-0.3',
      trend: 'down',
      icon: Activity,
      color: '#5EACBB'
    },
    { 
      title: 'Stock Bajo', 
      value: '12',
      change: 'Alerta',
      trend: 'alert',
      icon: AlertTriangle,
      color: '#FF6B6B'
    }
  ];

  const aiAnalytics = [
    { 
      title: 'Rotación de Productos',
      description: 'Análisis predictivo de movimiento',
      icon: Activity,
      color: '#70EAF0',
      action: () => consultarIA('rotacion')
    },
    { 
      title: 'Sobre Stock',
      description: 'Identificar excesos de inventario',
      icon: PackageCheck,
      color: '#9D4EDD',
      action: () => consultarIA('sobrestock')
    },
    { 
      title: 'Reabastecimiento',
      description: 'Sugerencias inteligentes de compra',
      icon: TrendingUp,
      color: '#06D6A0',
      action: () => consultarIA('reabastecimiento')
    },
    { 
      title: 'Comparativo Sucursales',
      description: 'Rendimiento entre ubicaciones',
      icon: Store,
      color: '#276A7C',
      action: () => consultarIA('comparativo')
    },
    { 
      title: 'Tendencias Mensuales',
      description: 'Patrones de ventas detectados',
      icon: Calendar,
      color: '#67BACD',
      action: () => consultarIA('tendencias')
    },
    { 
      title: 'Estrategia de Descuentos',
      description: 'Optimización de promociones',
      icon: Percent,
      color: '#5EACBB',
      action: () => consultarIA('descuentos')
    }
  ];

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        zIndex: 50
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '128px', height: '128px', margin: '0 auto 2rem' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '8px solid rgba(103, 186, 205, 0.2)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '8px solid transparent',
              borderTopColor: '#70EAF0',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              inset: '16px',
              border: '8px solid rgba(112, 234, 240, 0.2)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              inset: '16px',
              border: '8px solid transparent',
              borderTopColor: '#276A7C',
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite'
            }}></div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #276A7C 0%, #70EAF0 100%)',
            color: 'white',
            borderRadius: '1rem',
            padding: '1.5rem 2.5rem',
            boxShadow: '0 0 40px rgba(112, 234, 240, 0.4)'
          }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Inicializando TRIX</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Cargando módulos de análisis...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '2px solid rgba(112, 234, 240, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '90px'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #276A7C 0%, #70EAF0 100%)',
                  borderRadius: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(112, 234, 240, 0.5)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}>
                  <Cpu size={32} color="white" />
                </div>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#06D6A0',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 0 15px rgba(6, 214, 160, 0.6)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: '900',
                  color: '#276A7C',
                  letterSpacing: '0.05em',
                  margin: 0
                }}>
                  TRIX
                </h1>
                <p style={{ fontSize: '0.75rem', color: '#67BACD', fontWeight: '600', margin: 0 }}>Neural Dashboard</p>
              </div>
            </div>

            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={irAPredicciones}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #70EAF0 0%, #276A7C 100%)',
                  color: 'white',
                  borderRadius: '1rem',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  boxShadow: '0 0 20px rgba(112, 234, 240, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(112, 234, 240, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(112, 234, 240, 0.3)';
                }}
              >
                <LineChart size={20} />
                Predicciones IA
              </button>

              <button style={{
                position: 'relative',
                padding: '0.875rem',
                borderRadius: '1rem',
                border: '2px solid rgba(112, 234, 240, 0.2)',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                <Bell size={22} color="#276A7C" />
                <span style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#FF6B6B',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(255, 107, 107, 0.6)'
                }}></span>
              </button>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                background: 'linear-gradient(135deg, rgba(112, 234, 240, 0.1) 0%, rgba(103, 186, 205, 0.1) 100%)',
                padding: '0.625rem 1.25rem',
                borderRadius: '1rem',
                border: '2px solid rgba(112, 234, 240, 0.3)'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(103, 186, 205, 0.3)'
                }}>
                  <User size={22} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#000000', margin: 0 }}>{usuario.nombre}</p>
                  <p style={{ fontSize: '0.75rem', color: '#67BACD', margin: 0, textTransform: 'capitalize' }}>{usuario.rol}</p>
                </div>
              </div>

              <button
                onClick={cerrarSesion}
                style={{
                  padding: '0.875rem',
                  borderRadius: '1rem',
                  border: '2px solid rgba(255, 107, 107, 0.2)',
                  background: 'transparent',
                  color: '#FF6B6B',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                title="Cerrar Sesión"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                  e.currentTarget.style.borderColor = '#FF6B6B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.2)';
                }}
              >
                <LogOut size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Welcome Section */}
        <div style={{
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2rem',
          background: 'linear-gradient(135deg, #276A7C 0%, #70EAF0 100%)',
          padding: '3rem',
          color: 'white',
          boxShadow: '0 0 60px rgba(112, 234, 240, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            marginRight: '-200px',
            marginTop: '-200px'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            marginLeft: '-150px',
            marginBottom: '-150px'
          }}></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Sparkles size={40} style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              <h2 style={{ fontSize: '2.25rem', fontWeight: '900', margin: 0, letterSpacing: '0.02em' }}>
                Bienvenido de nuevo, {usuario.nombre}
              </h2>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem', margin: 0, fontWeight: '500' }}>
              Tu centro de comando inteligente para gestión de inventario
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const isAlert = stat.trend === 'alert';
            const isUp = stat.trend === 'up';
            
            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.75rem',
                  padding: '2rem',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.4s',
                  border: '2px solid rgba(112, 234, 240, 0.15)',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 15px 50px ${stat.color}33`;
                  e.currentTarget.style.borderColor = stat.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(112, 234, 240, 0.15)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  opacity: 0.03
                }}>
                  <Icon size={150} />
                </div>
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '1.25rem',
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: `0 10px 30px ${stat.color}40`,
                    transition: 'transform 0.3s'
                  }}>
                    <Icon size={32} color="white" />
                  </div>
                  
                  <h3 style={{
                    color: '#67BACD',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>{stat.title}</h3>
                  <p style={{
                    fontSize: '2.25rem',
                    fontWeight: '900',
                    color: '#000000',
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.02em'
                  }}>{stat.value}</p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: isAlert ? '#FF6B6B' : isUp ? '#06D6A0' : '#FFD166'
                  }}>
                    {!isAlert && (isUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />)}
                    {isAlert && <AlertTriangle size={18} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Access Menu */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: '#000000',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Zap size={32} color="#70EAF0" style={{ filter: 'drop-shadow(0 0 10px rgba(112, 234, 240, 0.5))' }} />
            Acceso Rápido
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  style={{
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1.5rem',
                    padding: '2rem 1.5rem',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.4s',
                    border: '2px solid rgba(112, 234, 240, 0.15)',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = `0 15px 50px ${item.color}33`;
                    e.currentTarget.style.borderColor = item.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(112, 234, 240, 0.15)';
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '1.25rem',
                      background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      boxShadow: `0 10px 30px ${item.color}40`,
                      transition: 'transform 0.3s'
                    }}>
                      <Icon size={36} color="white" />
                    </div>
                    <h4 style={{ fontWeight: 'bold', color: '#000000', marginBottom: '0.5rem', fontSize: '1rem' }}>{item.label}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#67BACD', margin: 0, fontWeight: '600' }}>Acceso directo</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* AI Analytics Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: '900',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: 0
            }}>
              <Brain size={32} color="#9D4EDD" style={{ filter: 'drop-shadow(0 0 10px rgba(157, 78, 221, 0.5))' }} />
              Análisis con IA
            </h3>
            <button
              onClick={() => setChatAbierto(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.75rem',
                background: 'linear-gradient(135deg, #9D4EDD 0%, #67BACD 100%)',
                color: 'white',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                boxShadow: '0 0 30px rgba(157, 78, 221, 0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(157, 78, 221, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(157, 78, 221, 0.4)';
              }}
            >
              <MessageSquare size={22} />
              Chat IA
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {aiAnalytics.map((analytic, index) => {
              const Icon = analytic.icon;
              return (
                <button
                  key={index}
                  onClick={analytic.action}
                  style={{
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1.75rem',
                    padding: '2rem',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.4s',
                    border: '2px solid rgba(112, 234, 240, 0.15)',
                    textAlign: 'left',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = `0 15px 50px ${analytic.color}33`;
                    e.currentTarget.style.borderColor = analytic.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(112, 234, 240, 0.15)';
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '1.25rem',
                      background: `linear-gradient(135deg, ${analytic.color} 0%, ${analytic.color}dd 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      boxShadow: `0 10px 30px ${analytic.color}40`,
                      transition: 'transform 0.3s'
                    }}>
                      <Icon size={36} color="white" />
                    </div>
                    
                    <h4 style={{
                      fontWeight: 'bold',
                      color: '#000000',
                      marginBottom: '0.75rem',
                      fontSize: '1.125rem'
                    }}>{analytic.title}</h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#67BACD',
                      marginBottom: '1.25rem',
                      lineHeight: '1.5'
                    }}>{analytic.description}</p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      color: '#276A7C'
                    }}>
                      <span>Analizar ahora</span>
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Chat IA Modal */}
      {chatAbierto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '2rem',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 0 80px rgba(112, 234, 240, 0.4)',
            border: '2px solid rgba(112, 234, 240, 0.3)',
            overflow: 'hidden'
          }}>
            
            {/* Chat Header */}
            <div style={{
              background: 'linear-gradient(135deg, #9D4EDD 0%, #67BACD 100%)',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <Brain size={28} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', margin: 0 }}>TRIX Neural Assistant</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', margin: 0, fontWeight: '500' }}>Asistente inteligente activado</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setChatAbierto(false);
                  setRespuestaIA(null);
                  setAnalisisSeleccionado(null);
                }}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '1rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={24} color="white" />
              </button>
            </div>

            {/* Chat Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem',
              backgroundColor: 'rgba(112, 234, 240, 0.05)'
            }}>
              {cargandoChat ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Loader size={48} color="#70EAF0" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                    <p style={{ color: '#67BACD', fontWeight: '600' }}>Procesando análisis...</p>
                  </div>
                </div>
              ) : respuestaIA ? (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: '2px solid rgba(112, 234, 240, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #9D4EDD 0%, #67BACD 100%)',
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 8px 20px rgba(157, 78, 221, 0.3)'
                    }}>
                      <Sparkles size={24} color="white" />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 'bold', color: '#000000', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Análisis Completado</h4>
                      <p style={{ fontSize: '0.875rem', color: '#67BACD', margin: 0 }}>
                        Resultado del análisis de {analisisSeleccionado}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(112, 234, 240, 0.08)',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    overflowX: 'auto',
                    border: '2px solid rgba(112, 234, 240, 0.2)'
                  }}>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#276A7C', margin: 0, fontFamily: 'monospace' }}>
                      {JSON.stringify(respuestaIA, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{
                    width: '96px',
                    height: '96px',
                    background: 'linear-gradient(135deg, #9D4EDD 0%, #67BACD 100%)',
                    borderRadius: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 15px 40px rgba(157, 78, 221, 0.3)'
                  }}>
                    <MessageSquare size={48} color="white" />
                  </div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '0.75rem' }}>
                    ¿En qué puedo ayudarte?
                  </h4>
                  <p style={{ color: '#67BACD', fontSize: '1rem' }}>
                    Escribe tu consulta o selecciona un análisis rápido
                  </p>
                </div>
              )}

              {historiaMensajes.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.tipo === 'usuario' ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      borderRadius: '1.5rem',
                      padding: '1.25rem 1.5rem',
                      backgroundColor: msg.tipo === 'usuario' ? undefined : '#FFFFFF',
                      background: msg.tipo === 'usuario' ? 'linear-gradient(135deg, #276A7C 0%, #70EAF0 100%)' : undefined,
                      color: msg.tipo === 'usuario' ? 'white' : '#000000',
                      border: msg.tipo === 'usuario' ? 'none' : '2px solid rgba(112, 234, 240, 0.2)',
                      boxShadow: msg.tipo === 'usuario' ? '0 8px 20px rgba(39, 106, 124, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <p style={{ margin: 0, lineHeight: '1.5' }}>
                      {msg.tipo === 'usuario' ? msg.texto : (msg.data?.mensaje || 'Procesando...')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{
              padding: '2rem',
              backgroundColor: '#FFFFFF',
              borderTop: '2px solid rgba(112, 234, 240, 0.2)'
            }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  value={mensajeChat}
                  onChange={(e) => setMensajeChat(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu consulta aquí..."
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: 'rgba(112, 234, 240, 0.08)',
                    border: '2px solid rgba(112, 234, 240, 0.2)',
                    borderRadius: '1.25rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.3s',
                    color: '#000000'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#70EAF0';
                    e.currentTarget.style.backgroundColor = 'rgba(112, 234, 240, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(112, 234, 240, 0.2)';
                    e.currentTarget.style.backgroundColor = 'rgba(112, 234, 240, 0.08)';
                  }}
                />
                <button
                  onClick={enviarMensajeChat}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #9D4EDD 0%, #67BACD 100%)',
                    color: 'white',
                    borderRadius: '1.25rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 25px rgba(157, 78, 221, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(157, 78, 221, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(157, 78, 221, 0.3)';
                  }}
                >
                  <Send size={20} />
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default DashboardGerente;