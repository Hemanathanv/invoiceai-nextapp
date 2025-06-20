'use client'; // only if using App Router

import { createContext, useContext, useState, ReactNode } from 'react';

type GlobalStateType = {
  remining_space: object | null;
  setRemining_space: (remining_space: object | null) => void;
};

const GlobalStateContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [remining_space, setRemining_space] = useState<object | null>(null);

  return (
    <GlobalStateContext.Provider value={{ remining_space, setRemining_space }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateType => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalStateProvider');
  return context;
};
