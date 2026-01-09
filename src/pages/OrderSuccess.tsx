import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, FileText, CreditCard, Banknote } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

interface LocationState {
  paymentMethod?: string;
  isOnlinePayment?: boolean;
}

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const orderId = `GFE${Date.now().toString().slice(-8)}`;
  const isOnlinePayment = state?.isOnlinePayment ?? false;
  const paymentMethod = state?.paymentMethod ?? 'Cash on Delivery';

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-accent/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-accent" />
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Order Placed Successfully!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Thank you for ordering from Gujarat Food Express. Your delicious food is being prepared!
          </p>

          <div className="bg-card rounded-xl p-6 shadow-card mb-6">
            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
            <p className="font-display text-2xl font-bold text-primary">{orderId}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Estimated delivery: 30-45 minutes
            </p>
          </div>

          {/* Payment Status Card */}
          <div className={`rounded-xl p-4 mb-8 border-2 ${
            isOnlinePayment 
              ? 'bg-green-50 dark:bg-green-950/30 border-green-500' 
              : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              {isOnlinePayment ? (
                <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <Banknote className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              )}
              <span className="font-medium text-foreground">{paymentMethod}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isOnlinePayment 
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                  : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
              }`}>
                {isOnlinePayment ? '✓ Payment Completed' : '₹ Pay on Delivery'}
              </span>
            </div>
            {isOnlinePayment && (
              <p className="text-xs text-muted-foreground mt-2">
                Transaction ID: TXN{Date.now().toString().slice(-10)}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="hero" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
