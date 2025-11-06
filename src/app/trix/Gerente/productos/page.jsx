'use client';
import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, Edit2, Trash2, 
  AlertTriangle, TrendingUp, DollarSign, X, Save,
  ChevronLeft, RefreshCw, Eye, ShoppingBag, BarChart3,
  Sparkles, Zap, Award, TrendingDown
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    stockBajo: 0,
    valorTotal: 0,
    activos: 0
  });

  const categorias = [
    'ABRIGO', 'BERMUDA', 'BUZOS', 'BUZO', 'CAMISAS', 'FALDA',
    'HOGAR', 'JEANS TERMINADOS', 'PANTALONES', 'PIJAMAS', 'POLOS',
    'ROPA DE BAÑO', 'ROPA INTERIOR', 'TERCERAS PIEZAS', 'TSHIRT',
    'TSHIRT TERMINADA', 'TERMINADAS', 'VESTIDOS'
  ];

  const generos = ['Mujer', 'Hombre', 'Niño', 'Niña', 'Unisex'];
  const tallas = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '4', '6', '8', '10', '12', '14', '16'];

  const [formulario, setFormulario] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    genero: '',
    talla: '',
    color: '',
    precioCompra: '',
    precioVenta: '',
    stockActual: '',
    stockMinimo: '5',
    proveedor: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    calcularEstadisticas();
  }, [productos]);

  const cargarProductos = async () => {
    setLoading(true);
    const token = localStorage.getItem('trix_token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/productos?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = () => {
    const stats = {
      total: productos.length,
      stockBajo: productos.filter(p => p.alertaStock).length,
      valorTotal: productos.reduce((sum, p) => sum + (p.precioVenta * p.stockActual), 0),
      activos: productos.filter(p => p.activo).length
    };
    setEstadisticas(stats);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirModalCrear = () => {
    setFormulario({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      genero: '',
      talla: '',
      color: '',
      precioCompra: '',
      precioVenta: '',
      stockActual: '',
      stockMinimo: '5',
      proveedor: ''
    });
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirModalEditar = (producto) => {
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria,
      genero: producto.genero,
      talla: producto.talla,
      color: producto.color || '',
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      stockActual: producto.stockActual,
      stockMinimo: producto.stockMinimo,
      proveedor: producto.proveedor || ''
    });
    setProductoSeleccionado(producto);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const guardarProducto = async () => {
    const token = localStorage.getItem('trix_token');
    const usuarioData = JSON.parse(localStorage.getItem('trix_usuario'));
    
    try {
      const url = modoEdicion 
        ? `${API_BASE_URL}/productos/${productoSeleccionado._id}`
        : `${API_BASE_URL}/productos`;
      
      const method = modoEdicion ? 'PUT' : 'POST';
      
      const body = {
        ...formulario,
        sucursal: usuarioData.sucursal
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        alert(modoEdicion ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        setModalAbierto(false);
        cargarProductos();
      } else {
        alert(data.mensaje || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;
    
    const token = localStorage.getItem('trix_token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        alert('Producto eliminado exitosamente');
        cargarProductos();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar producto');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const productosFiltrados = productos.filter(producto => {
    const matchSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       producto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = !filtroCategoria || producto.categoria === filtroCategoria;
    const matchGenero = !filtroGenero || producto.genero === filtroGenero;
    
    return matchSearch && matchCategoria && matchGenero;
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 30px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '4px solid #70EAF0',
              borderRadius: '50%',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
          <p style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#276A7C',
            marginBottom: '10px'
          }}>Cargando Productos</p>
          <p style={{ color: '#67BACD', fontSize: '14px' }}>Sincronizando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo decorativos */}
      <div style={{
        position: 'fixed',
        top: '-50%',
        right: '-10%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(112, 234, 240, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-30%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(103, 186, 205, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(39, 106, 124, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button
                onClick={() => window.history.back()}
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ChevronLeft style={{ width: '24px', height: '24px', color: '#276A7C' }} />
              </button>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(112, 234, 240, 0.3)'
                  }}>
                    <Package style={{ width: '28px', height: '28px', color: '#FFFFFF' }} />
                  </div>
                  <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#276A7C',
                    margin: 0,
                    letterSpacing: '-0.5px'
                  }}>
                    Gestión de Productos
                  </h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '62px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, rgba(112, 234, 240, 0.15) 0%, rgba(103, 186, 205, 0.15) 100%)',
                    borderRadius: '20px',
                    border: '1px solid rgba(112, 234, 240, 0.3)'
                  }}>
                    <Sparkles style={{ width: '14px', height: '14px', color: '#67BACD' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#276A7C' }}>
                      {estadisticas.activos} productos activos
                    </span>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.15) 0%, rgba(6, 214, 160, 0.1) 100%)',
                    borderRadius: '20px',
                    border: '1px solid rgba(6, 214, 160, 0.3)'
                  }}>
                    <Award style={{ width: '14px', height: '14px', color: '#06D6A0' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#06D6A0' }}>
                      Sistema en línea
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={cargarProductos}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
                  border: '1px solid rgba(39, 106, 124, 0.2)',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#276A7C',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #67BACD 0%, #5EACBB 100%)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(103, 186, 205, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)';
                  e.currentTarget.style.color = '#276A7C';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <RefreshCw style={{ width: '18px', height: '18px' }} />
                <span>Actualizar</span>
              </button>
              
              <button
                onClick={abrirModalCrear}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(112, 234, 240, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(112, 234, 240, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(112, 234, 240, 0.4)';
                }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 30px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Total Productos */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 245, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid rgba(39, 106, 124, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(39, 106, 124, 0.15)';
            e.currentTarget.style.borderColor = '#70EAF0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(39, 106, 124, 0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(103, 186, 205, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#67BACD', margin: '0 0 12px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Total Productos
                </p>
                <p style={{ fontSize: '48px', fontWeight: '700', color: '#276A7C', margin: '0', lineHeight: '1' }}>
                  {estadisticas.total}
                </p>
                <div style={{ 
                  marginTop: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '4px 10px',
                  background: 'rgba(103, 186, 205, 0.1)',
                  borderRadius: '8px',
                  width: 'fit-content'
                }}>
                  <TrendingUp style={{ width: '14px', height: '14px', color: '#06D6A0' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#06D6A0' }}>En inventario</span>
                </div>
              </div>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(103, 186, 205, 0.4)'
              }}>
                <Package style={{ width: '36px', height: '36px', color: '#FFFFFF' }} />
              </div>
            </div>
          </div>

          {/* Stock Bajo */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 245, 235, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid rgba(255, 209, 102, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(255, 209, 102, 0.25)';
            e.currentTarget.style.borderColor = '#FFD166';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.2)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255, 209, 102, 0.15) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#FFD166', margin: '0 0 12px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Stock Bajo
                </p>
                <p style={{ fontSize: '48px', fontWeight: '700', color: '#D4A747', margin: '0', lineHeight: '1' }}>
                  {estadisticas.stockBajo}
                </p>
                <div style={{ 
                  marginTop: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '4px 10px',
                  background: 'rgba(255, 209, 102, 0.15)',
                  borderRadius: '8px',
                  width: 'fit-content'
                }}>
                  <AlertTriangle style={{ width: '14px', height: '14px', color: '#D4A747' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#D4A747' }}>Requiere atención</span>
                </div>
              </div>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #FFD166 0%, #D4A747 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(255, 209, 102, 0.4)'
              }}>
                <AlertTriangle style={{ width: '36px', height: '36px', color: '#FFFFFF' }} />
              </div>
            </div>
          </div>

          {/* Valor Total */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(235, 255, 245, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid rgba(6, 214, 160, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(6, 214, 160, 0.25)';
            e.currentTarget.style.borderColor = '#06D6A0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(6, 214, 160, 0.2)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(6, 214, 160, 0.12) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#06D6A0', margin: '0 0 12px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Valor Total
                </p>
                <p style={{ fontSize: '32px', fontWeight: '700', color: '#05B589', margin: '0', lineHeight: '1' }}>
                  {formatCurrency(estadisticas.valorTotal)}
                </p>
                <div style={{ 
                  marginTop: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '4px 10px',
                  background: 'rgba(6, 214, 160, 0.12)',
                  borderRadius: '8px',
                  width: 'fit-content'
                }}>
                  <Zap style={{ width: '14px', height: '14px', color: '#06D6A0' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#06D6A0' }}>Activo en sistema</span>
                </div>
              </div>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #06D6A0 0%, #05B589 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(6, 214, 160, 0.4)'
              }}>
                <DollarSign style={{ width: '36px', height: '36px', color: '#FFFFFF' }} />
              </div>
            </div>
          </div>

          {/* Productos Activos */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 240, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid rgba(157, 78, 221, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(157, 78, 221, 0.25)';
            e.currentTarget.style.borderColor = '#9D4EDD';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.2)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(157, 78, 221, 0.12) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#9D4EDD', margin: '0 0 12px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Productos Activos
                </p>
                <p style={{ fontSize: '48px', fontWeight: '700', color: '#7D3EBD', margin: '0', lineHeight: '1' }}>
                  {estadisticas.activos}
                </p>
                <div style={{ 
                  marginTop: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '4px 10px',
                  background: 'rgba(157, 78, 221, 0.12)',
                  borderRadius: '8px',
                  width: 'fit-content'
                }}>
                  <TrendingUp style={{ width: '14px', height: '14px', color: '#9D4EDD' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#9D4EDD' }}>Disponibles</span>
                </div>
              </div>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #9D4EDD 0%, #7D3EBD 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(157, 78, 221, 0.4)'
              }}>
                <TrendingUp style={{ width: '36px', height: '36px', color: '#FFFFFF' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(39, 106, 124, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 2
              }}>
                <Search style={{ width: '20px', height: '20px', color: '#67BACD' }} />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 50px',
                  border: '2px solid rgba(103, 186, 205, 0.2)',
                  borderRadius: '16px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#276A7C',
                  background: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#70EAF0';
                  e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.1)';
                  e.target.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                }}
              />
            </div>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{
                padding: '16px 20px',
                border: '2px solid rgba(103, 186, 205, 0.2)',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: '500',
                color: '#276A7C',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#70EAF0';
                e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Todas las Categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              style={{
                padding: '16px 20px',
                border: '2px solid rgba(103, 186, 205, 0.2)',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: '500',
                color: '#276A7C',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#70EAF0';
                e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Todos los Géneros</option>
              {generos.map(gen => (
                <option key={gen} value={gen}>{gen}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(39, 106, 124, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, rgba(112, 234, 240, 0.08) 0%, rgba(103, 186, 205, 0.08) 100%)',
                  borderBottom: '2px solid rgba(39, 106, 124, 0.1)'
                }}>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#276A7C',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>Código</th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#276A7C',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>Producto</th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#276A7C',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>Categoría</th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#276A7C',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>Talla</th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#276A7C',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>Stock</th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#276A7C',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>Precio</th>
                  <th style={{
                    padding: '20px 24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#276A7C',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto, index) => (
                  <tr key={producto._id} style={{
                    borderBottom: '1px solid rgba(39, 106, 124, 0.05)',
                    transition: 'all 0.3s ease',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, rgba(112, 234, 240, 0.08) 0%, rgba(103, 186, 205, 0.05) 100%)';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '8px 14px',
                        background: 'linear-gradient(135deg, rgba(112, 234, 240, 0.15) 0%, rgba(103, 186, 205, 0.1) 100%)',
                        borderRadius: '10px',
                        border: '1px solid rgba(112, 234, 240, 0.3)'
                      }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#276A7C'
                        }}>{producto.codigo}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div>
                        <p style={{
                          fontWeight: '600',
                          color: '#000000',
                          margin: '0 0 4px 0',
                          fontSize: '15px'
                        }}>{producto.nombre}</p>
                        <p style={{
                          fontSize: '12px',
                          color: '#67BACD',
                          margin: 0,
                          fontWeight: '500'
                        }}>{producto.genero}</p>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#333333',
                        fontWeight: '500'
                      }}>{producto.categoria}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.12) 0%, rgba(157, 78, 221, 0.08) 100%)',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#7D3EBD',
                        border: '1px solid rgba(157, 78, 221, 0.2)'
                      }}>
                        {producto.talla}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '50px',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          background: producto.alertaStock 
                            ? 'linear-gradient(135deg, rgba(255, 209, 102, 0.15) 0%, rgba(255, 209, 102, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(6, 214, 160, 0.15) 0%, rgba(6, 214, 160, 0.1) 100%)',
                          border: producto.alertaStock 
                            ? '1px solid rgba(255, 209, 102, 0.3)'
                            : '1px solid rgba(6, 214, 160, 0.3)'
                        }}>
                          <span style={{
                            fontWeight: '700',
                            fontSize: '15px',
                            color: producto.alertaStock ? '#D4A747' : '#06D6A0'
                          }}>
                            {producto.stockActual}
                          </span>
                        </div>
                        {producto.alertaStock && (
                          <div style={{
                            animation: 'pulse 2s ease-in-out infinite'
                          }}>
                            <AlertTriangle style={{ width: '18px', height: '18px', color: '#FFD166' }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <p style={{
                        fontWeight: '700',
                        color: '#276A7C',
                        margin: 0,
                        fontSize: '16px'
                      }}>{formatCurrency(producto.precioVenta)}</p>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => {
                            setProductoSeleccionado(producto);
                            setModalVer(true);
                          }}
                          style={{
                            padding: '10px',
                            background: 'linear-gradient(135deg, rgba(103, 186, 205, 0.12) 0%, rgba(103, 186, 205, 0.08) 100%)',
                            border: '1px solid rgba(103, 186, 205, 0.3)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #67BACD 0%, #5EACBB 100%)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(103, 186, 205, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(103, 186, 205, 0.12) 0%, rgba(103, 186, 205, 0.08) 100%)';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          title="Ver detalles"
                        >
                          <Eye style={{ width: '18px', height: '18px', color: '#276A7C' }} />
                        </button>
                        <button
                          onClick={() => abrirModalEditar(producto)}
                          style={{
                            padding: '10px',
                            background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.12) 0%, rgba(6, 214, 160, 0.08) 100%)',
                            border: '1px solid rgba(6, 214, 160, 0.3)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #06D6A0 0%, #05B589 100%)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 214, 160, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 214, 160, 0.12) 0%, rgba(6, 214, 160, 0.08) 100%)';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          title="Editar"
                        >
                          <Edit2 style={{ width: '18px', height: '18px', color: '#05B589' }} />
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto._id)}
                          style={{
                            padding: '10px',
                            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(255, 107, 107, 0.08) 100%)',
                            border: '1px solid rgba(255, 107, 107, 0.3)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #E85555 100%)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(255, 107, 107, 0.08) 100%)';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          title="Eliminar"
                        >
                          <Trash2 style={{ width: '18px', height: '18px', color: '#E85555' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {productosFiltrados.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, rgba(103, 186, 205, 0.1) 0%, rgba(112, 234, 240, 0.1) 100%)',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingBag style={{ width: '50px', height: '50px', color: '#67BACD' }} />
                </div>
                <p style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#276A7C',
                  margin: '0 0 8px 0'
                }}>No se encontraron productos</p>
                <p style={{
                  fontSize: '14px',
                  color: '#67BACD'
                }}>Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Modal Crear/Editar */}
      {modalAbierto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
            borderRadius: '32px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(112, 234, 240, 0.2)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {modoEdicion ? (
                    <Edit2 style={{ width: '26px', height: '26px', color: '#FFFFFF' }} />
                  ) : (
                    <Plus style={{ width: '26px', height: '26px', color: '#FFFFFF' }} />
                  )}
                </div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: 0
                }}>
                  {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <X style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
              </button>
            </div>

            <div style={{
              padding: '32px',
              overflowY: 'auto',
              flex: 1
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                {/* Código */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Código *
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={formulario.codigo}
                    onChange={handleInputChange}
                    disabled={modoEdicion}
                    placeholder="Ej: PROD001"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: modoEdicion ? 'rgba(245, 245, 245, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: modoEdicion ? 'not-allowed' : 'text'
                    }}
                    onFocus={(e) => {
                      if (!modoEdicion) {
                        e.target.style.borderColor = '#70EAF0';
                        e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Descripción - Col Span 2 */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Descripción del producto"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={formulario.categoria}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Género */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Género *
                  </label>
                  <select
                    name="genero"
                    value={formulario.genero}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    {generos.map(gen => (
                      <option key={gen} value={gen}>{gen}</option>
                    ))}
                  </select>
                </div>

                {/* Talla */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Talla *
                  </label>
                  <select
                    name="talla"
                    value={formulario.talla}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    {tallas.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formulario.color}
                    onChange={handleInputChange}
                    placeholder="Ej: Azul marino"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Precio Compra */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Precio Compra *
                  </label>
                  <input
                    type="number"
                    name="precioCompra"
                    value={formulario.precioCompra}
                    onChange={handleInputChange}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Precio Venta */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Precio Venta *
                  </label>
                  <input
                    type="number"
                    name="precioVenta"
                    value={formulario.precioVenta}
                    onChange={handleInputChange}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Stock Actual */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Stock Actual *
                  </label>
                  <input
                    type="number"
                    name="stockActual"
                    value={formulario.stockActual}
                    onChange={handleInputChange}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Stock Mínimo */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stockMinimo"
                    value={formulario.stockMinimo}
                    onChange={handleInputChange}
                    placeholder="5"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Proveedor - Col Span 2 */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#276A7C',
                    marginBottom: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    Proveedor
                  </label>
                  <input
                    type="text"
                    name="proveedor"
                    value={formulario.proveedor}
                    onChange={handleInputChange}
                    placeholder="Nombre del proveedor"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid rgba(103, 186, 205, 0.2)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#276A7C',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#70EAF0';
                      e.target.style.boxShadow = '0 0 0 4px rgba(112, 234, 240, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(103, 186, 205, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Botones */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '32px'
              }}>
                <button
                  onClick={guardarProducto}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '18px 32px',
                    background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(112, 234, 240, 0.4)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(112, 234, 240, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(112, 234, 240, 0.4)';
                  }}
                >
                  <Save style={{ width: '20px', height: '20px' }} />
                  {modoEdicion ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
                <button
                  onClick={() => setModalAbierto(false)}
                  style={{
                    padding: '18px 32px',
                    background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
                    border: '1px solid rgba(39, 106, 124, 0.2)',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#276A7C',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #E8E8E8 0%, #D8D8D8 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Detalles */}
      {modalVer && productoSeleccionado && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
            borderRadius: '32px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
            maxWidth: '700px',
            width: '100%',
            overflow: 'hidden',
            border: '1px solid rgba(112, 234, 240, 0.2)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #276A7C 0%, #67BACD 100%)',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Eye style={{ width: '26px', height: '26px', color: '#FFFFFF' }} />
                </div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: 0
                }}>
                  Detalles del Producto
                </h2>
              </div>
              <button
                onClick={() => setModalVer(false)}
                style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <X style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                {/* Código */}
                <div style={{
                  gridColumn: '1 / -1',
                  background: 'linear-gradient(135deg, rgba(112, 234, 240, 0.12) 0%, rgba(103, 186, 205, 0.08) 100%)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(112, 234, 240, 0.3)'
                }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Código</p>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#276A7C',
                    margin: 0,
                    fontFamily: 'monospace'
                  }}>{productoSeleccionado.codigo}</p>
                </div>

                {/* Nombre */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Nombre</p>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#000000',
                    margin: 0
                  }}>{productoSeleccionado.nombre}</p>
                </div>

                {/* Descripción */}
                {productoSeleccionado.descripcion && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#67BACD',
                      margin: '0 0 10px 0',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>Descripción</p>
                    <p style={{
                      fontSize: '15px',
                      color: '#333333',
                      margin: 0,
                      lineHeight: '1.6'
                    }}>{productoSeleccionado.descripcion}</p>
                  </div>
                )}

                {/* Categoría */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Categoría</p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#000000',
                    margin: 0
                  }}>{productoSeleccionado.categoria}</p>
                </div>

                {/* Género */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Género</p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#000000',
                    margin: 0
                    }}>{productoSeleccionado.genero}</p>
                </div>

                {/* Talla */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Talla</p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#000000',
                    margin: 0
                  }}>{productoSeleccionado.talla}</p>
                </div>

                {/* Color */}
                {productoSeleccionado.color && (
                  <div>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#67BACD',
                      margin: '0 0 10px 0',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>Color</p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#000000',
                      margin: 0
                    }}>{productoSeleccionado.color}</p>
                  </div>
                )}

                {/* Precio Compra */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Precio Compra</p>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#276A7C',
                    margin: 0
                  }}>{formatCurrency(productoSeleccionado.precioCompra)}</p>
                </div>

                {/* Precio Venta */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Precio Venta</p>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#06D6A0',
                    margin: 0
                  }}>{formatCurrency(productoSeleccionado.precioVenta)}</p>
                </div>

                {/* Stock Actual */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Stock Actual</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <p style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: productoSeleccionado.alertaStock ? '#FFD166' : '#06D6A0',
                      margin: 0
                    }}>{productoSeleccionado.stockActual}</p>
                    {productoSeleccionado.alertaStock && (
                      <AlertTriangle style={{ width: '24px', height: '24px', color: '#FFD166' }} />
                    )}
                  </div>
                </div>

                {/* Stock Mínimo */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Stock Mínimo</p>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#276A7C',
                    margin: 0
                  }}>{productoSeleccionado.stockMinimo}</p>
                </div>

                {/* Proveedor */}
                {productoSeleccionado.proveedor && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#67BACD',
                      margin: '0 0 10px 0',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>Proveedor</p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#000000',
                      margin: 0
                    }}>{productoSeleccionado.proveedor}</p>
                  </div>
                )}

                {/* Estado */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#67BACD',
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>Estado</p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    background: productoSeleccionado.activo 
                      ? 'linear-gradient(135deg, rgba(6, 214, 160, 0.15) 0%, rgba(6, 214, 160, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.1) 100%)',
                    borderRadius: '12px',
                    border: productoSeleccionado.activo 
                      ? '1px solid rgba(6, 214, 160, 0.3)'
                      : '1px solid rgba(255, 107, 107, 0.3)'
                  }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: productoSeleccionado.activo ? '#06D6A0' : '#FF6B6B'
                    }} />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: productoSeleccionado.activo ? '#06D6A0' : '#FF6B6B'
                    }}>
                      {productoSeleccionado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón Cerrar */}
              <button
                onClick={() => setModalVer(false)}
                style={{
                  width: '100%',
                  marginTop: '32px',
                  padding: '18px 32px',
                  background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(112, 234, 240, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(112, 234, 240, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(112, 234, 240, 0.4)';
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;
                    