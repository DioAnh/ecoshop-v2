import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@suiet/wallet-kit'; // Import Wallet Hook

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet(); // Lấy trạng thái ví
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. ƯU TIÊN VÍ WEB3: Nếu ví đã kết nối, tạo User giả lập từ ví
    if (wallet.connected && wallet.address) {
      const mockUser = {
        id: wallet.address, // QUAN TRỌNG: Dùng địa chỉ ví làm User ID
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: 'wallet_user@ecoshop.com'
      } as User;

      setUser(mockUser);
      setSession(null); // Web3 không dùng session token của Supabase
      setLoading(false);
      return; // Dừng check Supabase auth
    }

    // 2. NẾU KHÔNG CÓ VÍ: Check Supabase Auth bình thường (Fallback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.email === 'admin@admin.com');
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'admin@admin.com');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [wallet.connected, wallet.address]); // Chạy lại khi trạng thái ví thay đổi

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { first_name: firstName, last_name: lastName }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    // Nếu đang dùng ví -> Ngắt kết nối ví
    if (wallet.connected) {
      await wallet.disconnect();
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};