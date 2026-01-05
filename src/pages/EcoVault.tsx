import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vault, TrendingUp } from "lucide-react";

// Placeholder page - will be fully implemented in Task 6
const EcoVault = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Vault className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Eco Vault</h1>
        </div>
        
        <Card className="bg-gradient-to-r from-primary/10 to-eco-light/20 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Coming Soon - Task 6
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Trang Eco Vault (Staking) sẽ được hoàn thiện trong Task 6 với đầy đủ chức năng:
              Các gói staking APR, gửi/rút ECO token.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EcoVault;
