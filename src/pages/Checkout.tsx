import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, ArrowLeft, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import QRPaymentModal from '@/components/checkout/QRPaymentModal';

// Validation schema for checkout form
const checkoutSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number (10-15 digits)'),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').max(500, 'Address must be less than 500 characters'),
  city: z.string().trim().min(2, 'City must be at least 2 characters').max(100, 'City must be less than 100 characters'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits').optional().or(z.literal('')),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, supabaseUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<{
    address: string;
    paymentMethod: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const subtotal = getTotalPrice();
  const deliveryFee = 40;
  const taxRate = 0.05; // 5% GST
  const taxAmount = Math.round(subtotal * taxRate);
  const totalWithTax = subtotal + deliveryFee + taxAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data using Zod schema
    const validationResult = checkoutSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    if (!supabaseUser?.id || !user?.email) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    // Use validated data
    const validatedData = validationResult.data;
    const fullAddress = `${validatedData.address}, ${validatedData.city}${validatedData.pincode ? `, ${validatedData.pincode}` : ''}, Gujarat, India`;

    // If online payment, show QR modal
    if (paymentMethod === 'online') {
      setPendingOrderData({
        address: fullAddress,
        paymentMethod: 'Online Payment (UPI)'
      });
      setShowQRModal(true);
      return;
    }

    // For COD, proceed directly
    await placeOrder(fullAddress, 'Cash on Delivery');
  };

  const placeOrder = async (address: string, paymentMethodText: string) => {
    if (!supabaseUser?.id || !user?.email) return;
    
    setIsProcessing(true);

    try {
      const { error } = await supabase.from('orders').insert({
        user_id: supabaseUser.id,
        user_email: user.email,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalWithTax,
        address,
        payment_method: paymentMethodText,
        status: paymentMethodText.includes('Online') ? 'confirmed' : 'pending'
      });

      if (error) {
        throw error;
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success', { 
        state: { 
          paymentMethod: paymentMethodText,
          isOnlinePayment: paymentMethodText.includes('Online'),
          totalAmount: totalWithTax
        } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePaymentComplete = async () => {
    if (pendingOrderData) {
      setShowQRModal(false);
      await placeOrder(pendingOrderData.address, pendingOrderData.paymentMethod);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Button>

          <h1 className="font-display text-3xl font-bold text-foreground mb-8">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Delivery Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Delivery Address
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House/Flat No., Street, Landmark"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Ahmedabad"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="380001"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === 'online'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === 'online' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">Online Payment</p>
                        <p className="text-sm text-muted-foreground">Pay via UPI, Card, Net Banking (Demo Mode)</p>
                      </div>
                      {paymentMethod === 'online' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (5%)</span>
                      <span>₹{taxAmount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">₹{totalWithTax}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : paymentMethod === 'online' ? `Pay Online • ₹${totalWithTax}` : `Place Order • ₹${totalWithTax}`}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* QR Payment Modal */}
          <QRPaymentModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            onPaymentComplete={handleOnlinePaymentComplete}
            amount={totalWithTax}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
