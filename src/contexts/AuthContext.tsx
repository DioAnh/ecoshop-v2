import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Thêm role 'verifier'
export type UserRole = 'consumer' | 'shipper' | 'business' | 'verifier';

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
}

const MOCK_PROFILES: Record<UserRole, UserProfile> = {
  consumer: { id: 'user-consumer-01', name: 'Nguyễn Mai Anh', role: 'consumer', avatar: 'https://github.com/shadcn.png', email: 'maianh@example.com' },
  shipper: { id: 'user-shipper-01', name: 'Trần Văn Ship', role: 'shipper', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', email: 'shipper@ecoshop.com' },
  business: { id: 'user-business-01', name: 'Green Farm Co.', role: 'business', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GF', email: 'contact@greenfarm.vn' },
  // Profile cho Verifier
  verifier: { id: 'user-verifier-01', name: 'VinaControl Carbon', role: 'verifier', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=VC', email: 'audit@vinacontrol.vn' }
};

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  switchRole: (role: UserRole) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(MOCK_PROFILES['consumer']);
  const [role, setRole] = useState<UserRole>('consumer');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const switchRole = (newRole: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setRole(newRole);
      setUser(MOCK_PROFILES[newRole]);
      setIsLoading(false);
      // Điều hướng thông minh
      if (newRole === 'shipper') navigate('/shipper');
      else if (newRole === 'business') navigate('/business');
      else if (newRole === 'verifier') navigate('/verification'); // Route mới
      else navigate('/');
    }, 500);
  };

  const signOut = async () => { await supabase.auth.signOut(); setUser(null); navigate('/auth'); };

  const value = { user, role, isLoading, switchRole, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};