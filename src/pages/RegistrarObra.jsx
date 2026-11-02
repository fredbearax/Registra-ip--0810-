import React, { useState } from 'react';
import './RegistrarObra.css'; // Opcional para tus estilos
import { generarCertificadoPdf } from '../utils/generarCertificado';

export default function RegistrarObra() {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    archivo: null,
    titulo: '',
    categoria: 'Pintura',
    descripcion: '',
    autor: 'Xavier Uriel Reyes Vilchis'
  });
  const [folioGenerado, setFolioGenerado] = useState('');
  const [loading, setLoading] = useState(false);

  // Manejador de cambios generales
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'archivo') {
      setFormData({ ...formData, archivo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validaciones por paso
  const esPasoValido = () => {
    if (paso === 1) return formData.archivo !== null;
    if (paso === 2) return formData.titulo.trim().length >= 5 && formData.categoria !== '';
    return true;
  };

  const handleSiguiente = () => {
    if (esPasoValido()) setPaso(paso + 1);
  };

  const handleAnterior = () => {
    if (paso > 1) setPaso(paso - 1);
  };

  // Envío final al backend
  const handleSubmitFinal = async () => {
    setLoading(true);
    const data = new FormData();
    const folioAsignado = `OBRA-0810-00${Math.floor(Math.random() * 900) + 100}`; // Ejemplo dinámico con tu boleta

    data.append('folio', folioAsignado);
    data.append('titulo', formData.titulo);
    data.append('categoria', formData.categoria);
    data.append('descripcion', formData.descripcion);
    data.append('autor', formData.autor);
    if (formData.archivo) {
      data.append('archivo', formData.archivo);
    }

    try {
      const response = await fetch('http://localhost:4000/obras', {
        method: 'POST',
        body: data
      });
      const resultado = await response.json();
      if (response.ok) {
        setFolioGenerado(resultado.obra.folio);
        setPaso(4); // Ir a confirmación final
      } else {
        alert('Error al registrar: ' + resultado.error);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor backend en el puerto 4000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Registro de Obra - Wizard</h2>

      {/* Barra de progreso visual */}
      <div className="progress-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map((num) => (
          <div 
            key={num} 
            style={{
              width: '35px', height: '35px', borderRadius: '50%',
              background: paso >= num ? '#1b4d3e' : '#ccc',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            {num}
          </div>
        ))}
      </div>

      {/* PASO 1: Subir Archivo */}
      {paso === 1 && (
        <div className="step-content">
          <h3>Paso 1: Subir Archivo de la Obra</h3>
          <input type="file" name="archivo" onChange={handleChange} style={{ margin: '1rem 0' }} />
          {formData.archivo && <p style={{ color: 'green' }}>Archivo seleccionado: {formData.archivo.name}</p>}
        </div>
      )}

      {/* PASO 2: Metadatos */}
      {paso === 2 && (
        <div className="step-content">
          <h3>Paso 2: Metadatos de la Obra</h3>
          <div style={{ margin: '1rem 0' }}>
            <label>Título (mínimo 5 caracteres):</label><br />
            <input 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ margin: '1rem 0' }}>
            <label>Categoría:</label><br />
            <select name="categoria" value={formData.categoria} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
              <option value="Pintura">Pintura</option>
              <option value="Escultura">Escultura</option>
              <option value="Digital">Arte Digital</option>
              <option value="Fotografía">Fotografía</option>
            </select>
          </div>
          <div style={{ margin: '1rem 0' }}>
            <label>Descripción:</label><br />
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>
      )}

      {/* PASO 3: Vista Previa */}
      {paso === 3 && (
        <div className="step-content">
          <h3>Paso 3: Vista Previa del Resumen</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li><strong>Archivo:</strong> {formData.archivo ? formData.archivo.name : 'Ninguno'}</li>
            <li><strong>Título:</strong> {formData.titulo}</li>
            <li><strong>Categoría:</strong> {formData.categoria}</li>
            <li><strong>Descripción:</strong> {formData.descripcion || 'Sin descripción'}</li>
            <li><strong>Autor:</strong> {formData.autor}</li>
          </ul>
        </div>
      )}

      {/* PASO 4: Confirmación Final */}
      {paso === 4 && (
  <div className="step-content" style={{ textAlign: 'center' }}>
    <h3>¡Registro Exitoso!</h3>
    <p>Tu obra ha sido guardada correctamente en el servidor.</p>
    
    <div style={{ background: '#e8f5e9', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
      <strong>Folio Asignado:</strong> <span style={{ fontSize: '1.2rem', color: '#1b4d3e' }}>{folioGenerado}</span>
    </div>

    {/* 2. Colocas el botón aquí para que el usuario descargue su certificado inmediatamente */}
    <button 
      onClick={() => generarCertificadoPdf({
        folio: folioGenerado,
        titulo: formData.titulo,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        autor: formData.autor
      })}
      style={{
        padding: '12px 24px',
        background: '#1b4d3e',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginTop: '1rem'
      }}
    >
      📥 Descargar certificado en PDF
    </button>
  </div>
)}

      {/* Botones de Navegación */}
      <div className="wizard-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        {paso > 1 && paso < 4 && (
          <button onClick={handleAnterior} style={{ padding: '10px 20px' }}>Atrás</button>
        )}
        
        {paso < 3 && (
          <button 
            onClick={handleSiguiente} 
            disabled={!esPasoValido()} 
            style={{ padding: '10px 20px', background: esPasoValido() ? '#1b4d3e' : '#ccc', color: '#fff', border: 'none' }}
          >
            Siguiente
          </button>
        )}

        {paso === 3 && (
          <button 
            onClick={handleSubmitFinal} 
            disabled={loading}
            style={{ padding: '10px 20px', background: '#1b4d3e', color: '#fff', border: 'none' }}
          >
            {loading ? 'Guardando...' : 'Confirmar y Enviar'}
          </button>
        )}
      </div>
    </div>
  );
}