import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import './MisCotizaciones.css';

export default function MisCotizaciones() {
  const { token, user } = useAuth();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCot, setSelectedCot] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  // Cargar cotizaciones
  useEffect(() => {
    fetchMisCotizaciones();
  }, []);

  const fetchMisCotizaciones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:3000/api/cotizaciones',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCotizaciones(response.data);
    } catch (error) {
      console.error('Error fetching cotizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cotización
  const handleDeleteCotizacion = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      try {
        await axios.delete(
          `http://localhost:3000/api/cotizaciones/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCotizaciones(cotizaciones.filter((cot) => cot.id !== id));
        setSelectedCot(null);
      } catch (error) {
        console.error('Error eliminando cotización:', error);
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'status-pendiente';
      case 'CONTACTADO':
        return 'status-contactado';
      case 'CANCELADA':
        return 'status-cancelada';
      default:
        return '';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return '⏳';
      case 'CONTACTADO':
        return '✅';
      case 'CANCELADA':
        return '❌';
      default:
        return '';
    }
  };

  return (
    <div className="mis-cotizaciones">
      <div className="page-header">
        <h1>📋 Mis Cotizaciones</h1>
        <p>Aquí puedes ver todas tus solicitudes de cotización y su estado</p>
      </div>

      {loading ? (
        <div className="loading">Cargando tus cotizaciones...</div>
      ) : cotizaciones.length > 0 ? (
        <div className="cotizaciones-grid">
          {cotizaciones.map((cot) => (
            <div key={cot.id} className="cot-card">
              <div className="card-header">
                <div className="cot-number">Cotización #{cot.id}</div>
                <span className={`status-badge ${getEstadoColor(cot.ESTADO)}`}>
                  {getEstadoIcon(cot.ESTADO)} {cot.ESTADO}
                </span>
              </div>

              <div className="card-body">
                <div className="card-section">
                  <h3>🛞 Llanta Solicitada</h3>
                  <div className="llanta-info">
                    <div className="brand-model">
                      <strong className="brand">{cot.llanta?.MARCA}</strong>
                      <span className="model">{cot.llanta?.MODELO_LLANTA}</span>
                    </div>
                    <div className="specs">
                      <span className="spec">
                        <i className="fas fa-ruler"></i> {cot.llanta?.MEDIDA_LLANTA}
                      </span>
                      <span className="spec">
                        <i className="fas fa-ring"></i> {cot.llanta?.MEDIDA_RIN}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-section">
                  <h3>📊 Detalle</h3>
                  <div className="details-grid">
                    <div className="detail">
                      <label>Cantidad:</label>
                      <span>{cot.CANTIDAD}</span>
                    </div>
                    <div className="detail">
                      <label>Precio Unitario:</label>
                      <span>${cot.PRECIO_UNITARIO.toFixed(2)}</span>
                    </div>
                    <div className="detail">
                      <label>Subtotal:</label>
                      <strong>${cot.SUBTOTAL.toFixed(2)}</strong>
                    </div>
                    <div className="detail">
                      <label>Fecha:</label>
                      <span>{new Date(cot.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {cot.NOTAS && (
                  <div className="card-section">
                    <h3>📝 Notas del Administrador</h3>
                    <div className="notes-box">
                      <p>{cot.NOTAS}</p>
                    </div>
                  </div>
                )}

                <div className="card-actions">
                  <button
                    className="btn-view"
                    onClick={() => setSelectedCot(cot)}
                  >
                    👁️ Ver Detalles
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCotizacion(cot.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No tienes cotizaciones aún</h2>
          <p>Comienza a cotizar llantas desde nuestro catálogo principal</p>
          <a href="/llantas" className="btn-browse">
            Explorar Llantas
          </a>
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedCot && (
        <div className="modal-overlay" onClick={() => setSelectedCot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cotización #{selectedCot.id}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedCot(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-content">
              <div className="detail-section">
                <h3>🛞 Información de la Llanta</h3>
                <div className="llanta-details">
                  <div className="brand-section">{selectedCot.llanta?.MARCA}</div>
                  <div className="specs-grid">
                    <div className="spec-box">
                      <label>Modelo</label>
                      <span>{selectedCot.llanta?.MODELO_LLANTA}</span>
                    </div>
                    <div className="spec-box">
                      <label>Medida Llanta</label>
                      <span>{selectedCot.llanta?.MEDIDA_LLANTA}</span>
                    </div>
                    <div className="spec-box">
                      <label>Medida Rin</label>
                      <span>{selectedCot.llanta?.MEDIDA_RIN}</span>
                    </div>
                    <div className="spec-box">
                      <label>Tipo Vehículo</label>
                      <span>{selectedCot.llanta?.TIPO_VEHICULO}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>💰 Resumen de Cotización</h3>
                <div className="summary">
                  <div className="summary-item">
                    <span>Cantidad:</span>
                    <strong>{selectedCot.CANTIDAD}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Precio Unitario:</span>
                    <strong>${selectedCot.PRECIO_UNITARIO.toFixed(2)}</strong>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <strong>${selectedCot.SUBTOTAL.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>🔔 Estado de tu Cotización</h3>
                <div className="status-info">
                  <div className={`status-indicator ${getEstadoColor(selectedCot.ESTADO)}`}>
                    {getEstadoIcon(selectedCot.ESTADO)}
                  </div>
                  <div>
                    <p className="status-text">{selectedCot.ESTADO}</p>
                    <p className="status-description">
                      {selectedCot.ESTADO === 'PENDIENTE' &&
                        'Tu cotización está en espera de revisión. Pronto nos pondremos en contacto.'}
                      {selectedCot.ESTADO === 'CONTACTADO' &&
                        'Nuestro equipo ya se ha puesto en contacto contigo. Revisa tus notas.'}
                      {selectedCot.ESTADO === 'CANCELADA' &&
                        'Esta cotización ha sido cancelada.'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedCot.NOTAS && (
                <div className="detail-section">
                  <h3>📝 Notas del Equipo de Ventas</h3>
                  <div className="notes-panel">
                    {selectedCot.NOTAS}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>📅 Información Temporal</h3>
                <div className="timing">
                  <div className="timing-item">
                    <label>Creada el:</label>
                    <span>{new Date(selectedCot.created_at).toLocaleString()}</span>
                  </div>
                  <div className="timing-item">
                    <label>Última actualización:</label>
                    <span>{new Date(selectedCot.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-contact"
                  onClick={() => {
                    alert('Por favor contacta a: +503 7234-5678 o ventas@llanteria-sv.com');
                  }}
                >
                  📞 Contactar Ventas
                </button>
                <button
                  className="btn-close-modal"
                  onClick={() => setSelectedCot(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
