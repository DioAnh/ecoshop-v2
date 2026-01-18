import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bike, Zap, CheckCircle, Coins, Leaf, Flame, Truck, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useWalletContext } from '@/contexts/WalletContext'; 
import { useGreenFund } from '@/contexts/GreenFundContext'; // MỚI: Import GreenFund
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Confetti from 'react-confetti';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const REINVEST_OPTIONS = [
  { id: '6m', duration: '6 Months', apr: 12, risk: 'Medium', riskColor: 'text-yellow-600' },
  { id: '1y', duration: '1 Year', apr: 25, risk: 'High', riskColor: 'text-orange-600' },
  { id: '2y', duration: '2 Years', apr: 50, risk: 'Very High', riskColor: 'text-red-600' }
];

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { addPurchase, stakeEco } = useWalletContext(); 
  const { collectProtocolFee } = useGreenFund(); // MỚI: Lấy hàm thu phí
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryVehicle, setDeliveryVehicle] = useState('electric_standard');
  const [earnedEco, setEarnedEco] = useState(0);
  const [savedCO2, setSavedCO2] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  const [hasReinvested, setHasReinvested] = useState(false);
  const [isReinvesting, setIsReinvesting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => { setWindowSize({ width: window.innerWidth, height: window.innerHeight }); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const orderTotal = getTotalPrice(); // Lấy tổng giá trị đơn hàng

      // --- LOGIC 1: TÍNH TOÁN ECO & CO2 ---
      let totalProductCO2 = 0;
      let totalProductEco = 0;

      const itemIds = items.map(i => i.id);
      const { data: products } = await supabase.from('products').select('id, co2_emission, name').in('id', itemIds);

      if (products) {
        items.forEach(cartItem => {
          const productDB = products.find(p => p.id === cartItem.id);
          const co2PerUnit = productDB?.co2_emission || 0;
          const ecoPerUnit = Math.min(co2PerUnit, 50); 
          
          totalProductEco += ecoPerUnit * cartItem.quantity;
          totalProductCO2 += co2PerUnit * cartItem.quantity;

          addPurchase(cartItem.name, ecoPerUnit * cartItem.quantity, co2PerUnit * cartItem.quantity);
        });
      }

      // --- LOGIC 2: TÍNH PHÍ VẬN CHUYỂN ---
      let deliveryBonusEco = 0; 
      let deliveryBonusCO2 = 0; 
      let deliveryNote = "";

      switch (deliveryVehicle) {
        case 'bicycle': deliveryBonusEco = 5; deliveryBonusCO2 = 2.5; deliveryNote = "Green Delivery (Bicycle)"; break;
        case 'electric_standard': deliveryBonusEco = 2; deliveryBonusCO2 = 1.0; deliveryNote = "Green Delivery (EV)"; break;
        case 'gas_standard': deliveryBonusEco = -2; deliveryBonusCO2 = -0.5; deliveryNote = "Standard Delivery (Gas)"; break;
        case 'gas_express': deliveryBonusEco = -5; deliveryBonusCO2 = -2.0; deliveryNote = "Express Delivery (Gas)"; break;
      }

      if (deliveryBonusEco !== 0) addPurchase(deliveryNote, deliveryBonusEco, deliveryBonusCO2);

      const finalTotalEco = totalProductEco + deliveryBonusEco;
      const finalTotalCO2 = totalProductCO2 + deliveryBonusCO2;

      setEarnedEco(finalTotalEco);
      setSavedCO2(finalTotalCO2);

      // --- LOGIC 3 (MỚI): THU PHÍ PROTOCOL VÀO REAL YIELD POOL ---
      // Trích 5% giá trị đơn hàng vào Revenue Pool
      collectProtocolFee(orderTotal);

      setTimeout(() => {
        setOrderSuccess(true);
        clearCart();
        setLoading(false);
      }, 1500);

    } catch (error) { 
      console.error(error);
      setLoading(false); 
      toast({ title: "Error", description: "Cannot process order at this time.", variant: "destructive" });
    }
  };

  const handleReinvest = () => {
    if (earnedEco <= 0 || !selectedOption) return;
    const option = REINVEST_OPTIONS.find(o => o.id === selectedOption);
    
    setIsReinvesting(true);
    
    setTimeout(() => {
      stakeEco(
        earnedEco, 
        'product', 
        `Product: ${items[0]?.name || 'Order'}`, 
        option?.apr || 0, 
        option?.duration
      );
      
      setHasReinvested(true);
      setIsReinvesting(false);
      
      toast({ 
        title: "Investment Successful! 🌟", 
        description: "You received an Investment Certificate NFT in your Profile.", 
        className: "bg-indigo-50 border-indigo-200" 
      });
    }, 1500);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {earnedEco > 0 && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <div className="max-w-2xl w-full space-y-6">
            
            <Card className="border-2 border-emerald-100 shadow-xl bg-white/90 backdrop-blur">
              <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-1">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                  <p className="text-muted-foreground text-sm">Your order has been processed on-chain.</p>
                </div>

                <div className={`w-full max-w-md bg-gradient-to-br border rounded-xl p-4 ${earnedEco >= 0 ? 'from-emerald-50 to-teal-50 border-emerald-100' : 'from-orange-50 to-red-50 border-red-100'}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <p className={`text-[10px] font-bold uppercase mb-1 ${earnedEco >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {earnedEco >= 0 ? 'Tokens Earned' : 'Tokens Deducted'}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Coins className={`w-4 h-4 ${earnedEco >= 0 ? 'text-yellow-500 fill-yellow-500' : 'text-red-500'}`} />
                        <span className={`text-xl font-extrabold ${earnedEco >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {earnedEco >= 0 ? '+' : ''}{earnedEco.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <p className="text-[10px] text-green-700 font-bold uppercase mb-1">CO₂ Reduced</p>
                      <div className="flex items-center justify-center gap-1">
                        <Leaf className="w-4 h-4 text-green-500 fill-green-500" />
                        <span className="text-xl font-extrabold text-green-600">{savedCO2.toFixed(1)}kg</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* MỚI: Thông báo về Protocol Revenue */}
                  <div className="mt-3 pt-3 border-t border-dashed border-emerald-200 text-center">
                    <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-blue-500" />
                      <span>5% fee added to <strong>Community Revenue Pool</strong> (Real Yield)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phần Reinvest (Giữ nguyên code cũ) */}
            {earnedEco > 0 && !hasReinvested && (
              <div className="animate-in slide-in-from-bottom duration-700 delay-200">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 animate-pulse"></div>
                  <Card className="relative border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                            <TrendingUp className="w-5 h-5 text-indigo-600" /> 
                            Reinvest - Micro-invest in Product
                          </CardTitle>
                          <p className="text-xs text-indigo-600/80 mt-1">
                            Use <strong>{earnedEco.toFixed(2)} ECO</strong> to reinvest directly.
                          </p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold cursor-help border border-orange-200 hover:bg-orange-200 transition-colors">
                                <Info className="w-3.5 h-3.5" /> Important
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-orange-50 text-orange-900 border-orange-200">
                              <p>This is a <strong>one-time</strong> opportunity. High returns come with risks.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {REINVEST_OPTIONS.map((option) => (
                          <div 
                            key={option.id} 
                            onClick={() => setSelectedOption(option.id)} 
                            className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 text-center ${selectedOption === option.id ? 'border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600' : 'border-gray-200 bg-white hover:border-indigo-300'}`}
                          >
                            <p className="text-xs font-semibold text-gray-500 mb-1">{option.duration}</p>
                            <p className="text-xl font-extrabold text-indigo-700">{option.apr}%</p>
                            <p className={`text-[10px] font-bold mt-1 ${option.riskColor}`}>{option.risk}</p>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={handleReinvest} 
                        disabled={isReinvesting || !selectedOption} 
                        className={`w-full py-5 font-bold shadow-md transition-all ${!selectedOption ? 'opacity-50' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
                      >
                        {isReinvesting ? "Processing..." : selectedOption ? `Confirm Investment` : "Select a Package"}
                      </Button>
                      <div className="text-center">
                        <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-gray-600 underline">
                          Skip, keep tokens in wallet
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {hasReinvested && (
              <div className="animate-in zoom-in duration-300">
                <Card className="bg-indigo-600 text-white border-none shadow-lg overflow-hidden relative">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-16 w-16 bg-white rounded-lg shadow-lg flex items-center justify-center shrink-0">
                      <img src="https://cdn-icons-png.flaticon.com/512/11450/11450230.png" alt="NFT" className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">Investment Successful!</p>
                      <p className="text-indigo-100 text-sm">You received a <strong>Certificate NFT</strong> in your profile.</p>
                    </div>
                    <Button variant="secondary" onClick={() => navigate('/eco-profile')} className="text-indigo-700 bg-white hover:bg-indigo-50 font-bold">
                      View NFT
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {(!earnedEco || (earnedEco <= 0)) && (
              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={() => navigate('/eco-profile')} variant="outline" size="lg" className="w-full">Check Wallet & History</Button>
                <Button onClick={() => navigate('/')} variant="ghost" size="lg" className="w-full text-muted-foreground">Back to Home</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // MÀN HÌNH FORM CHECKOUT (Giữ nguyên, chỉ import thêm hook)
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryVehicle} onValueChange={setDeliveryVehicle} className="space-y-4">
                  <Label className="text-sm font-semibold text-emerald-600 mt-2 block">🌱 Eco-Friendly (Earn Bonus ECO)</Label>
                  <div className={`flex items-start space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${deliveryVehicle === 'bicycle' ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                    <RadioGroupItem value="bicycle" id="bicycle" className="mt-1" />
                    <Label htmlFor="bicycle" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><Bike className="w-5 h-5 text-green-600" /> <span className="font-bold text-gray-800">Traditional Bicycle</span></div>
                        <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">+5 ECO</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery 8-12 days. Zero emissions.</p>
                    </Label>
                  </div>
                  <div className={`flex items-start space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${deliveryVehicle === 'electric_standard' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                    <RadioGroupItem value="electric_standard" id="electric_standard" className="mt-1" />
                    <Label htmlFor="electric_standard" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> <span className="font-bold text-gray-800">Standard Electric Scooter</span></div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">+2 ECO</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery 3-5 days. 90% emission reduction.</p>
                    </Label>
                  </div>

                  <Label className="text-sm font-semibold text-orange-600 mt-4 block">🔥 Gas Vehicle (Deduct ECO)</Label>
                  <div className={`flex items-start space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${deliveryVehicle === 'gas_standard' ? 'border-orange-400 bg-orange-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                    <RadioGroupItem value="gas_standard" id="gas_standard" className="mt-1" />
                    <Label htmlFor="gas_standard" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-orange-500" /> <span className="font-bold text-gray-800">Standard Gas Truck (Consolidated)</span></div>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">-2 ECO</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery 3-5 days. Medium emissions.</p>
                    </Label>
                  </div>
                  <div className={`flex items-start space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${deliveryVehicle === 'gas_express' ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                    <RadioGroupItem value="gas_express" id="gas_express" className="mt-1" />
                    <Label htmlFor="gas_express" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-red-600 fill-red-600" /> <span className="font-bold text-gray-800">Express Gas (Instant)</span></div>
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">-5 ECO</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery 1-2 days (Separate trip). HIGH emissions.</p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-none shadow-lg sticky top-24">
              <CardHeader className="bg-gray-50/50 pb-4"><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4 pt-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[180px]">{item.quantity}x {item.name}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-bold text-gray-800">Total Payment:</span>
                    <span className="text-2xl font-extrabold text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <Button 
                    className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95" 
                    size="lg" 
                    onClick={handleCheckout} 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Processing...
                      </span>
                    ) : (
                      "Confirm Payment"
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    By paying, you agree to donate 1% to the reforestation fund.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;