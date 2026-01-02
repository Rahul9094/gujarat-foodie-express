import { Link } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => {
  const orderId = `GFE${Date.now().toString().slice(-8)}`;

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

          <div className="bg-card rounded-xl p-6 shadow-card mb-8">
            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
            <p className="font-display text-2xl font-bold text-primary">{orderId}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Estimated delivery: 30-45 minutes
            </p>
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
