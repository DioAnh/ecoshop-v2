import { useWallet } from '@suiet/wallet-kit';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const wallet = useWallet();
  const location = useLocation();
  const [isTimeout, setIsTimeout] = useState(false);

  // Fallback: Nếu connecting quá lâu (3s), coi như thất bại để tránh treo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (wallet.status === 'connecting') {
      timer = setTimeout(() => setIsTimeout(true), 3000);
    }
    return () => clearTimeout(timer);
  }, [wallet.status]);

  // Case 1: Đang kết nối -> Hiển thị Loading
  if (wallet.status === 'connecting' && !isTimeout) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-2 border-primary/30"></div>
        <p className="text-muted-foreground animate-pulse">Đang đồng bộ ví Web3...</p>
      </div>
    );
  }

  // Case 2: Chưa kết nối -> Đá về trang Auth
  if (!wallet.connected) {
    // Lưu lại trang hiện tại để redirect lại sau khi login (nếu cần phát triển thêm)
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Case 3: Đã kết nối -> Cho phép vào
  return <>{children}</>;
};

export default ProtectedRoute;