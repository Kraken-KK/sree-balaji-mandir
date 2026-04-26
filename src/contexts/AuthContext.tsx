import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { useToast } from '@/hooks/use-toast';
import SubscriberDialog from '@/components/SubscriberDialog';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isFamily: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
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
  const [isFamily, setIsFamily] = useState(false);
  const [showSubscriberDialog, setShowSubscriberDialog] = useState(false);
  const [subscriberData, setSubscriberData] = useState<{email: string, name: string}>({email: '', name: ''});
  const { toast } = useToast();

  const ADMIN_CODE = "552010";

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            setTimeout(() => {
              if (isMounted) checkAdminStatus(session.user);
            }, 0);
            
            if (event === 'SIGNED_IN') {
              const hasSeenDialog = localStorage.getItem('newsletter_dialog_shown');
              if (!hasSeenDialog) {
                setTimeout(() => {
                  setSubscriberData({
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || 'User'
                  });
                  setShowSubscriberDialog(true);
                  localStorage.setItem('newsletter_dialog_shown', 'true');
                }, 1500);
              }
            }
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
        }
      }
    );

    // THEN get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error('Error getting session:', error);
        else if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) checkAdminStatus(session.user);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    if (!user) { setIsAdmin(false); setIsFamily(false); return; }
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      const adminEmail = user.email?.toLowerCase();
      setIsAdmin(adminEmail === 'admin@sribalajitemple.org' || profile?.username === 'admin');

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      setIsFamily(!!roles?.some((r: any) => r.role === 'family'));
    } catch {
      setIsAdmin(false);
      setIsFamily(false);
    }
  };

  const checkAdminCode = (code: string): boolean => code === ADMIN_CODE;

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back!", description: "You have successfully signed in." });
    } catch (error: any) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({ title: "Google sign in failed", description: error.message || "Please try again", variant: "destructive" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      toast({ title: "Apple sign in failed", description: error.message || "Please try again", variant: "destructive" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: userData?.full_name || userData?.fullName || 'User',
            username: userData?.username || email.split('@')[0],
            ...userData
          }
        }
      });
      if (error) throw error;
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
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
      toast({ title: "Signed out", description: "You have been signed out successfully." });
    } catch (error: any) {
      toast({ title: "Sign out failed", description: error.message, variant: "destructive" });
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) throw new Error('No user logged in');
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ user_id: user.id, ...data, updated_at: new Date().toISOString() });
      if (error) throw error;
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading, isAdmin, isFamily,
      signIn, signInWithGoogle, signInWithApple, signUp, signOut, updateProfile, checkAdminCode,
    }}>
      {children}
      <SubscriberDialog
        open={showSubscriberDialog}
        onClose={() => setShowSubscriberDialog(false)}
        userEmail={subscriberData.email}
        userName={subscriberData.name}
      />
    </AuthContext.Provider>
  );
};
