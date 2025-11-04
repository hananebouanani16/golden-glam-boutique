import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session au chargement
    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    console.log('[AdminAuth] 🔄 Vérification session admin...');
    setLoading(true);
    
    // Timeout de 8 secondes
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 8000)
    );
    
    try {
      const sessionPromise = supabase.auth.getSession();
      const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
      }
      console.log('[AdminAuth] ✅ Session vérifiée');
    } catch (error: any) {
      if (error.message === 'Timeout') {
        console.error('[AdminAuth] ⏱️ Timeout - vérification session trop longue');
      } else {
        console.error('[AdminAuth] ❌ Erreur vérification session:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    console.log('[AdminAuth] 🔄 Vérification rôle admin...');
    
    // Timeout de 5 secondes
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );
    
    try {
      const rolePromise = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle(); // Utiliser maybeSingle au lieu de single
      
      const { data, error } = await Promise.race([rolePromise, timeoutPromise]) as any;

      const hasAdminRole = !!data && !error;
      setIsAdmin(hasAdminRole);
      console.log('[AdminAuth] ✅ Rôle vérifié:', hasAdminRole);
      return hasAdminRole;
    } catch (error: any) {
      if (error.message === 'Timeout') {
        console.error('[AdminAuth] ⏱️ Timeout - vérification rôle trop longue');
      } else {
        console.error('[AdminAuth] ❌ Erreur vérification rôle:', error);
      }
      setIsAdmin(false);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AdminAuth] 🔐 Tentative de connexion...');
    
    // Timeout de 10 secondes pour la connexion
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('La connexion prend trop de temps. Vérifiez votre connexion Internet.')), 10000)
    );
    
    try {
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;

      if (error) throw error;
      
      if (data.user) {
        const hasAdminRole = await checkAdminRole(data.user.id);
        if (!hasAdminRole) {
          await supabase.auth.signOut();
          throw new Error('Accès non autorisé - Vous devez être administrateur');
        }
        console.log('[AdminAuth] ✅ Connexion admin réussie');
      }
    } catch (error: any) {
      console.error('[AdminAuth] ❌ Erreur connexion:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
