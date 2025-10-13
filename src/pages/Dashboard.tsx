import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Leaf,
  TrendingDown,
  Users,
  Package,
  Truck,
  Award,
  Gift,
  Building2,
  Medal,
} from "lucide-react";
import { toast } from "sonner";
import carbonVCS from "@/assets/carbon-vcs.jpg";
import carbonGoldStandard from "@/assets/carbon-gold-standard.jpg";
import carbonIREC from "@/assets/carbon-irec.jpg";
import carbonVCU from "@/assets/carbon-vcu.jpg";

// Mock data
const wasteData = [
  { name: "Giấy", value: 35, color: "hsl(var(--eco-green))" },
  { name: "Nhựa", value: 25, color: "hsl(var(--accent))" },
  { name: "Kim loại", value: 20, color: "hsl(var(--earth-brown))" },
  { name: "Thủy tinh", value: 20, color: "hsl(var(--co2-low))" },
];

const monthlyEmissions = [
  { month: "T1", co2: 120 },
  { month: "T2", co2: 100 },
  { month: "T3", co2: 95 },
  { month: "T4", co2: 85 },
  { month: "T5", co2: 80 },
  { month: "T6", co2: 75 },
  { month: "T7", co2: 70 },
  { month: "T8", co2: 65 },
  { month: "T9", co2: 60 },
  { month: "T10", co2: 55 },
  { month: "T11", co2: 50 },
  { month: "T12", co2: 45 },
];

const departmentData = [
  { dept: "IT", co2Emitted: 80, co2Reduced: 30 },
  { dept: "Marketing", co2Emitted: 120, co2Reduced: 50 },
  { dept: "Sales", co2Emitted: 150, co2Reduced: 60 },
  { dept: "HR", co2Emitted: 60, co2Reduced: 25 },
  { dept: "Finance", co2Emitted: 70, co2Reduced: 35 },
];

const quarterlyTrend = [
  { quarter: "Q1/2024", packaging: 80, transport: 120, product: 200 },
  { quarter: "Q2/2024", packaging: 70, transport: 110, product: 180 },
  { quarter: "Q3/2024", packaging: 60, transport: 100, product: 160 },
  { quarter: "Q4/2024", packaging: 50, transport: 90, product: 140 },
];

const pointsHistory = [
  { date: "25/03/2025", activity: "Mua sản phẩm xanh", points: "+50" },
  { date: "20/03/2025", activity: "Quy đổi ve chai", points: "+30" },
  { date: "15/03/2025", activity: "Giao hàng bằng xe đạp", points: "+20" },
  { date: "10/03/2025", activity: "Đổi voucher", points: "-100" },
  { date: "05/03/2025", activity: "Mua sản phẩm xanh", points: "+45" },
];

const topEmployees = [
  { name: "Nguyễn Văn A", reduction: 150, points: 450 },
  { name: "Trần Thị B", reduction: 130, points: 390 },
  { name: "Lê Văn C", reduction: 120, points: 360 },
  { name: "Phạm Thị D", reduction: 110, points: 330 },
  { name: "Hoàng Văn E", reduction: 100, points: 300 },
];

const topCompanies = [
  { rank: 1, name: "GreenTech Corp", reduction: 2500, medal: "🥇" },
  { rank: 2, name: "EcoVietnam Ltd", reduction: 2300, medal: "🥈" },
  { rank: 3, name: "Sustainable Co", reduction: 2100, medal: "🥉" },
  { rank: 4, name: "Nature First", reduction: 1900, medal: "" },
  { rank: 5, name: "Clean Energy Inc", reduction: 1800, medal: "" },
];

const companyList = [
  { id: "1", name: "GreenTech Corp" },
  { id: "2", name: "EcoVietnam Ltd" },
  { id: "3", name: "Sustainable Co" },
  { id: "4", name: "Nature First" },
];

