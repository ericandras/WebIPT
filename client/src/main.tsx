import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './utils/socketContext.jsx'


const rootElement = document.querySelector<HTMLElement>("#root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SocketProvider>
        <App />
      </SocketProvider>
    </StrictMode>
  );
}
