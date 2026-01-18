import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCheckout = () => {
    if (!user) { navigate('/auth'); return; }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
           <ShoppingBag className="w-8 h-8 text-primary" />
           <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
           <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{items.length} items</span>
        </div>

        {items.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <ShoppingBag className="w-20 h-20 mx-auto text-gray-200 mb-4" />
             <p className="text-xl font-medium text-gray-500 mb-6">Your cart is empty</p>
             <Link to="/">
               <Button size="lg" className="rounded-full px-8">Explore Products</Button>
             </Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* 1. LIST ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 md:items-center">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">{formatPrice(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through decoration-gray-400">{formatPrice(item.originalPrice)}</span>
                      )}
                    </div>
                  </div>

                  {/* Controls (Mobile: Stack vertical, Desktop: Horizontal) */}
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                     <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                           <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-white hover:shadow-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                           <Plus className="h-3 w-3" />
                        </Button>
                     </div>
                     <div className="text-right min-w-[100px]">
                        <p className="font-bold text-lg text-gray-800 mb-1">{formatPrice(item.price * item.quantity)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center justify-end gap-1 transition-colors">
                           <Trash2 className="w-3 h-3" /> Remove
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. SUMMARY (Sticky) */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="text-lg text-primary">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee:</span>
                    <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded text-xs">Free (Eco)</span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 pt-4 mt-2">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-extrabold text-primary">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-right mt-1">(VAT included)</p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3 pb-6 px-6">
                  <Button className="w-full text-lg py-6 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full border-gray-200 hover:bg-white hover:text-primary rounded-xl" onClick={() => navigate('/')}>
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;