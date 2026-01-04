import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, X, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'in_progress' | 'delivered';
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  paymentMethod: string;
  userEmail: string;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'text-spice-turmeric' },
  in_progress: { icon: Truck, label: 'On the way', color: 'text-primary' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-accent' },
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Load user-specific orders
  useEffect(() => {
    if (user?.email) {
      const allOrders: Order[] = JSON.parse(localStorage.getItem('gujaratFoodOrders') || '[]');
      const userOrders = allOrders.filter(order => order.userEmail === user.email);
      setOrders(userOrders);
    } else {
      setOrders([]);
    }
  }, [user]);

  const handleReorder = (order: Order) => {
    toast.success(`Items from order ${order.id} added to cart!`);
  };

  const handleClearDeliveredOrders = () => {
    if (!user?.email) return;
    
    const allOrders: Order[] = JSON.parse(localStorage.getItem('gujaratFoodOrders') || '[]');
    const updatedOrders = allOrders.filter(
      order => order.userEmail !== user.email || order.status !== 'delivered'
    );
    localStorage.setItem('gujaratFoodOrders', JSON.stringify(updatedOrders));
    
    const userOrders = updatedOrders.filter(order => order.userEmail === user.email);
    setOrders(userOrders);
    toast.success('All delivered orders cleared!');
  };

  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;

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
                Clear Delivered Orders ({deliveredOrdersCount})
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
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

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
                          <span className="font-bold text-foreground">{order.id}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ordered on {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 ${status.color}`}>
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-medium">{status.label}</span>
                      </div>
                    </div>

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

                    <div className="mt-4 pt-4 border-t border-border flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
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
                <span className="font-bold text-foreground">{selectedOrder.id}</span>
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
                <p className="text-sm text-muted-foreground">{selectedOrder.paymentMethod}</p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-2">Order Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.date).toLocaleDateString('en-IN', {
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

            <div className="mt-6">
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Orders;
