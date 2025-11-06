'use client';

import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Package,
    DollarSign,
    TrendingUp,
    Search,
    Filter,
    Calendar,
    Eye,
    X,
    Plus,
    Minus,
    LogOut,
    User,
    Menu,
    ChevronRight,
    BarChart3,
    Clock,
    CheckCircle
} from 'lucide-react';

export default function VendedorDashboard() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalVentas: 0,
        totalVendido: 0,
        promedioVenta: 0,
        ventasHoy: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Estados para nueva venta
    const [carritoItems, setCarritoItems] = useState([]);
    const [descuento, setDescuento] = useState(0);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '' });
    const [observaciones, setObservaciones] = useState('');
    const [searchProducto, setSearchProducto] = useState('');
    const [modalVenta, setModalVenta] = useState(null);

    // Estados para filtros
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        metodoPago: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('trix_token');
        const usuario = localStorage.getItem('trix_usuario');

        if (!token || !usuario) {
            window.location.href = '/trix/login';
            return;
        }

        setUserData(JSON.parse(usuario));
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        await Promise.all([
            cargarMisVentas(),
            cargarProductos(),
            cargarEstadisticas()
        ]);
    };

    const cargarMisVentas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('trix_token');
            const response = await fetch('https://backend-hackathon-t4q9.onrender.com/api/ventas/mis-ventas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setVentas(data.data || []);
            }
        } catch (err) {
            setError('Error al cargar ventas');
        } finally {
            setLoading(false);
        }
    };

    const cargarProductos = async () => {
        try {
            const token = localStorage.getItem('trix_token');
            const response = await fetch('https://backend-hackathon-t4q9.onrender.com/api/productos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setProductos(data.data || []);
            }
        } catch (err) {
            console.error('Error al cargar productos:', err);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const token = localStorage.getItem('trix_token');
            const response = await fetch('https://backend-hackathon-t4q9.onrender.com/api/ventas/mis-ventas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setEstadisticas(data.estadisticas || {
                    totalVentas: 0,
                    totalVendido: 0,
                    promedioVenta: 0
                });
            }
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
        }
    };

    const agregarAlCarrito = (producto) => {
        const itemExistente = carritoItems.find(item => item.producto === producto._id);

        if (itemExistente) {
            if (itemExistente.cantidad < producto.stockActual) {
                setCarritoItems(carritoItems.map(item =>
                    item.producto === producto._id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                ));
            }
        } else {
            setCarritoItems([...carritoItems, {
                producto: producto._id,
                nombreProducto: producto.nombre,
                cantidad: 1,
                precioUnitario: producto.precioVenta,
                stockDisponible: producto.stockActual
            }]);
        }
    };

    const actualizarCantidad = (productoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            setCarritoItems(carritoItems.filter(item => item.producto !== productoId));
        } else {
            setCarritoItems(carritoItems.map(item =>
                item.producto === productoId
                    ? { ...item, cantidad: nuevaCantidad }
                    : item
            ));
        }
    };

    const calcularTotales = () => {
        const subtotal = carritoItems.reduce((sum, item) =>
            sum + (item.cantidad * item.precioUnitario), 0
        );
        const total = subtotal - descuento;
        return { subtotal, total };
    };

    const crearVenta = async () => {
        try {
            setLoading(true);
            setError('');

            if (carritoItems.length === 0) {
                setError('Debe agregar al menos un producto');
                return;
            }

            const token = localStorage.getItem('trix_token');
            const ventaData = {
                sucursal: userData.sucursal || 'Principal',
                items: carritoItems.map(item => ({
                    producto: item.producto,
                    cantidad: item.cantidad
                })),
                descuento,
                metodoPago,
                observaciones,
                cliente: cliente.nombre ? cliente : undefined
            };

            const response = await fetch('https://backend-hackathon-t4q9.onrender.com/api/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(ventaData)
            });

            const data = await response.json();

            if (data.success) {
                alert('¡Venta registrada exitosamente!');
                setCarritoItems([]);
                setDescuento(0);
                setCliente({ nombre: '', telefono: '', email: '' });
                setObservaciones('');
                setActiveSection('ventas');
                await cargarDatos();
            } else {
                setError(data.mensaje || 'Error al registrar venta');
            }
        } catch (err) {
            setError('Error al procesar la venta');
        } finally {
            setLoading(false);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('trix_token');
        localStorage.removeItem('trix_usuario');
        window.location.href = '/trix/login';
    };

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchProducto.toLowerCase())
    );

    const { subtotal, total } = calcularTotales();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a1628 0%, #1a2840 100%)',
            fontFamily: "'Quicksand', sans-serif"
        }}>
            {/* Sidebar */}
            <div style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: sidebarOpen ? '280px' : '80px',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(103,186,205,0.2)',
                transition: 'width 0.3s ease',
                zIndex: 1000,
                overflowY: 'auto'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '2rem 1.5rem',
                    borderBottom: '1px solid rgba(103,186,205,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '45px',
                        height: '45px',
                        background: 'linear-gradient(135deg, #67BACD, #70EAF0)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: '900',
                        color: '#FFF',
                        fontFamily: "'Orbitron', sans-serif"
                    }}>T</div>
                    {sidebarOpen && (
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: '900',
                            background: 'linear-gradient(135deg, #67BACD, #70EAF0)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: "'Orbitron', sans-serif"
                        }}>RIX</span>
                    )}
                </div>

                {/* Menu Items */}
                <nav style={{ padding: '1.5rem 0' }}>
                    {[
                        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                        { id: 'nueva-venta', icon: ShoppingCart, label: 'Nueva Venta' },
                        { id: 'ventas', icon: Package, label: 'Mis Ventas' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                if (window.innerWidth < 768) setSidebarOpen(false);
                            }}
                            style={{
                                width: '100%',
                                padding: '1rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: activeSection === item.id ? 'rgba(103,186,205,0.2)' : 'transparent',
                                border: 'none',
                                borderLeft: activeSection === item.id ? '4px solid #67BACD' : '4px solid transparent',
                                color: activeSection === item.id ? '#70EAF0' : 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '1rem',
                                fontWeight: '600',
                                fontFamily: "'Quicksand', sans-serif"
                            }}
                            onMouseEnter={(e) => {
                                if (activeSection !== item.id) {
                                    e.currentTarget.style.background = 'rgba(103,186,205,0.1)';
                                    e.currentTarget.style.color = '#FFF';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeSection !== item.id) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                }
                            }}
                        >
                            <item.icon size={22} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* User Section */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem',
                    borderTop: '1px solid rgba(103,186,205,0.2)'
                }}>
                    {sidebarOpen && userData && (
                        <div style={{
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: 'rgba(103,186,205,0.1)',
                            borderRadius: '12px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '0.5rem'
                            }}>
                                <User size={18} color="#67BACD" />
                                <span style={{ color: '#FFF', fontWeight: '600', fontSize: '0.95rem' }}>
                                    {userData.nombre}
                                </span>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                color: 'rgba(255,255,255,0.6)'
                            }}>
                                {userData.rol}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={cerrarSesion}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: 'rgba(239,68,68,0.2)',
                            border: '1px solid rgba(239,68,68,0.4)',
                            borderRadius: '10px',
                            color: '#FF6B6B',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                        }}
                    >
                        <LogOut size={18} />
                        {sidebarOpen && <span>Salir</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: sidebarOpen ? '280px' : '80px',
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh'
            }}>
                {/* Header */}
                <header style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(103,186,205,0.2)',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{
                                background: 'rgba(103,186,205,0.2)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#67BACD'
                            }}
                        >
                            <Menu size={22} />
                        </button>
                        <h1 style={{
                            margin: 0,
                            fontSize: '1.75rem',
                            fontWeight: '800',
                            color: '#FFF',
                            fontFamily: "'Orbitron', sans-serif"
                        }}>
                            {activeSection === 'dashboard' && 'Dashboard'}
                            {activeSection === 'nueva-venta' && 'Nueva Venta'}
                            {activeSection === 'ventas' && 'Mis Ventas'}
                        </h1>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem'
                    }}>
                        <Clock size={18} />
                        <span>{new Date().toLocaleDateString('es-CO')}</span>
                    </div>
                </header>

                {/* Content Area */}
                <main style={{ padding: '2rem' }}>
                    {/* Dashboard */}
                    {activeSection === 'dashboard' && (
                        <div>
                            {/* Stats Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '1.5rem',
                                marginBottom: '2rem'
                            }}>
                                {[
                                    {
                                        icon: DollarSign,
                                        label: 'Total Vendido',
                                        value: `$${estadisticas.totalVendido?.toLocaleString('es-CO') || 0}`,
                                        color: '#67BACD'
                                    },
                                    {
                                        icon: Package,
                                        label: 'Ventas Realizadas',
                                        value: estadisticas.totalVentas || 0,
                                        color: '#70EAF0'
                                    },
                                    {
                                        icon: TrendingUp,
                                        label: 'Promedio por Venta',
                                        value: `$${estadisticas.promedioVenta?.toLocaleString('es-CO') || 0}`,
                                        color: '#4ADE80'
                                    }
                                ].map((stat, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            backdropFilter: 'blur(20px)',
                                            borderRadius: '20px',
                                            padding: '2rem',
                                            border: '1px solid rgba(103,186,205,0.2)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(103,186,205,0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                background: `${stat.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <stat.icon size={24} color={stat.color} />
                                            </div>
                                            <span style={{
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.95rem',
                                                fontWeight: '600'
                                            }}>{stat.label}</span>
                                        </div>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '2rem',
                                            fontWeight: '800',
                                            color: '#FFF',
                                            fontFamily: "'Orbitron', sans-serif"
                                        }}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Sales */}
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '2rem',
                                border: '1px solid rgba(103,186,205,0.2)'
                            }}>
                                <h2 style={{
                                    margin: '0 0 1.5rem 0',
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    color: '#FFF'
                                }}>Ventas Recientes</h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(103,186,205,0.2)' }}>
                                                {['Número', 'Fecha', 'Total', 'Estado'].map(header => (
                                                    <th key={header} style={{
                                                        padding: '1rem',
                                                        textAlign: 'left',
                                                        color: 'rgba(255,255,255,0.7)',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600'
                                                    }}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ventas.slice(0, 5).map((venta, idx) => (
                                                <tr
                                                    key={idx}
                                                    style={{
                                                        borderBottom: '1px solid rgba(103,186,205,0.1)',
                                                        transition: 'background 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(103,186,205,0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <td style={{ padding: '1rem', color: '#67BACD', fontWeight: '600' }}>
                                                        {venta.numeroVenta}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                                                        {new Date(venta.fecha).toLocaleDateString('es-CO')}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: '#FFF', fontWeight: '700' }}>
                                                        ${venta.total?.toLocaleString('es-CO')}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            padding: '0.35rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            background: venta.estadoVenta === 'Completada'
                                                                ? 'rgba(74,222,128,0.2)'
                                                                : 'rgba(239,68,68,0.2)',
                                                            color: venta.estadoVenta === 'Completada' ? '#4ADE80' : '#FF6B6B'
                                                        }}>
                                                            {venta.estadoVenta}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Nueva Venta */}
                    {activeSection === 'nueva-venta' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth > 1024 ? '1fr 400px' : '1fr',
                            gap: '2rem'
                        }}>
                            {/* Productos */}
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '2rem',
                                border: '1px solid rgba(103,186,205,0.2)'
                            }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Buscar producto..."
                                            value={searchProducto}
                                            onChange={(e) => setSearchProducto(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '1rem 1rem 1rem 3rem',
                                                background: 'rgba(255,255,255,0.08)',
                                                border: '2px solid rgba(103,186,205,0.3)',
                                                borderRadius: '14px',
                                                color: '#FFF',
                                                fontSize: '1rem',
                                                outline: 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#67BACD';
                                                e.target.style.boxShadow = '0 0 0 4px rgba(103,186,205,0.15)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'rgba(103,186,205,0.3)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <Search style={{
                                            position: 'absolute',
                                            left: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#67BACD'
                                        }} size={20} />
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    maxHeight: '600px',
                                    overflowY: 'auto'
                                }}>
                                    {productosFiltrados.map((producto, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '16px',
                                                padding: '1.5rem',
                                                border: '1px solid rgba(103,186,205,0.2)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => agregarAlCarrito(producto)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.borderColor = '#67BACD';
                                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(103,186,205,0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.borderColor = 'rgba(103,186,205,0.2)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <h3 style={{
                                                margin: '0 0 0.5rem 0',
                                                fontSize: '1.1rem',
                                                fontWeight: '700',
                                                color: '#FFF'
                                            }}>{producto.nombre}</h3>
                                            <p style={{
                                                margin: '0 0 0.5rem 0',
                                                fontSize: '0.85rem',
                                                color: 'rgba(255,255,255,0.6)'
                                            }}>{producto.codigo}</p>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: '1rem'
                                            }}>
                                                <span style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: '800',
                                                    color: '#67BACD'
                                                }}>${producto.precioVenta?.toLocaleString('es-CO')}</span>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    color: producto.stockActual > 0 ? '#4ADE80' : '#FF6B6B',
                                                    fontWeight: '600'
                                                }}>Stock: {producto.stockActual}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Carrito */}
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '2rem',
                                border: '1px solid rgba(103,186,205,0.2)',
                                height: 'fit-content',
                                position: window.innerWidth > 1024 ? 'sticky' : 'static',
                                top: '100px'
                            }}>
                                <h2 style={{
                                    margin: '0 0 1.5rem 0',
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    color: '#FFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <ShoppingCart size={24} color="#67BACD" />
                                    Carrito ({carritoItems.length})
                                </h2>

                                <div style={{
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    marginBottom: '1.5rem'
                                }}>
                                    {carritoItems.length === 0 ? (
                                        <p style={{
                                            textAlign: 'center',
                                            color: 'rgba(255,255,255,0.5)',
                                            padding: '2rem'
                                        }}>Carrito vacío</p>
                                    ) : (
                                        carritoItems.map((item, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    borderRadius: '12px',
                                                    padding: '1rem',
                                                    marginBottom: '0.75rem',
                                                    border: '1px solid rgba(103,186,205,0.2)'
                                                }}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'start',
                                                    marginBottom: '0.75rem'
                                                }}>
                                                    <div>
                                                        <h4 style={{
                                                            margin: '0 0 0.25rem 0',
                                                            fontSize: '1rem',
                                                            fontWeight: '700',
                                                            color: '#FFF'
                                                        }}>{item.nombreProducto}</h4>
                                                        <p style={{
                                                            margin: 0,
                                                            fontSize: '0.9rem',
                                                            color: '#67BACD',
                                                            fontWeight: '600'
                                                        }}>${item.precioUnitario?.toLocaleString('es-CO')}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => actualizarCantidad(item.producto, 0)}
                                                        style={{
                                                            background: 'rgba(239,68,68,0.2)',
                                                            border: '1px solid rgba(239,68,68,0.4)',
                                                            borderRadius: '8px',
                                                            padding: '0.5rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#FF6B6B'
                                                        }}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        background: 'rgba(103,186,205,0.1)',
                                                        borderRadius: '8px',
                                                        padding: '0.25rem'
                                                    }}>
                                                        <button
                                                            onClick={() => actualizarCantidad(item.producto, item.cantidad - 1)}
                                                            style={{
                                                                background: 'rgba(103,186,205,0.3)',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '0.5rem',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#FFF'
                                                            }}
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span style={{
                                                            color: '#FFF',
                                                            fontWeight: '700',
                                                            minWidth: '30px',
                                                            textAlign: 'center'
                                                        }}>{item.cantidad}</span>
                                                        <button
                                                            onClick={() => item.cantidad < item.stockDisponible && actualizarCantidad(item.producto, item.cantidad + 1)}
                                                            style={{
                                                                background: 'rgba(103,186,205,0.3)',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '0.5rem',
                                                                cursor: item.cantidad < item.stockDisponible ? 'pointer' : 'not-allowed',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#FFF',
                                                                opacity: item.cantidad < item.stockDisponible ? 1 : 0.5
                                                            }}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <span style={{
                                                        fontSize: '1.1rem',
                                                        fontWeight: '800',
                                                        color: '#70EAF0'
                                                    }}>
                                                        ${(item.cantidad * item.precioUnitario).toLocaleString('es-CO')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Cliente Info */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{
                                        margin: '0 0 1rem 0',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: 'rgba(255,255,255,0.8)'
                                    }}>Cliente (Opcional)</h3>
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={cliente.nombre}
                                        onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(103,186,205,0.3)',
                                            borderRadius: '10px',
                                            color: '#FFF',
                                            fontSize: '0.95rem',
                                            marginBottom: '0.5rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono"
                                        value={cliente.telefono}
                                        onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(103,186,205,0.3)',
                                            borderRadius: '10px',
                                            color: '#FFF',
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                {/* Método de Pago */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.95rem',
                                        fontWeight: '700',
                                        color: 'rgba(255,255,255,0.8)'
                                    }}>Método de Pago</label>
                                    <select
                                        value={metodoPago}
                                        onChange={(e) => setMetodoPago(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(103,186,205,0.3)',
                                            borderRadius: '10px',
                                            color: '#FFF',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Mixto">Mixto</option>
                                    </select>
                                </div>

                                {/* Descuento */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.95rem',
                                        fontWeight: '700',
                                        color: 'rgba(255,255,255,0.8)'
                                    }}>Descuento ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={descuento}
                                        onChange={(e) => setDescuento(Number(e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(103,186,205,0.3)',
                                            borderRadius: '10px',
                                            color: '#FFF',
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                {/* Totales */}
                                <div style={{
                                    background: 'rgba(103,186,205,0.1)',
                                    borderRadius: '12px',
                                    padding: '1.25rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                                            Subtotal:
                                        </span>
                                        <span style={{ color: '#FFF', fontWeight: '700', fontSize: '1.05rem' }}>
                                            ${subtotal.toLocaleString('es-CO')}
                                        </span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                                            Descuento:
                                        </span>
                                        <span style={{ color: '#FF6B6B', fontWeight: '700', fontSize: '1.05rem' }}>
                                            -${descuento.toLocaleString('es-CO')}
                                        </span>
                                    </div>
                                    <div style={{
                                        borderTop: '2px solid rgba(103,186,205,0.3)',
                                        paddingTop: '0.75rem',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{
                                            color: '#FFF',
                                            fontWeight: '800',
                                            fontSize: '1.1rem'
                                        }}>Total:</span>
                                        <span style={{
                                            color: '#70EAF0',
                                            fontWeight: '900',
                                            fontSize: '1.5rem',
                                            fontFamily: "'Orbitron', sans-serif"
                                        }}>
                                            ${total.toLocaleString('es-CO')}
                                        </span>
                                    </div>
                                </div>

                                {error && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'rgba(239,68,68,0.2)',
                                        border: '1px solid rgba(239,68,68,0.4)',
                                        borderRadius: '10px',
                                        color: '#FF6B6B',
                                        fontSize: '0.9rem',
                                        marginBottom: '1rem'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                {/* Botón Procesar Venta */}
                                <button
                                    onClick={crearVenta}
                                    disabled={loading || carritoItems.length === 0}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        background: loading || carritoItems.length === 0
                                            ? 'rgba(103,186,205,0.3)'
                                            : 'linear-gradient(135deg, #276A7C, #67BACD, #70EAF0)',
                                        border: 'none',
                                        borderRadius: '14px',
                                        color: '#FFF',
                                        fontSize: '1.1rem',
                                        fontWeight: '800',
                                        cursor: loading || carritoItems.length === 0 ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        opacity: loading || carritoItems.length === 0 ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading && carritoItems.length > 0) {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(103,186,205,0.5)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading && carritoItems.length > 0) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                border: '3px solid rgba(255,255,255,0.3)',
                                                borderTop: '3px solid #FFF',
                                                borderRadius: '50%',
                                                animation: 'spin 0.8s linear infinite'
                                            }}></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={22} />
                                            Procesar Venta
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mis Ventas */}
                    {activeSection === 'ventas' && (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '2rem',
                            border: '1px solid rgba(103,186,205,0.2)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '2rem',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '1.75rem',
                                    fontWeight: '800',
                                    color: '#FFF'
                                }}>Mis Ventas</h2>
                                <button
                                    onClick={cargarMisVentas}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: 'rgba(103,186,205,0.2)',
                                        border: '1px solid rgba(103,186,205,0.4)',
                                        borderRadius: '10px',
                                        color: '#67BACD',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(103,186,205,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(103,186,205,0.2)';
                                    }}
                                >
                                    Actualizar
                                </button>
                            </div>

                            {/* Filtros */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginBottom: '2rem'
                            }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: 'rgba(255,255,255,0.7)'
                                    }}>Fecha Inicio</label>
                                    <input
                                        type="date"
                                        value={filtros.fechaInicio}
                                        onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(103,186,205,0.3)',
                                            borderRadius: '10px',
                                            color: '#FFF',
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: 'rgba(255,255,255,0.7)'
                                    }}>Fecha Fin</label>
                                    <input
                                        type="date"
                                        value={filtros.fechaFin}
                                        onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(103,186,205,0.3)',
                                            borderRadius: '10px',
                                            color: '#FFF',
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Tabla de Ventas */}
                            <div style={{ overflowX: 'auto' }}>
                                {loading ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem',
                                        color: 'rgba(255,255,255,0.6)'
                                    }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            border: '4px solid rgba(103,186,205,0.3)',
                                            borderTop: '4px solid #67BACD',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            margin: '0 auto 1rem'
                                        }}></div>
                                        Cargando ventas...
                                    </div>
                                ) : ventas.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem',
                                        color: 'rgba(255,255,255,0.6)'
                                    }}>
                                        <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <p style={{ margin: 0, fontSize: '1.1rem' }}>No hay ventas registradas</p>
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid rgba(103,186,205,0.3)' }}>
                                                {['Número', 'Fecha', 'Items', 'Total', 'Método Pago', 'Estado', 'Acciones'].map(header => (
                                                    <th key={header} style={{
                                                        padding: '1rem',
                                                        textAlign: 'left',
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.95rem',
                                                        fontWeight: '700',
                                                        whiteSpace: 'nowrap'
                                                    }}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ventas.map((venta, idx) => (
                                                <tr
                                                    key={idx}
                                                    style={{
                                                        borderBottom: '1px solid rgba(103,186,205,0.1)',
                                                        transition: 'background 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(103,186,205,0.08)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <td style={{
                                                        padding: '1rem',
                                                        color: '#67BACD',
                                                        fontWeight: '700',
                                                        fontFamily: "'Orbitron', sans-serif"
                                                    }}>
                                                        {venta.numeroVenta}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                                                        {new Date(venta.fecha).toLocaleDateString('es-CO', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                                                        {venta.items?.length || 0} items
                                                    </td>
                                                    <td style={{
                                                        padding: '1rem',
                                                        color: '#70EAF0',
                                                        fontWeight: '800',
                                                        fontSize: '1.05rem'
                                                    }}>
                                                        ${venta.total?.toLocaleString('es-CO')}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                                                        {venta.metodoPago}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            padding: '0.4rem 0.85rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '700',
                                                            background: venta.estadoVenta === 'Completada'
                                                                ? 'rgba(74,222,128,0.2)'
                                                                : venta.estadoVenta === 'Cancelada'
                                                                    ? 'rgba(239,68,68,0.2)'
                                                                    : 'rgba(251,191,36,0.2)',
                                                            color: venta.estadoVenta === 'Completada'
                                                                ? '#4ADE80'
                                                                : venta.estadoVenta === 'Cancelada'
                                                                    ? '#FF6B6B'
                                                                    : '#FCD34D',
                                                            border: `1px solid ${venta.estadoVenta === 'Completada'
                                                                    ? 'rgba(74,222,128,0.4)'
                                                                    : venta.estadoVenta === 'Cancelada'
                                                                        ? 'rgba(239,68,68,0.4)'
                                                                        : 'rgba(251,191,36,0.4)'
                                                                }`
                                                        }}>
                                                            {venta.estadoVenta}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <button
                                                            onClick={() => setModalVenta(venta)}
                                                            style={{
                                                                background: 'rgba(103,186,205,0.2)',
                                                                border: '1px solid rgba(103,186,205,0.4)',
                                                                borderRadius: '8px',
                                                                padding: '0.5rem 1rem',
                                                                cursor: 'pointer',
                                                                color: '#67BACD',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '600',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = 'rgba(103,186,205,0.3)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = 'rgba(103,186,205,0.2)';
                                                            }}
                                                        >
                                                            <Eye size={16} />
                                                            Ver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Detalle Venta */}
            {modalVenta && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}
                    onClick={() => setModalVenta(null)}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(26,40,64,0.98), rgba(10,22,40,0.98))',
                        borderRadius: '24px',
                        maxWidth: '700px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '2px solid rgba(103,186,205,0.3)',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
                    }}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            padding: '2rem',
                            borderBottom: '1px solid rgba(103,186,205,0.2)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: '#FFF'
                            }}>Detalle de Venta</h2>
                            <button
                                onClick={() => setModalVenta(null)}
                                style={{
                                    background: 'rgba(239,68,68,0.2)',
                                    border: '1px solid rgba(239,68,68,0.4)',
                                    borderRadius: '10px',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FF6B6B'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            {/* Info General */}
                            <div style={{
                                background: 'rgba(103,186,205,0.1)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    <div>
                                        <p style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '0.85rem',
                                            color: 'rgba(255,255,255,0.6)',
                                            fontWeight: '600'
                                        }}>Número de Venta</p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '1.1rem',
                                            fontWeight: '800',
                                            color: '#67BACD',
                                            fontFamily: "'Orbitron', sans-serif"
                                        }}>{modalVenta.numeroVenta}</p>
                                    </div>
                                    <div>
                                        <p style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '0.85rem',
                                            color: 'rgba(255,255,255,0.6)',
                                            fontWeight: '600'
                                        }}>Fecha</p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            color: '#FFF'
                                        }}>
                                            {new Date(modalVenta.fecha).toLocaleDateString('es-CO', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '0.85rem',
                                            color: 'rgba(255,255,255,0.6)',
                                            fontWeight: '600'
                                        }}>Método de Pago</p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            color: '#FFF'
                                        }}>{modalVenta.metodoPago}</p>
                                    </div>
                                    <div>
                                        <p style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '0.85rem',
                                            color: 'rgba(255,255,255,0.6)',
                                            fontWeight: '600'
                                        }}>Estado</p>
                                        <span style={{
                                            padding: '0.4rem 0.85rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '700',
                                            background: modalVenta.estadoVenta === 'Completada'
                                                ? 'rgba(74,222,128,0.2)'
                                                : 'rgba(239,68,68,0.2)',
                                            color: modalVenta.estadoVenta === 'Completada' ? '#4ADE80' : '#FF6B6B'
                                        }}>
                                            {modalVenta.estadoVenta}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    margin: '0 0 1rem 0',
                                    fontSize: '1.25rem',
                                    fontWeight: '800',
                                    color: '#FFF'
                                }}>Productos</h3>
                                <div style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '14px',
                                    overflow: 'hidden'
                                }}>
                                    {modalVenta.items?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '1.25rem',
                                                borderBottom: idx < modalVenta.items.length - 1
                                                    ? '1px solid rgba(103,186,205,0.1)'
                                                    : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <h4 style={{
                                                    margin: '0 0 0.5rem 0',
                                                    fontSize: '1.05rem',
                                                    fontWeight: '700',
                                                    color: '#FFF'
                                                }}>{item.nombreProducto}</h4>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    fontSize: '0.9rem',
                                                    color: 'rgba(255,255,255,0.7)'
                                                }}>
                                                    <span>Código: {item.codigoProducto}</span>
                                                    <span>Cantidad: {item.cantidad}</span>
                                                    <span>Precio: ${item.precioUnitario?.toLocaleString('es-CO')}</span>
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '800',
                                                color: '#70EAF0'
                                            }}>
                                                ${item.subtotal?.toLocaleString('es-CO')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Totales */}
                            <div style={{
                                background: 'rgba(103,186,205,0.1)',
                                borderRadius: '12px',
                                padding: '1.25rem',
                                maxWidth: '300px',
                                marginLeft: 'auto'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                                        Subtotal:
                                    </span>
                                    <span style={{ color: '#FFF', fontWeight: '700', fontSize: '1.05rem' }}>
                                        ${modalVenta.subtotal?.toLocaleString('es-CO')}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem'
                                }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                                        Descuento:
                                    </span>
                                    <span style={{ color: '#FF6B6B', fontWeight: '700', fontSize: '1.05rem' }}>
                                        -${modalVenta.descuento?.toLocaleString('es-CO')}
                                    </span>
                                </div>
                                <div style={{
                                    borderTop: '2px solid rgba(103,186,205,0.3)',
                                    paddingTop: '0.75rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{
                                        color: '#FFF',
                                        fontWeight: '800',
                                        fontSize: '1.1rem'
                                    }}>Total:</span>
                                    <span style={{
                                        color: '#70EAF0',
                                        fontWeight: '900',
                                        fontSize: '1.5rem',
                                        fontFamily: "'Orbitron', sans-serif"
                                    }}>
                                        ${modalVenta.total?.toLocaleString('es-CO')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

