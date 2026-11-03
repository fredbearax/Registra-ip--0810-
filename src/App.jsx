import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RegistrarObra from './pages/RegistrarObra'; // Asegúrate de importar tu wizard aquí
import Dashboard from './pages/Dashboard';
import RutaProtegida from './components/RutaProtegida';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Esto es lo que va dentro de tu archivo App.jsx */}
        <Route path="/" element={<Layout />}>
        <Route element="{<Galeria" path="galeria"/>
          <Route index element={<RegistrarObra />} />
          <Route 
            path="dashboard" 
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;