import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Link, X } from 'lucide-react';

interface AdminProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

const AdminProductForm = ({ open, onOpenChange, onProductAdded }: AdminProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    imageUrl: '',
    co2Emission: ''
  });

  const categories = [
    'Thực phẩm organic',
    'Đồ gia dụng xanh',
    'Thời trang tái chế',
    'Bao bì sinh học',
    'Tiết kiệm năng lượng'
  ];

  const resetForm = () => {
    setForm({
      name: '',
      category: '',
      price: '',
      description: '',
      imageUrl: '',
      co2Emission: ''
    });
    setImageMethod('url');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For demo purposes, we'll use a placeholder image URL
    // In a real app, you'd upload to Supabase Storage
    setForm({ ...form, imageUrl: 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(file.name) });
    
    toast({
      title: "Ảnh đã được chọn",
      description: `Đã chọn file: ${file.name}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.category || !form.price) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await (supabase as any)
        .from('products')
        .insert([
          {
            name: form.name,
            category: form.category,
            price: parseFloat(form.price),
            description: form.description,
            image_url: form.imageUrl || 'https://via.placeholder.com/400x300?text=Product',
            co2_emission: form.co2Emission ? parseFloat(form.co2Emission) : 1.0
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thành công!",
        description: "Sản phẩm đã được thêm vào cửa hàng",
      });

      resetForm();
      onOpenChange(false);
      onProductAdded();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để thêm sản phẩm vào cửa hàng
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Bình nước thủy tinh tái chế"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Loại sản phẩm *</Label>
            <Select
              value={form.category}
              onValueChange={(value) => setForm({ ...form, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Giá bán (VND) *</Label>
            <Input
              id="price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="50000"
              min="0"
              step="1000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="co2Emission">Lượng CO₂ (kg)</Label>
            <Input
              id="co2Emission"
              type="number"
              value={form.co2Emission}
              onChange={(e) => setForm({ ...form, co2Emission: e.target.value })}
              placeholder="1.0"
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh sản phẩm</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={imageMethod === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageMethod('url')}
                className="flex items-center gap-2"
              >
                <Link className="w-4 h-4" />
                URL
              </Button>
              <Button
                type="button"
                variant={imageMethod === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageMethod('upload')}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Tải lên
              </Button>
            </div>

            {imageMethod === 'url' ? (
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Chọn file ảnh (.jpg, .png, .webp)
                </p>
              </div>
            )}
            
            {form.imageUrl && (
              <div className="relative">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error';
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setForm({ ...form, imageUrl: '' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả sản phẩm</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả chi tiết về sản phẩm..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Đang thêm..." : "Xác nhận"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProductForm;