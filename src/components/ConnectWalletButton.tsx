import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '@/contexts/WalletContext';

const ConnectWalletButton = () => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const { shortAddress, ecoBalance } = useWalletContext();

  if (!wallet.connected) {
    return (
      <ConnectButton 
        className="!bg-primary !text-primary-foreground !rounded-md !px-4 !py-2 !font-medium hover:!bg-primary/90 !transition-colors !flex !items-center !gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </ConnectButton>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-primary/30 bg-primary/5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-mono text-sm">{shortAddress}</span>
          <div className="flex items-center gap-1 text-primary font-medium">
            <span>{ecoBalance.toFixed(2)}</span>
            <span className="text-xs">ECO</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate('/eco-profile')}>
          <Wallet className="w-4 h-4 mr-2" />
          My Eco Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/eco-vault')}>
          <Wallet className="w-4 h-4 mr-2" />
          Eco Vault
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => wallet.disconnect()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectWalletButton;
