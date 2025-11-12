import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminLlantas = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [llantas, setLlantas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar que sea ADMIN
  useEffect(() => {
    if (user && user.ROL !== 'ADMIN') {
      setError('❌ No tienes permisos para acceder a esta sección. Solo ADMIN.');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    MARCA: '',
    MODELO_LLANTA: '',
    MEDIDA_RIN: '',
    MEDIDA_LLANTA: '',
    PRECIO: '',
    IMAGEN: '',
    CONDICION: 'nueva',
    TIPO_VEHICULO: '',
    STOCK: '',
  });

  const fetchLlantas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/llantas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLlantas(response.data);
      setError('');
    } catch (err) {
      setError('Error cargando llantas: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Cargar llantas al montar
  useEffect(() => {
    fetchLlantas();
  }, [fetchLlantas]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Actualizar llanta existente
        await axios.patch(
          `http://localhost:3000/api/llantas/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Llanta actualizada exitosamente');
        setEditingId(null);
      } else {
        // Crear nueva llanta
        await axios.post('http://localhost:3000/api/llantas', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Llanta creada exitosamente');
      }

      // Limpiar formulario
      setFormData({
        MARCA: '',
        MODELO_LLANTA: '',
        MEDIDA_RIN: '',
        MEDIDA_LLANTA: '',
        PRECIO: '',
        IMAGEN: '',
        CONDICION: 'nueva',
        TIPO_VEHICULO: '',
        STOCK: '',
      });
      setShowForm(false);

      // Recargar llantas
      fetchLlantas();
    } catch (err) {
      setError('Error guardando llanta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (llanta) => {
    setFormData(llanta);
    setEditingId(llanta.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta llanta?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/llantas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Llanta eliminada exitosamente');
      fetchLlantas();
    } catch (err) {
      setError('Error eliminando llanta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      MARCA: '',
      MODELO_LLANTA: '',
      MEDIDA_RIN: '',
      MEDIDA_LLANTA: '',
      PRECIO: '',
      IMAGEN: '',
      CONDICION: 'nueva',
      TIPO_VEHICULO: '',
      STOCK: '',
    });
  };

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 mb-4">
            <i className="fas fa-tire"></i> Administración de Llantas
          </h1>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess('')}
              ></button>
            </div>
          )}

          {!showForm ? (
            <div>
              <button
                className="btn btn-primary mb-4"
                onClick={() => setShowForm(true)}
              >
                <i className="fas fa-plus"></i> Agregar Nueva Llanta
              </button>

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Medida Rin</th>
                        <th>Medida Llanta</th>
                        <th>Precio</th>
                        <th>Condición</th>
                        <th>Tipo Vehículo</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {llantas.length > 0 ? (
                        llantas.map((llanta) => (
                          <tr key={llanta.id}>
                            <td>{llanta.MARCA}</td>
                            <td>{llanta.MODELO_LLANTA}</td>
                            <td>{llanta.MEDIDA_RIN}</td>
                            <td>{llanta.MEDIDA_LLANTA}</td>
                            <td>${parseFloat(llanta.PRECIO).toFixed(2)}</td>
                            <td>
                              <span
                                className={`badge ${
                                  llanta.CONDICION === 'nueva'
                                    ? 'bg-success'
                                    : 'bg-warning'
                                }`}
                              >
                                {llanta.CONDICION}
                              </span>
                            </td>
                            <td>{llanta.TIPO_VEHICULO}</td>
                            <td>{llanta.STOCK}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEdit(llanta)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(llanta.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center text-muted">
                            No hay llantas registradas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  {editingId ? 'Editar Llanta' : 'Agregar Nueva Llanta'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MARCA" className="form-label">
                        Marca *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MARCA"
                        name="MARCA"
                        value={formData.MARCA}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MODELO_LLANTA" className="form-label">
                        Modelo Llanta
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MODELO_LLANTA"
                        name="MODELO_LLANTA"
                        value={formData.MODELO_LLANTA}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MEDIDA_RIN" className="form-label">
                        Medida Rin
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MEDIDA_RIN"
                        name="MEDIDA_RIN"
                        value={formData.MEDIDA_RIN}
                        onChange={handleInputChange}
                        placeholder="ej: 16, 17, 18"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MEDIDA_LLANTA" className="form-label">
                        Medida Llanta
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MEDIDA_LLANTA"
                        name="MEDIDA_LLANTA"
                        value={formData.MEDIDA_LLANTA}
                        onChange={handleInputChange}
                        placeholder="ej: 195/65R15"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="PRECIO" className="form-label">
                        Precio *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="PRECIO"
                        name="PRECIO"
                        step="0.01"
                        value={formData.PRECIO}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="STOCK" className="form-label">
                        Stock *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="STOCK"
                        name="STOCK"
                        value={formData.STOCK}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="CONDICION" className="form-label">
                        Condición
                      </label>
                      <select
                        className="form-select"
                        id="CONDICION"
                        name="CONDICION"
                        value={formData.CONDICION}
                        onChange={handleInputChange}
                      >
                        <option value="nueva">Nueva</option>
                        <option value="reacondicionada">Reacondicionada</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="TIPO_VEHICULO" className="form-label">
                        Tipo de Vehículo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="TIPO_VEHICULO"
                        name="TIPO_VEHICULO"
                        value={formData.TIPO_VEHICULO}
                        onChange={handleInputChange}
                        placeholder="ej: Auto, Camión, Moto"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="IMAGEN" className="form-label">
                      URL de Imagen
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="IMAGEN"
                      name="IMAGEN"
                      value={formData.IMAGEN}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLlantas;