const carbonCredits = [
  { 
    id: 1, 
    name: "VCS", 
    fullName: "Verified Carbon Standard", 
    image: carbonVCS,
    price: "12,000 VNĐ/tấn CO₂",
    description: "Tiêu chuẩn tín chỉ carbon tự nguyện phổ biến nhất thế giới"
  },
  { 
    id: 2, 
    name: "Gold Standard", 
    fullName: "Gold Standard Carbon Credit", 
    image: carbonGoldStandard,
    price: "18,000 VNĐ/tấn CO₂",
    description: "Tín chỉ carbon cao cấp với tác động phát triển bền vững"
  },
  { 
    id: 3, 
    name: "I-REC", 
    fullName: "International REC Standard", 
    image: carbonIREC,
    price: "8,000 VNĐ/tấn CO₂",
    description: "Chứng chỉ năng lượng tái tạo quốc tế"
  },
  { 
    id: 4, 
    name: "VCU", 
    fullName: "Voluntary Carbon Units", 
    image: carbonVCU,
    price: "10,000 VNĐ/tấn CO₂",
    description: "Đơn vị carbon tự nguyện được công nhận rộng rãi"
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [greenpoints, setGreenpoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('greenpoints')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setGreenpoints(data?.greenpoints || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
    const company = companyList.find(c => c.id === companyId);
    toast.success(`Dữ liệu phát thải cá nhân và GreenPoint sẽ được đồng bộ với công ty ${company?.name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            📊 Báo cáo phát thải & GreenPoint
          </h1>
          <p className="text-muted-foreground">
            Theo dõi phát thải CO₂e và điểm GreenPoint của bạn
          </p>
        </div>

        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="individual">Cá nhân</TabsTrigger>
            <TabsTrigger value="company">Doanh nghiệp</TabsTrigger>
            <TabsTrigger value="partner">Doanh nghiệp sàn</TabsTrigger>
          </TabsList>

          {/* Tab 1: Individual */}
          <TabsContent value="individual" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* CO2 Overview Card */}
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="text-primary" />
                    Tổng quan phát thải
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng CO₂e đã phát thải</p>
                    <p className="text-3xl font-bold text-foreground">1,250 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CO₂e đã giảm</p>
                    <p className="text-3xl font-bold text-primary">350 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mục tiêu giảm phát thải tháng này: 70%
                    </p>
                    <Progress value={70} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* GreenPoint Card */}
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="text-accent" />
                    Điểm GreenPoint
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm tích lũy hiện tại</p>
                    <p className="text-3xl font-bold text-accent">
                      {loading ? "..." : `${greenpoints.toLocaleString()} điểm`}
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    <Gift className="mr-2 h-4 w-4" />
                    Đổi điểm lấy quà
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle>Tỷ lệ rác tái chế</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={wasteData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {wasteData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="eco-card">
                <CardHeader>
                  <CardTitle>Phát thải CO₂e theo tháng</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyEmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="co2" fill="hsl(var(--primary))" animationDuration={800} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Company Sync */}
            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Đồng bộ với công ty</CardTitle>
                <CardDescription>
                  Kết nối dữ liệu của bạn với công ty để tham gia các thử thách xanh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleCompanySelect}>
                  <SelectTrigger className="w-full md:w-[400px]">
                    <SelectValue placeholder="Chọn công ty của bạn" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyList.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Points History */}
            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Lịch sử giao dịch GreenPoint</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Hoạt động</TableHead>
                      <TableHead className="text-right">Điểm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pointsHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.activity}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={item.points.startsWith("+") ? "default" : "secondary"}
                            className={item.points.startsWith("+") ? "bg-primary" : ""}
                          >
                            {item.points}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Company */}
          <TabsContent value="company" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Tổng CO₂e công ty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">8,500 kg</p>
                </CardContent>
              </Card>
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">CO₂e đã giảm</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">2,100 kg</p>
                </CardContent>
              </Card>
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Nhân viên tham gia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">156</p>
                </CardContent>
              </Card>
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Tổng GreenPoint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-accent">45,600</p>
                </CardContent>
              </Card>
            </div>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Phát thải theo phòng ban</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dept" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="co2Emitted" fill="hsl(var(--muted-foreground))" name="CO₂e phát thải" stackId="a" />
                    <Bar dataKey="co2Reduced" fill="hsl(var(--primary))" name="CO₂e đã giảm" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="text-primary" />
                    Top nhân viên giảm phát thải
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead className="text-right">CO₂e giảm (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topEmployees.map((emp, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell className="text-right text-primary">{emp.reduction}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="text-accent" />
                    Top GreenPoint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead className="text-right">Điểm</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topEmployees.map((emp, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell className="text-right text-accent">{emp.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="text-primary" />
                  Bảng xếp hạng công ty xanh
                </CardTitle>
                <CardDescription>Top 10 công ty giảm phát thải nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Hạng</TableHead>
                      <TableHead>Công ty</TableHead>
                      <TableHead className="text-right">CO₂e giảm (kg)</TableHead>
                      <TableHead className="text-center">Huy hiệu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCompanies.map((company) => (
                      <TableRow key={company.rank}>
                        <TableCell className="font-bold">#{company.rank}</TableCell>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell className="text-right text-primary">{company.reduction.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-2xl">{company.medal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="eco-card border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="text-primary" />
                  Thử thách xanh
                </CardTitle>
                <CardDescription>
                  Mục tiêu chung: Giảm 3,000 kg CO₂e trong tháng này
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Tiến độ: 2,100 / 3,000 kg</span>
                    <span className="text-sm font-bold text-primary">70%</span>
                  </div>
                  <Progress value={70} className="h-3" />
                </div>
                <p className="text-sm text-muted-foreground">
                  🎁 Phần thưởng: Mỗi nhân viên nhận thêm 100 GreenPoint khi đạt mục tiêu!
                </p>
              </CardContent>
            </Card>

            {/* Carbon Credits Exchange */}
            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="text-primary" />
                  Quy đổi tín chỉ carbon
                </CardTitle>
                <CardDescription>
                  Mua tín chỉ carbon để bù đắp lượng phát thải của công ty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {carbonCredits.map((credit) => (
                    <div 
                      key={credit.id}
                      className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={credit.image} 
                          alt={credit.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{credit.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{credit.fullName}</p>
                          <p className="text-sm text-primary font-bold mb-1">{credit.price}</p>
                          <p className="text-xs text-muted-foreground">{credit.description}</p>
                        </div>
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        Mua tín chỉ
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Partner/Merchant */}
          <TabsContent value="partner" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Phát thải từ bao bì
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">450 kg</p>
                </CardContent>
              </Card>
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Phát thải vận chuyển
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">680 kg</p>
                </CardContent>
              </Card>
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Phát thải sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1,200 kg</p>
                </CardContent>
              </Card>
              <Card className="eco-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    GreenPoint khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-accent">32,500</p>
                </CardContent>
              </Card>
            </div>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Xu hướng giảm phát thải theo quý</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={quarterlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="packaging" stroke="hsl(var(--earth-brown))" name="Bao bì" strokeWidth={2} />
                    <Line type="monotone" dataKey="transport" stroke="hsl(var(--accent))" name="Vận chuyển" strokeWidth={2} />
                    <Line type="monotone" dataKey="product" stroke="hsl(var(--primary))" name="Sản phẩm" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="eco-card border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="text-primary" />
                  Nhãn xanh & Thưởng GreenPoint
                </CardTitle>
                <CardDescription>
                  Doanh nghiệp của bạn đã vượt chuẩn phát thải!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">🏆</div>
                  <div>
                    <p className="text-lg font-bold text-primary">GREEN LABEL - Hạng Vàng</p>
                    <p className="text-sm text-muted-foreground">
                      Khách hàng mua sản phẩm của bạn nhận +15% GreenPoint thưởng
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-background/80">
                    <p className="text-sm text-muted-foreground">Điểm TB/Khách hàng</p>
                    <p className="text-xl font-bold text-accent">65 điểm</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/80">
                    <p className="text-sm text-muted-foreground">Xếp hạng ngành</p>
                    <p className="text-xl font-bold text-primary">#2</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/80">
                    <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
                    <p className="text-xl font-bold">1,245</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle>So sánh với doanh nghiệp cùng ngành</CardTitle>
                <CardDescription>Ngành: Thời trang bền vững</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doanh nghiệp</TableHead>
                      <TableHead className="text-right">CO₂e TB/sản phẩm</TableHead>
                      <TableHead className="text-right">GreenPoint TB</TableHead>
                      <TableHead className="text-center">Nhãn</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-primary/5">
                      <TableCell className="font-bold">Doanh nghiệp của bạn</TableCell>
                      <TableCell className="text-right text-primary font-bold">2.3 kg</TableCell>
                      <TableCell className="text-right text-accent font-bold">65</TableCell>
                      <TableCell className="text-center">🏆</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>EcoFashion Co</TableCell>
                      <TableCell className="text-right">2.1 kg</TableCell>
                      <TableCell className="text-right">70</TableCell>
                      <TableCell className="text-center">🏆</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GreenWear Ltd</TableCell>
                      <TableCell className="text-right">2.8 kg</TableCell>
                      <TableCell className="text-right">55</TableCell>
                      <TableCell className="text-center">🥈</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Nature Threads</TableCell>
                      <TableCell className="text-right">3.2 kg</TableCell>
                      <TableCell className="text-right">48</TableCell>
                      <TableCell className="text-center">🥉</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Carbon Credits Exchange */}
            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="text-primary" />
                  Quy đổi tín chỉ carbon
                </CardTitle>
                <CardDescription>
                  Mua tín chỉ carbon để bù đắp lượng phát thải
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {carbonCredits.map((credit) => (
                    <div 
                      key={credit.id}
                      className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={credit.image} 
                          alt={credit.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{credit.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{credit.fullName}</p>
                          <p className="text-sm text-primary font-bold mb-1">{credit.price}</p>
                          <p className="text-xs text-muted-foreground">{credit.description}</p>
                        </div>
                      </div>
                      <Button className="w-full mt-3" size="sm">
                        Mua tín chỉ
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
