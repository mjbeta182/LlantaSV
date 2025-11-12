import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from './authService';
import { AuthContext } from '../../context/AuthProvider';

export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!correo || !password) {
        throw new Error('Por favor completa todos los campos');
      }

      setSuccess('✅ Iniciando sesión...');
      const { token, usuario } = await apiLogin({ 
        CORREO: correo.toLowerCase(), 
        PASSWORD: password 
      });
      
      await login(token, usuario);
      setSuccess('✅ ¡Sesión iniciada exitosamente!');
      setTimeout(() => navigate('/perfil'), 1500);
    } catch (err) {
      console.error('Error de login:', err);
      setError('❌ ' + (err.response?.data?.message || err.message || 'Credenciales inválidas'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  {/* Formulario - Izquierda */}
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Iniciar Sesión
                    </p>

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

                    <form onSubmit={handleLogin} className="mx-1 mx-md-4">
                      <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo</label>
                        <input
                          type="email"
                          id="correo"
                          className="form-control"
                          placeholder="test@gmail.com"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Entrando...
                            </>
                          ) : (
                            'Entrar'
                          )}
                        </button>
                      </div>

                      <p className="text-center">¿No tienes cuenta? <Link to="/register" className="link-info fw-bold">Regístrate aquí</Link></p>
                    </form>
                  </div>

                  {/* Imagen Visual - Derecha */}
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Ilustración de login"
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
