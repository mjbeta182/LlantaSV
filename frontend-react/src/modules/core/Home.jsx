import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LlantaDetallModal from '../../components/llantas/LlantaDetallModal';
import './Home.css';

const testimonios = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    cargo: 'Cliente Premium',
    texto: 'Excelente servicio y llantas de muy buena calidad. Muy recomendado.',
    avatar: '',
  },
  {
    id: 2,
    nombre: 'María García',
    cargo: 'Transportista',
    texto: 'Las mejores llantas del mercado. Durabilidad garantizada.',
    avatar: '',
  },
  {
    id: 3,
    nombre: 'Juan López',
    cargo: 'Gerente de Flota',
    texto: 'Servicio profesional y atención al cliente de primera categoría.',
    avatar: '',
  },
];

export default function Home() {
  const [llantas, setLlantas] = useState([]);
  const [filteredLlantas, setFilteredLlantas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLlanta, setSelectedLlanta] = useState(null);
  const [currentTestimonioIndex, setCurrentTestimonioIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLlantas();
  }, []);

  const fetchLlantas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/llantas');
      setLlantas(response.data);
      setFilteredLlantas(response.data);
    } catch (error) {
      console.error('Error fetching llantas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredLlantas(llantas);
      return;
    }

    const filtered = llantas.filter((llanta) => {
      const marca = (llanta.MARCA || '').toLowerCase();
      const modelo = (llanta.MODELO_LLANTA || '').toLowerCase();
      const medida = (llanta.MEDIDA_LLANTA || '').toLowerCase();
      const medidaRin = (llanta.MEDIDA_RIN || '').toLowerCase();

      return (
        marca.includes(term) ||
        modelo.includes(term) ||
        medida.includes(term) ||
        medidaRin.includes(term)
      );
    });

    setFilteredLlantas(filtered);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonioIndex((prev) => (prev + 1) % testimonios.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevTestimonio = () => {
    setCurrentTestimonioIndex(
      (prev) => (prev - 1 + testimonios.length) % testimonios.length
    );
  };

  const handleNextTestimonio = () => {
    setCurrentTestimonioIndex((prev) => (prev + 1) % testimonios.length);
  };

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Llantas de Primera Calidad</h1>
          <p className="hero-subtitle">
            Encuentra la llanta perfecta para tu vehículo
          </p>
          <p className="hero-description">
            Con más de 10 años en el mercado, ofrecemos las mejores opciones
            en llantas con precios competitivos y garantía de satisfacción.
          </p>
        </div>
      </section>

      <section className="search-section">
        <div className="search-card">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar por marca, modelo, medida..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="search-results">
            {filteredLlantas.length} llantas encontradas
          </div>
        </div>
      </section>

      <section className="catalog-section">
        {loading ? (
          <div className="loading">Cargando llantas...</div>
        ) : filteredLlantas.length > 0 ? (
          <div className="llantas-grid">
            {filteredLlantas.map((llanta) => (
              <div key={llanta.id} className="llanta-card">
                <div className="llanta-image">
                  {llanta.IMAGEN ? (
                    <img src={llanta.IMAGEN} alt={llanta.MARCA} />
                  ) : (
                    <div className="image-placeholder">
                      <i className="fas fa-tire"></i>
                    </div>
                  )}
                </div>
                <div className="llanta-info">
                  <h3 className="llanta-marca">{llanta.MARCA}</h3>
                  <p className="llanta-modelo">{llanta.MODELO_LLANTA}</p>

                  <div className="spec-badges">
                    <span className="spec-badge">
                      <i className="fas fa-ruler"></i> {llanta.MEDIDA_LLANTA}
                    </span>
                    <span className="spec-badge">
                      <i className="fas fa-ring"></i> {llanta.MEDIDA_RIN}
                    </span>
                  </div>

                  <div className="llanta-details">
                    <span className="detail-item">
                      <i className="fas fa-car"></i> {llanta.TIPO_VEHICULO}
                    </span>
                    <span className="detail-item">
                      <i className="fas fa-check-circle"></i>{' '}
                      {llanta.CONDICION}
                    </span>
                  </div>

                  <div className="llanta-footer">
                    <div className="price-section">
                      <span className="price"></span>
                    </div>
                    <button
                      className="btn-detalles"
                      onClick={() => setSelectedLlanta(llanta)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            No se encontraron llantas que coincidan con tu búsqueda
          </div>
        )}
      </section>

      <section className="testimonios-section">
        <h2 className="testimonios-title">Lo que dicen nuestros clientes</h2>
        <div className="testimonio-carousel">
          <button
            className="carousel-btn prev"
            onClick={handlePrevTestimonio}
            aria-label="Anterior"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="testimonio-card">
            <div className="testimonio-avatar">
              {testimonios[currentTestimonioIndex].avatar}
            </div>
            <p className="testimonio-text">
              "{testimonios[currentTestimonioIndex].texto}"
            </p>
            <h4 className="testimonio-nombre">
              {testimonios[currentTestimonioIndex].nombre}
            </h4>
            <p className="testimonio-cargo">
              {testimonios[currentTestimonioIndex].cargo}
            </p>
          </div>

          <button
            className="carousel-btn next"
            onClick={handleNextTestimonio}
            aria-label="Siguiente"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="carousel-indicators">
          {testimonios.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                index === currentTestimonioIndex ? 'active' : ''
              }`}
              onClick={() => setCurrentTestimonioIndex(index)}
              aria-label={`Ir a testimonio ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      <section className="info-section">
        <div className="info-card">
          <i className="fas fa-shipping-fast"></i>
          <h3>Envío Rápido</h3>
          <p>Entrega en 24-48 horas en toda la región</p>
        </div>
        <div className="info-card">
          <i className="fas fa-shield-alt"></i>
          <h3>Garantía</h3>
          <p>Todas nuestras llantas con garantía oficial</p>
        </div>
        <div className="info-card">
          <i className="fas fa-headset"></i>
          <h3>Soporte 24/7</h3>
          <p>Atención al cliente disponible todos los días</p>
        </div>
        <div className="info-card">
          <i className="fas fa-tag"></i>
          <h3>Mejores Precios</h3>
          <p>Precios competitivos y ofertas especiales</p>
        </div>
      </section>

      {selectedLlanta && (
        <LlantaDetallModal
          llanta={selectedLlanta}
          onClose={() => setSelectedLlanta(null)}
        />
      )}
    </div>
  );
}
