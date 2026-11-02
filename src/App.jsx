import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import RutaProtegida from './components/RutaProtegida';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Registro />} />
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