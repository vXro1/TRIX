'use client';
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Store,
  Clock,
  User,
  RefreshCw,
  DollarSign,
  BarChart3,
  ShoppingCart,
  PackageCheck,
  LogOut,
  Menu,
  X,
  QrCode,
  MessageSquare,
  Send,
  Sparkles,
  Calendar,
  TrendingDown,
  Users,
  Percent,
  Zap,
  Target,
  Activity,
  ChevronDown,
  ChevronUp,
  Brain,
  Cpu,
  CheckCircle,
  XCircle,
  Loader,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Bell
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const DashboardGerente = () => {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({ nombre: 'Admin', rol: 'gerente' });
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensajeChat, setMensajeChat] = useState('');
  const [cargandoChat, setCargandoChat] = useState(false);
  const [respuestaIA, setRespuestaIA] = useState(null);
  const [analisisSeleccionado, setAnalisisSeleccionado] = useState(null);
  const [historiaMensajes, setHistoriaMensajes] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    tendencias: null,
    sobreStock: [],
    reabastecimiento: [],
    valorInventario: { valorTotal: 125000000, cantidadProductos: 4580 },
    rotacion: { promedioRotacion: 2.8, rotacionOptima: 3.5 },
    productosStockBajo: [],
    sucursales: null,
    horariosPico: []
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

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

  const menuItems = [
    { href: '/trix/Gerente/productos', icon: Package, label: 'Productos', gradient: { from: '#3b82f6', to: '#0891b2' }, color: '#3b82f6' },
    { href: '/trix/Gerente/inventario', icon: BarChart3, label: 'Inventario', gradient: { from: '#10b981', to: '#059669' }, color: '#10b981' },
    { href: '/trix/Gerente/reportes', icon: ShoppingCart, label: 'Reportes', gradient: { from: '#a855f7', to: '#ec4899' }, color: '#a855f7' },
    { href: '/trix/Gerente/sucursal', icon: Store, label: 'Sucursales', gradient: { from: '#f97316', to: '#dc2626' }, color: '#f97316' },
    { href: '/trix/Gerente/scanner', icon: QrCode, label: 'Scanner QR', gradient: { from: '#6366f1', to: '#a855f7' }, color: '#6366f1' }
  ];

  const statsCards = [
    { 
      title: 'Valor Inventario', 
      value: formatCurrency(dashboardData.valorInventario?.valorTotal || 0),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: '#10b981'
    },
    { 
      title: 'Productos Totales', 
      value: dashboardData.valorInventario?.cantidadProductos || 0,
      change: '+8.2%',
      trend: 'up',
      icon: Package,
      color: '#3b82f6'
    },
    { 
      title: 'Rotación Promedio', 
      value: dashboardData.rotacion?.promedioRotacion?.toFixed(1) || '0',
      change: '-0.3',
      trend: 'down',
      icon: Activity,
      color: '#f59e0b'
    },
    { 
      title: 'Stock Bajo', 
      value: '12',
      change: 'Alerta',
      trend: 'alert',
      icon: AlertTriangle,
      color: '#ef4444'
    }
  ];

  const aiAnalytics = [
    { 
      title: 'Rotación de Productos',
      description: 'Análisis predictivo de movimiento',
      icon: Activity,
      gradient: { from: '#22d3ee', to: '#3b82f6' },
      action: () => consultarIA('rotacion')
    },
    { 
      title: 'Sobre Stock',
      description: 'Identificar excesos de inventario',
      icon: PackageCheck,
      gradient: { from: '#c084fc', to: '#ec4899' },
      action: () => consultarIA('sobrestock')
    },
    { 
      title: 'Reabastecimiento',
      description: 'Sugerencias inteligentes de compra',
      icon: TrendingUp,
      gradient: { from: '#4ade80', to: '#10b981' },
      action: () => consultarIA('reabastecimiento')
    },
    { 
      title: 'Comparativo Sucursales',
      description: 'Rendimiento entre ubicaciones',
      icon: Store,
      gradient: { from: '#fb923c', to: '#ef4444' },
      action: () => consultarIA('comparativo')
    },
    { 
      title: 'Tendencias Mensuales',
      description: 'Patrones de ventas detectados',
      icon: Calendar,
      gradient: { from: '#818cf8', to: '#a855f7' },
      action: () => consultarIA('tendencias')
    },
    { 
      title: 'Estrategia de Descuentos',
      description: 'Optimización de promociones',
      icon: Percent,
      gradient: { from: '#f472b6', to: '#fb7185' },
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
        backgroundColor: 'white',
        zIndex: 50
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '128px', height: '128px', margin: '0 auto 2rem' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '8px solid #dbeafe',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '8px solid transparent',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              inset: '16px',
              border: '8px solid #cffafe',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              inset: '16px',
              border: '8px solid transparent',
              borderTopColor: '#06b6d4',
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite'
            }}></div>
          </div>
          <div style={{
            background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
            color: 'white',
            borderRadius: '1rem',
            padding: '1.5rem 2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Inicializando TRIX</p>
            <p style={{ color: '#dbeafe', fontSize: '0.875rem' }}>Cargando módulos de análisis...</p>
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
      background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff, #ecfeff)'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}>
                  <Cpu size={28} color="white" />
                </div>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#4ade80',
                  borderRadius: '50%',
                  border: '2px solid white',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  background: 'linear-gradient(to right, #2563eb, #0891b2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  TRIX
                </h1>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Neural Dashboard</p>
              </div>
            </div>

            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{
                position: 'relative',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                <Bell size={20} color="#475569" />
                <span style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%'
                }}></span>
              </button>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'linear-gradient(to right, #eff6ff, #ecfeff)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                border: '1px solid #dbeafe'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(to bottom right, #60a5fa, #22d3ee)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={20} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{usuario.nombre}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, textTransform: 'capitalize' }}>{usuario.rol}</p>
                </div>
              </div>

              <button
                onClick={cerrarSesion}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: 'transparent',
                  color: '#dc2626',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Welcome Section */}
        <div style={{
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4, #3b82f6)',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '256px',
            height: '256px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            marginRight: '-128px',
            marginTop: '-128px'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '192px',
            height: '192px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            marginLeft: '-96px',
            marginBottom: '-96px'
          }}></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Sparkles size={32} style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              <h2 style={{ fontSize: '1.875rem', fontWeight: '900', margin: 0 }}>Bienvenido de nuevo, {usuario.nombre}</h2>
            </div>
            <p style={{ color: '#dbeafe', fontSize: '1.125rem', margin: 0 }}>Tu centro de comando inteligente para gestión de inventario</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
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
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  border: '1px solid #f1f5f9',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '128px',
                  height: '128px',
                  opacity: 0.05
                }}>
                  <Icon size={128} />
                </div>
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '1rem',
                    background: `linear-gradient(to bottom right, ${stat.color}, ${stat.color}dd)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s'
                  }}>
                    <Icon size={28} color="white" />
                  </div>
                  
                  <h3 style={{
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>{stat.title}</h3>
                  <p style={{
                    fontSize: '1.875rem',
                    fontWeight: '900',
                    color: '#1e293b',
                    marginBottom: '0.5rem'
                  }}>{stat.value}</p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: isAlert ? '#dc2626' : isUp ? '#16a34a' : '#f59e0b'
                  }}>
                    {!isAlert && (isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />)}
                    {isAlert && <AlertTriangle size={16} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Access Menu */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            color: '#1e293b',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Zap size={28} color="#3b82f6" />
            Acceso Rápido
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                    border: '1px solid #f1f5f9',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '1rem',
                      background: `linear-gradient(to bottom right, ${item.gradient.from}, ${item.gradient.to})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s'
                    }}>
                      <Icon size={32} color="white" />
                    </div>
                    <h4 style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>{item.label}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Acceso directo</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* AI Analytics Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: 0
            }}>
              <Brain size={28} color="#a855f7" />
              Análisis con IA
            </h3>
            <button
              onClick={() => setChatAbierto(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                color: 'white',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <MessageSquare size={20} />
              Chat IA
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {aiAnalytics.map((analytic, index) => {
              const Icon = analytic.icon;
              return (
                <button
                  key={index}
                  onClick={analytic.action}
                  style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s',
                    border: '1px solid #f1f5f9',
                    textAlign: 'left',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '1rem',
                      background: `linear-gradient(to bottom right, ${analytic.gradient.from}, ${analytic.gradient.to})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s'
                    }}>
                      <Icon size={32} color="white" />
                    </div>
                    
                    <h4 style={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '0.5rem',
                      fontSize: '1.125rem'
                    }}>{analytic.title}</h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      marginBottom: '1rem'
                    }}>{analytic.description}</p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      color: '#2563eb'
                    }}>
                      <span>Analizar ahora</span>
                      <ArrowUpRight size={16} />
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
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">TRIX Neural Assistant</h3>
            <p className="text-purple-100 text-sm">Asistente inteligente activado</p>
          </div>
        </div>
        <button
          onClick={() => {
            setChatAbierto(false);
            setRespuestaIA(null);
            setAnalisisSeleccionado(null);
          }}
          className="p-2 hover:bg-white/20 rounded-xl transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {cargandoChat ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Procesando análisis...</p>
            </div>
          </div>
        ) : respuestaIA ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Análisis Completado</h4>
                <p className="text-sm text-slate-500">
                  Resultado del análisis de {analisisSeleccionado}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-sm overflow-x-auto border border-slate-200">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(respuestaIA, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">
              ¿En qué puedo ayudarte?
            </h4>
            <p className="text-slate-500">
              Escribe tu consulta o selecciona un análisis rápido
            </p>
          </div>
        )}

        {historiaMensajes.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.tipo === 'usuario'
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            >
              {msg.tipo === 'usuario' ? (
                <p>{msg.texto}</p>
              ) : (
                <p>{msg.data?.mensaje || 'Procesando...'}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-6 bg-white border-t border-slate-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={mensajeChat}
            onChange={(e) => setMensajeChat(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu consulta aquí..."
            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={enviarMensajeChat}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DashboardGerente;