import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Camera, X } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().trim().min(1, "Please enter customer name").max(100),
  orderCode: z.string().trim().min(1, "Please enter order code").regex(/^\d+$/, "Order code must be a number"),
  phoneNumber: z.string().trim().min(10, "Phone number must be at least 10 digits").max(11, "Invalid phone number").regex(/^\d+$/, "Phone number must contain digits only"),
  weightKg: z.string().trim().min(1, "Please enter weight").regex(/^\d+(\.\d+)?$/, "Weight must be a number"),
  shipperName: z.string().trim().min(1, "Please enter shipper name").max(100),
  warehouseAddress: z.string().min(1, "Please select warehouse address"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateDeliveryModalProps {
  onSuccess: () => void;
}

export default function CreateDeliveryModal({ onSuccess }: CreateDeliveryModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      orderCode: "",
      phoneNumber: "",
      weightKg: "",
      shipperName: "",
      warehouseAddress: "",
    },
  });

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
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
      form.reset();
      handleRemoveImage();
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Parse and validate numbers
      const orderCode = parseInt(values.orderCode, 10);
      const phoneNumber = parseInt(values.phoneNumber, 10);
      const weightKg = parseFloat(values.weightKg);

      if (isNaN(orderCode) || isNaN(phoneNumber) || isNaN(weightKg)) {
        throw new Error("Invalid numeric data");
      }

      const { data, error } = await (supabase as any).from("2waydelivery").insert({
        "Tên khách hàng": values.customerName.trim(), // Keep DB column names as is
        "Mã đơn mua": orderCode,
        "Số điện thoại": phoneNumber,
        "Số lượng kg": weightKg,
        "Tên shipper": values.shipperName.trim(),
        "Địa chỉ kho": values.warehouseAddress,
      }).select();

      if (error) throw error;

      toast({
        title: "Order Created!",
        description: "Return order has been created and saved to system.",
      });

      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating delivery:", error);
      toast({
        title: "Error",
        description: error.message || "Could not create return order. Please check inputs.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Return Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Create Return Order</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter route info for delivery combined with recycling collection
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Code</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter order code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="Enter phone number" 
                      maxLength={11}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipperName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipper Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shipper name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warehouseAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse Address</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                      <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                      <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                      <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                      <SelectItem value="Bình Dương">Bình Dương</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Camera Capture Section */}
            <div className="space-y-3 pt-2">
              <FormLabel className="text-base font-semibold">
                Collection Report Photo
              </FormLabel>
              
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
                  className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Camera className="mr-2 h-6 w-6" />
                  📸 Capture Photo
                </Button>
              ) : (
                <div className="relative rounded-lg overflow-hidden border-2 border-green-500">
                  <img 
                    src={capturedImage} 
                    alt="Collection Report" 
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
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Route"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}