import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    tipoCreador: 'Diseñador'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim() || !formData.correo.trim()) {
      setError('Todos los campos obligatorios deben estar llenos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    setError('');
    // Guardar en localStorage
    localStorage.setItem('registraIpUsuario', JSON.stringify(formData));
    // Redirigir al dashboard
    navigate('/dashboard');
  };

  return (
    <div className="registro-card">
      <h2>Registro de Creador de Contenido</h2>
      <form onSubmit={handleSubmit} className="registro-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Xavier Uriel Reyes Vilchis"
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="correo@dominio.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoCreador">Tipo de Creador:</label>
          <select
            id="tipoCreador"
            name="tipoCreador"
            value={formData.tipoCreador}
            onChange={handleChange}
          >
            <option value="Diseñador">Diseñador</option>
            <option value="Fotógrafo">Fotógrafo</option>
            <option value="Escritor">Escritor</option>
            <option value="Cineasta">Cineasta</option>
          </select>
        </div>

        {/* Contenedor de error accesible */}
        <div aria-live="polite" className="error-container">
          {error && <p className="error-message">{error}</p>}
        </div>

        <button type="submit" className="btn-submit">Registrarse</button>
      </form>
    </div>
  );
}