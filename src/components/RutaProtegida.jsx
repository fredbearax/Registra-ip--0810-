import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RutaProtegida({ children }) {
  const usuario = localStorage.getItem('registraIpUsuario');

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}