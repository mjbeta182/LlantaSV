import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login as apiLogin } from './authService';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';

export default function RegisterForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    NOMBRES: '',
    APELLIDOS: '',
    CORREO: '',
    DUI: '',
    TELEFONO: '',
    DIRECCION: '',
    PASSWORD: '',
    PASSWORD_confirmation: '',
    ROL: 'cliente',
    VEHICULO: {
      MARCA_ID: '',
      MODELO_ID: '',
      ANIO: '',
      MEDIDA_RIN: '',
      MEDIDA_LLANTA: '',
      MARCA_LLANTA: ''
    }
  });

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const cacheTimestamp = localStorage.getItem('cacheTimestamp');
    const ahora = Date.now();
    const unaHora = 60 * 60 * 1000;
    const cacheValido = cacheTimestamp && (ahora - cacheTimestamp < unaHora);

    if (cacheValido) {
      setMarcas(JSON.parse(localStorage.getItem('marcas')));
      setModelos(JSON.parse(localStorage.getItem('modelos')));
      setCargandoDatos(false);
    }

    Promise.all([
      axios.get('http://localhost:3000/api/marcas'),
      axios.get('http://localhost:3000/api/modelos')
    ])
      .then(([resMarcas, resModelos]) => {
        setMarcas(resMarcas.data);
        setModelos(resModelos.data);
        localStorage.setItem('marcas', JSON.stringify(resMarcas.data));
        localStorage.setItem('modelos', JSON.stringify(resModelos.data));
        localStorage.setItem('cacheTimestamp', Date.now());
      })
      .catch(() => setError('Error al cargar datos del vehículo'))
      .finally(() => setCargandoDatos(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.VEHICULO) {
      setForm({ ...form, VEHICULO: { ...form.VEHICULO, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones básicas
      if (!form.NOMBRES || !form.APELLIDOS || !form.CORREO || !form.PASSWORD || !form.PASSWORD_confirmation) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      if (form.PASSWORD !== form.PASSWORD_confirmation) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (form.PASSWORD.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Registrar
      await register(form);
      
      // Mostrar mensaje de éxito
      setSuccess('✅ ¡Registrado con éxito! Iniciando sesión...');
      
      // Iniciar sesión automáticamente
      const { token, usuario } = await apiLogin({ 
        CORREO: form.CORREO.toLowerCase(), 
        PASSWORD: form.PASSWORD 
      });
      
      await login(token, usuario);
      setTimeout(() => navigate('/perfil'), 1500);
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.response?.data?.message || err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const marcaId = parseInt(form.VEHICULO.MARCA_ID);
  const modelosFiltrados = isNaN(marcaId)
    ? []
    : modelos.filter(m => m.MARCA_ID === marcaId);

  if (cargandoDatos) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#eee' }}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando datos de vehículo...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black shadow-lg" style={{ borderRadius: '25px' }}>
              <div className="card-body p-4 p-md-5">
                <div className="row">
                  {/* Formulario - Izquierda */}
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h2 fw-bold mb-4">
                      Crear Cuenta
                    </p>

                    {success && (
                      <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                        {success}
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={() => setSuccess('')}
                        ></button>
                      </div>
                    )}

                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                        {error}
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={() => setError('')}
                        ></button>
                      </div>
                    )}

                    <form onSubmit={handleRegister}>
                      {/* Nombres y Apellidos */}
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="nombres" className="form-label">Nombres</label>
                          <input
                            type="text"
                            id="nombres"
                            name="NOMBRES"
                            className="form-control"
                            value={form.NOMBRES}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="apellidos" className="form-label">Apellidos</label>
                          <input
                            type="text"
                            id="apellidos"
                            name="APELLIDOS"
                            className="form-control"
                            value={form.APELLIDOS}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Correo */}
                      <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo</label>
                        <input
                          type="email"
                          id="correo"
                          name="CORREO"
                          className="form-control"
                          value={form.CORREO}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>

                      {/* DUI y Teléfono */}
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="dui" className="form-label">DUI</label>
                          <input
                            type="text"
                            id="dui"
                            name="DUI"
                            className="form-control"
                            value={form.DUI}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="telefono" className="form-label">Teléfono</label>
                          <input
                            type="text"
                            id="telefono"
                            name="TELEFONO"
                            className="form-control"
                            value={form.TELEFONO}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Dirección */}
                      <div className="mb-3">
                        <label htmlFor="direccion" className="form-label">Dirección</label>
                        <input
                          type="text"
                          id="direccion"
                          name="DIRECCION"
                          className="form-control"
                          value={form.DIRECCION}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>

                      {/* Contraseña y Confirmación */}
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="password" className="form-label">Contraseña</label>
                          <input
                            type="password"
                            id="password"
                            name="PASSWORD"
                            className="form-control"
                            value={form.PASSWORD}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="password_conf" className="form-label">Confirmar</label>
                          <input
                            type="password"
                            id="password_conf"
                            name="PASSWORD_confirmation"
                            className="form-control"
                            value={form.PASSWORD_confirmation}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Datos del Vehículo */}
                      <div className="card mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0"><i className="fas fa-car me-2"></i>Datos del Vehículo</h6>
                        </div>
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label htmlFor="marca" className="form-label">Marca *</label>
                              <select
                                id="marca"
                                name="MARCA_ID"
                                className="form-select"
                                value={form.VEHICULO.MARCA_ID}
                                onChange={handleChange}
                                disabled={loading}
                              >
                                <option value="">Selecciona una marca</option>
                                {marcas.map(m => (
                                  <option key={m.id} value={m.id}>{m.NOMBRE}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="modelo" className="form-label">Modelo *</label>
                              <select
                                id="modelo"
                                name="MODELO_ID"
                                className="form-select"
                                value={form.VEHICULO.MODELO_ID}
                                onChange={handleChange}
                                disabled={!form.VEHICULO.MARCA_ID || loading}
                              >
                                <option value="">Selecciona un modelo</option>
                                {modelosFiltrados.map(m => (
                                  <option key={m.id} value={m.id}>{m.MODELO}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <label htmlFor="anio" className="form-label">Año</label>
                              <input
                                type="text"
                                id="anio"
                                name="ANIO"
                                className="form-control"
                                placeholder="Ej: 20"
                                value={form.VEHICULO.ANIO}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="medida-rin" className="form-label">Medida Rin</label>
                              <input
                                type="text"
                                id="medida-rin"
                                name="MEDIDA_RIN"
                                className="form-control"
                                placeholder="Ej: 15"
                                value={form.VEHICULO.MEDIDA_RIN}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="medida-llanta" className="form-label">Medida Llanta</label>
                              <input
                                type="text"
                                id="medida-llanta"
                                name="MEDIDA_LLANTA"
                                className="form-control"
                                placeholder="Ej: 19"
                                value={form.VEHICULO.MEDIDA_LLANTA}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="marca-llanta" className="form-label">Marca Llanta</label>
                              <input
                                type="text"
                                id="marca-llanta"
                                name="MARCA_LLANTA"
                                className="form-control"
                                placeholder="Ej: Mi"
                                value={form.VEHICULO.MARCA_LLANTA}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botón Registrarse */}
                      <div className="d-flex justify-content-center mb-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Registrando...
                            </>
                          ) : (
                            'Registrarse'
                          )}
                        </button>
                      </div>

                      {/* Enlaces */}
                      <p className="text-center">
                        ¿Ya tienes cuenta? <Link to="/login" className="link-info fw-bold">Inicia sesión aquí</Link>
                      </p>
                    </form>
                  </div>

                  {/* Imagen Visual - Derecha */}
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Ilustración de registro"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
