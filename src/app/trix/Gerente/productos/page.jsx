'use client';
import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, Edit2, Trash2, 
  AlertTriangle, TrendingUp, DollarSign, X, Save,
  ChevronLeft, RefreshCw, Eye, ShoppingBag, BarChart3
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Cargando productos...</p>
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
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Productos</h1>
                <p className="text-slate-600 text-sm mt-1">{estadisticas.activos} productos activos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={cargarProductos}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
              
              <button
                onClick={abrirModalCrear}
                className="button-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Producto
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Productos</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{estadisticas.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Stock Bajo</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{estadisticas.stockBajo}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(estadisticas.valorTotal)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Productos Activos</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{estadisticas.activos}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="glass-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las Categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los Géneros</option>
              {generos.map(gen => (
                <option key={gen} value={gen}>{gen}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Talla</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Precio</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {productosFiltrados.map((producto) => (
                  <tr key={producto._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-slate-900">{producto.codigo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{producto.nombre}</p>
                        <p className="text-xs text-slate-500">{producto.genero}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-700">{producto.categoria}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                        {producto.talla}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${producto.alertaStock ? 'text-amber-600' : 'text-green-600'}`}>
                          {producto.stockActual}
                        </span>
                        {producto.alertaStock && (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{formatCurrency(producto.precioVenta)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setProductoSeleccionado(producto);
                            setModalVer(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => abrirModalEditar(producto)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {productosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={() => setModalAbierto(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formulario.codigo}
                    onChange={handleInputChange}
                    disabled={modoEdicion}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Ej: PROD001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    rows="2"
                    placeholder="Descripción del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
                  <select
                    name="categoria"
                    value={formulario.categoria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Género *</label>
                  <select
                    name="genero"
                    value={formulario.genero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    {generos.map(gen => (
                      <option key={gen} value={gen}>{gen}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Talla *</label>
                  <select
                    name="talla"
                    value={formulario.talla}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    {tallas.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formulario.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Ej: Azul marino"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Compra *</label>
                  <input
                    type="number"
                    name="precioCompra"
                    value={formulario.precioCompra}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Venta *</label>
                  <input
                    type="number"
                    name="precioVenta"
                    value={formulario.precioVenta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Actual *</label>
                  <input
                    type="number"
                    name="stockActual"
                    value={formulario.stockActual}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    name="stockMinimo"
                    value={formulario.stockMinimo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
                  <input
                    type="text"
                    name="proveedor"
                    value={formulario.proveedor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Nombre del proveedor"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={guardarProducto}
                  className="button-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {modoEdicion ? 'Actualizar' : 'Crear'} Producto
                </button>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Detalles del Producto</h2>
              <button
                onClick={() => setModalVer(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Código</p>
                  <p className="text-2xl font-bold text-slate-900 font-mono">{productoSeleccionado.codigo}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-slate-600">Nombre</p>
                  <p className="text-lg font-semibold text-slate-900">{productoSeleccionado.nombre}</p>
                </div>

                {productoSeleccionado.descripcion && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600">Descripción</p>
                    <p className="text-slate-900">{productoSeleccionado.descripcion}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-600">Categoría</p>
                  <p className="font-semibold text-slate-900">{productoSeleccionado.categoria}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Género</p>
                  <p className="font-semibold text-slate-900">{productoSeleccionado.genero}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Talla</p>
                  <p className="font-semibold text-slate-900">{productoSeleccionado.talla}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Color</p>
                  <p className="font-semibold text-slate-900">{productoSeleccionado.color || 'N/A'}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">Precio Compra</p>
                  <p className="text-xl font-bold text-green-900">{formatCurrency(productoSeleccionado.precioCompra)}</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">Precio Venta</p>
                  <p className="text-xl font-bold text-blue-900">{formatCurrency(productoSeleccionado.precioVenta)}</p>
                </div>

                <div className={`p-3 rounded-lg ${productoSeleccionado.alertaStock ? 'bg-amber-50' : 'bg-purple-50'}`}>
                  <p className={`text-sm ${productoSeleccionado.alertaStock ? 'text-amber-700' : 'text-purple-700'}`}>Stock Actual</p>
                  <p className={`text-xl font-bold ${productoSeleccionado.alertaStock ? 'text-amber-900' : 'text-purple-900'}`}>
                    {productoSeleccionado.stockActual} unidades
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">Stock Mínimo</p>
                  <p className="text-xl font-bold text-slate-900">{productoSeleccionado.stockMinimo} unidades</p>
                </div>

                {productoSeleccionado.proveedor && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600">Proveedor</p>
                    <p className="font-semibold text-slate-900">{productoSeleccionado.proveedor}</p>
                  </div>
                )}

                <div className="col-span-2 bg-indigo-50 p-3 rounded-lg">
                  <p className="text-sm text-indigo-700">Margen de Ganancia</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {productoSeleccionado.precioCompra > 0 
                      ? ((productoSeleccionado.precioVenta - productoSeleccionado.precioCompra) / productoSeleccionado.precioCompra * 100).toFixed(2)
                      : 0}%
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-slate-600">Estado</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    productoSeleccionado.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {productoSeleccionado.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setModalVer(false)}
                className="w-full mt-6 button-secondary"
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