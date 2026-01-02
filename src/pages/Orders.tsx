import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

// Mock orders data - in a real app this would come from the database
const mockOrders = [
  {
    id: 'GFE12345678',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { name: 'Gujarati Thali', quantity: 2, price: 350 },
      { name: 'Dhokla', quantity: 1, price: 80 },
    ],
    total: 780,
  },
  {
    id: 'GFE12345679',
    date: '2024-01-14',
    status: 'in_progress',
    items: [
      { name: 'Fafda Jalebi', quantity: 2, price: 60 },
    ],
    total: 160,
  },
];

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'text-spice-turmeric' },
  in_progress: { icon: Truck, label: 'On the way', color: 'text-primary' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-accent' },
};

const Orders = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">
            My Orders
          </h1>

          {mockOrders.length === 0 ? (
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
              {mockOrders.map((order, index) => {
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
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="secondary" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 p-6 bg-secondary rounded-xl text-center">
            <p className="text-muted-foreground text-sm">
              Note: Order history will be available once the backend is connected.
              Currently showing demo data.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
