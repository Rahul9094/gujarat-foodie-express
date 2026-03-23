import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, X, Trash2, ChefHat, PackageCheck, XCircle, AlertCircle, CreditCard, Banknote, CircleDollarSign } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  payment_method: string;
  user_email: string;
}

const statusConfig = {
  pending: { 
    icon: Clock, 
    label: 'Order Received', 
    color: 'text-spice-turmeric',
    bgColor: 'bg-spice-turmeric/10',
    description: 'Your order has been received and is being processed'
  },
  confirmed: {
    icon: PackageCheck,
    label: 'Confirmed',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Payment confirmed, preparing your order'
  },
  preparing: { 
    icon: ChefHat, 
    label: 'Preparing', 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Our chefs are preparing your delicious food'
  },
  in_progress: { 
    icon: Truck, 
    label: 'Out for Delivery', 
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'Your order is on the way!'
  },
  delivered: { 
    icon: CheckCircle, 
    label: 'Delivered', 
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    description: 'Order delivered successfully'
  },
  cancelled: { 
    icon: XCircle, 
    label: 'Cancelled', 
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    description: 'Order has been cancelled'
  },
};

const paymentStatusConfig: Record<string, { icon: any; label: string; color: string; bgColor: string }> = {
  pending: { icon: Clock, label: 'Payment Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' },
  partial: { icon: CircleDollarSign, label: 'Partially Paid', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  paid: { icon: CreditCard, label: 'Paid', color: 'text-green-600', bgColor: 'bg-green-500/10' },
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const { addToCart } = useCart();
  const { supabaseUser, isAuthenticated, loading: authLoading } = useAuth();

  // Load user-specific orders from Supabase with real-time updates
  useEffect(() => {
    if (supabaseUser?.id) {
      fetchOrders();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${supabaseUser.id}`
          },
          (payload) => {
            console.log('Order update received:', payload);
            if (payload.eventType === 'UPDATE') {
              setOrders(prev => prev.map(order => 
                order.id === payload.new.id 
                  ? { ...order, ...payload.new, items: payload.new.items as Order['items'] }
                  : order
              ));
              toast.info(`Order status updated to: ${statusConfig[payload.new.status as keyof typeof statusConfig]?.label || payload.new.status}`);
            } else if (payload.eventType === 'INSERT') {
              fetchOrders();
            } else if (payload.eventType === 'DELETE') {
              setOrders(prev => prev.filter(order => order.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else if (!authLoading) {
      setOrders([]);
      setLoading(false);
    }
  }, [supabaseUser, authLoading]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', supabaseUser?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } else {
      const ordersData = (data || []).map(order => ({
        ...order,
        items: order.items as Array<{ name: string; quantity: number; price: number }>
      }));
      setOrders(ordersData);
    }
    setLoading(false);
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;
    
    setCancellingOrder(true);
    const order = orders.find(o => o.id === cancelOrderId);
    
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', cancelOrderId);

    if (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } else {
      setOrders(prev => prev.map(o => 
        o.id === cancelOrderId ? { ...o, status: 'cancelled' } : o
      ));
      
      // Show refund message for online payments
      if (order?.payment_method === 'online') {
        toast.success('Order cancelled! Your payment amount will be sent to your account within 24 hours.', {
          duration: 6000
        });
      } else {
        toast.success('Order cancelled successfully!');
      }
    }
    
    setCancellingOrder(false);
    setCancelOrderId(null);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        id: `reorder-${Date.now()}-${item.name}`,
        name: item.name,
        price: item.price,
        image: '',
        rating: 0,
        reviewCount: 0,
        restaurantId: '',
        cityId: '',
        description: '',
        category: ''
      } as any);
    });
    toast.success(`Items from order added to cart!`);
  };

  const handleClearDeliveredOrders = async () => {
    if (!supabaseUser?.id) return;
    
    const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
    
    if (completedOrders.length === 0) {
      toast.info('No completed or cancelled orders to clear');
      return;
    }
    
    const orderIds = completedOrders.map(o => o.id);
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .in('id', orderIds);
    
    if (error) {
      console.error('Error deleting orders:', error);
      toast.error('Failed to clear orders');
      return;
    }
    
    // Update local state immediately
    setOrders(prev => prev.filter(o => !orderIds.includes(o.id)));
    toast.success('All completed/cancelled orders cleared!');
  };

  const canCancelOrder = (status: string) => {
    return status === 'pending' || status === 'confirmed';
  };

  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled').length;

  // Get status steps for progress tracking
  const getStatusSteps = (currentStatus: string) => {
    if (currentStatus === 'cancelled') {
      return [{ ...statusConfig.cancelled, key: 'cancelled', isComplete: true, isCurrent: true }];
    }
    
    const allSteps = ['pending', 'confirmed', 'preparing', 'in_progress', 'delivered'];
    const currentIndex = allSteps.indexOf(currentStatus);
    
    return allSteps.map((step, index) => ({
      ...statusConfig[step as keyof typeof statusConfig],
      key: step,
      isComplete: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Please login to view your orders
            </h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to see your order history.
            </p>
            <Link to="/login">
              <Button variant="hero" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              My Orders
            </h1>
            {deliveredOrdersCount > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearDeliveredOrders}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Completed Orders ({deliveredOrdersCount})
              </Button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                No orders yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start ordering delicious Gujarati food!
              </p>
              <Link to="/menu">
                <Button variant="hero" size="lg">
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;
                const steps = getStatusSteps(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-card rounded-xl p-6 shadow-card animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-5 h-5 text-primary" />
                          <span className="font-bold text-foreground">#{order.id.slice(0, 8)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ordered on {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Payment: {order.payment_method === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="font-medium text-sm">{status.label}</span>
                        </div>
                        {(() => {
                          const ps = paymentStatusConfig[order.payment_status] || paymentStatusConfig.pending;
                          const PsIcon = ps.icon;
                          return (
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${ps.bgColor} ${ps.color}`}>
                              <PsIcon className="w-4 h-4" />
                              <span className="font-medium text-sm">{ps.label}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Order Progress Tracker */}
                    {order.status !== 'cancelled' && (
                      <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center justify-between relative">
                          {/* Progress line */}
                          <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                          <div 
                            className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
                            style={{ 
                              width: `${(steps.findIndex(s => s.isCurrent) / (steps.length - 1)) * 100}%` 
                            }}
                          />
                          
                          {steps.map((step, stepIndex) => {
                            const StepIcon = step.icon;
                            return (
                              <div key={step.key} className="flex flex-col items-center relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  step.isComplete 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-secondary text-muted-foreground'
                                } ${step.isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                                  <StepIcon className="w-4 h-4" />
                                </div>
                                <span className={`text-xs mt-2 text-center max-w-[60px] ${
                                  step.isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-4">
                          {status.description}
                        </p>
                      </div>
                    )}

                    {/* Cancelled Order Message */}
                    {order.status === 'cancelled' && (
                      <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                        <div className="flex items-center gap-2 text-destructive mb-2">
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">Order Cancelled</span>
                        </div>
                        {order.payment_method === 'online' && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                            <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p>Your payment amount will be sent to your account within 24 hours.</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">₹{order.total}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                      {canCancelOrder(order.status) && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setCancelOrderId(order.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel Order
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleReorder(order)}
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">
                Order Details
              </h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedOrder(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">#{selectedOrder.id.slice(0, 8)}</span>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Order Status</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  statusConfig[selectedOrder.status as keyof typeof statusConfig]?.bgColor
                } ${statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color}`}>
                  {(() => {
                    const StatusIcon = statusConfig[selectedOrder.status as keyof typeof statusConfig]?.icon || Clock;
                    return <StatusIcon className="w-4 h-4" />;
                  })()}
                  <span className="font-medium text-sm">
                    {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                  </span>
                </div>
                
                {/* Refund message for cancelled online orders */}
                {selectedOrder.status === 'cancelled' && selectedOrder.payment_method === 'online' && (
                  <div className="mt-3 p-3 bg-primary/10 rounded-lg text-sm">
                    <p className="text-foreground">💰 Your payment amount will be sent to your account within 24 hours.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Delivery Address</h3>
                <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Payment Method</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.payment_method === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Payment Status</h3>
                {(() => {
                  const ps = paymentStatusConfig[selectedOrder.payment_status] || paymentStatusConfig.pending;
                  const PsIcon = ps.icon;
                  return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${ps.bgColor} ${ps.color}`}>
                      <PsIcon className="w-4 h-4" />
                      <span className="font-medium text-sm">{ps.label}</span>
                    </div>
                  );
                })()}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-primary">₹{selectedOrder.total}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {canCancelOrder(selectedOrder.status) && (
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => {
                    setCancelOrderId(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                >
                  Cancel Order
                </Button>
              )}
              <Button 
                variant="hero" 
                className="flex-1"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={!!cancelOrderId} onOpenChange={() => setCancelOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
              {orders.find(o => o.id === cancelOrderId)?.payment_method === 'online' && (
                <span className="block mt-2 text-primary font-medium">
                  Your payment amount will be sent to your account within 24 hours.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancellingOrder}>Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelOrder}
              disabled={cancellingOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancellingOrder ? 'Cancelling...' : 'Yes, Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Orders;
