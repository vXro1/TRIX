'use client';
import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

export default function ScannerPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('trix_token');
    if (!token) {
      alert('Debes iniciar sesión para acceder a esta página');
      router.push('/trix/login');
    }
  }, []);

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(
        (decodedText) => {
          setResultado(decodedText);
          scanner.clear();
          setScanning(false);
          
          const match = decodedText.match(/\/panel\/producto\/([a-f0-9]+)/i);
          if (match) {
            cargarProducto(match[1]);
          } else {
            setError('El código QR no contiene un enlace válido de producto');
          }
        },
        (error) => {
          console.warn(error);
        }
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [scanning]);

  const cargarProducto = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-hackathon-t4q9.onrender.com';
      const response = await fetch(`${apiUrl}/api/productos/public/${id}`);
      
      if (!response.ok) throw new Error('Producto no encontrado');
      
      const data = await response.json();
      setProducto(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducto(null);
    }
  };

  const iniciarEscaneo = () => {
    setScanning(true);
    setResultado(null);
    setProducto(null);
    setError(null);
  };

  const limpiar = () => {
    setScanning(false);
    setResultado(null);
    setProducto(null);
    setError(null);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#FFFFFF',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    bgPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(103, 186, 205, 0.05) 1px, transparent 0)',
      backgroundSize: '40px 40px',
      pointerEvents: 'none',
      zIndex: 0
    },
    glowOrb1: {
      position: 'absolute',
      top: '-10%',
      right: '-5%',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(112, 234, 240, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      pointerEvents: 'none',
      zIndex: 0
    },
    glowOrb2: {
      position: 'absolute',
      bottom: '-15%',
      left: '-10%',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(103, 186, 205, 0.12) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      zIndex: 0
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    header: {
      marginBottom: '3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    backButton: {
      background: 'linear-gradient(135deg, #276A7C 0%, #5EACBB 100%)',
      color: '#FFFFFF',
      padding: '0.875rem 1.75rem',
      borderRadius: '14px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(39, 106, 124, 0.25)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '0.95rem',
      letterSpacing: '0.3px'
    },
    title: {
      fontSize: '2.75rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #276A7C 0%, #67BACD 50%, #70EAF0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      flex: 1,
      letterSpacing: '-1px',
      lineHeight: '1.2'
    },
    spacer: {
      width: '140px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginBottom: '2.5rem',
      flexWrap: 'wrap'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #276A7C 0%, #67BACD 100%)',
      color: '#FFFFFF',
      padding: '1.125rem 2.75rem',
      borderRadius: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(103, 186, 205, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '1rem',
      letterSpacing: '0.3px',
      position: 'relative',
      overflow: 'hidden'
    },
    secondaryButton: {
      background: 'linear-gradient(135deg, #67BACD 0%, #70EAF0 100%)',
      color: '#FFFFFF',
      padding: '1.125rem 2.75rem',
      borderRadius: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(112, 234, 240, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '1rem',
      letterSpacing: '0.3px',
      position: 'relative',
      overflow: 'hidden'
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    gridLg: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: '2rem',
      alignItems: 'start'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '24px',
      padding: '2.25rem',
      boxShadow: '0 8px 32px rgba(39, 106, 124, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(103, 186, 205, 0.25)',
      backdropFilter: 'blur(12px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    },
    cardAccent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #276A7C 0%, #67BACD 50%, #70EAF0 100%)',
      borderRadius: '24px 24px 0 0'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#276A7C',
      marginBottom: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      letterSpacing: '-0.3px'
    },
    urlBox: {
      background: 'rgba(103, 186, 205, 0.08)',
      padding: '1.5rem',
      borderRadius: '14px',
      border: '2px solid rgba(103, 186, 205, 0.2)',
      wordBreak: 'break-all',
      fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      fontSize: '0.9rem',
      color: '#276A7C',
      lineHeight: '1.7',
      position: 'relative'
    },
    urlLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#67BACD',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '0.5rem',
      display: 'block'
    },
    productCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '28px',
      padding: '2.75rem',
      boxShadow: '0 15px 45px rgba(39, 106, 124, 0.18), 0 5px 15px rgba(0, 0, 0, 0.08)',
      border: '2px solid rgba(103, 186, 205, 0.3)',
      position: 'sticky',
      top: '1.5rem',
      height: 'fit-content',
      backdropFilter: 'blur(12px)'
    },
    productHeader: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#276A7C',
      marginBottom: '2rem',
      textAlign: 'center',
      paddingBottom: '1.5rem',
      borderBottom: '3px solid',
      borderImage: 'linear-gradient(90deg, transparent, #67BACD, transparent) 1',
      letterSpacing: '-0.3px'
    },
    productImage: {
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative'
    },
    imageWrapper: {
      position: 'relative',
      width: '240px',
      height: '240px'
    },
    imageBg: {
      position: 'absolute',
      top: '-10px',
      left: '-10px',
      right: '-10px',
      bottom: '-10px',
      background: 'linear-gradient(135deg, rgba(103, 186, 205, 0.2), rgba(112, 234, 240, 0.15))',
      borderRadius: '20px',
      filter: 'blur(15px)',
      zIndex: 0
    },
    image: {
      width: '240px',
      height: '240px',
      objectFit: 'cover',
      borderRadius: '18px',
      boxShadow: '0 10px 30px rgba(39, 106, 124, 0.25)',
      border: '3px solid rgba(103, 186, 205, 0.4)',
      position: 'relative',
      zIndex: 1
    },
    productName: {
      fontSize: '2.25rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #276A7C 0%, #67BACD 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      marginBottom: '2.5rem',
      letterSpacing: '-0.8px',
      lineHeight: '1.2'
    },
    infoGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.875rem'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.125rem 1.5rem',
      borderRadius: '14px',
      background: 'rgba(103, 186, 205, 0.06)',
      border: '1px solid rgba(103, 186, 205, 0.15)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    infoRowHighlight: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 1.75rem',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, rgba(103, 186, 205, 0.15), rgba(112, 234, 240, 0.1))',
      border: '2px solid rgba(103, 186, 205, 0.35)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(103, 186, 205, 0.12)'
    },
    infoLabel: {
      color: '#276A7C',
      fontWeight: '600',
      fontSize: '0.95rem',
      letterSpacing: '0.2px'
    },
    infoValue: {
      color: '#333333',
      fontWeight: '600',
      fontSize: '0.95rem'
    },
    infoValueHighlight: {
      color: '#276A7C',
      fontWeight: '700',
      fontSize: '1.15rem'
    },
    qrContainer: {
      marginTop: '2.5rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(103, 186, 205, 0.08), rgba(112, 234, 240, 0.05))',
      borderRadius: '18px',
      textAlign: 'center',
      border: '2px solid rgba(103, 186, 205, 0.25)',
      position: 'relative'
    },
    qrLabel: {
      fontSize: '0.9rem',
      color: '#276A7C',
      marginBottom: '1.25rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1.5px'
    },
    qrImage: {
      width: '150px',
      height: '150px',
      margin: '0 auto',
      borderRadius: '12px',
      padding: '10px',
      background: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(39, 106, 124, 0.15)'
    },
    errorCard: {
      background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08), rgba(255, 107, 107, 0.05))',
      border: '2px solid rgba(255, 107, 107, 0.3)',
      borderRadius: '24px',
      padding: '2.5rem',
      boxShadow: '0 8px 32px rgba(255, 107, 107, 0.18)',
      backdropFilter: 'blur(12px)'
    },
    errorTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#FF6B6B',
      marginBottom: '1rem',
      letterSpacing: '-0.3px'
    },
    errorText: {
      color: '#FF6B6B',
      fontSize: '1rem',
      lineHeight: '1.6'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgPattern}></div>
      <div style={styles.glowOrb1}></div>
      <div style={styles.glowOrb2}></div>
      
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <button
            onClick={() => router.back()}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(39, 106, 124, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(39, 106, 124, 0.25)';
            }}
          >
            ← Volver
          </button>
          <h1 style={styles.title}>
            Escáner de Productos
          </h1>
          <div style={styles.spacer}></div>
        </div>

        <div style={styles.buttonGroup}>
          {!scanning && (
            <button
              onClick={iniciarEscaneo}
              style={styles.primaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(103, 186, 205, 0.45), 0 0 20px rgba(112, 234, 240, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(103, 186, 205, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
              }}
            >
              Iniciar Escáner
            </button>
          )}
          {(resultado || producto || error) && (
            <button
              onClick={limpiar}
              style={styles.secondaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(112, 234, 240, 0.45), 0 0 20px rgba(112, 234, 240, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(112, 234, 240, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
              }}
            >
              Limpiar
            </button>
          )}
        </div>

        <div style={styles.gridLg}>
          <div style={styles.grid}>
            {scanning && (
              <div style={styles.card}>
                <div style={styles.cardAccent}></div>
                <h2 style={styles.cardTitle}>
                  Apunta al código QR
                </h2>
                <div id="reader" style={{ width: '100%' }}></div>
              </div>
            )}

            {resultado && (
              <div style={styles.card}>
                <div style={styles.cardAccent}></div>
                <h2 style={styles.cardTitle}>
                  URL Escaneada
                </h2>
                <div style={styles.urlBox}>
                  <span style={styles.urlLabel}>URL detectada</span>
                  {resultado}
                </div>
              </div>
            )}
          </div>

          {producto && (
            <div style={styles.productCard}>
              <h2 style={styles.productHeader}>
                Información del Producto
              </h2>

              {producto.imagen && (
                <div style={styles.productImage}>
                  <div style={styles.imageWrapper}>
                    <div style={styles.imageBg}></div>
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={styles.image}
                    />
                  </div>
                </div>
              )}

              <h3 style={styles.productName}>
                {producto.nombre}
              </h3>

              <div style={styles.infoGrid}>
                <InfoRow label="Código" value={producto.codigo} />
                <InfoRow label="Descripción" value={producto.descripcion || '-'} />
                <InfoRow label="Categoría" value={producto.categoria || '-'} />
                <InfoRow label="Género" value={producto.genero || '-'} />
                <InfoRow label="Talla" value={producto.talla || '-'} />
                <InfoRow label="Color" value={producto.color || '-'} />
                <InfoRow 
                  label="Precio Venta" 
                  value={producto.precioVenta ? `$${producto.precioVenta.toLocaleString()}` : '-'} 
                  highlight
                />
                <InfoRow 
                  label="Stock" 
                  value={producto.stockActual || 0} 
                  highlight
                />
              </div>

              <div style={styles.qrContainer}>
                <p style={styles.qrLabel}>Código QR</p>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-hackathon-t4q9.onrender.com'}/qrcodes/${producto.codigo || producto._id}.png`}
                  alt="QR Code"
                  style={styles.qrImage}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorCard}>
              <h2 style={styles.errorTitle}>Error</h2>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = highlight ? {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.75rem',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(103, 186, 205, 0.15), rgba(112, 234, 240, 0.1))',
    border: '2px solid rgba(103, 186, 205, 0.35)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(103, 186, 205, 0.12)'
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.125rem 1.5rem',
    borderRadius: '14px',
    background: 'rgba(103, 186, 205, 0.06)',
    border: '1px solid rgba(103, 186, 205, 0.15)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  };

  const rowStyle = {
    ...baseStyle,
    ...(isHovered && {
      transform: 'translateX(6px)',
      boxShadow: highlight 
        ? '0 6px 20px rgba(103, 186, 205, 0.25)' 
        : '0 2px 8px rgba(103, 186, 205, 0.15)',
      background: highlight 
        ? 'linear-gradient(135deg, rgba(103, 186, 205, 0.2), rgba(112, 234, 240, 0.15))'
        : 'rgba(103, 186, 205, 0.1)'
    })
  };

  const labelStyle = {
    color: '#276A7C',
    fontWeight: '600',
    fontSize: '0.95rem',
    letterSpacing: '0.2px'
  };

  const valueStyle = highlight ? {
    color: '#276A7C',
    fontWeight: '700',
    fontSize: '1.15rem'
  } : {
    color: '#333333',
    fontWeight: '600',
    fontSize: '0.95rem'
  };

  return (
    <div 
      style={rowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={labelStyle}>
        {label}:
      </span>
      <span style={valueStyle}>
        {value}
      </span>
    </div>
  );
}