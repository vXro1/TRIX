'use client';
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Download, Calendar, Filter, FileText, 
  BarChart3, PieChart, Package, Users, DollarSign,
  ChevronDown, RefreshCw, FileSpreadsheet, X, Check,
  AlertCircle, ArrowUp, ArrowDown, ShoppingCart
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const ReportesPage = () => {
  const [loading, setLoading] = useState(false);
  const [tipoReporte, setTipoReporte] = useState('dashboard');
  const [filtros, setFiltros] = useState({
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    agruparPor: 'dia',
    categoria: '',
    genero: '',
    limite: 20
  });
  const [datosReporte, setDatosReporte] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarReporte();
  }, [tipoReporte]);

  const cargarReporte = async () => {
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

      let url = '';
      const params = new URLSearchParams();

      switch (tipoReporte) {
        case 'dashboard':
          url = `${API_BASE_URL}/reportes/dashboard`;
          params.append('fechaInicio', filtros.fechaInicio);
          params.append('fechaFin', filtros.fechaFin);
          break;
        
        case 'ventas':
          url = `${API_BASE_URL}/reportes/ventas`;
          params.append('fechaInicio', filtros.fechaInicio);
          params.append('fechaFin', filtros.fechaFin);
          params.append('agruparPor', filtros.agruparPor);
          break;
        
        case 'productos':
          url = `${API_BASE_URL}/reportes/productos-mas-vendidos`;
          params.append('fechaInicio', filtros.fechaInicio);
          params.append('fechaFin', filtros.fechaFin);
          params.append('limite', filtros.limite);
          if (filtros.categoria) params.append('categoria', filtros.categoria);
          if (filtros.genero) params.append('genero', filtros.genero);
          break;
        
        case 'rotacion':
          url = `${API_BASE_URL}/reportes/rotacion-inventario`;
          params.append('fechaInicio', filtros.fechaInicio);
          params.append('fechaFin', filtros.fechaFin);
          break;
        
        case 'categoria':
          url = `${API_BASE_URL}/reportes/por-categoria`;
          params.append('fechaInicio', filtros.fechaInicio);
          params.append('fechaFin', filtros.fechaFin);
          break;
        
        case 'genero':
          url = `${API_BASE_URL}/reportes/por-genero`;
          params.append('fechaInicio', filtros.fechaInicio);
          params.append('fechaFin', filtros.fechaFin);
          break;
        
        case 'tallas':
          url = `${API_BASE_URL}/reportes/tallas-mas-vendidas`;
          params.append('fechaInicio', filtros.fechaInicio);
          params.append('fechaFin', filtros.fechaFin);
          if (filtros.genero) params.append('genero', filtros.genero);
          break;
      }

      const response = await fetch(`${url}?${params.toString()}`, { headers });
      const data = await response.json();

      if (data.success) {
        setDatosReporte(data);
      } else {
        alert('Error al cargar el reporte');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const exportarExcel = () => {
    if (!datosReporte) return;

    let csvContent = '';
    let filename = '';

    switch (tipoReporte) {
      case 'dashboard':
        filename = 'dashboard.csv';
        csvContent = 'Métrica,Valor\n';
        csvContent += `Total Ventas,${datosReporte.kpis?.ventas?.total || 0}\n`;
        csvContent += `Total Ingresos,${datosReporte.kpis?.ventas?.ingresos || 0}\n`;
        csvContent += `Promedio Venta,${datosReporte.kpis?.ventas?.promedio || 0}\n`;
        csvContent += `Total Productos,${datosReporte.kpis?.inventario?.totalProductos || 0}\n`;
        csvContent += `Stock Bajo,${datosReporte.kpis?.inventario?.productosStockBajo || 0}\n`;
        csvContent += `Valor Inventario,${datosReporte.kpis?.inventario?.valorTotal || 0}\n`;
        break;

      case 'productos':
        filename = 'productos_mas_vendidos.csv';
        csvContent = 'Código,Nombre,Categoría,Género,Talla,Cantidad Vendida,Total Ingresos\n';
        datosReporte.data?.forEach(prod => {
          csvContent += `${prod.codigoProducto},${prod.nombreProducto},${prod.categoria},${prod.genero},${prod.talla},${prod.cantidadVendida},${prod.totalIngresos}\n`;
        });
        break;

      case 'rotacion':
        filename = 'rotacion_inventario.csv';
        csvContent = 'Código,Nombre,Categoría,Cantidad Vendida,Stock Actual,Tasa Rotación,Estado\n';
        datosReporte.data?.forEach(item => {
          csvContent += `${item.codigo},${item.nombre},${item.categoria},${item.cantidadVendida},${item.stockActual},${item.tasaRotacionMensual},${item.estado}\n`;
        });
        break;

      case 'categoria':
        filename = 'ventas_por_categoria.csv';
        csvContent = 'Categoría,Cantidad Vendida,Total Ingresos,% Ingresos\n';
        datosReporte.data?.forEach(cat => {
          csvContent += `${cat._id},${cat.cantidadVendida},${cat.totalIngresos},${cat.porcentajeIngresos}%\n`;
        });
        break;

      case 'genero':
        filename = 'ventas_por_genero.csv';
        csvContent = 'Género,Cantidad Vendida,Total Ingresos,% Ingresos\n';
        datosReporte.data?.forEach(gen => {
          csvContent += `${gen.genero},${gen.cantidadVendida},${gen.totalIngresos},${gen.porcentajeIngresos}%\n`;
        });
        break;

      case 'tallas':
        filename = 'ventas_por_talla.csv';
        csvContent = 'Talla,Género,Cantidad Vendida,Total Ingresos\n';
        datosReporte.data?.forEach(talla => {
          csvContent += `${talla.talla},${talla.genero},${talla.cantidadVendida},${talla.totalIngresos}\n`;
        });
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportarPDF = () => {
    if (!datosReporte) return;

    let contenido = '';
    
    switch (tipoReporte) {
      case 'dashboard':
        contenido = `
          <h1>Reporte Dashboard TRIX</h1>
          <p>Período: ${datosReporte.periodo?.inicio} - ${datosReporte.periodo?.fin}</p>
          <h2>KPIs de Ventas</h2>
          <table border="1" cellpadding="5">
            <tr><td>Total Ventas</td><td>${datosReporte.kpis?.ventas?.total || 0}</td></tr>
            <tr><td>Total Ingresos</td><td>${formatCurrency(datosReporte.kpis?.ventas?.ingresos)}</td></tr>
            <tr><td>Promedio Venta</td><td>${formatCurrency(datosReporte.kpis?.ventas?.promedio)}</td></tr>
          </table>
          <h2>Inventario</h2>
          <table border="1" cellpadding="5">
            <tr><td>Total Productos</td><td>${datosReporte.kpis?.inventario?.totalProductos || 0}</td></tr>
            <tr><td>Stock Bajo</td><td>${datosReporte.kpis?.inventario?.productosStockBajo || 0}</td></tr>
            <tr><td>Valor Total</td><td>${formatCurrency(datosReporte.kpis?.inventario?.valorTotal)}</td></tr>
          </table>
        `;
        break;

      case 'productos':
        contenido = `
          <h1>Productos Más Vendidos</h1>
          <p>Período: ${datosReporte.periodo?.inicio} - ${datosReporte.periodo?.fin}</p>
          <table border="1" cellpadding="5">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${datosReporte.data?.map(prod => `
                <tr>
                  <td>${prod.codigoProducto}</td>
                  <td>${prod.nombreProducto}</td>
                  <td>${prod.categoria}</td>
                  <td>${prod.cantidadVendida}</td>
                  <td>${formatCurrency(prod.totalIngresos)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;

      case 'rotacion':
        contenido = `
          <h1>Rotación de Inventario</h1>
          <p>Período: ${datosReporte.periodo?.inicio} - ${datosReporte.periodo?.fin}</p>
          <table border="1" cellpadding="5">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Vendido</th>
                <th>Stock</th>
                <th>Rotación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${datosReporte.data?.map(item => `
                <tr>
                  <td>${item.codigo}</td>
                  <td>${item.nombre}</td>
                  <td>${item.cantidadVendida}</td>
                  <td>${item.stockActual}</td>
                  <td>${item.tasaRotacionMensual}</td>
                  <td>${item.estado}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;
    }

    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`
      <html>
        <head>
          <title>Reporte TRIX</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #1e40af; color: white; padding: 10px; }
            td { padding: 8px; }
            tr:nth-child(even) { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          ${contenido}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    ventana.document.close();
  };

  const renderDashboard = () => {
    if (!datosReporte?.kpis) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">VENTAS</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{datosReporte.kpis.ventas.total}</p>
            <p className="text-sm text-slate-600 mt-2">{formatCurrency(datosReporte.kpis.ventas.ingresos)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">PROMEDIO</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(datosReporte.kpis.ventas.promedio)}</p>
            <p className="text-sm text-slate-600 mt-2">por venta</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">INVENTARIO</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{datosReporte.kpis.inventario.totalProductos}</p>
            <p className="text-sm text-slate-600 mt-2">{formatCurrency(datosReporte.kpis.inventario.valorTotal)}</p>
          </div>
        </div>

        {datosReporte.topProductos && datosReporte.topProductos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Top Productos</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {datosReporte.topProductos.map((prod, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{prod.nombreProducto}</p>
                        <p className="text-sm text-slate-600">{prod.cantidadVendida} unidades</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(prod.totalIngresos)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProductos = () => {
    if (!datosReporte?.data) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Productos Más Vendidos</h3>
          <p className="text-sm text-slate-600 mt-1">Total: {datosReporte.total} productos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Género</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Cantidad</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {datosReporte.data.map((prod, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{prod.codigoProducto}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{prod.nombreProducto}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{prod.categoria}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{prod.genero}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900">{prod.cantidadVendida}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900">{formatCurrency(prod.totalIngresos)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRotacion = () => {
    if (!datosReporte?.data) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Rotación de Inventario</h3>
          <p className="text-sm text-slate-600 mt-1">Período de {datosReporte.periodo?.dias} días</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Vendido</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Rotación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {datosReporte.data.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{item.codigo}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.nombre}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-900">{item.cantidadVendida}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-900">{item.stockActual}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900">{item.tasaRotacionMensual}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.estado === 'Alta rotación' ? 'bg-green-100 text-green-800' :
                      item.estado === 'Rotación media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCategoria = () => {
    if (!datosReporte?.data) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ventas por Categoría</h3>
          <div className="space-y-4">
            {datosReporte.data.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">{cat._id}</span>
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(cat.totalIngresos)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${cat.porcentajeIngresos}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-1">{cat.cantidadVendida} unidades • {cat.porcentajeIngresos}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Resumen</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Ingresos</span>
                <span className="font-bold text-slate-900">{formatCurrency(datosReporte.totalIngresos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Categorías</span>
                <span className="font-bold text-slate-900">{datosReporte.data.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Período</span>
                <span className="font-bold text-slate-900">{datosReporte.periodo?.inicio} - {datosReporte.periodo?.fin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reportes y Análisis</h1>
          <p className="text-slate-600">Genera y exporta reportes detallados de tu negocio</p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tipo de Reporte */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Reporte
              </label>
              <select
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dashboard">Dashboard General</option>
                <option value="ventas">Reporte de Ventas</option>
                <option value="productos">Productos Más Vendidos</option>
                <option value="rotacion">Rotación de Inventario</option>
                <option value="categoria">Ventas por Categoría</option>
                <option value="genero">Ventas por Género</option>
                <option value="tallas">Tallas Más Vendidas</option>
              </select>
            </div>

            {/* Botón Filtros */}
            <div className="flex items-end gap-3">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
                <ChevronDown className={`w-4 h-4 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={cargarReporte}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Cargando...' : 'Generar'}
              </button>

              <button
                onClick={exportarExcel}
                disabled={!datosReporte}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>

              <button
                onClick={exportarPDF}
                disabled={!datosReporte}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          {/* Filtros Expandibles */}
          {mostrarFiltros && (
            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {tipoReporte === 'ventas' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Agrupar por
                  </label>
                  <select
                    value={filtros.agruparPor}
                    onChange={(e) => setFiltros({...filtros, agruparPor: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dia">Día</option>
                    <option value="mes">Mes</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="sucursal">Sucursal</option>
                  </select>
                </div>
              )}

              {(tipoReporte === 'productos' || tipoReporte === 'tallas') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Género
                  </label>
                  <select
                    value={filtros.genero}
                    onChange={(e) => setFiltros({...filtros, genero: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              )}

              {tipoReporte === 'productos' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={filtros.categoria}
                      onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas</option>
                      <option value="Zapatos">Zapatos</option>
                      <option value="Ropa">Ropa</option>
                      <option value="Accesorios">Accesorios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Límite
                    </label>
                    <input
                      type="number"
                      value={filtros.limite}
                      onChange={(e) => setFiltros({...filtros, limite: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="5"
                      max="100"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Contenido del Reporte */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Generando reporte...</p>
          </div>
        ) : datosReporte ? (
          <div>
            {tipoReporte === 'dashboard' && renderDashboard()}
            {tipoReporte === 'productos' && renderProductos()}
            {tipoReporte === 'rotacion' && renderRotacion()}
            {tipoReporte === 'categoria' && renderCategoria()}
            {tipoReporte === 'genero' && renderCategoria()}
            {tipoReporte === 'tallas' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Tallas Más Vendidas</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Talla</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Género</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Cantidad</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {datosReporte.data?.map((talla, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{talla.talla}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{talla.genero}</td>
                          <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900">{talla.cantidadVendida}</td>
                          <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900">{formatCurrency(talla.totalIngresos)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tipoReporte === 'ventas' && datosReporte.datos && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Reporte de Ventas</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {datosReporte.periodo?.inicio} - {datosReporte.periodo?.fin}
                  </p>
                </div>
                
                {/* Estadísticas Generales */}
                <div className="p-6 border-b border-slate-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Total Ventas</p>
                      <p className="text-2xl font-bold text-slate-900">{datosReporte.estadisticas?.totalVentas || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Ingresos</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(datosReporte.estadisticas?.totalIngresos)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Promedio Venta</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(datosReporte.estadisticas?.promedioVenta)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Venta Más Alta</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(datosReporte.estadisticas?.ventaMasAlta)}</p>
                    </div>
                  </div>
                </div>

                {/* Datos Agrupados */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                          {filtros.agruparPor === 'dia' ? 'Fecha' : 
                           filtros.agruparPor === 'mes' ? 'Mes' :
                           filtros.agruparPor === 'vendedor' ? 'Vendedor' : 'Sucursal'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Cantidad Ventas</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total Ingresos</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Promedio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {datosReporte.datos.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {item._id || item.nombreVendedor || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-slate-900">{item.cantidadVentas}</td>
                          <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900">{formatCurrency(item.totalIngresos)}</td>
                          <td className="px-6 py-4 text-sm text-right text-slate-900">{formatCurrency(item.promedioVenta)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">No hay datos para mostrar</p>
            <p className="text-slate-500 text-sm">Selecciona un tipo de reporte y haz clic en "Generar"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesPage;