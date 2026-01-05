import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Award, Flame, History, User } from "lucide-react";

// Placeholder page - will be fully implemented in Task 5
const EcoProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">My Eco Profile</h1>
        </div>
        
        <Card className="bg-gradient-to-r from-primary/10 to-eco-light/20 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Coming Soon - Task 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Trang Eco Profile sẽ được hoàn thiện trong Task 5 với đầy đủ chức năng:
              Wallet, Badges, Streak, Lịch sử giao dịch.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EcoProfile;
