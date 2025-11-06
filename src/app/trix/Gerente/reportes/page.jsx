'use client';
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Download, Calendar, Filter, FileText, 
  BarChart3, PieChart, Package, Users, DollarSign,
  ChevronDown, RefreshCw, FileSpreadsheet, X, Check,
  AlertCircle, ArrowUp, ArrowDown, ShoppingCart, Activity,
  Zap, Target, TrendingDown, Layers, Box, Star
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
    
    // Simulación de datos de prueba
    setTimeout(() => {
      if (tipoReporte === 'dashboard') {
        setDatosReporte({
          success: true,
          kpis: {
            ventas: {
              total: 156,
              ingresos: 48750000,
              promedio: 312500
            },
            inventario: {
              totalProductos: 450,
              productosStockBajo: 23,
              valorTotal: 125000000
            }
          },
          topProductos: [
            { nombreProducto: 'Zapatos Deportivos Nike', categoria: 'Zapatos', cantidadVendida: 45, totalIngresos: 13500000 },
            { nombreProducto: 'Camisa Formal', categoria: 'Ropa', cantidadVendida: 38, totalIngresos: 9500000 },
            { nombreProducto: 'Jeans Levi\'s', categoria: 'Ropa', cantidadVendida: 32, totalIngresos: 8000000 },
            { nombreProducto: 'Reloj Casio', categoria: 'Accesorios', cantidadVendida: 28, totalIngresos: 7000000 },
            { nombreProducto: 'Bolso de Cuero', categoria: 'Accesorios', cantidadVendida: 25, totalIngresos: 6250000 }
          ],
          periodo: {
            inicio: filtros.fechaInicio,
            fin: filtros.fechaFin
          }
        });
      } else if (tipoReporte === 'productos') {
        setDatosReporte({
          success: true,
          data: [
            { codigoProducto: 'NIKE-001', nombreProducto: 'Zapatos Deportivos Nike', categoria: 'Zapatos', genero: 'Hombre', cantidadVendida: 45, totalIngresos: 13500000 },
            { codigoProducto: 'LEV-002', nombreProducto: 'Jeans Levi\'s', categoria: 'Ropa', genero: 'Hombre', cantidadVendida: 32, totalIngresos: 8000000 },
            { codigoProducto: 'FORM-003', nombreProducto: 'Camisa Formal', categoria: 'Ropa', genero: 'Hombre', cantidadVendida: 38, totalIngresos: 9500000 }
          ],
          total: 3,
          periodo: { inicio: filtros.fechaInicio, fin: filtros.fechaFin }
        });
      } else if (tipoReporte === 'rotacion') {
        setDatosReporte({
          success: true,
          data: [
            { codigo: 'NIKE-001', nombre: 'Zapatos Nike', cantidadVendida: 45, stockActual: 25, tasaRotacionMensual: '1.8', estado: 'Alta rotación' },
            { codigo: 'LEV-002', nombre: 'Jeans Levi\'s', cantidadVendida: 32, stockActual: 40, tasaRotacionMensual: '0.8', estado: 'Rotación media' },
            { codigo: 'FORM-003', nombre: 'Camisa Formal', cantidadVendida: 12, stockActual: 60, tasaRotacionMensual: '0.2', estado: 'Baja rotación' }
          ],
          periodo: { dias: 30 }
        });
      } else if (tipoReporte === 'categoria') {
        setDatosReporte({
          success: true,
          data: [
            { _id: 'Zapatos', cantidadVendida: 120, totalIngresos: 36000000, porcentajeIngresos: 45 },
            { _id: 'Ropa', cantidadVendida: 95, totalIngresos: 28500000, porcentajeIngresos: 35 },
            { _id: 'Accesorios', cantidadVendida: 65, totalIngresos: 16250000, porcentajeIngresos: 20 }
          ],
          totalIngresos: 80750000,
          periodo: { inicio: filtros.fechaInicio, fin: filtros.fechaFin }
        });
      } else if (tipoReporte === 'tallas') {
        setDatosReporte({
          success: true,
          data: [
            { talla: 'M', genero: 'Hombre', cantidadVendida: 85, totalIngresos: 21250000 },
            { talla: 'L', genero: 'Hombre', cantidadVendida: 72, totalIngresos: 18000000 },
            { talla: 'S', genero: 'Mujer', cantidadVendida: 68, totalIngresos: 17000000 }
          ]
        });
      } else if (tipoReporte === 'ventas') {
        setDatosReporte({
          success: true,
          datos: [
            { _id: '2024-11-01', cantidadVentas: 12, totalIngresos: 3750000, promedioVenta: 312500 },
            { _id: '2024-11-02', cantidadVentas: 15, totalIngresos: 4687500, promedioVenta: 312500 },
            { _id: '2024-11-03', cantidadVentas: 18, totalIngresos: 5625000, promedioVenta: 312500 }
          ],
          estadisticas: {
            totalVentas: 156,
            totalIngresos: 48750000,
            promedioVenta: 312500,
            ventaMasAlta: 850000
          },
          periodo: { inicio: filtros.fechaInicio, fin: filtros.fechaFin }
        });
      }
      setLoading(false);
    }, 1000);
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
    alert('Función de exportación a Excel - Integrar con backend');
  };

  const exportarPDF = () => {
    if (!datosReporte) return;
    alert('Función de exportación a PDF - Integrar con backend');
  };

  const renderDashboard = () => {
    if (!datosReporte?.kpis) return null;

    const kpis = datosReporte.kpis;
    const stockPercentage = kpis.inventario.totalProductos > 0 
      ? ((kpis.inventario.productosStockBajo / kpis.inventario.totalProductos) * 100).toFixed(1)
      : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* KPIs Principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #67BACD',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(103, 186, 205, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #67BACD 0%, #70EAF0 100%)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <ShoppingCart style={{ width: '1.75rem', height: '1.75rem' }} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.75rem',
                background: 'rgba(6, 214, 160, 0.15)',
                color: '#06D6A0',
                border: '1px solid rgba(6, 214, 160, 0.3)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                <ArrowUp style={{ width: '1rem', height: '1rem' }} />
                <span>+12%</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Total Ventas
              </p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#276A7C', marginBottom: '0.25rem' }}>
                {kpis.ventas.total}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                {formatCurrency(kpis.ventas.ingresos)} en ingresos
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#6c757d',
              paddingTop: '1rem',
              borderTop: '1px solid #e9ecef',
              marginTop: '1rem'
            }}>
              <Activity style={{ width: '1rem', height: '1rem', color: '#67BACD' }} />
              <span>Período activo</span>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #06D6A0',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(6, 214, 160, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #06D6A0 0%, #5EACBB 100%)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #06D6A0 0%, #5EACBB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <DollarSign style={{ width: '1.75rem', height: '1.75rem' }} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.75rem',
                background: 'rgba(6, 214, 160, 0.15)',
                color: '#06D6A0',
                border: '1px solid rgba(6, 214, 160, 0.3)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                <TrendingUp style={{ width: '1rem', height: '1rem' }} />
                <span>+8%</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Ticket Promedio
              </p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#06D6A0', marginBottom: '0.25rem' }}>
                {formatCurrency(kpis.ventas.promedio)}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                Por transacción
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#6c757d',
              paddingTop: '1rem',
              borderTop: '1px solid #e9ecef',
              marginTop: '1rem'
            }}>
              <Target style={{ width: '1rem', height: '1rem', color: '#06D6A0' }} />
              <span>Meta: {formatCurrency(kpis.ventas.promedio * 1.15)}</span>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #FF6B6B',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #FF6B6B 0%, #FFD166 100%)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Package style={{ width: '1.75rem', height: '1.75rem' }} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 107, 107, 0.15)',
                color: '#FF6B6B',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                <AlertCircle style={{ width: '1rem', height: '1rem' }} />
                <span>{stockPercentage}%</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Inventario Total
              </p>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#276A7C', marginBottom: '0.25rem' }}>
                {kpis.inventario.totalProductos}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                {formatCurrency(kpis.inventario.valorTotal)} en stock
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#6c757d',
              paddingTop: '1rem',
              borderTop: '1px solid #e9ecef',
              marginTop: '1rem'
            }}>
              <Layers style={{ width: '1rem', height: '1rem', color: '#FF6B6B' }} />
              <span>{kpis.inventario.productosStockBajo} productos bajo stock</span>
            </div>
          </div>
        </div>

        {/* Top Productos */}
        {datosReporte.topProductos && datosReporte.topProductos.length > 0 && (
          <div style={{
            background: '#ffffff',
            border: '2px solid #e9ecef',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '2px solid #e9ecef',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #FFD166 0%, #FF6B6B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}>
                  <Star style={{ width: '1.25rem', height: '1.25rem' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
                    Productos Estrella
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    Top 5 más vendidos
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {datosReporte.topProductos.map((prod, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.75rem',
                        background: index === 0 ? 'linear-gradient(135deg, #FFD166 0%, #FF6B6B 100%)' :
                                   index === 1 ? 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)' :
                                   index === 2 ? 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)' :
                                   'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        fontSize: '0.875rem'
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', color: '#212529', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                          {prod.nombreProducto}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            background: 'rgba(103, 186, 205, 0.15)',
                            color: '#276A7C',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: '1px solid rgba(103, 186, 205, 0.3)'
                          }}>
                            {prod.categoria}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6c757d' }}>
                            <Box style={{ width: '0.75rem', height: '0.75rem' }} />
                            {prod.cantidadVendida} vendidos
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
                        {formatCurrency(prod.totalIngresos)}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                        {((prod.totalIngresos / kpis.ventas.ingresos) * 100).toFixed(1)}% del total
                      </p>
                    </div>
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
      <div style={{
        background: '#ffffff',
        border: '2px solid #e9ecef',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
            Productos Más Vendidos
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Total: {datosReporte.total} productos encontrados
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Código
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Producto
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Categoría
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Género
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Cantidad
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Total Ingresos
                </th>
              </tr>
            </thead>
            <tbody>
              {datosReporte.data.map((prod, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e9ecef', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(103, 186, 205, 0.15)',
                      color: '#276A7C',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      fontFamily: 'Courier New, monospace',
                      border: '1px solid rgba(103, 186, 205, 0.3)'
                    }}>
                      {prod.codigoProducto}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ fontWeight: '600', color: '#276A7C' }}>
                      {prod.nombreProducto}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      background: 'rgba(112, 234, 240, 0.15)',
                      color: '#5EACBB',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid rgba(112, 234, 240, 0.3)'
                    }}>
                      {prod.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      background: 'rgba(94, 172, 187, 0.15)',
                      color: '#5EACBB',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid rgba(94, 172, 187, 0.3)'
                    }}>
                      {prod.genero}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '2.5rem',
                      padding: '0.375rem 0.75rem',
                      background: 'rgba(6, 214, 160, 0.15)',
                      color: '#06D6A0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      border: '1px solid rgba(6, 214, 160, 0.3)'
                    }}>
                      {prod.cantidadVendida}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#212529' }}>
                      {formatCurrency(prod.totalIngresos)}
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

  const renderRotacion = () => {
    if (!datosReporte?.data) return null;

    return (
      <div style={{
        background: '#ffffff',
        border: '2px solid #e9ecef',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
            Rotación de Inventario
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Análisis de {datosReporte.periodo?.dias} días
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Código
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Producto
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Vendido
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Stock
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Rotación
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {datosReporte.data.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(103, 186, 205, 0.15)',
                      color: '#276A7C',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      fontFamily: 'Courier New, monospace',
                      border: '1px solid rgba(103, 186, 205, 0.3)'
                    }}>
                      {item.codigo}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ fontWeight: '600', color: '#276A7C' }}>
                      {item.nombre}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#495057' }}>
                    {item.cantidadVendida}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#495057' }}>
                    {item.stockActual}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: '#67BACD' }}>
                      {item.tasaRotacionMensual}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid',
                      background: item.estado === 'Alta rotación' ? 'rgba(6, 214, 160, 0.15)' :
                                 item.estado === 'Rotación media' ? 'rgba(255, 209, 102, 0.15)' : 'rgba(255, 107, 107, 0.15)',
                      color: item.estado === 'Alta rotación' ? '#06D6A0' :
                             item.estado === 'Rotación media' ? '#FFD166' : '#FF6B6B',
                      borderColor: item.estado === 'Alta rotación' ? 'rgba(6, 214, 160, 0.3)' :
                                   item.estado === 'Rotación media' ? 'rgba(255, 209, 102, 0.3)' : 'rgba(255, 107, 107, 0.3)'
                    }}>
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

    const colors = [
      { main: '#67BACD', secondary: '#276A7C' },
      { main: '#70EAF0', secondary: '#67BACD' },
      { main: '#5EACBB', secondary: '#276A7C' },
      { main: '#FFD166', secondary: '#FF6B6B' },
      { main: '#06D6A0', secondary: '#5EACBB' }
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <div style={{
          background: '#ffffff',
          border: '2px solid #e9ecef',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '2px solid #e9ecef',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
              Ventas por Categoría
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              Distribución de ingresos
            </p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {datosReporte.data.map((cat, index) => {
                const colorSet = colors[index % colors.length];
                return (
                  <div key={index} style={{
                    padding: '1rem',
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '0.5rem',
                          background: `linear-gradient(135deg, ${colorSet.main} 0%, ${colorSet.secondary} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          <PieChart style={{ width: '1rem', height: '1rem' }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#212529' }}>
                          {cat._id}
                        </span>
                      </div>
                      <span style={{ fontWeight: '700', color: '#212529', fontSize: '1rem' }}>
                        {formatCurrency(cat.totalIngresos)}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '0.5rem',
                      background: '#e9ecef',
                      borderRadius: '0.25rem',
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        width: `${cat.porcentajeIngresos}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${colorSet.main} 0%, ${colorSet.secondary} 100%)`,
                        borderRadius: '0.25rem',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                        {cat.cantidadVendida} unidades vendidas
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: colorSet.main }}>
                        {cat.porcentajeIngresos}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '2px solid #e9ecef',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '2px solid #e9ecef',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
              Resumen del Período
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              Estadísticas generales
            </p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '0.75rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}>
                  <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                    Total Ingresos
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                    {formatCurrency(datosReporte.totalIngresos)}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.375rem 0.625rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(6, 214, 160, 0.15)',
                  color: '#06D6A0',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  <ArrowUp style={{ width: '1rem', height: '1rem' }} />
                  <span>+15%</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '0.75rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}>
                  <Layers style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                    Categorías Activas
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                    {datosReporte.data.length}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '0.75rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #FFD166 0%, #FF6B6B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}>
                  <Target style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                    Categoría Líder
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                    {datosReporte.data[0]?._id || 'N/A'}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.375rem 0.625rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 209, 102, 0.15)',
                  color: '#FFD166',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  <Star style={{ width: '1rem', height: '1rem' }} />
                  <span>Top</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVentas = () => {
    if (!datosReporte?.datos) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #67BACD',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(103, 186, 205, 0.15)'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              marginBottom: '0.75rem'
            }}>
              <ShoppingCart style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Total Ventas
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
              {datosReporte.estadisticas?.totalVentas || 0}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #06D6A0',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(6, 214, 160, 0.15)'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #06D6A0 0%, #5EACBB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              marginBottom: '0.75rem'
            }}>
              <DollarSign style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Total Ingresos
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
              {formatCurrency(datosReporte.estadisticas?.totalIngresos)}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #70EAF0',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(112, 234, 240, 0.15)'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #70EAF0 0%, #67BACD 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              marginBottom: '0.75rem'
            }}>
              <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Promedio
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
              {formatCurrency(datosReporte.estadisticas?.promedioVenta)}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #FFD166',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(255, 209, 102, 0.15)'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #FFD166 0%, #FF6B6B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              marginBottom: '0.75rem'
            }}>
              <Star style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Venta Más Alta
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
              {formatCurrency(datosReporte.estadisticas?.ventaMasAlta)}
            </p>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '2px solid #e9ecef',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '2px solid #e9ecef',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
              Reporte de Ventas Detallado
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              {datosReporte.periodo?.inicio} - {datosReporte.periodo?.fin}
            </p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                    {filtros.agruparPor === 'dia' ? 'Fecha' : 
                     filtros.agruparPor === 'mes' ? 'Mes' :
                     filtros.agruparPor === 'vendedor' ? 'Vendedor' : 'Sucursal'}
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                    Cantidad Ventas
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                    Total Ingresos
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody>
                {datosReporte.datos.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#276A7C' }}>
                        {item._id || item.nombreVendedor || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '2.5rem',
                        padding: '0.375rem 0.75rem',
                        background: 'rgba(6, 214, 160, 0.15)',
                        color: '#06D6A0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        border: '1px solid rgba(6, 214, 160, 0.3)'
                      }}>
                        {item.cantidadVentas}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#212529' }}>
                        {formatCurrency(item.totalIngresos)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', color: '#67BACD' }}>
                        {formatCurrency(item.promedioVenta)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTallas = () => {
    if (!datosReporte?.data) return null;

    return (
      <div style={{
        background: '#ffffff',
        border: '2px solid #e9ecef',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#212529', marginBottom: '0.25rem' }}>
            Tallas Más Vendidas
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Análisis de preferencias por talla
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Talla
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Género
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Cantidad Vendida
                </th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', borderBottom: '2px solid #e9ecef' }}>
                  Total Ingresos
                </th>
              </tr>
            </thead>
            <tbody>
              {datosReporte.data.map((talla, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'rgba(255, 209, 102, 0.15)',
                      color: '#FFD166',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      border: '1px solid rgba(255, 209, 102, 0.3)'
                    }}>
                      {talla.talla}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      background: 'rgba(94, 172, 187, 0.15)',
                      color: '#5EACBB',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid rgba(94, 172, 187, 0.3)'
                    }}>
                      {talla.genero}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '2.5rem',
                      padding: '0.375rem 0.75rem',
                      background: 'rgba(6, 214, 160, 0.15)',
                      color: '#06D6A0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      border: '1px solid rgba(6, 214, 160, 0.3)'
                    }}>
                      {talla.cantidadVendida}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#212529' }}>
                      {formatCurrency(talla.totalIngresos)}
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f5 100%)',
      padding: '1.5rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(103, 186, 205, 0.3)'
            }}>
              <BarChart3 style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#212529', margin: 0 }}>
              Reportes y Análisis
            </h1>
          </div>
          <p style={{ color: '#6c757d', margin: 0 }}>
            Genera y exporta reportes detallados con análisis en tiempo real
          </p>
        </div>

        {/* Controls */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #e9ecef',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Report Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                Tipo de Reporte
              </label>
              <select
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#ffffff',
                  border: '2px solid #dee2e6',
                  borderRadius: '0.75rem',
                  color: '#212529',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value="dashboard">📊 Dashboard General</option>
                <option value="ventas">💰 Reporte de Ventas</option>
                <option value="productos">⭐ Productos Más Vendidos</option>
                <option value="rotacion">🔄 Rotación de Inventario</option>
                <option value="categoria">📦 Ventas por Categoría</option>
                <option value="genero">👔 Ventas por Género</option>
                <option value="tallas">📏 Tallas Más Vendidas</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.75rem',
                  border: '2px solid #dee2e6',
                  background: '#ffffff',
                  color: '#495057',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Filter style={{ width: '1rem', height: '1rem' }} />
                Filtros
                <ChevronDown style={{ 
                  width: '1rem', 
                  height: '1rem',
                  transform: mostrarFiltros ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              </button>

              <button
                onClick={cargarReporte}
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: loading ? '#dee2e6' : 'linear-gradient(135deg, #67BACD 0%, #276A7C 100%)',
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(103, 186, 205, 0.3)'
                }}
              >
                <RefreshCw style={{ 
                  width: '1rem', 
                  height: '1rem',
                  animation: loading ? 'spin 1s linear infinite' : 'none'
                }} />
                {loading ? 'Cargando...' : 'Generar'}
              </button>

              <button
                onClick={exportarExcel}
                disabled={!datosReporte}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: !datosReporte ? '#dee2e6' : 'linear-gradient(135deg, #06D6A0 0%, #5EACBB 100%)',
                  color: '#FFFFFF',
                  cursor: !datosReporte ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: !datosReporte ? 'none' : '0 4px 12px rgba(6, 214, 160, 0.3)'
                }}
              >
                <FileSpreadsheet style={{ width: '1rem', height: '1rem' }} />
                Excel
              </button>

              <button
                onClick={exportarPDF}
                disabled={!datosReporte}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: !datosReporte ? '#dee2e6' : 'linear-gradient(135deg, #FF6B6B 0%, #FF3838 100%)',
                  color: '#FFFFFF',
                  cursor: !datosReporte ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: !datosReporte ? 'none' : '0 4px 12px rgba(255, 107, 107, 0.3)'
                }}
              >
                <FileText style={{ width: '1rem', height: '1rem' }} />
                PDF
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {mostrarFiltros && (
            <div style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '2px solid #e9ecef',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#ffffff',
                    border: '2px solid #dee2e6',
                    borderRadius: '0.75rem',
                    color: '#212529',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#ffffff',
                    border: '2px solid #dee2e6',
                    borderRadius: '0.75rem',
                    color: '#212529',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {tipoReporte === 'ventas' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                    Agrupar por
                  </label>
                  <select
                    value={filtros.agruparPor}
                    onChange={(e) => setFiltros({...filtros, agruparPor: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#ffffff',
                      border: '2px solid #dee2e6',
                      borderRadius: '0.75rem',
                      color: '#212529',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="dia">📅 Día</option>
                    <option value="mes">📆 Mes</option>
                    <option value="vendedor">👤 Vendedor</option>
                    <option value="sucursal">🏢 Sucursal</option>
                  </select>
                </div>
              )}

              {(tipoReporte === 'productos' || tipoReporte === 'tallas') && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                    Género
                  </label>
                  <select
                    value={filtros.genero}
                    onChange={(e) => setFiltros({...filtros, genero: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#ffffff',
                      border: '2px solid #dee2e6',
                      borderRadius: '0.75rem',
                      color: '#212529',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Todos</option>
                    <option value="Hombre">👔 Hombre</option>
                    <option value="Mujer">👗 Mujer</option>
                    <option value="Unisex">👕 Unisex</option>
                  </select>
                </div>
              )}

              {tipoReporte === 'productos' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                      Categoría
                    </label>
                    <select
                      value={filtros.categoria}
                      onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: '#ffffff',
                        border: '2px solid #dee2e6',
                        borderRadius: '0.75rem',
                        color: '#212529',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Todas</option>
                      <option value="Zapatos">👟 Zapatos</option>
                      <option value="Ropa">👔 Ropa</option>
                      <option value="Accesorios">👜 Accesorios</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                      Límite de Resultados
                    </label>
                    <input
                      type="number"
                      value={filtros.limite}
                      onChange={(e) => setFiltros({...filtros, limite: e.target.value})}
                      min="5"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: '#ffffff',
                        border: '2px solid #dee2e6',
                        borderRadius: '0.75rem',
                        color: '#212529',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Report Content */}
        {loading ? (
          <div style={{
            background: '#ffffff',
            border: '2px solid #e9ecef',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <RefreshCw style={{ 
              width: '4rem', 
              height: '4rem', 
              color: '#67BACD',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#212529', marginBottom: '0.5rem' }}>
              Generando reporte...
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              Por favor espera un momento
            </p>
          </div>
        ) : datosReporte ? (
          <div>
            {tipoReporte === 'dashboard' && renderDashboard()}
            {tipoReporte === 'productos' && renderProductos()}
            {tipoReporte === 'rotacion' && renderRotacion()}
            {tipoReporte === 'categoria' && renderCategoria()}
            {tipoReporte === 'genero' && renderCategoria()}
            {tipoReporte === 'tallas' && renderTallas()}
            {tipoReporte === 'ventas' && renderVentas()}
          </div>
        ) : (
          <div style={{
            background: '#ffffff',
            border: '2px solid #e9ecef',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <BarChart3 style={{ 
              width: '4rem', 
              height: '4rem', 
              color: '#dee2e6',
              margin: '0 auto 1rem'
            }} />
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#212529', marginBottom: '0.5rem' }}>
              No hay datos para mostrar
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              Selecciona un tipo de reporte y haz clic en "Generar"
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
        }
        
        select:hover, input:hover {
          border-color: #67BACD !important;
        }
        
        select:focus, input:focus {
          outline: none;
          border-color: #67BACD !important;
          box-shadow: 0 0 0 3px rgba(103, 186, 205, 0.15);
        }
        
        table tbody tr:hover {
          background: #0c57a1ff !important;
        }
      `}</style>
    </div>
  );
};

export default ReportesPage;