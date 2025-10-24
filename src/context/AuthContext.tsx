import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react'; 

import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth'; 
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase/config';

// Define o que o contexto irá fornecer
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

// Cria o contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
});

// Componente Provedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(false); 

      if (currentUser) {
        try {
          const idTokenResult = await getIdTokenResult(currentUser, true); 
          if (idTokenResult.claims.admin === true) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Erro ao verificar claims de admin:", error);
  
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};