import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, X, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CameraCapture() {
  const [open, setOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Lỗi camera",
        description: "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
        stopCamera();
        
        toast({
          title: "Đã chụp ảnh!",
          description: "Ảnh báo cáo thu gom đã được lưu.",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setCapturedImage(null);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !capturedImage) {
      startCamera();
    } else if (!newOpen) {
      stopCamera();
      handleRemoveImage();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="default"
          size="lg"
          className="rounded-full gap-2"
        >
          <Camera className="w-5 h-5" />
          Chụp Ảnh Báo Cáo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Chụp Ảnh Thu Gom
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Chụp ảnh hiện trường thu gom tái chế
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <canvas ref={canvasRef} className="hidden" />
          
          {!capturedImage ? (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Camera className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Capture Button */}
              <Button
                type="button"
                onClick={capturePhoto}
                disabled={!isCameraActive}
                variant="default"
                className="w-full h-16 text-xl font-semibold"
                size="lg"
              >
                <Camera className="mr-3 h-8 w-8" />
                Chụp Ảnh
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Captured Image Preview */}
              <div className="relative rounded-lg overflow-hidden border-2 border-green-500">
                <img
                  src={capturedImage}
                  alt="Ảnh báo cáo thu gom"
                  className="w-full h-auto"
                />
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleRetake}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Chụp lại
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Đã lưu ảnh!",
                      description: "Ảnh báo cáo đã được lưu vào hệ thống.",
                    });
                    setOpen(false);
                  }}
                  variant="default"
                  className="flex-1"
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
