import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Função para iniciar o mock em ambiente de desenvolvimento
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
 
  const { worker } = await import('./mocks/browser');
 
  // Inicia o worker
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
 
const root = ReactDOM.createRoot(document.getElementById('root'));

// Inicia o mock ANTES de renderizar a aplicação
enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});