import { useState } from "react";
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
import { Plus } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().trim().min(1, "Vui lòng nhập tên khách hàng").max(100),
  orderCode: z.string().trim().min(1, "Vui lòng nhập mã đơn mua").regex(/^\d+$/, "Mã đơn mua phải là số"),
  phoneNumber: z.string().trim().min(10, "Số điện thoại phải có ít nhất 10 số").max(11, "Số điện thoại không hợp lệ").regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
  weightKg: z.string().trim().min(1, "Vui lòng nhập số lượng kg").regex(/^\d+(\.\d+)?$/, "Số lượng kg phải là số"),
  shipperName: z.string().trim().min(1, "Vui lòng nhập tên shipper").max(100),
  warehouseAddress: z.string().min(1, "Vui lòng chọn địa chỉ kho"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateDeliveryModalProps {
  onSuccess: () => void;
}

export default function CreateDeliveryModal({ onSuccess }: CreateDeliveryModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Parse and validate numbers
      const orderCode = parseInt(values.orderCode, 10);
      const phoneNumber = parseInt(values.phoneNumber, 10);
      const weightKg = parseFloat(values.weightKg);

      if (isNaN(orderCode) || isNaN(phoneNumber) || isNaN(weightKg)) {
        throw new Error("Dữ liệu số không hợp lệ");
      }

      const { data, error } = await (supabase as any).from("2waydelivery").insert({
        "Tên khách hàng": values.customerName.trim(),
        "Mã đơn mua": orderCode,
        "Số điện thoại": phoneNumber,
        "Số lượng kg": weightKg,
        "Tên shipper": values.shipperName.trim(),
        "Địa chỉ kho": values.warehouseAddress,
      }).select();

      if (error) throw error;

      toast({
        title: "Tạo đơn thành công!",
        description: "Đơn thu về đã được tạo và lưu vào hệ thống.",
      });

      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating delivery:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo đơn thu về. Vui lòng kiểm tra lại thông tin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Tạo Đơn Thu Về
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Tạo Đơn Thu Về</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Nhập thông tin route giao hàng kết hợp thu gom tái chế
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khách hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên khách hàng" {...field} />
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
                  <FormLabel>Mã đơn mua</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Nhập mã đơn mua" {...field} />
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
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="Nhập số điện thoại (10-11 số)" 
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
                  <FormLabel>Số lượng kg</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Nhập số lượng kg" {...field} />
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
                  <FormLabel>Tên shipper</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên shipper" {...field} />
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
                  <FormLabel>Địa chỉ kho</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa chỉ kho" />
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang tạo..." : "Tạo Route"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
