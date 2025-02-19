import React, { createContext, useState, ReactNode } from 'react';

interface TableContextProps {
  table: string;
  chain: string;
  setTable: (value: string) => void;
  setChain: (value: string) => void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

const TableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [table, setTable] = useState<string>('');
  const [chain, setChain] = useState<string>('');

  return (
    <TableContext.Provider value={{ table, chain, setTable, setChain }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = React.useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

export { TableContext, TableProvider };