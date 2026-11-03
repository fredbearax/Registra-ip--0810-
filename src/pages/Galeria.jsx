import React, { useState, useEffect } from 'react';
import { generarCertificadoPdf } from '../utils/generarCertificado';

export default function Galeria() {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true); // ISO 9241: Retroalimentación visual de carga (Loader)
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [orden, setOrden] = useState('recientes');
  const [obraSeleccionada, setObraSeleccionada] = useState(null); // Para el modal de detalle

  // Cargar obras del backend al montar el componente
  useEffect(() => {
    fetch('http://localhost:4000/api/obras') // Ajusta tu endpoint si es necesario
      .then(res => res.json())
      .then(data => {
        setObras(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar obras:", err);
        setLoading(false);
      });
  }, []);

  // Filtrado y Ordenamiento
  const obrasFiltradas = obras
    .filter(obra => {
      const textoMatch = obra.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                         obra.autor.toLowerCase().includes(busqueda.toLowerCase());
      const catMatch = categoriaFiltro === 'Todas' || obra.categoria === categoriaFiltro;
      return textoMatch && catMatch;
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fechaRegistro || Date.now());
      const fechaB = new Date(b.fechaRegistro || Date.now());
      return orden === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
    });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Galería de Obras Registradas</h2>

      {/* Barra de Búsqueda y Filtros */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        <input 
          type="text" 
          placeholder="Buscar por título o autor..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', flex: '1', minWidth: '220px', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <select 
          value={categoriaFiltro} 
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Diseño">Diseño</option>
          <option value="Fotografía">Fotografía</option>
          <option value=" Escritura">Escritura</option>
          <option value="Cine">Cine</option>
        </select>

        <select 
          value={orden} 
          onChange={(e) => setOrden(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="recientes">Más recientes primero</option>
          <option value="antiguas">Más antiguas primero</option>
        </select>
      </div>

      {/* CRITERIO ISO 9241-110 / 9241-9: Retroalimentación visual de carga (Loader) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#1b4d3e' }}>
          ⏳ Cargando obras del servidor, por favor espere...
        </div>
      ) : obrasFiltradas.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>No se encontraron obras registradas.</p>
      ) : (
        /* Grid Responsivo (CSS Grid) */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {obrasFiltradas.map((obra) => (
            <div 
              key={obra.folio || obra.id}
              onClick={() => setObraSeleccionada(obra)}
              style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
            >
              <div style={{ height: '140px', background: '#f5f5f5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>
                {obra.categoria === 'Fotografia' ? '📸' : obra.categoria === 'Cine' ? '🎬' : obra.categoria === 'Escritura' ? '✍️' : '🎨'}
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1b4d3e' }}>{obra.titulo}</h4>
              <p style={{ margin: '0.2rem 0', color: '#555', fontSize: '0.9rem' }}><strong>Autor:</strong> {obra.autor}</p>
              <p style={{ margin: '0.2rem 0', color: '#555', fontSize: '0.9rem' }}><strong>Categoría:</strong> {obra.categoria}</p>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Detalle (Modal) */}
      {obraSeleccionada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', position: 'relative' }}>
            <h3>Detalle de la Obra</h3>
            <p><strong>Folio:</strong> {obraSeleccionada.folio}</p>
            <p><strong>Título:</strong> {obraSeleccionada.titulo}</p>
            <p><strong>Autor:</strong> {obraSeleccionada.autor}</p>
            <p><strong>Categoría:</strong> {obraSeleccionada.categoria}</p>
            <p><strong>Descripción:</strong> {obraSeleccionada.descripcion}</p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {/* CRITERIO ISO 9241-9 / Accesibilidad Táctil: Área mínima de toque de 44x44px en elementos interactivos */}
              <button 
                onClick={() => generarCertificadoPdf(obraSeleccionada)}
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  padding: '12px 20px',
                  backgroundColor: '#1b4d3e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                📥 Descargar Certificado
              </button>

              <button 
                onClick={() => setObraSeleccionada(null)}
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  padding: '12px 20px',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}