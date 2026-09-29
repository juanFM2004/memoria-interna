import React from 'react';
import ReactDOM from 'react-dom/client';
import RiscSimulator from './components/RiscSimulator.jsx';
import './styles.css';
import './risc-simulator.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RiscSimulator />
  </React.StrictMode>
);