import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signUpWithPhone: (phone: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  checkAdminCode: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const ADMIN_CODE = "551010";

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            checkAdminStatus(session.user);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            setTimeout(() => {
              if (isMounted) {
                checkAdminStatus(session.user);
              }
            }, 0);
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Check if user has admin privileges
      const adminEmail = user.email?.toLowerCase();
      setIsAdmin(adminEmail === 'admin@sribalajitemple.org' || profile?.username === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const checkAdminCode = (code: string): boolean => {
    return code === ADMIN_CODE;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectTo = window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google sign in failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOtp = async (phone: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) throw error;
      
      toast({
        title: "OTP sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Phone sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const redirectTo = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: userData?.full_name || userData?.fullName || 'User',
            username: userData?.username || email.split('@')[0],
            ...userData
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Welcome to Sri Balaji Temple community! Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, userData?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            full_name: userData?.full_name || userData?.fullName || 'User',
            username: userData?.username || phone,
            ...userData
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "OTP sent",
        description: "Please check your phone for the verification code to complete registration.",
      });
    } catch (error: any) {
      toast({
        title: "Phone sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAdmin(false);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ 
          user_id: user.id, 
          ...data,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signIn,
      signInWithGoogle,
      signInWithOtp,
      verifyOtp,
      signUp,
      signUpWithPhone,
      signOut,
      updateProfile,
      checkAdminCode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
