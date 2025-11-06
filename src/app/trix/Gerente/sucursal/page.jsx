'use client';
import React, { useState, useEffect } from 'react';
import {
    Store, Plus, Search, Edit, Trash2, MapPin, Phone, Mail,
    User, Clock, AlertCircle, RefreshCw, X, Save, Building,
    TrendingUp, Package, DollarSign, BarChart3, ChevronLeft,
    CheckCircle, XCircle, Calendar, Users
} from 'lucide-react';

const API_BASE_URL = 'https://backend-hackathon-t4q9.onrender.com/api';

const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '24px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    mainWrapper: {
        maxWidth: '1400px',
        margin: '0 auto'
    },
    headerCard: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px rgba(59, 130, 246, 0.1)',
        position: 'relative',
        overflow: 'hidden'
    },
    headerGlow: {
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
    },
    headerContent: {
        position: 'relative',
        zIndex: 1
    },
    headerTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    backButton: {
        padding: '12px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: '#3b82f6'
    },
    iconWrapper: {
        width: '56px',
        height: '56px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '4px',
        letterSpacing: '-0.5px'
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: '500'
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
    },
    refreshButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: 'rgba(148, 163, 184, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '12px',
        color: '#cbd5e1',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: '600'
    },
    primaryButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: 'none',
        borderRadius: '12px',
        color: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
    },
    comparativeCard: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 58, 138, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    comparativeTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    comparativeGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px'
    },
    comparativeItem: {
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
        padding: '20px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    },
    comparativeHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    comparativeName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#ffffff'
    },
    rankBadge: {
        padding: '4px 12px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#ffffff'
    },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(59, 130, 246, 0.1)'
    },
    statsLabel: {
        color: '#94a3b8',
        fontSize: '13px'
    },
    statsValue: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600'
    },
    searchCard: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 58, 138, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    searchWrapper: {
        position: 'relative'
    },
    searchIcon: {
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#3b82f6',
        zIndex: 1
    },
    searchInput: {
        width: '100%',
        padding: '14px 14px 14px 48px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease'
    },
    branchGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px'
    },
    branchCard: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(30, 58, 138, 0.08) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        position: 'relative'
    },
    statusBar: {
        height: '4px',
        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
    },
    statusBarInactive: {
        height: '4px',
        background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
    },
    branchContent: {
        padding: '24px'
    },
    branchHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },
    branchInfo: {
        flex: 1
    },
    branchNameRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px'
    },
    branchName: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: '-0.3px'
    },
    branchCode: {
        fontSize: '13px',
        color: '#64748b',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: '500'
    },
    branchIcon: {
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
    },
    infoSection: {
        marginBottom: '20px'
    },
    infoRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '12px'
    },
    infoIcon: {
        color: '#3b82f6',
        marginTop: '2px',
        flexShrink: 0
    },
    infoText: {
        color: '#cbd5e1',
        fontSize: '13px',
        lineHeight: '1.6'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    statsButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '10px',
        color: '#3b82f6',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '13px',
        fontWeight: '600'
    },
    editButton: {
        padding: '12px',
        background: 'rgba(148, 163, 184, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '10px',
        color: '#cbd5e1',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    deleteButton: {
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        color: '#ef4444',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    emptyState: {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 58, 138, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '20px',
        padding: '64px 32px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    emptyIcon: {
        width: '64px',
        height: '64px',
        margin: '0 auto 16px',
        color: '#475569'
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: '16px'
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 1000,
        overflowY: 'auto'
    },
    modalContent: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '24px',
        maxWidth: '900px',
        width: '100%',
        margin: '32px auto',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 100px rgba(59, 130, 246, 0.2)'
    },
    modalHeader: {
        padding: '32px',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#ffffff'
    },
    closeButton: {
        padding: '8px',
        background: 'rgba(148, 163, 184, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: '#cbd5e1'
    },
    modalBody: {
        padding: '32px',
        maxHeight: 'calc(90vh - 200px)',
        overflowY: 'auto'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px'
    },
    formSection: {
        marginBottom: '24px'
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#cbd5e1',
        marginBottom: '8px'
    },
    required: {
        color: '#ef4444'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        cursor: 'pointer'
    },
    textarea: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    checkboxGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px'
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        background: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '13px',
        color: '#cbd5e1'
    },
    checkbox: {
        width: '16px',
        height: '16px',
        accentColor: '#3b82f6'
    },
    modalFooter: {
        padding: '24px 32px',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
    },
    cancelButton: {
        padding: '12px 24px',
        background: 'rgba(148, 163, 184, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '10px',
        color: '#cbd5e1',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: '600'
    },
    submitButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: 'none',
        borderRadius: '10px',
        color: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
    },
    loadingContainer: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingContent: {
        textAlign: 'center'
    },
    spinner: {
        width: '48px',
        height: '48px',
        color: '#3b82f6',
        margin: '0 auto 16px',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        color: '#94a3b8',
        fontSize: '18px',
        fontWeight: '600'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    statCard: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '16px',
        padding: '20px'
    },
    statLabel: {
        fontSize: '13px',
        color: '#94a3b8',
        marginBottom: '8px'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#3b82f6'
    },
    topProductsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    productItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px'
    },
    productLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
        minWidth: 0
    },
    productRank: {
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '700',
        color: '#ffffff',
        flexShrink: 0
    },
    productInfo: {
        flex: 1,
        minWidth: 0
    },
    productName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    productQuantity: {
        fontSize: '12px',
        color: '#94a3b8'
    },
    productRevenue: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#10b981',
        marginLeft: '16px',
        flexShrink: 0
    }
};

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
            <div style={styles.loadingContainer}>
                <div style={styles.loadingContent}>
                    <RefreshCw style={styles.spinner} />
                    <p style={styles.loadingText}>Cargando sucursales...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                input:focus, textarea:focus, select:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                }
                
                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
                }
                
                button:active {
                    transform: translateY(0);
                }
                
                *::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                *::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.3);
                    border-radius: 4px;
                }
                
                *::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.5);
                    border-radius: 4px;
                }
                
                *::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.7);
                }
            `}</style>
            
            <div style={styles.mainWrapper}>
                {/* Header */}
                <div style={styles.headerCard}>
                    <div style={styles.headerGlow}></div>
                    <div style={styles.headerContent}>
                        <div style={styles.headerTop}>
                            <div style={styles.headerLeft}>
                                <button
                                    onClick={() => window.location.href = '/trix/Gerente'}
                                    style={styles.backButton}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div style={styles.iconWrapper}>
                                    <Store size={28} color="#ffffff" />
                                </div>
                                <div>
                                    <h1 style={styles.title}>Gestión de Sucursales</h1>
                                    <p style={styles.subtitle}>{sucursales.length} sucursales registradas</p>
                                </div>
                            </div>

                            <div style={styles.buttonGroup}>
                                <button onClick={cargarDatos} style={styles.refreshButton}>
                                    <RefreshCw size={16} />
                                    Actualizar
                                </button>

                                {usuario?.rol === 'admin' && (
                                    <button onClick={() => abrirModal()} style={styles.primaryButton}>
                                        <Plus size={16} />
                                        Nueva Sucursal
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparativo de rendimiento */}
                {comparativo && comparativo.length > 0 && (
                    <div style={styles.comparativeCard}>
                        <h2 style={styles.comparativeTitle}>
                            <BarChart3 size={20} />
                            Comparativo de Rendimiento (últimos 90 días)
                        </h2>
                        <div style={styles.comparativeGrid}>
                            {comparativo.map((item, index) => (
                                <div key={index} style={styles.comparativeItem}>
                                    <div style={styles.comparativeHeader}>
                                        <h3 style={styles.comparativeName}>{item.sucursal}</h3>
                                        <span style={styles.rankBadge}>#{index + 1}</span>
                                    </div>
                                    <div>
                                        <div style={styles.statsRow}>
                                            <span style={styles.statsLabel}>Ventas:</span>
                                            <span style={styles.statsValue}>{item.ventas.total}</span>
                                        </div>
                                        <div style={styles.statsRow}>
                                            <span style={styles.statsLabel}>Ingresos:</span>
                                            <span style={{...styles.statsValue, color: '#10b981'}}>{formatCurrency(item.ventas.ingresos)}</span>
                                        </div>
                                        <div style={styles.statsRow}>
                                            <span style={styles.statsLabel}>Productos:</span>
                                            <span style={styles.statsValue}>{item.inventario.totalProductos}</span>
                                        </div>
                                        <div style={{...styles.statsRow, borderBottom: 'none'}}>
                                            <span style={styles.statsLabel}>Eficiencia:</span>
                                            <span style={{...styles.statsValue, color: '#3b82f6'}}>{item.eficiencia}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barra de búsqueda */}
                <div style={styles.searchCard}>
                    <div style={styles.searchWrapper}>
                        <Search style={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, código o ciudad..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Lista de sucursales */}
                <div style={styles.branchGrid}>
                    {sucursalesFiltradas.map((sucursal) => (
                        <div key={sucursal._id} style={styles.branchCard}>
                            <div style={sucursal.estado === 'Activa' ? styles.statusBar : styles.statusBarInactive}></div>

                            <div style={styles.branchContent}>
                                <div style={styles.branchHeader}>
                                    <div style={styles.branchInfo}>
                                        <div style={styles.branchNameRow}>
                                            <h3 style={styles.branchName}>{sucursal.nombre}</h3>
                                            {sucursal.estado === 'Activa' ? (
                                                <CheckCircle size={16} color="#10b981" />
                                            ) : (
                                                <XCircle size={16} color="#ef4444" />
                                            )}
                                        </div>
                                        <p style={styles.branchCode}>{sucursal.codigo}</p>
                                    </div>
                                    <div style={styles.branchIcon}>
                                        <Store size={24} color="#ffffff" />
                                    </div>
                                </div>

                                <div style={styles.infoSection}>
                                    <div style={styles.infoRow}>
                                        <MapPin size={16} style={styles.infoIcon} />
                                        <div style={styles.infoText}>
                                            <p>{sucursal.direccion?.calle}</p>
                                            <p>{sucursal.direccion?.ciudad}, {sucursal.direccion?.estado}</p>
                                        </div>
                                    </div>

                                    {sucursal.contacto?.telefono && (
                                        <div style={styles.infoRow}>
                                            <Phone size={16} style={styles.infoIcon} />
                                            <span style={styles.infoText}>{sucursal.contacto.telefono}</span>
                                        </div>
                                    )}

                                    {sucursal.contacto?.email && (
                                        <div style={styles.infoRow}>
                                            <Mail size={16} style={styles.infoIcon} />
                                            <span style={styles.infoText}>{sucursal.contacto.email}</span>
                                        </div>
                                    )}

                                    {sucursal.gerente && (
                                        <div style={styles.infoRow}>
                                            <User size={16} style={styles.infoIcon} />
                                            <span style={styles.infoText}>{sucursal.gerente.nombre}</span>
                                        </div>
                                    )}

                                    {sucursal.horario && (
                                        <div style={styles.infoRow}>
                                            <Clock size={16} style={styles.infoIcon} />
                                            <span style={styles.infoText}>
                                                {sucursal.horario.apertura} - {sucursal.horario.cierre}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.actionButtons}>
                                    <button
                                        onClick={() => verEstadisticas(sucursal)}
                                        style={styles.statsButton}
                                    >
                                        <TrendingUp size={16} />
                                        Estadísticas
                                    </button>

                                    {usuario?.rol === 'admin' && (
                                        <>
                                            <button
                                                onClick={() => abrirModal(sucursal)}
                                                style={styles.editButton}
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                onClick={() => eliminarSucursal(sucursal._id)}
                                                style={styles.deleteButton}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sucursalesFiltradas.length === 0 && (
                    <div style={styles.emptyState}>
                        <AlertCircle style={styles.emptyIcon} />
                        <p style={styles.emptyText}>No se encontraron sucursales</p>
                    </div>
                )}
            </div>

            {/* Modal de formulario */}
            {modalAbierto && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                {modoEdicion ? 'Editar Sucursal' : 'Nueva Sucursal'}
                            </h2>
                            <button onClick={cerrarModal} style={styles.closeButton}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={styles.modalBody}>
                                <div style={styles.formGrid}>
                                    {/* Información básica */}
                                    <div style={styles.formSection}>
                                        <h3 style={styles.sectionTitle}>
                                            <Building size={20} color="#3b82f6" />
                                            Información Básica
                                        </h3>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Código <span style={styles.required}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formulario.codigo}
                                                onChange={(e) => setFormulario({...formulario, codigo: e.target.value})}
                                                style={styles.input}
                                                placeholder="SUC-001"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Nombre <span style={styles.required}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formulario.nombre}
                                                onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                                                style={styles.input}
                                                placeholder="Sucursal Centro"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Gerente
                                            </label>
                                            <select
                                                value={formulario.gerenteId}
                                                onChange={(e) => setFormulario({...formulario, gerenteId: e.target.value})}
                                                style={styles.select}
                                            >
                                                <option value="">Seleccionar gerente</option>
                                                {gerentes.map(gerente => (
                                                    <option key={gerente._id} value={gerente._id}>
                                                        {gerente.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Estado
                                            </label>
                                            <select
                                                value={formulario.estado}
                                                onChange={(e) => setFormulario({...formulario, estado: e.target.value})}
                                                style={styles.select}
                                            >
                                                <option value="Activa">Activa</option>
                                                <option value="Inactiva">Inactiva</option>
                                                <option value="En construcción">En construcción</option>
                                            </select>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Fecha de Apertura
                                            </label>
                                            <input
                                                type="date"
                                                value={formulario.fechaApertura}
                                                onChange={(e) => setFormulario({...formulario, fechaApertura: e.target.value})}
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div style={styles.formSection}>
                                        <h3 style={styles.sectionTitle}>
                                            <MapPin size={20} color="#3b82f6" />
                                            Dirección
                                        </h3>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Calle <span style={styles.required}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formulario.direccion.calle}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    direccion: {...formulario.direccion, calle: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="Calle 123 #45-67"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Ciudad <span style={styles.required}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formulario.direccion.ciudad}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    direccion: {...formulario.direccion, ciudad: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="Bogotá"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Estado/Departamento <span style={styles.required}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formulario.direccion.estado}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    direccion: {...formulario.direccion, estado: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="Cundinamarca"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Código Postal
                                            </label>
                                            <input
                                                type="text"
                                                value={formulario.direccion.codigoPostal}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    direccion: {...formulario.direccion, codigoPostal: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="110111"
                                            />
                                        </div>
                                    </div>

                                    {/* Contacto */}
                                    <div style={styles.formSection}>
                                        <h3 style={styles.sectionTitle}>
                                            <Phone size={20} color="#3b82f6" />
                                            Contacto
                                        </h3>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Teléfono <span style={styles.required}>*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formulario.contacto.telefono}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    contacto: {...formulario.contacto, telefono: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="+57 300 123 4567"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>
                                                Email <span style={styles.required}>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formulario.contacto.email}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    contacto: {...formulario.contacto, email: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="sucursal@empresa.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Horario */}
                                    <div style={styles.formSection}>
                                        <h3 style={styles.sectionTitle}>
                                            <Clock size={20} color="#3b82f6" />
                                            Horario
                                        </h3>

                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Apertura</label>
                                                <input
                                                    type="time"
                                                    value={formulario.horario.apertura}
                                                    onChange={(e) => setFormulario({
                                                        ...formulario,
                                                        horario: {...formulario.horario, apertura: e.target.value}
                                                    })}
                                                    style={styles.input}
                                                />
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Cierre</label>
                                                <input
                                                    type="time"
                                                    value={formulario.horario.cierre}
                                                    onChange={(e) => setFormulario({
                                                        ...formulario,
                                                        horario: {...formulario.horario, cierre: e.target.value}
                                                    })}
                                                    style={styles.input}
                                                />
                                            </div>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Días Laborales</label>
                                            <div style={styles.checkboxGrid}>
                                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                                                    <label key={dia} style={styles.checkboxLabel}>
                                                        <input
                                                            type="checkbox"
                                                            checked={formulario.horario.diasLaborales.includes(dia)}
                                                            onChange={(e) => {
                                                                const dias = e.target.checked
                                                                    ? [...formulario.horario.diasLaborales, dia]
                                                                    : formulario.horario.diasLaborales.filter(d => d !== dia);
                                                                setFormulario({
                                                                    ...formulario,
                                                                    horario: {...formulario.horario, diasLaborales: dias}
                                                                });
                                                            }}
                                                            style={styles.checkbox}
                                                        />
                                                        <span>{dia}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Capacidad */}
                                    <div style={styles.formSection}>
                                        <h3 style={styles.sectionTitle}>
                                            <Package size={20} color="#3b82f6" />
                                            Capacidad
                                        </h3>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Metros Cuadrados</label>
                                            <input
                                                type="number"
                                                value={formulario.capacidad.metrosCuadrados}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    capacidad: {...formulario.capacidad, metrosCuadrados: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="150"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Stock Máximo (unidades)</label>
                                            <input
                                                type="number"
                                                value={formulario.capacidad.stockMaximo}
                                                onChange={(e) => setFormulario({
                                                    ...formulario,
                                                    capacidad: {...formulario.capacidad, stockMaximo: e.target.value}
                                                })}
                                                style={styles.input}
                                                placeholder="5000"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Observaciones</label>
                                            <textarea
                                                value={formulario.observaciones}
                                                onChange={(e) => setFormulario({...formulario, observaciones: e.target.value})}
                                                style={styles.textarea}
                                                rows="4"
                                                placeholder="Notas adicionales sobre la sucursal..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.modalFooter}>
                                <button type="button" onClick={cerrarModal} style={styles.cancelButton}>
                                    Cancelar
                                </button>
                                <button type="submit" style={styles.submitButton}>
                                    <Save size={16} />
                                    {modoEdicion ? 'Actualizar' : 'Crear'} Sucursal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de estadísticas */}
            {modalEstadisticas && sucursalSeleccionada && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h2 style={styles.modalTitle}>
                                    Estadísticas - {sucursalSeleccionada.nombre}
                                </h2>
                                <p style={{...styles.subtitle, marginTop: '4px'}}>
                                    Código: {sucursalSeleccionada.codigo}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setModalEstadisticas(false);
                                    setEstadisticas(null);
                                }}
                                style={styles.closeButton}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            {estadisticas ? (
                                <div>
                                    {/* Período */}
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#94a3b8', fontSize: '13px'}}>
                                        <Calendar size={16} />
                                        <span>Período: {estadisticas.periodo?.inicio} - {estadisticas.periodo?.fin}</span>
                                    </div>

                                    {/* KPIs de Inventario */}
                                    <div style={{marginBottom: '32px'}}>
                                        <h3 style={styles.sectionTitle}>
                                            <Package size={20} color="#3b82f6" />
                                            Inventario
                                        </h3>
                                        <div style={styles.statsGrid}>
                                            <div style={{...styles.statCard, borderColor: '#3b82f6'}}>
                                                <p style={styles.statLabel}>Productos</p>
                                                <p style={{...styles.statValue, color: '#3b82f6'}}>
                                                    {estadisticas.inventario?.totalProductos || 0}
                                                </p>
                                            </div>
                                            <div style={{...styles.statCard, background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981'}}>
                                                <p style={styles.statLabel}>Unidades</p>
                                                <p style={{...styles.statValue, color: '#10b981'}}>
                                                    {estadisticas.inventario?.totalUnidades || 0}
                                                </p>
                                            </div>
                                            <div style={{...styles.statCard, background: 'rgba(139, 92, 246, 0.1)', borderColor: '#8b5cf6'}}>
                                                <p style={styles.statLabel}>Valor Total</p>
                                                <p style={{...styles.statValue, color: '#8b5cf6', fontSize: '20px'}}>
                                                    {formatCurrency(estadisticas.inventario?.valorInventario || 0)}
                                                </p>
                                            </div>
                                            <div style={{...styles.statCard, background: 'rgba(251, 191, 36, 0.1)', borderColor: '#fbbf24'}}>
                                                <p style={styles.statLabel}>Disponibilidad</p>
                                                <p style={{...styles.statValue, color: '#fbbf24'}}>
                                                    {estadisticas.inventario?.disponibilidad || 0}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* KPIs de Ventas */}
                                    <div style={{marginBottom: '32px'}}>
                                        <h3 style={styles.sectionTitle}>
                                            <DollarSign size={20} color="#10b981" />
                                            Ventas
                                        </h3>
                                        <div style={styles.statsGrid}>
                                            <div style={{...styles.statCard, background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981'}}>
                                                <p style={styles.statLabel}>Total Ventas</p>
                                                <p style={{...styles.statValue, color: '#10b981'}}>
                                                    {estadisticas.ventas?.total || 0}
                                                </p>
                                            </div>
                                            <div style={{...styles.statCard, background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981'}}>
                                                <p style={styles.statLabel}>Ingresos</p>
                                                <p style={{...styles.statValue, color: '#10b981', fontSize: '20px'}}>
                                                    {formatCurrency(estadisticas.ventas?.ingresos || 0)}
                                                </p>
                                            </div>
                                            <div style={{...styles.statCard, background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6'}}>
                                                <p style={styles.statLabel}>Ticket Promedio</p>
                                                <p style={{...styles.statValue, color: '#3b82f6', fontSize: '18px'}}>
                                                    {formatCurrency(estadisticas.ventas?.ticketPromedio || 0)}
                                                </p>
                                            </div>
                                            <div style={{...styles.statCard, borderColor: '#8b5cf6'}}>
                                                <p style={styles.statLabel}>Clientes</p>
                                                <p style={{...styles.statValue, color: '#8b5cf6'}}>
                                                    {estadisticas.ventas?.clientesAtendidos || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Productos más vendidos */}
                                    {estadisticas.productosTopVentas && estadisticas.productosTopVentas.length > 0 && (
                                        <div style={{marginBottom: '32px'}}>
                                            <h3 style={styles.sectionTitle}>
                                                <TrendingUp size={20} color="#10b981" />
                                                Top 10 Productos Más Vendidos
                                            </h3>
                                            <div style={styles.topProductsList}>
                                                {estadisticas.productosTopVentas.slice(0, 10).map((producto, index) => (
                                                    <div key={index} style={styles.productItem}>
                                                        <div style={styles.productLeft}>
                                                            <div style={styles.productRank}>
                                                                {index + 1}
                                                            </div>
                                                            <div style={styles.productInfo}>
                                                                <p style={styles.productName}>
                                                                    {producto.nombre}
                                                                </p>
                                                                <p style={styles.productQuantity}>
                                                                    {producto.cantidad} unidades vendidas
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div style={styles.productRevenue}>
                                                            {formatCurrency(producto.ingresos)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empleados */}
                                    {estadisticas.empleados && (
                                        <div>
                                            <h3 style={styles.sectionTitle}>
                                                <Users size={20} color="#3b82f6" />
                                                Personal
                                            </h3>
                                            <div style={styles.statsGrid}>
                                                <div style={styles.statCard}>
                                                    <p style={styles.statLabel}>Total Empleados</p>
                                                    <p style={{...styles.statValue, color: '#3b82f6'}}>
                                                        {estadisticas.empleados.total || 0}
                                                    </p>
                                                </div>
                                                <div style={{...styles.statCard, background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981'}}>
                                                    <p style={styles.statLabel}>Activos</p>
                                                    <p style={{...styles.statValue, color: '#10b981'}}>
                                                        {estadisticas.empleados.activos || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{textAlign: 'center', padding: '40px'}}>
                                    <RefreshCw style={{...styles.spinner, margin: '0 auto 16px'}} />
                                    <p style={{color: '#94a3b8'}}>Cargando estadísticas...</p>
                                </div>
                            )}
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                onClick={() => {
                                    setModalEstadisticas(false);
                                    setEstadisticas(null);
                                }}
                                style={styles.cancelButton}
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