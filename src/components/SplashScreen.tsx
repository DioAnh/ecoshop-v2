import { useEffect, useState } from "react";
import { Leaf, ShoppingBag, Zap } from "lucide-react";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Bắt đầu hiệu ứng mờ dần (fade out) ở giây thứ 4.5 để chuyển cảnh mượt
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 4500);

    // Gọi hàm kết thúc sau đúng 5 giây
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="relative flex flex-col items-center font-sans">
        {/* --- PHẦN LOGO --- */}
        <div className="relative mb-8 animate-in zoom-in duration-1000 ease-out">
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center relative z-10 animate-bounce-slow">
            <Leaf className="w-16 h-16 text-emerald-600 fill-emerald-100" />
            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full animate-spin-slow">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* --- PHẦN TÊN VÀ SLOGAN (ĐÃ SỬA LẠI ANIMATION) --- */}
        {/* Sử dụng class custom 'animate-fadeInUp' thay vì các class tailwind phức tạp để đảm bảo hiện text */}
        <div 
          className="text-center space-y-4 animate-fadeInUp" 
          style={{ animationDelay: '0.5s' }} // Delay 0.5s sau khi logo hiện
        >
          <h1 className="text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3 drop-shadow-lg">
            EcoShop
            <ShoppingBag className="w-8 h-8 text-emerald-300" />
          </h1>
          
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto opacity-50"></div>
          
          <p className="text-lg text-emerald-100 font-medium tracking-wider uppercase drop-shadow-md">
            Shop Green • Earn Token • Save Earth
          </p>
        </div>

        {/* --- THANH LOADING --- */}
        <div className="mt-12 w-64 h-1.5 bg-emerald-900/50 rounded-full overflow-hidden backdrop-blur-sm border border-emerald-700/30">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full animate-loading-bar"></div>
        </div>
        
        <p className="mt-4 text-xs text-emerald-400/70 animate-pulse font-mono tracking-tight">
          Initializing Sui Blockchain...
        </p>
      </div>

      {/* CSS Animation Styles (Inline) */}
      <style>{`
        /* Animation mới cho phần text: Đảm bảo trượt từ dưới lên và hiện rõ */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          opacity: 0; /* Bắt đầu ẩn */
          animation: fadeInUp 1s ease-out forwards; /* Chạy trong 1s và giữ trạng thái cuối (hiện) */
        }

        /* Các animation cũ giữ nguyên */
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 5s linear forwards;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;