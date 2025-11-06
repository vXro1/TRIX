'use client';
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Store,
  Clock,
  User,
  ChevronRight,
  RefreshCw,
  DollarSign,
  BarChart3,
  ShoppingCart,
  PackageCheck,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  QrCode
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const DashboardGerente = () => {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    tendencias: null,
    sobreStock: [],
    reabastecimiento: [],
    valorInventario: null,
    rotacion: null,
    productosStockBajo: [],
    sucursales: null,
    horariosPico: null
  });

  useEffect(() => {
    verificarAutenticacion();
    cargarDatosDashboard();
  }, []);

  const verificarAutenticacion = () => {
    const token = localStorage.getItem('trix_token');
    const usuarioData = localStorage.getItem('trix_usuario');

    if (!token || !usuarioData) {
      window.location.href = '/trix/login';
      return;
    }

    try {
      const userData = JSON.parse(usuarioData);
      setUsuario(userData);

      // Verificar rol
      if (userData.rol !== 'gerente' && userData.rol !== 'admin') {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '/trix/login';
      }
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
      window.location.href = '/trix/login';
    }
  };

  const cargarDatosDashboard = async () => {
    setLoading(true);
    const token = localStorage.getItem('trix_token');

    if (!token) {
      window.location.href = '/trix/login';
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Cargar todos los datos en paralelo
      const [
        tendenciasRes,
        sobreStockRes,
        reabastecimientoRes,
        valorInventarioRes,
        rotacionRes,
        stockBajoRes,
        sucursalesRes,
        horariosRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/tendencias?meses=6`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/analytics/sobre-stock?meses=3`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/analytics/sugerencias-reabastecimiento?dias=30`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/inventario/valoracion`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/inventario/indice-rotacion?fechaInicio=${getFechaInicio()}&fechaFin=${getFechaFin()}`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/productos/alertas/stock-bajo`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/sucursales/comparar-rendimiento?fechaInicio=${getFechaInicio()}&fechaFin=${getFechaFin()}`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/analytics/horarios-pico?fechaInicio=${getFechaInicio()}&fechaFin=${getFechaFin()}`, { headers }).catch(() => null)
      ]);

      const tendencias = tendenciasRes ? await tendenciasRes.json() : null;
      const sobreStock = sobreStockRes ? await sobreStockRes.json() : null;
      const reabastecimiento = reabastecimientoRes ? await reabastecimientoRes.json() : null;
      const valorInventario = valorInventarioRes ? await valorInventarioRes.json() : null;
      const rotacion = rotacionRes ? await rotacionRes.json() : null;
      const stockBajo = stockBajoRes ? await stockBajoRes.json() : null;
      const sucursales = sucursalesRes ? await sucursalesRes.json() : null;
      const horarios = horariosRes ? await horariosRes.json() : null;

      setDashboardData({
        tendencias: tendencias?.success ? tendencias.data : null,
        sobreStock: sobreStock?.success ? sobreStock.data : [],
        reabastecimiento: reabastecimiento?.success ? reabastecimiento.data : [],
        valorInventario: valorInventario?.success ? valorInventario.totales : null,
        rotacion: rotacion?.success ? rotacion.estadisticas : null,
        productosStockBajo: stockBajo?.success ? stockBajo.data : [],
        sucursales: sucursales?.success ? sucursales.data : null,
        horariosPico: horarios?.success ? horarios.horariosPico : null
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        cerrarSesion();
      }
    } finally {
      setLoading(false);
    }
  };

  const getFechaInicio = () => {
    return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  };

  const getFechaFin = () => {
    return new Date().toISOString().split('T')[0];
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('trix_token');
    localStorage.removeItem('trix_usuario');
    window.location.href = '/trix/login';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 z-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center space-y-4">
          <RefreshCw className="w-16 h-16 text-blue-600 loading-icon" />
          <p className="text-blue-700 text-xl font-semibold loading-text">
            Cargando ...
          </p>
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-75"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></span>
            <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
      </div>

    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard TRIX</h1>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Bienvenido, {usuario?.nombre || 'Usuario'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={cargarDatosDashboard}
                className="button-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>


              <div className="relative group">
                <button className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  <User className="w-5 h-5 text-slate-700" />
                  <span className="hidden sm:inline text-sm font-medium text-slate-700">
                    {usuario?.nombre?.split(' ')[0] || 'Usuario'}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-slate-200">
                    <p className="font-semibold text-slate-900">{usuario?.nombre}</p>
                    <p className="text-xs text-slate-600">{usuario?.email}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1 capitalize">{usuario?.rol}</p>
                  </div>
                  <button
                    onClick={cerrarSesion}
                    className="button-primary flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* KPIs principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">INVENTARIO</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
              {dashboardData.valorInventario ? formatCurrency(dashboardData.valorInventario.valorCosto) : '$0'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              {dashboardData.valorInventario?.totalUnidades || 0} unidades
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">PRODUCTOS</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
              {dashboardData.valorInventario?.totalProductos || 0}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">productos activos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">ALERTAS</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
              {dashboardData.productosStockBajo.length}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">productos stock bajo</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">ROTACIÓN</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
              {dashboardData.rotacion?.altaRotacion || 0}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">alta rotación</p>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Stock Bajo */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  Stock Bajo
                </h2>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {dashboardData.productosStockBajo.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.productosStockBajo.slice(0, 5).map((producto) => (
                    <div key={producto._id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm sm:text-base">{producto.nombre}</p>
                        <p className="text-xs sm:text-sm text-slate-600">Código: {producto.codigo}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-base sm:text-lg font-bold text-amber-600">{producto.stockActual}</p>
                        <p className="text-xs text-slate-500">Mín: {producto.stockMinimo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8 text-sm">No hay productos con stock bajo</p>
              )}
            </div>
          </div>

          {/* Reabastecimiento */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Reabastecimiento
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {dashboardData.reabastecimiento.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.reabastecimiento.slice(0, 5).map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm sm:text-base">{item.nombre}</p>
                        <p className="text-xs sm:text-sm text-slate-600">Stock: {item.stockActual}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-base sm:text-lg font-bold text-blue-600">+{item.cantidadSugerida}</p>
                        <p className="text-xs text-slate-500">sugerido</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8 text-sm">No hay sugerencias</p>
              )}
            </div>
          </div>

          {/* Sobre-Stock */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                Sobre-Stock
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {dashboardData.sobreStock.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.sobreStock.slice(0, 4).map((producto) => (
                    <div key={producto._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm sm:text-base">{producto.nombre}</p>
                        <p className="text-xs sm:text-sm text-slate-600">Stock: {producto.stockActual}</p>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-orange-600 ml-2">
                        {producto.mesesInventario.toFixed(1)} meses
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8 text-sm">No hay sobre-stock</p>
              )}
            </div>
          </div>

          {/* Horarios Pico */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                Horarios Pico
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {dashboardData.horariosPico && dashboardData.horariosPico.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.horariosPico.map((horario, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm sm:text-base">{horario.hora}:00 - {horario.hora}:59</p>
                          <p className="text-xs sm:text-sm text-slate-600">{horario.cantidadVentas} ventas</p>
                        </div>
                      </div>
                      <p className="text-sm sm:text-lg font-bold text-slate-900 ml-2">{formatCurrency(horario.totalVentas)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8 text-sm">No hay datos</p>
              )}
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <a
            href="/trix/Gerente/productos"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900 text-sm sm:text-base">Productos</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Gestionar catálogo</p>
          </a>

          <a
            href="/trix/Gerente/inventario"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900 text-sm sm:text-base">Inventario</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Análisis y movimientos</p>
          </a>

          <a
            href="/trix/Gerente/reportes"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900 text-sm sm:text-base">Reportes</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Ventas y análisis</p>
          </a>

          <a
            href="/trix/Gerente/sucursal"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900 text-sm sm:text-base">Sucursales</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Comparar rendimiento</p>
          </a>
          <a
            href="/trix/Gerente/scanner"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-slate-900 text-sm sm:text-base">QR</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Escanear productos</p>
          </a>

        </div>
      </div>

    </div >
  );
};

export default DashboardGerente;