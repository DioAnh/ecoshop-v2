import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bike, Truck, TreePine, Clock, MapPin, Award, Recycle } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GreenDelivery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recycleWeight, setRecycleWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecycleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please Login",
        description: "You need to login to exchange points",
        variant: "destructive",
      });
      return;
    }

    const weight = parseFloat(recycleWeight);
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid weight",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const pointsEarned = Math.floor(weight * 10); // 1kg = 10 points
      const co2Saved = weight * 2.5; // Assume 1kg waste = 2.5kg CO2 saved

      // Get current greenpoints
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('greenpoints')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Update greenpoints
      const newGreenpoints = (userData?.greenpoints || 0) + pointsEarned;
      const { error: updateError } = await supabase
        .from('users')
        .update({ greenpoints: newGreenpoints })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Create transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          greenpoints_earned: pointsEarned,
          co2_saved: co2Saved,
          amount: weight,
          note: `Recycled ${weight}kg waste`,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Exchange Successful!",
        description: `You received ${pointsEarned} GreenPoints for ${weight}kg recycled waste`,
      });

      setRecycleWeight('');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during exchange",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <Bike className="w-8 h-8 text-primary" />
              Green Delivery
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Eco-friendly delivery service, reducing carbon emissions and protecting the planet
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Bike className="w-5 h-5" />
                  Electric Bikes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">
                  100% electric bikes, zero emissions, reducing CO2 by 85% compared to traditional gas vehicles
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  Fast Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">
                  2-4 hour delivery within the city, committed to punctuality and safety
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <MapPin className="w-5 h-5" />
                  Wide Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-600">
                  Covering all of HCMC and Hanoi, expanding to other provinces
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <TreePine className="w-5 h-5" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>
                  Impressive numbers on environmental protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600 font-medium">CO2 Saved</p>
                    <p className="text-2xl font-bold text-green-700">1,250 kg</p>
                  </div>
                  <TreePine className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Green Orders</p>
                    <p className="text-2xl font-bold text-blue-700">12,500</p>
                  </div>
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Zero Emission Km</p>
                    <p className="text-2xl font-bold text-purple-700">45,000 km</p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Truck className="w-5 h-5" />
                  Delivery Process
                </CardTitle>
                <CardDescription>
                  From warehouse to customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Order Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        System automatically confirms and prepares order
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Route Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        AI calculates shortest, energy-saving routes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Green Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Shipper uses electric bike to deliver to your door
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Completion</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn GreenPoints for every green delivery
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recycle Exchange Section */}
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Recycle className="w-6 h-6" />
                Recycle Exchange
              </CardTitle>
              <CardDescription>
                Exchange recyclables for GreenPoints - 1kg = 10 points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Accepted Waste:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Plastic Bottles (PET, HDPE)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Paper, Cardboard
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Aluminum Cans, Metal
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Glass
                    </li>
                  </ul>
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">Exchange Rate</span>
                      <span className="text-2xl font-bold text-green-700">1kg = 10 points</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Every 1kg recycled saves ~2.5kg CO₂ emissions
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Exchange Now:</h4>
                  <div className="space-y-4 p-4 bg-white rounded-lg border border-green-200">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Weight (kg)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Enter weight (e.g., 2.5)"
                        value={recycleWeight}
                        onChange={(e) => setRecycleWeight(e.target.value)}
                        className="border-green-300 focus:border-green-500"
                      />
                    </div>
                    {recycleWeight && parseFloat(recycleWeight) > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          You will receive: <span className="font-bold">{Math.floor(parseFloat(recycleWeight) * 10)} GreenPoints</span>
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Reduced Emissions: ~{(parseFloat(recycleWeight) * 2.5).toFixed(2)} kg CO₂
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleRecycleSubmit}
                      disabled={isSubmitting || !recycleWeight || parseFloat(recycleWeight) <= 0}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Exchange'}
                    </Button>
                    {!user && (
                      <p className="text-xs text-center text-amber-600">
                        Please login to exchange points
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-center">Benefits of Green Delivery</CardTitle>
              <CardDescription className="text-center">
                Building a sustainable future together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TreePine className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Reduce Emissions</h4>
                  <p className="text-sm text-muted-foreground">
                    Reduce CO2 emissions by 85% compared to traditional vehicles
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Earn Green Points</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn extra GreenPoints for every electric vehicle delivery
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Fast Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Flexible electric bikes, fast delivery within the city
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Cost Effective</h4>
                  <p className="text-sm text-muted-foreground">
                    Save on shipping costs thanks to high energy efficiency
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GreenDelivery;