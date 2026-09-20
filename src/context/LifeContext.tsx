import React, { createContext, useContext, ReactNode } from 'react';
import { useLifeData } from '../hooks/useLifeData';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

export type LifeDataContextType = ReturnType<typeof useLifeData>;

export interface LifeContextValue {
  lifeData: LifeDataContextType;
  theme: ReturnType<typeof useTheme>;
  language: ReturnType<typeof useLanguage>;
  toast: ReturnType<typeof useToast>;
}

const LifeContext = createContext<LifeContextValue | undefined>(undefined);

export const LifeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const lifeData = useLifeData();
  const theme = useTheme();
  const language = useLanguage();
  const toast = useToast();

  return (
    <LifeContext.Provider value={{ lifeData, theme, language, toast }}>
      {children}
    </LifeContext.Provider>
  );
};

export function useLifeContext(): LifeContextValue {
  const context = useContext(LifeContext);
  if (!context) {
    throw new Error('useLifeContext must be used within a LifeProvider');
  }
  return context;
}
