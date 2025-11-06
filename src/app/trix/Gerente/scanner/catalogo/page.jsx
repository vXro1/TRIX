"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QRGeneratorPage() {
    const router = useRouter();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generando, setGenerando] = useState(null);
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("trix_token");
        if (!token) {
            alert("⚠️ Debes iniciar sesión para acceder a esta página");
            router.push("/trix/login");
            return;
        }
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const token = localStorage.getItem("trix_token");
            if (!token) {
                router.push("/trix/login");
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-hackathon-t4q9.onrender.com";
            const response = await fetch(`${apiUrl}/api/productos`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                alert("⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.");
                localStorage.removeItem("trix_token");
                router.push("/trix/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`Error al cargar productos: ${response.status}`);
            }

            const data = await response.json();
            setProductos(data.data || data.productos || data || []);
            setError(null);
        } catch (error) {
            setError(error.message);
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    const generarQR = async (id) => {
        setGenerando(id);
        try {
            const token = localStorage.getItem("trix_token");
            if (!token) {
                router.push("/trix/login");
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-hackathon-t4q9.onrender.com";
            const response = await fetch(`${apiUrl}/api/productos/${id}/qrcode`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                alert("⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.");
                localStorage.removeItem("trix_token");
                router.push("/trix/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Error al generar QR");
            }

            alert("✅ QR generado exitosamente");
            await cargarProductos();
        } catch (error) {
            alert("❌ " + error.message);
        } finally {
            setGenerando(null);
        }
    };

    const descargarQR = (producto) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-hackathon-t4q9.onrender.com";
        const link = document.createElement("a");
        link.href = `${apiUrl}/qrcodes/${producto.codigo || producto._id}.png`;
        link.download = `QR_${producto.codigo || producto._id}.png`;
        link.target = "_blank";
        link.click();
    };

    const productosFiltrados = productos.filter(
        (p) =>
            p.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
            p.codigo?.toLowerCase().includes(filtro.toLowerCase()) ||
            p.categoria?.toLowerCase().includes(filtro.toLowerCase())
    );

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingContent}>
                    <div style={styles.spinner}></div>
                    <div style={styles.loadingText}>Cargando productos...</div>
                    <div style={styles.loadingSubtext}>Preparando tu espacio de trabajo</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorCard}>
                    <div style={styles.errorIcon}>⚠</div>
                    <h2 style={styles.errorTitle}>Error de Conexión</h2>
                    <p style={styles.errorMessage}>{error}</p>
                    <div style={styles.errorButtons}>
                        <button
                            onClick={() => {
                                setLoading(true);
                                setError(null);
                                cargarProductos();
                            }}
                            style={styles.retryButton}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            🔄 Reintentar Conexión
                        </button>
                        <button
                            onClick={() => router.push("/trix/Gerente")}
                            style={styles.backButton}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            ← Volver al Panel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.mainContainer}>
            <div style={styles.backgroundPattern}></div>

            <div style={styles.contentWrapper}>
                {/* Header */}
                <div style={styles.header}>
                    <button
                        onClick={() => router.back()}
                        style={styles.backButtonHeader}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(39, 106, 124, 0.9)';
                            e.target.style.transform = 'translateX(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#276A7C';
                            e.target.style.transform = 'translateX(0)';
                        }}
                    >
                        ← Volver
                    </button>

                    <div style={styles.titleContainer}>
                        <div style={styles.titleGlow}></div>
                        <h1 style={styles.mainTitle}>Generador de Códigos QR</h1>
                        <p style={styles.subtitle}>Sistema inteligente de generación de códigos</p>
                    </div>
                </div>

                {/* Stats Bar */}
                <div style={styles.statsBar}>
                    <div style={styles.statItem}>
                        <div style={styles.statIcon}>📦</div>
                        <div style={styles.statContent}>
                            <div style={styles.statValue}>{productos.length}</div>
                            <div style={styles.statLabel}>Productos Totales</div>
                        </div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statIcon}>✓</div>
                        <div style={styles.statContent}>
                            <div style={styles.statValue}>{productosFiltrados.length}</div>
                            <div style={styles.statLabel}>Resultados Visibles</div>
                        </div>
                    </div>
                    <div style={styles.statItem}>
                        <div style={styles.statIcon}>🎨</div>
                        <div style={styles.statContent}>
                            <div style={styles.statValue}>QR</div>
                            <div style={styles.statLabel}>Generación Activa</div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={styles.searchContainer}>
                    <div style={styles.searchIcon}>🔍</div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, código o categoría..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        style={styles.searchInput}
                        onFocus={(e) => {
                            e.target.parentElement.style.borderColor = '#70EAF0';
                            e.target.parentElement.style.boxShadow = '0 0 25px rgba(112, 234, 240, 0.3)';
                        }}
                        onBlur={(e) => {
                            e.target.parentElement.style.borderColor = 'rgba(103, 186, 205, 0.3)';
                            e.target.parentElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                        }}
                    />
                    {filtro && (
                        <button
                            onClick={() => setFiltro("")}
                            style={styles.clearButton}
                            onMouseEnter={(e) => e.target.style.opacity = '1'}
                            onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                {productos.length > 0 ? (
                    <div style={styles.productsGrid}>
                        {productosFiltrados.map((producto) => (
                            <ProductoCard
                                key={producto._id}
                                producto={producto}
                                generando={generando === producto._id}
                                onGenerarQR={() => generarQR(producto._id)}
                                onDescargarQR={() => descargarQR(producto)}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📦</div>
                        <h2 style={styles.emptyTitle}>No hay productos disponibles</h2>
                        <p style={styles.emptyText}>Agrega productos para comenzar a generar códigos QR</p>
                    </div>
                )}

                {productosFiltrados.length === 0 && productos.length > 0 && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🔍</div>
                        <h2 style={styles.emptyTitle}>No se encontraron resultados</h2>
                        <p style={styles.emptyText}>Intenta con otro término de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductoCard({ producto, generando, onGenerarQR, onDescargarQR }) {
    const [qrExists, setQrExists] = useState(false);
    const [checkingQR, setCheckingQR] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const checkQR = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-hackathon-t4q9.onrender.com";
                const qrUrl = `${apiUrl}/qrcodes/${producto.codigo || producto._id}.png`;
                const response = await fetch(qrUrl, { method: "HEAD" });
                setQrExists(response.ok);
            } catch {
                setQrExists(false);
            } finally {
                setCheckingQR(false);
            }
        };
        checkQR();
    }, [producto, generando]);

    const cardStyle = {
        ...styles.productCard,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
            ? '0 15px 40px rgba(112, 234, 240, 0.3), 0 0 30px rgba(103, 186, 205, 0.2)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div
            style={cardStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.cardGlow}></div>

            {/* Badge de estado */}
            <div style={qrExists ? styles.badgeSuccess : styles.badgePending}>
                {qrExists ? '✓ QR Generado' : '○ Sin QR'}
            </div>

            {/* Imagen del producto */}
            {producto.imagen && (
                <div style={styles.imageContainer}>
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={styles.productImage}
                    />
                    <div style={styles.imageOverlay}></div>
                </div>
            )}

            {/* Información del producto */}
            <div style={styles.cardContent}>
                <h3 style={styles.productName}>{producto.nombre}</h3>

                <div style={styles.productInfo}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Código</span>
                        <span style={styles.infoValue}>{producto.codigo || "Sin código"}</span>
                    </div>

                    {producto.categoria && (
                        <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Categoría</span>
                            <span style={styles.infoValue}>📁 {producto.categoria}</span>
                        </div>
                    )}
                </div>

                {/* QR Preview */}
                {qrExists && !checkingQR && (
                    <div style={styles.qrPreviewContainer}>
                        <div style={styles.qrPreviewLabel}>Código QR Generado</div>
                        <div style={styles.qrPreview}>
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/qrcodes/${producto.codigo || producto._id}.png`}
                                alt="QR Code"
                                style={styles.qrImage}
                            />
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div style={styles.buttonContainer}>
                    {!qrExists && !checkingQR && (
                        <button
                            onClick={onGenerarQR}
                            disabled={generando}
                            style={generando ? styles.buttonDisabled : styles.buttonPrimary}
                            onMouseEnter={(e) => !generando && (e.target.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => !generando && (e.target.style.transform = 'scale(1)')}
                        >
                            {generando ? (
                                <>
                                    <span style={styles.buttonSpinner}></span>
                                    Generando...
                                </>
                            ) : (
                                <>🎨 Generar QR</>
                            )}
                        </button>
                    )}

                    {qrExists && (
                        <>
                            <button
                                onClick={onDescargarQR}
                                style={styles.buttonSuccess}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                📥 Descargar QR
                            </button>
                            <button
                                onClick={onGenerarQR}
                                disabled={generando}
                                style={generando ? styles.buttonDisabled : styles.buttonSecondary}
                                onMouseEnter={(e) => !generando && (e.target.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => !generando && (e.target.style.transform = 'scale(1)')}
                            >
                                {generando ? 'Regenerando...' : '🔄 Regenerar'}
                            </button>
                        </>
                    )}

                    {checkingQR && (
                        <div style={styles.checkingState}>
                            <span style={styles.checkingSpinner}></span>
                            Verificando QR...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    mainContainer: {
        minHeight: '100vh',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
    },

    backgroundPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(103, 186, 205, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(112, 234, 240, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(39, 106, 124, 0.03) 0%, transparent 50%)
    `,
        animation: 'float 20s ease-in-out infinite',
    },

    contentWrapper: {
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
    },

    header: {
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
    },

    backButtonHeader: {
        background: '#276A7C',
        backdropFilter: 'blur(10px)',
        border: '1px solid #67BACD',
        color: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(39, 106, 124, 0.3)',
    },

    titleContainer: {
        flex: 1,
        textAlign: 'center',
        position: 'relative',
    },

    titleGlow: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(112, 234, 240, 0.3) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: -1,
    },

    mainTitle: {
        fontSize: 'clamp(28px, 5vw, 48px)',
        fontWeight: '800',
        color: '#276A7C',
        marginBottom: '10px',
        textShadow: '0 2px 10px rgba(39, 106, 124, 0.2)',
        letterSpacing: '1px',
    },

    subtitle: {
        fontSize: 'clamp(14px, 2vw, 18px)',
        color: '#5EACBB',
        fontWeight: '500',
    },

    statsBar: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },

    statItem: {
        background: '#FFFFFF',
        backdropFilter: 'blur(10px)',
        border: '2px solid #67BACD',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(39, 106, 124, 0.15)',
    },

    statIcon: {
        fontSize: '36px',
        background: 'linear-gradient(135deg, #70EAF0, #67BACD)',
        borderRadius: '12px',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(112, 234, 240, 0.3)',
    },

    statContent: {
        flex: 1,
    },

    statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#276A7C',
        marginBottom: '4px',
    },

    statLabel: {
        fontSize: '14px',
        color: '#276A7C',
        fontWeight: '600',
    },

    searchContainer: {
        position: 'relative',
        marginBottom: '40px',
        background: '#FFFFFF',
        backdropFilter: 'blur(10px)',
        border: '2px solid #67BACD',
        borderRadius: '16px',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(39, 106, 124, 0.15)',
    },

    searchIcon: {
        fontSize: '24px',
        color: '#276A7C',
    },

    searchInput: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        padding: '16px 0',
        fontSize: '16px',
        color: '#276A7C',
        fontWeight: '500',
    },

    clearButton: {
        background: 'rgba(255, 107, 107, 0.2)',
        border: 'none',
        borderRadius: '8px',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#FF6B6B',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        opacity: 0.6,
    },

    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
    },

    productCard: {
        background: '#FFFFFF',
        backdropFilter: 'blur(10px)',
        border: '2px solid #67BACD',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(39, 106, 124, 0.15)',
    },

    cardGlow: {
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(112, 234, 240, 0.1) 0%, transparent 70%)',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
    },

    badgeSuccess: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'rgba(6, 214, 160, 0.9)',
        color: '#FFFFFF',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(6, 214, 160, 0.4)',
    },

    badgePending: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'rgba(255, 209, 102, 0.9)',
        color: '#000000',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(255, 209, 102, 0.4)',
    },

    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(39, 106, 124, 0.3), rgba(103, 186, 205, 0.3))',
    },

    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.4s ease',
    },

    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
    },

    cardContent: {
        padding: '24px',
    },

    productName: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#276A7C',
        marginBottom: '16px',
        lineHeight: '1.4',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },

    productInfo: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },

    infoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        background: 'rgba(103, 186, 205, 0.08)',
        borderRadius: '8px',
        border: '1px solid rgba(103, 186, 205, 0.3)',
    },

    infoLabel: {
        fontSize: '13px',
        color: '#276A7C',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },

    infoValue: {
        fontSize: '14px',
        color: '#5EACBB',
        fontWeight: '600',
    },

    qrPreviewContainer: {
        marginBottom: '20px',
    },

    qrPreviewLabel: {
        fontSize: '12px',
        color: '#67BACD',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: '10px',
        letterSpacing: '0.5px',
    },

    qrPreview: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #06D6A0',
        boxShadow: '0 0 20px rgba(6, 214, 160, 0.3)',
    },

    qrImage: {
        width: '120px',
        height: '120px',
        objectFit: 'contain',
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },

    buttonPrimary: {
        width: '100%',
        background: 'linear-gradient(135deg, #70EAF0, #67BACD)',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontSize: '15px',
        fontWeight: '700',
        color: '#000000',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(112, 234, 240, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },

    buttonSuccess: {
        width: '100%',
        background: 'linear-gradient(135deg, #06D6A0, #04b182)',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontSize: '15px',
        fontWeight: '700',
        color: '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(6, 214, 160, 0.3)',
    },

    buttonSecondary: {
        width: '100%',
        background: 'rgba(103, 186, 205, 0.2)',
        border: '2px solid #67BACD',
        borderRadius: '12px',
        padding: '12px',
        fontSize: '14px',
        fontWeight: '700',
        color: '#67BACD',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },

    buttonDisabled: {
        width: '100%',
        background: 'rgba(192, 192, 192, 0.2)',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontSize: '15px',
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.5)',
        cursor: 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },

    buttonSpinner: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderTopColor: '#FFFFFF',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
    },

    checkingState: {
        textAlign: 'center',
        padding: '16px',
        color: '#67BACD',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },

    checkingSpinner: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(103, 186, 205, 0.3)',
        borderTopColor: '#67BACD',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
    },

    emptyState: {
        background: '#FFFFFF',
        backdropFilter: 'blur(10px)',
        border: '2px solid #67BACD',
        borderRadius: '24px',
        padding: '60px 40px',
        textAlign: 'center',
        marginTop: '40px',
        boxShadow: '0 8px 30px rgba(39, 106, 124, 0.15)',
    },

    emptyIcon: {
        fontSize: '80px',
        marginBottom: '20px',
        filter: 'drop-shadow(0 4px 10px rgba(39, 106, 124, 0.2))',
    },

    emptyTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#276A7C',
        marginBottom: '12px',
    },

    emptyText: {
        fontSize: '16px',
        color: '#5EACBB',
        fontWeight: '500',
    },

    loadingContainer: {
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },

    loadingContent: {
        textAlign: 'center',
        zIndex: 2,
    },

    spinner: {
        width: '80px',
        height: '80px',
        border: '4px solid rgba(103, 186, 205, 0.2)',
        borderTopColor: '#276A7C',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 30px',
        boxShadow: '0 0 30px rgba(39, 106, 124, 0.3)',
    },

    loadingText: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#276A7C',
        marginBottom: '12px',
        textShadow: '0 2px 10px rgba(39, 106, 124, 0.2)',
    },

    loadingSubtext: {
        fontSize: '16px',
        color: '#5EACBB',
        fontWeight: '500',
    },

    errorContainer: {
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },

    errorCard: {
        background: '#FFFFFF',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 107, 107, 0.5)',
        borderRadius: '24px',
        padding: '50px 40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 15px 40px rgba(255, 107, 107, 0.2)',
    },

    errorIcon: {
        fontSize: '80px',
        marginBottom: '20px',
        color: '#FF6B6B',
        filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.5))',
    },

    errorTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#FF6B6B',
        marginBottom: '16px',
    },

    errorMessage: {
        fontSize: '16px',
        color: '#276A7C',
        marginBottom: '30px',
        lineHeight: '1.6',
    },

    errorButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },

    retryButton: {
        width: '100%',
        background: 'linear-gradient(135deg, #70EAF0, #67BACD)',
        border: 'none',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '700',
        color: '#000000',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(112, 234, 240, 0.3)',
    },

    backButton: {
        width: '100%',
        background: 'rgba(103, 186, 205, 0.2)',
        border: '2px solid #67BACD',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '700',
        color: '#67BACD',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
};

// Agregar estilos de animación CSS globales
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @media (max-width: 768px) {
      .stats-bar {
        grid-template-columns: 1fr !important;
      }
      
      .products-grid {
        grid-template-columns: 1fr !important;
      }
    }
    
    @media (max-width: 480px) {
      .header {
        flex-direction: column;
        align-items: stretch !important;
      }
      
      .back-button-header {
        width: 100%;
      }
    }
    
    input::placeholder {
      color: rgba(103, 186, 205, 0.6);
    }
    
    *::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    
    *::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }
    
    *::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #70EAF0, #67BACD);
      border-radius: 10px;
      border: 2px solid rgba(0, 0, 0, 0.2);
    }
    
    *::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #67BACD, #5EACBB);
    }
  `;

    if (!document.head.querySelector('[data-qr-styles]')) {
        styleSheet.setAttribute('data-qr-styles', 'true');
        document.head.appendChild(styleSheet);
    }
}