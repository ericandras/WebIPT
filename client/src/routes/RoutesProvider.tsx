import React, { createContext, useState, useContext, ReactNode } from 'react';

type RouteType = 'Nat' | 'Raw' | 'Mangle' | 'Filter' | 'Home';

interface RouteContextType {
  route: RouteType;
  setRoute: (route: RouteType) => void;
}

// Valor padrão para o contexto
const defaultRouteContext: RouteContextType = {
  route: 'Home', // Valor inicial
  setRoute: () => {
    throw new Error('setRoute function must be overridden by RouteProvider');
  },
};

// Cria o contexto com o valor padrão
const RouteContext = createContext<RouteContextType>(defaultRouteContext);

interface RouteProviderProps {
  children: ReactNode;
}

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [route, setRoute] = useState<RouteType>('Home'); // Valor inicial

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  return useContext(RouteContext);
};