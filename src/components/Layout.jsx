import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.css'; // O estilos en línea/App.css

export default function Layout() {
  return (
    <div className="layout-container">
      <header className="main-header">
        <h1>REGISTRA-IP</h1>
        <p className="subtitle">Sistema de Registro y Verificación de Autoría</p>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}