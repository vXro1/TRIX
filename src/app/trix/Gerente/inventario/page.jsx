'use client';
import React, { useState, useEffect } from 'react';
import { 
  Package, TrendingUp, TrendingDown, RefreshCw, ArrowUpCircle,
  ArrowDownCircle, AlertCircle, Repeat, Trash2, ChevronLeft,
  Calendar, Filter, Search, X, Save, FileText, BarChart3,
  ShoppingCart, Clock, DollarSign, Eye, CheckCircle, AlertTriangle,
  Download, TrendingUp as TrendUp, Activity
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const GestionInventario = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [valoracion, setValoracion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [tipoOperacion, setTipoOperacion] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [historialProducto, setHistorialProducto] = useState([]);
  const [resumenMovimientos, setResumenMovimientos] = useState(null);
  const [vistaActiva, setVistaActiva] = useState('general'); // general, analytics

  const [formulario, setFormulario] = useState({
    productoId: '',
    cantidad: '',
    motivo: '',
    observaciones: '',
    costoUnitario: '',
    stockReal: '',
    sucursalDestino: ''
  });

  const tiposMovimiento = [
    { value: 'ENTRADA', label: 'Entrada', icon: ArrowUpCircle, color: 'green' },
    { value: 'SALIDA', label: 'Salida', icon: ArrowDownCircle, color: 'red' },
    { value: 'AJUSTE', label: 'Ajuste', icon: RefreshCw, color: 'blue' },
    { value: 'TRANSFERENCIA', label: 'Transferencia', icon: Repeat, color: 'purple' },
    { value: 'MERMA', label: 'Merma', icon: Trash2, color: 'orange' }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    const token = localStorage.getItem('trix_token');
    
    try {
      const [productosRes, movimientosRes, valoracionRes, resumenRes] = await Promise.all([
        fetch(`${API_BASE_URL}/productos?limit=1000`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/inventario/movimientos?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/inventario/valoracion`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/inventario/resumen-movimientos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null)
      ]);

      const productosData = await productosRes.json();
      const movimientosData = await movimientosRes.json();
      const valoracionData = await valoracionRes.json();
      const resumenData = resumenRes ? await resumenRes.json() : null;

      if (productosData.success) setProductos(productosData.data);
      if (movimientosData.success) setMovimientos(movimientosData.data);
      if (valoracionData.success) setValoracion(valoracionData.totales);
      if (resumenData && resumenData.success) setResumenMovimientos(resumenData.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const abrirModal = (tipo, producto = null) => {
    setTipoOperacion(tipo);
    setProductoSeleccionado(producto);
    setFormulario({
      productoId: producto?._id || '',
      cantidad: '',
      motivo: '',
      observaciones: '',
      costoUnitario: producto?.precioCompra || '',
      stockReal: producto?.stockActual || '',
      sucursalDestino: ''
    });
    setModalAbierto(true);
  };

  const ejecutarOperacion = async () => {
    const token = localStorage.getItem('trix_token');
    
    let url = '';
    let body = {};

    switch (tipoOperacion) {
      case 'ENTRADA':
        url = `${API_BASE_URL}/inventario/entrada`;
        body = {
          productoId: formulario.productoId,
          cantidad: parseInt(formulario.cantidad),
          motivo: formulario.motivo,
          observaciones: formulario.observaciones,
          costoUnitario: parseFloat(formulario.costoUnitario) || undefined
        };
        break;
      
      case 'SALIDA':
        url = `${API_BASE_URL}/inventario/salida`;
        body = {
          productoId: formulario.productoId,
          cantidad: parseInt(formulario.cantidad),
          motivo: formulario.motivo,
          observaciones: formulario.observaciones
        };
        break;
      
      case 'AJUSTE':
        url = `${API_BASE_URL}/inventario/ajuste`;
        body = {
          productoId: formulario.productoId,
          stockReal: parseInt(formulario.stockReal),
          motivo: formulario.motivo,
          observaciones: formulario.observaciones
        };
        break;
      
      case 'TRANSFERENCIA':
        url = `${API_BASE_URL}/inventario/transferencia`;
        body = {
          productoId: formulario.productoId,
          cantidad: parseInt(formulario.cantidad),
          sucursalDestino: formulario.sucursalDestino,
          observaciones: formulario.observaciones
        };
        break;
      
      case 'MERMA':
        url = `${API_BASE_URL}/inventario/merma`;
        body = {
          productoId: formulario.productoId,
          cantidad: parseInt(formulario.cantidad),
          motivo: formulario.motivo,
          observaciones: formulario.observaciones
        };
        break;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.mensaje);
        setModalAbierto(false);
        cargarDatos();
      } else {
        alert(data.mensaje || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al ejecutar la operación');
    }
  };

  const verHistorial = async (producto) => {
    setProductoSeleccionado(producto);
    const token = localStorage.getItem('trix_token');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/inventario/movimientos/producto/${producto._id}?limit=50`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = await response.json();
      
      if (data.success) {
        setHistorialProducto(data.data);
        setModalHistorial(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIconoTipoMovimiento = (tipo) => {
    const iconos = {
      'ENTRADA': { Icon: ArrowUpCircle, color: 'text-green-600', bg: 'bg-green-100' },
      'SALIDA': { Icon: ArrowDownCircle, color: 'text-red-600', bg: 'bg-red-100' },
      'AJUSTE_POSITIVO': { Icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
      'AJUSTE_NEGATIVO': { Icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-100' },
      'TRANSFERENCIA_ENTRADA': { Icon: Repeat, color: 'text-purple-600', bg: 'bg-purple-100' },
      'TRANSFERENCIA_SALIDA': { Icon: Repeat, color: 'text-indigo-600', bg: 'bg-indigo-100' },
      'MERMA': { Icon: Trash2, color: 'text-red-600', bg: 'bg-red-100' }
    };

    return iconos[tipo] || { Icon: Package, color: 'text-slate-600', bg: 'bg-slate-100' };
  };

  const getEstadoStock = (producto) => {
    const porcentaje = (producto.stockActual / producto.stockMinimo) * 100;
    
    if (porcentaje <= 50) {
      return { color: 'text-red-600', bg: 'bg-red-100', label: 'Crítico', icon: AlertTriangle };
    } else if (porcentaje <= 100) {
      return { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Bajo', icon: AlertCircle };
    } else if (porcentaje <= 150) {
      return { color: 'text-green-600', bg: 'bg-green-100', label: 'Óptimo', icon: CheckCircle };
    } else {
      return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Alto', icon: TrendUp };
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const matchSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       producto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && producto.activo;
  });

  const movimientosFiltrados = movimientos.filter(mov => {
    return !filtroTipo || mov.tipoMovimiento === filtroTipo;
  });

  // Productos con stock crítico
  const productosStockCritico = productos.filter(p => 
    p.activo && p.stockActual <= p.stockMinimo * 0.5
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Inventario</h1>
                <p className="text-slate-600 text-sm mt-1">Control de movimientos y stock</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setVistaActiva('general')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    vistaActiva === 'general' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setVistaActiva('analytics')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    vistaActiva === 'analytics' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                  }`}
                >
                  Analytics
                </button>
              </div>
              
              <button
                onClick={cargarDatos}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Alertas de Stock Crítico */}
        {productosStockCritico.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  {productosStockCritico.length} producto{productosStockCritico.length > 1 ? 's' : ''} con stock crítico
                </h3>
                <p className="text-sm text-red-700">
                  Productos con menos del 50% del stock mínimo requerido
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas de Valoración */}
        {valoracion && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Productos</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{valoracion.totalProductos}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Unidades</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{valoracion.totalUnidades}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <ShoppingCart className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Valor Costo</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(valoracion.valorCosto)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Utilidad Potencial</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">{formatCurrency(valoracion.utilidadPotencial)}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {vistaActiva === 'general' && (
          <>
            {/* Acciones Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Operaciones de Inventario</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {tiposMovimiento.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    onClick={() => abrirModal(value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      color === 'green' ? 'border-green-200 bg-green-50 hover:bg-green-100' :
                      color === 'red' ? 'border-red-200 bg-red-50 hover:bg-red-100' :
                      color === 'blue' ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' :
                      color === 'purple' ? 'border-purple-200 bg-purple-50 hover:bg-purple-100' :
                      'border-orange-200 bg-orange-50 hover:bg-orange-100'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${
                      color === 'green' ? 'text-green-600' :
                      color === 'red' ? 'text-red-600' :
                      color === 'blue' ? 'text-blue-600' :
                      color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      color === 'green' ? 'text-green-700' :
                      color === 'red' ? 'text-red-700' :
                      color === 'blue' ? 'text-blue-700' :
                      color === 'purple' ? 'text-purple-700' :
                      'text-orange-700'
                    }`}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Productos en Inventario */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Productos en Inventario</h2>
                  <span className="text-sm text-slate-600">{productosFiltrados.length} productos</span>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {productosFiltrados.slice(0, 20).map((producto) => {
                    const estadoStock = getEstadoStock(producto);
                    const EstadoIcon = estadoStock.icon;
                    
                    return (
                      <div key={producto._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{producto.nombre}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-slate-600">Código: {producto.codigo}</p>
                            <span className="text-slate-400">•</span>
                            <p className="text-xs text-slate-600">Talla: {producto.talla}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-3">
                          <div className={`px-2 py-1 ${estadoStock.bg} rounded-lg flex items-center gap-1`}>
                            <EstadoIcon className={`w-3 h-3 ${estadoStock.color}`} />
                            <span className={`text-xs font-semibold ${estadoStock.color}`}>
                              {estadoStock.label}
                            </span>
                          </div>

                          <div className="text-right">
                            <p className={`text-lg font-bold ${producto.alertaStock ? 'text-amber-600' : 'text-green-600'}`}>
                              {producto.stockActual}
                            </p>
                            <p className="text-xs text-slate-500">stock</p>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => verHistorial(producto)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver historial"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => abrirModal('ENTRADA', producto)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Entrada"
                            >
                              <ArrowUpCircle className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => abrirModal('SALIDA', producto)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Salida"
                            >
                              <ArrowDownCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Últimos Movimientos */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Últimos Movimientos</h2>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="ENTRADA">Entradas</option>
                    <option value="SALIDA">Salidas</option>
                    <option value="AJUSTE_POSITIVO">Ajustes +</option>
                    <option value="AJUSTE_NEGATIVO">Ajustes -</option>
                    <option value="TRANSFERENCIA_ENTRADA">Transfer. Entrada</option>
                    <option value="TRANSFERENCIA_SALIDA">Transfer. Salida</option>
                    <option value="MERMA">Mermas</option>
                  </select>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {movimientosFiltrados.map((mov) => {
                    const { Icon, color, bg } = getIconoTipoMovimiento(mov.tipoMovimiento);
                    
                    return (
                      <div key={mov._id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${bg} rounded-lg`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 truncate">{mov.nombreProducto}</p>
                                <p className="text-xs text-slate-600">{mov.codigoProducto}</p>
                              </div>
                              <span className={`text-sm font-bold ${color}`}>
                                {mov.tipoMovimiento.includes('SALIDA') || mov.tipoMovimiento.includes('NEGATIVO') || mov.tipoMovimiento === 'MERMA' ? '-' : '+'}{mov.cantidad}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
                              <span>{mov.motivo}</span>
                              <span>{formatDate(mov.createdAt)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1 text-xs">
                              <span className="text-slate-500">Stock: {mov.stockAnterior} → {mov.stockNuevo}</span>
                              <span className="text-slate-400">|</span>
                              <span className="text-slate-500">Por: {mov.nombreUsuario}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {movimientosFiltrados.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No hay movimientos registrados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {vistaActiva === 'analytics' && resumenMovimientos && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <ArrowUpCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Entradas Totales</p>
                    <p className="text-2xl font-bold text-slate-900">{resumenMovimientos.totalEntradas || 0}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">Unidades ingresadas al inventario</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <ArrowDownCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Salidas Totales</p>
                    <p className="text-2xl font-bold text-slate-900">{resumenMovimientos.totalSalidas || 0}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">Unidades retiradas del inventario</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Activity className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Movimientos</p>
                    <p className="text-2xl font-bold text-slate-900">{resumenMovimientos.totalMovimientos || 0}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">Operaciones registradas</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Análisis de Inventario</h3>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Análisis detallado disponible próximamente</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Operaciones */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {tipoOperacion === 'ENTRADA' && 'Registrar Entrada'}
                {tipoOperacion === 'SALIDA' && 'Registrar Salida'}
                {tipoOperacion === 'AJUSTE' && 'Ajuste de Inventario'}
                {tipoOperacion === 'TRANSFERENCIA' && 'Transferencia entre Sucursales'}
                {tipoOperacion === 'MERMA' && 'Registrar Merma'}
              </h2>
              <button
                onClick={() => setModalAbierto(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {!productoSeleccionado && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Producto *</label>
                    <select
                      name="productoId"
                      value={formulario.productoId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar producto...</option>
                      {productos.filter(p => p.activo).map(p => (
                        <option key={p._id} value={p._id}>
                          {p.codigo} - {p.nombre} (Stock: {p.stockActual})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {productoSeleccionado && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Producto seleccionado</p>
                    <p className="text-lg font-bold text-slate-900">{productoSeleccionado.nombre}</p>
                    <p className="text-sm text-slate-600">Stock actual: <span className="font-semibold">{productoSeleccionado.stockActual}</span></p>
                  </div>
                )}

                {tipoOperacion !== 'AJUSTE' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label>
                    <input
                      type="number"
                      name="cantidad"
                      value={formulario.cantidad}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="1"
                    />
                  </div>
                )}

                {tipoOperacion === 'AJUSTE' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Real *</label>
                    <input
                      type="number"
                      name="stockReal"
                      value={formulario.stockReal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    {productoSeleccionado && formulario.stockReal && (
                      <p className="text-sm mt-1 text-slate-600">
                        Diferencia: <span className={`font-semibold ${parseInt(formulario.stockReal) - productoSeleccionado.stockActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {parseInt(formulario.stockReal) - productoSeleccionado.stockActual >= 0 ? '+' : ''}{parseInt(formulario.stockReal) - productoSeleccionado.stockActual}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {tipoOperacion === 'ENTRADA' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Costo Unitario</label>
                    <input
                      type="number"
                      name="costoUnitario"
                      value={formulario.costoUnitario}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Opcional"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}

                {tipoOperacion === 'TRANSFERENCIA' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sucursal Destino *</label>
                    <input
                      type="text"
                      name="sucursalDestino"
                      value={formulario.sucursalDestino}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ID de la sucursal destino"
                    />
                  </div>
                )}

                {tipoOperacion !== 'TRANSFERENCIA' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Motivo *</label>
                    <input
                      type="text"
                      name="motivo"
                      value={formulario.motivo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descripción del motivo"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={formulario.observaciones}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Detalles adicionales..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={ejecutarOperacion}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Save className="w-5 h-5" />
                  Registrar Operación
                </button>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial */}
      {modalHistorial && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{productoSeleccionado.nombre}</h2>
                <p className="text-sm text-slate-600 mt-1">Historial de movimientos</p>
              </div>
              <button
                onClick={() => setModalHistorial(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Stock Actual</p>
                  <p className="text-2xl font-bold text-slate-900">{productoSeleccionado.stockActual}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Stock Mínimo</p>
                  <p className="text-2xl font-bold text-slate-900">{productoSeleccionado.stockMinimo}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Movimientos</p>
                  <p className="text-2xl font-bold text-slate-900">{historialProducto.length}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 mb-3">Últimas operaciones</h3>
                {historialProducto.map((mov) => {
                  const { Icon, color, bg } = getIconoTipoMovimiento(mov.tipoMovimiento);
                  
                  return (
                    <div key={mov._id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${bg} rounded-lg`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-slate-900">{mov.tipoMovimiento.replace(/_/g, ' ')}</p>
                              <p className="text-sm text-slate-600">{mov.motivo}</p>
                            </div>
                            <span className={`text-lg font-bold ${color}`}>
                              {mov.tipoMovimiento.includes('SALIDA') || mov.tipoMovimiento.includes('NEGATIVO') || mov.tipoMovimiento === 'MERMA' ? '-' : '+'}{mov.cantidad}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500">Stock anterior</p>
                              <p className="font-semibold text-slate-900">{mov.stockAnterior}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Stock nuevo</p>
                              <p className="font-semibold text-slate-900">{mov.stockNuevo}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
                            <span>Por: {mov.nombreUsuario}</span>
                            <span>{formatDate(mov.createdAt)}</span>
                          </div>

                          {mov.observaciones && (
                            <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-700">
                              <p className="font-medium text-slate-600 mb-1">Observaciones:</p>
                              <p>{mov.observaciones}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {historialProducto.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No hay movimientos registrados para este producto</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionInventario;