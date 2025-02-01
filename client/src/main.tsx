import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import './styles/variables.css'
import { SocketProvider } from './utils/socketContext.js'
import { RouteProvider } from './routes/RoutesProvider.js'


const rootElement = document.querySelector<HTMLElement>("#root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SocketProvider>
        <RouteProvider>
          <App />
        </RouteProvider>
      </SocketProvider>
    </StrictMode>
  );
}
