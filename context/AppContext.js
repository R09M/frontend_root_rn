import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('ko');
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      isDarkMode, 
      setIsDarkMode 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};