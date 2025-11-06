'use client';
import React, { useState, useEffect } from 'react';
import {
    Store, Plus, Search, Edit, Trash2, MapPin, Phone, Mail,
    User, Clock, AlertCircle, RefreshCw, X, Save, Building,
    TrendingUp, Package, DollarSign, BarChart3, ChevronLeft,
    CheckCircle, XCircle, Calendar, Users
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const GestionSucursales = () => {
    const [loading, setLoading] = useState(true);
    const [sucursales, setSucursales] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEstadisticas, setModalEstadisticas] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);
    const [comparativo, setComparativo] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [gerentes, setGerentes] = useState([]);

    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        direccion: {
            calle: '',
            ciudad: '',
            estado: '',
            codigoPostal: ''
        },
        contacto: {
            telefono: '',
            email: ''
        },
        gerenteId: '',
        horario: {
            apertura: '08:00',
            cierre: '20:00',
            diasLaborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        },
        capacidad: {
            metrosCuadrados: '',
            stockMaximo: ''
        },
        fechaApertura: '',
        observaciones: '',
        estado: 'Activa'
    });

    useEffect(() => {
        verificarAutenticacion();
        cargarDatos();
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
        } catch (error) {
            console.error('Error al parsear datos de usuario:', error);
            window.location.href = '/trix/login';
        }
    };

    const cargarDatos = async () => {
        setLoading(true);
        const token = localStorage.getItem('trix_token');

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [sucursalesRes, gerentesRes, comparativoRes] = await Promise.all([
                fetch(`${API_BASE_URL}/sucursales?limit=100`, { headers }),
                fetch(`${API_BASE_URL}/usuarios?rol=gerente`, { headers }).catch(() => null),
                fetch(`${API_BASE_URL}/sucursales/comparar-rendimiento?fechaInicio=${getFechaInicio()}&fechaFin=${getFechaFin()}`, { headers })
            ]);

            const sucursalesData = await sucursalesRes.json();
            const gerentesData = gerentesRes ? await gerentesRes.json() : null;
            const comparativoData = await comparativoRes.json();

            if (sucursalesData.success) {
                setSucursales(sucursalesData.data);
            }

            if (gerentesData?.success) {
                setGerentes(gerentesData.data);
            }

            if (comparativoData.success) {
                setComparativo(comparativoData.data);
            }

        } catch (error) {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar los datos');
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

    const abrirModal = (sucursal = null) => {
        if (sucursal) {
            setModoEdicion(true);
            setSucursalSeleccionada(sucursal);
            setFormulario({
                codigo: sucursal.codigo || '',
                nombre: sucursal.nombre || '',
                direccion: sucursal.direccion || {
                    calle: '',
                    ciudad: '',
                    estado: '',
                    codigoPostal: ''
                },
                contacto: sucursal.contacto || {
                    telefono: '',
                    email: ''
                },
                gerenteId: sucursal.gerente?._id || '',
                horario: sucursal.horario || {
                    apertura: '08:00',
                    cierre: '20:00',
                    diasLaborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                },
                capacidad: sucursal.capacidad || {
                    metrosCuadrados: '',
                    stockMaximo: ''
                },
                fechaApertura: sucursal.fechaApertura ? new Date(sucursal.fechaApertura).toISOString().split('T')[0] : '',
                observaciones: sucursal.observaciones || '',
                estado: sucursal.estado || 'Activa'
            });
        } else {
            setModoEdicion(false);
            setSucursalSeleccionada(null);
            setFormulario({
                codigo: '',
                nombre: '',
                direccion: {
                    calle: '',
                    ciudad: '',
                    estado: '',
                    codigoPostal: ''
                },
                contacto: {
                    telefono: '',
                    email: ''
                },
                gerenteId: '',
                horario: {
                    apertura: '08:00',
                    cierre: '20:00',
                    diasLaborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                },
                capacidad: {
                    metrosCuadrados: '',
                    stockMaximo: ''
                },
                fechaApertura: '',
                observaciones: '',
                estado: 'Activa'
            });
        }
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setSucursalSeleccionada(null);
        setModoEdicion(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('trix_token');
        const url = modoEdicion
            ? `${API_BASE_URL}/sucursales/${sucursalSeleccionada._id}`
            : `${API_BASE_URL}/sucursales`;

        const metodo = modoEdicion ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formulario)
            });

            const data = await response.json();

            if (data.success) {
                alert(modoEdicion ? 'Sucursal actualizada exitosamente' : 'Sucursal creada exitosamente');
                cerrarModal();
                cargarDatos();
            } else {
                alert(data.mensaje || 'Error al guardar la sucursal');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la sucursal');
        }
    };

    const eliminarSucursal = async (id) => {
        if (!confirm('¿Está seguro de desactivar esta sucursal?')) return;

        const token = localStorage.getItem('trix_token');

        try {
            const response = await fetch(`${API_BASE_URL}/sucursales/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                alert('Sucursal desactivada exitosamente');
                cargarDatos();
            } else {
                alert(data.mensaje || 'Error al desactivar la sucursal');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al desactivar la sucursal');
        }
    };

    const verEstadisticas = async (sucursal) => {
        setSucursalSeleccionada(sucursal);
        setModalEstadisticas(true);

        const token = localStorage.getItem('trix_token');

        try {
            const response = await fetch(
                `${API_BASE_URL}/sucursales/${sucursal._id}/estadisticas?fechaInicio=${getFechaInicio()}&fechaFin=${getFechaFin()}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const data = await response.json();

            if (data.success) {
                setEstadisticas(data);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const sucursalesFiltradas = sucursales.filter(sucursal =>
        sucursal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        sucursal.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        sucursal.direccion?.ciudad?.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">Cargando sucursales...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => window.location.href = '/trix/Gerente'}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <Store className="w-8 h-8 text-blue-600" />
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Sucursales</h1>
                                    <p className="text-sm text-slate-600">{sucursales.length} sucursales registradas</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={cargarDatos}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Actualizar
                            </button>

                            {usuario?.rol === 'admin' && (
                                <button
                                    onClick={() => abrirModal()}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Nueva Sucursal
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comparativo de rendimiento */}
                {comparativo && comparativo.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Comparativo de Rendimiento (últimos 90 días)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {comparativo.map((item, index) => (
                                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-slate-900">{item.sucursal}</h3>
                                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Ventas:</span>
                                            <span className="font-semibold">{item.ventas.total}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Ingresos:</span>
                                            <span className="font-semibold text-green-600">{formatCurrency(item.ventas.ingresos)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Productos:</span>
                                            <span className="font-semibold">{item.inventario.totalProductos}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Eficiencia:</span>
                                            <span className="font-semibold text-blue-600">{item.eficiencia}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barra de búsqueda */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, código o ciudad..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Lista de sucursales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sucursalesFiltradas.map((sucursal) => (
                        <div key={sucursal._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className={`h-2 ${sucursal.estado === 'Activa' ? 'bg-green-500' : 'bg-red-500'}`}></div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-slate-900">{sucursal.nombre}</h3>
                                            {sucursal.estado === 'Activa' ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 font-mono">{sucursal.codigo}</p>
                                    </div>
                                    <Store className="w-8 h-8 text-blue-600" />
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                                        <div className="text-sm text-slate-600">
                                            <p>{sucursal.direccion?.calle}</p>
                                            <p>{sucursal.direccion?.ciudad}, {sucursal.direccion?.estado}</p>
                                        </div>
                                    </div>

                                    {sucursal.contacto?.telefono && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">{sucursal.contacto.telefono}</span>
                                        </div>
                                    )}

                                    {sucursal.contacto?.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600 truncate">{sucursal.contacto.email}</span>
                                        </div>
                                    )}

                                    {sucursal.gerente && (
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">{sucursal.gerente.nombre}</span>
                                        </div>
                                    )}

                                    {sucursal.horario && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">
                                                {sucursal.horario.apertura} - {sucursal.horario.cierre}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => verEstadisticas(sucursal)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        Estadísticas
                                    </button>

                                    {usuario?.rol === 'admin' && (
                                        <>
                                            <button
                                                onClick={() => abrirModal(sucursal)}
                                                className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => eliminarSucursal(sucursal._id)}
                                                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sucursalesFiltradas.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No se encontraron sucursales</p>
                    </div>
                )}
            </div>

            {/* Modal de formulario */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {modoEdicion ? 'Editar Sucursal' : 'Nueva Sucursal'}
                                </h2>
                                <button onClick={cerrarModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información básica */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <Building className="w-5 h-5 text-blue-600" />
                                        Información Básica
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Email <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formulario.contacto.email}
                                            onChange={(e) => setFormulario({
                                                ...formulario,
                                                contacto: { ...formulario.contacto, email: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Horario */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Horario
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Apertura
                                            </label>
                                            <input
                                                type="time"
                                                value={formulario.horario.apertura}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    horario: { ...formulario.horario, apertura: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Cierre
                                            </label>
                                            <input
                                                type="time"
                                                value={formulario.horario.cierre}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    horario: { ...formulario.horario, cierre: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Días Laborales
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                                                <label key={dia} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formulario.horario.diasLaborales.includes(dia)}
                                                        onChange={(e) => {
                                                            const dias = e.target.checked
                                                                ? [...formulario.horario.diasLaborales, dia]
                                                                : formulario.horario.diasLaborales.filter(d => d !== dia);
                                                            setFormulario({
                                                                ...formulario,
                                                                horario: { ...formulario.horario, diasLaborales: dias }
                                                            });
                                                        }}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                    <span className="text-sm text-slate-700">{dia}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Capacidad */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-blue-600" />
                                        Capacidad
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Metros Cuadrados
                                        </label>
                                        <input
                                            type="number"
                                            value={formulario.capacidad.metrosCuadrados}
                                            onChange={(e) => setFormulario({
                                                ...formulario,
                                                capacidad: { ...formulario.capacidad, metrosCuadrados: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="150"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Stock Máximo (unidades)
                                        </label>
                                        <input
                                            type="number"
                                            value={formulario.capacidad.stockMaximo}
                                            onChange={(e) => setFormulario({
                                                ...formulario,
                                                capacidad: { ...formulario.capacidad, stockMaximo: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="5000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Observaciones
                                        </label>
                                        <textarea
                                            value={formulario.observaciones}
                                            onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="4"
                                            placeholder="Notas adicionales sobre la sucursal..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    {modoEdicion ? 'Actualizar' : 'Crear'} Sucursal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de estadísticas */}
            {modalEstadisticas && sucursalSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Estadísticas - {sucursalSeleccionada.nombre}
                                    </h2>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Código: {sucursalSeleccionada.codigo}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setModalEstadisticas(false);
                                        setEstadisticas(null);
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {estadisticas ? (
                                <div className="space-y-6">
                                    {/* Período */}
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Período: {estadisticas.periodo?.inicio} - {estadisticas.periodo?.fin}</span>
                                    </div>

                                    {/* KPIs de Inventario */}
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <Package className="w-5 h-5 text-blue-600" />
                                            Inventario
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <p className="text-sm text-slate-600 mb-1">Productos</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {estadisticas.inventario?.totalProductos || 0}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                <p className="text-sm text-slate-600 mb-1">Unidades</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {estadisticas.inventario?.totalUnidades || 0}
                                                </p>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                                <p className="text-sm text-slate-600 mb-1">Valor Total</p>
                                                <p className="text-xl font-bold text-purple-600">
                                                    {formatCurrency(estadisticas.inventario?.valorInventario || 0)}
                                                </p>
                                            </div>
                                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                                <p className="text-sm text-slate-600 mb-1">Stock Bajo</p>
                                                <p className="text-2xl font-bold text-amber-600">
                                                    {estadisticas.inventario?.productosStockBajo || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* KPIs de Ventas */}
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            Ventas
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                <p className="text-sm text-slate-600 mb-1">Total Ventas</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {estadisticas.ventas?.totalVentas || 0}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <p className="text-sm text-slate-600 mb-1">Ingresos</p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    {formatCurrency(estadisticas.ventas?.totalIngresos || 0)}
                                                </p>
                                            </div>
                                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                                <p className="text-sm text-slate-600 mb-1">Promedio Venta</p>
                                                <p className="text-xl font-bold text-indigo-600">
                                                    {formatCurrency(estadisticas.ventas?.promedioVenta || 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Productos */}
                                    {estadisticas.topProductos && estadisticas.topProductos.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                                Top 5 Productos Más Vendidos
                                            </h3>
                                            <div className="space-y-3">
                                                {estadisticas.topProductos.map((producto, index) => (
                                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                                                <span className="text-purple-600 font-bold text-sm">#{index + 1}</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-slate-900 truncate">
                                                                    {producto.nombreProducto}
                                                                </p>
                                                                <p className="text-sm text-slate-600">
                                                                    {producto.cantidadVendida} unidades vendidas
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <p className="font-bold text-green-600">
                                                                {formatCurrency(producto.totalIngresos)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={() => {
                                    setModalEstadisticas(false);
                                    setEstadisticas(null);
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
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

export default GestionSucursales;
