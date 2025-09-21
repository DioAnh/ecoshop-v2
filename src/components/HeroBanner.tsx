import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Recycle } from "lucide-react";
import heroBannerImage from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      <img 
        src={heroBannerImage} 
        alt="Green Shopping Banner"
        className="w-full h-[400px] md:h-[500px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-medium">Mua sắm bền vững</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Mua sắm xanh – 
              <span className="text-green-400"> Giảm phát thải CO₂</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-6 text-white/90">
              Khám phá hàng ngàn sản phẩm thân thiện với môi trường. 
              Mỗi lần mua sắm là một lần bảo vệ hành tinh.
            </p>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Recycle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Đã tiết kiệm 1,234 tấn CO₂</span>
              </div>
              <div className="w-px h-6 bg-white/30" />
              <span className="text-sm">+10,000 khách hàng tin tưởng</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="eco-button text-lg px-8">
                Khám phá ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;