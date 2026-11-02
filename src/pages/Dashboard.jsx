import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const usuarioGuardado = JSON.parse(localStorage.getItem('registraIpUsuario')) || { nombre: 'Creador' };

  const handleLogout = () => {
    localStorage.removeItem('registraIpUsuario');
    navigate('/');
  };

  return (
    <div className="dashboard-card">
      <h2>Panel de Control (Dashboard)</h2>
      <p className="welcome-text">¡Bienvenido de nuevo, <strong>{usuarioGuardado.nombre}</strong>!</p>
      <div className="info-box">
        <p><strong>Correo:</strong> {usuarioGuardado.correo}</p>
        <p><strong>Rol / Perfil:</strong> {usuarioGuardado.tipoCreador}</p>
      </div>
      <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
    </div>
  );
}