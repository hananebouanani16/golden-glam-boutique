
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Récupération du mot de passe depuis les variables d'environnement
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "25051985n*N";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const authStatus = localStorage.getItem('adminAuth');
    const authTimestamp = localStorage.getItem('adminAuthTime');
    
    // Expirer la session après 24 heures
    if (authStatus === 'true' && authTimestamp) {
      const timeElapsed = Date.now() - parseInt(authTimestamp);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (timeElapsed < twentyFourHours) {
        setIsAuthenticated(true);
      } else {
        // Session expirée
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTime');
      }
    }
  }, []);

  const login = (password: string): boolean => {
    // Validation plus stricte du mot de passe
    if (password && password.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
