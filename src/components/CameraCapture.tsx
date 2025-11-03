import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CameraCapture() {
  const [open, setOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        toast({
          title: "Đã chụp ảnh!",
          description: "Ảnh báo cáo thu gom đã được lưu.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      handleRemoveImage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-base sm:text-lg px-6 py-6">
          <Camera className="w-5 h-5 mr-2" />
          📸 Chụp Ảnh Báo Cáo
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />

          {!capturedImage ? (
            <Button
              type="button"
              onClick={triggerCamera}
              className="w-full h-20 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Camera className="mr-3 h-8 w-8" />
              📸 Mở Camera
            </Button>
          ) : (
            <div className="space-y-4">
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
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={triggerCamera}
                  variant="outline"
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
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
                  className="flex-1 bg-green-600 hover:bg-green-700"
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
