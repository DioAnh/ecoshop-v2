import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Wallet, Shield, Coins, ArrowRight } from 'lucide-react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { useEffect } from 'react';

const Auth = () => {
  const navigate = useNavigate();
  const wallet = useWallet();

  // Redirect to home if wallet is connected
  useEffect(() => {
    if (wallet.connected) {
      navigate('/');
    }
  }, [wallet.connected, navigate]);

  const features = [
    {
      icon: Wallet,
      title: 'Kết nối ví Sui',
      description: 'Hỗ trợ Sui Wallet, Suiet, Surf và nhiều ví khác'
    },
    {
      icon: Coins,
      title: 'Nhận ECO Token',
      description: 'Mua sắm xanh, tích lũy token từ việc giảm CO2'
    },
    {
      icon: Shield,
      title: 'Bảo mật Web3',
      description: 'Tài sản của bạn, quyền kiểm soát của bạn'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-light/20 via-background to-primary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-primary block">EcoShop</span>
            <span className="text-sm text-muted-foreground">Shop-to-Earn on Sui</span>
          </div>
        </div>

        <Card className="border-primary/20 shadow-xl shadow-primary/10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Kết nối ví để bắt đầu</CardTitle>
            <CardDescription className="text-base">
              Mua sắm xanh, nhận thưởng token ECO trên blockchain Sui
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Connect Wallet Button */}
            <div className="pt-4">
              <ConnectButton 
                className="!w-full !bg-primary !text-primary-foreground !rounded-lg !px-6 !py-4 !font-semibold !text-lg hover:!bg-primary/90 !transition-all !flex !items-center !justify-center !gap-3 !shadow-lg !shadow-primary/30"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
                <ArrowRight className="w-5 h-5" />
              </ConnectButton>
            </div>

            {/* Supported Wallets */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Ví được hỗ trợ</p>
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">Sui Wallet</span>
                <span className="px-2 py-1 bg-muted rounded">Suiet</span>
                <span className="px-2 py-1 bg-muted rounded">Surf</span>
                <span className="px-2 py-1 bg-muted rounded">+more</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground"
          >
            ← Quay về trang chủ
          </Button>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground mt-4 px-4">
          Bằng việc kết nối ví, bạn đồng ý với các điều khoản sử dụng của EcoShop. 
          Chúng tôi không bao giờ yêu cầu seed phrase của bạn.
        </p>
      </div>
    </div>
  );
};

export default Auth;
