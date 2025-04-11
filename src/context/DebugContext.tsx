import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DebugContextType {
  isDebugPanelVisible: boolean;
  showDebugPanel: () => void;
  hideDebugPanel: () => void;
  toggleDebugPanel: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

interface DebugProviderProps {
  children: ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [isDebugPanelVisible, setIsDebugPanelVisible] = useState(false);

  const showDebugPanel = () => setIsDebugPanelVisible(true);
  const hideDebugPanel = () => setIsDebugPanelVisible(false);
  const toggleDebugPanel = () => setIsDebugPanelVisible(prev => !prev);

  return (
    <DebugContext.Provider
      value={{
        isDebugPanelVisible,
        showDebugPanel,
        hideDebugPanel,
        toggleDebugPanel,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = (): DebugContextType => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
