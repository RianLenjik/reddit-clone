import React, { createContext, FC, ReactNode, useContext, useState } from 'react';

// Define a type for the context state
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

// Create a context with a default undefined value, then assert the type.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define a type for the provider props
interface AuthProviderProps {
  children: ReactNode; // Accepts React children
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwtToken'); // Clear the token on logout
  };

  // Provide the state and the functions via context
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
