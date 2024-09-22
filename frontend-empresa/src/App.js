import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DepartamentoCadastro from './Paginas/Departamento/DepartamentoCadastro';
import FuncionarioCadastro from './Paginas/Funcionario/FuncionarioCadastro';
import NavBar from './Componentes/NavBar';

function App() {
  return (
    <Router>
      <div>
        <NavBar /> {}
        <h1>Gestão de Empresa</h1>
        <Routes>
          <Route path="/departamentos" element={<DepartamentoCadastro />} />
          <Route path="/funcionarios" element={<FuncionarioCadastro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
