import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Sprout, TreePine, Leaf } from "lucide-react";

interface DynamicNFTProps {
  co2Saved: number;
  investedAmount: number; // Số ECO đã tái đầu tư
}

const DynamicNFT = ({ co2Saved, investedAmount }: DynamicNFTProps) => {
  // Logic tính Level NFT (On-chain Logic Simulation)
  // Level 1: < 10kg CO2
  // Level 2: >= 10kg CO2
  // Level 3: >= 50kg CO2 + Đã đầu tư > 100 ECO
  // Level 4 (Max): >= 200kg CO2 + Đã đầu tư > 1000 ECO
  
  let level = 1;
  let nextTarget = 10;
  let currentProgress = co2Saved;
  let title = "Hạt Giống (Seed)";
  let image = "https://cdn-icons-png.flaticon.com/512/10696/10696772.png"; // Ảnh hạt giống
  let benefit = "+0% APR Staking";
  let color = "bg-gray-100 text-gray-600";

  if (co2Saved >= 10 && co2Saved < 50) {
    level = 2;
    nextTarget = 50;
    title = "Cây Non (Sapling)";
    image = "https://cdn-icons-png.flaticon.com/512/1598/1598196.png"; // Ảnh cây non
    benefit = "+2% APR Staking";
    color = "bg-green-100 text-green-700";
  } else if (co2Saved >= 50 && investedAmount >= 100 && co2Saved < 200) {
    level = 3;
    nextTarget = 200;
    title = "Cây Trưởng Thành (Tree)";
    image = "https://cdn-icons-png.flaticon.com/512/2921/2921865.png"; // Ảnh cây lớn
    benefit = "+5% APR Staking + Airdrop Access";
    color = "bg-emerald-100 text-emerald-800";
  } else if (co2Saved >= 200 && investedAmount >= 1000) {
    level = 4;
    nextTarget = 1000; // Max
    title = "Cổ Thụ (Ancient - Rare)";
    image = "https://cdn-icons-png.flaticon.com/512/4333/4333907.png"; // Ảnh cổ thụ thần thoại
    benefit = "+10% APR Staking + DAO Voting";
    color = "bg-purple-100 text-purple-800 border-purple-200 shadow-purple-100";
  }

  // Tính % tiến độ lên cấp
  const progressPercent = Math.min((currentProgress / nextTarget) * 100, 100);

  return (
    <Card className={`relative overflow-hidden border-2 ${level === 4 ? 'border-purple-400 shadow-xl' : 'border-dashed border-gray-200'}`}>
      {/* Hiệu ứng nền cho Level cao */}
      {level >= 3 && <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-100/30 z-0"></div>}
      
      <CardContent className="p-6 relative z-10 flex flex-col items-center text-center">
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-black/5 backdrop-blur-sm">Level {level}</Badge>
        </div>

        <div className="w-32 h-32 mb-4 transition-transform hover:scale-110 duration-500 cursor-pointer">
          <img src={image} alt="Dynamic NFT" className="w-full h-full object-contain drop-shadow-md" />
        </div>

        <h3 className={`text-xl font-extrabold mb-1 ${level === 4 ? 'text-purple-700' : 'text-gray-800'}`}>{title}</h3>
        <Badge className={`mb-4 ${color} hover:${color} border-none`}>{benefit}</Badge>

        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-500">
            <span>Tiến hóa tiếp theo</span>
            <span>{currentProgress.toFixed(1)} / {nextTarget} kg CO₂</span>
          </div>
          <Progress value={progressPercent} className="h-2" indicatorClassName={level === 4 ? "bg-purple-500" : "bg-green-500"} />
          
          {level < 3 && investedAmount < 100 && (
            <p className="text-[10px] text-orange-500 flex items-center justify-center gap-1 mt-2">
              <Zap className="w-3 h-3" /> Cần đầu tư thêm {100 - investedAmount} ECO để lên cấp 3
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicNFT;