import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Smartphone, QrCode, Loader2 } from 'lucide-react';

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  amount: number;
}

type PaymentStatus = 'pending' | 'scanning' | 'processing' | 'completed';

const QRPaymentModal = ({ isOpen, onClose, onPaymentComplete, amount }: QRPaymentModalProps) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [countdown, setCountdown] = useState(300); // 5 minutes

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus('pending');
      setCountdown(300);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const simulatePayment = () => {
    setPaymentStatus('scanning');
    
    setTimeout(() => {
      setPaymentStatus('processing');
      
      setTimeout(() => {
        setPaymentStatus('completed');
        
        setTimeout(() => {
          onPaymentComplete();
        }, 1500);
      }, 2000);
    }, 1500);
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'pending':
        return 'Scan QR code to pay';
      case 'scanning':
        return 'QR Code scanned...';
      case 'processing':
        return 'Processing payment...';
      case 'completed':
        return 'Payment successful!';
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending':
        return <QrCode className="w-6 h-6 text-primary" />;
      case 'scanning':
        return <Smartphone className="w-6 h-6 text-yellow-500 animate-pulse" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && paymentStatus === 'pending' && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl">
            Online Payment
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Amount Display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary">₹{amount}</p>
          </div>

          {/* QR Code */}
          <div className="relative">
            <div className={`bg-white p-4 rounded-xl border-2 transition-all ${
              paymentStatus === 'completed' ? 'border-green-500' : 
              paymentStatus === 'scanning' || paymentStatus === 'processing' ? 'border-yellow-500' : 
              'border-border'
            }`}>
              {/* Dummy QR Code using SVG */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className={`${paymentStatus !== 'pending' ? 'opacity-50' : ''}`}
              >
                {/* QR Code Pattern */}
                <rect width="200" height="200" fill="white"/>
                
                {/* Corner squares */}
                <rect x="10" y="10" width="50" height="50" fill="black"/>
                <rect x="17" y="17" width="36" height="36" fill="white"/>
                <rect x="24" y="24" width="22" height="22" fill="black"/>
                
                <rect x="140" y="10" width="50" height="50" fill="black"/>
                <rect x="147" y="17" width="36" height="36" fill="white"/>
                <rect x="154" y="24" width="22" height="22" fill="black"/>
                
                <rect x="10" y="140" width="50" height="50" fill="black"/>
                <rect x="17" y="147" width="36" height="36" fill="white"/>
                <rect x="24" y="154" width="22" height="22" fill="black"/>
                
                {/* Data pattern */}
                <rect x="70" y="10" width="10" height="10" fill="black"/>
                <rect x="90" y="10" width="10" height="10" fill="black"/>
                <rect x="110" y="10" width="10" height="10" fill="black"/>
                <rect x="70" y="30" width="10" height="10" fill="black"/>
                <rect x="100" y="30" width="10" height="10" fill="black"/>
                <rect x="120" y="30" width="10" height="10" fill="black"/>
                
                <rect x="70" y="70" width="10" height="10" fill="black"/>
                <rect x="80" y="80" width="10" height="10" fill="black"/>
                <rect x="90" y="70" width="10" height="10" fill="black"/>
                <rect x="100" y="90" width="10" height="10" fill="black"/>
                <rect x="110" y="80" width="10" height="10" fill="black"/>
                <rect x="120" y="70" width="10" height="10" fill="black"/>
                
                <rect x="70" y="100" width="10" height="10" fill="black"/>
                <rect x="90" y="110" width="10" height="10" fill="black"/>
                <rect x="100" y="100" width="10" height="10" fill="black"/>
                <rect x="120" y="110" width="10" height="10" fill="black"/>
                
                <rect x="10" y="70" width="10" height="10" fill="black"/>
                <rect x="30" y="70" width="10" height="10" fill="black"/>
                <rect x="10" y="90" width="10" height="10" fill="black"/>
                <rect x="40" y="80" width="10" height="10" fill="black"/>
                <rect x="20" y="100" width="10" height="10" fill="black"/>
                <rect x="50" y="90" width="10" height="10" fill="black"/>
                
                <rect x="140" y="70" width="10" height="10" fill="black"/>
                <rect x="160" y="80" width="10" height="10" fill="black"/>
                <rect x="140" y="100" width="10" height="10" fill="black"/>
                <rect x="170" y="90" width="10" height="10" fill="black"/>
                <rect x="150" y="110" width="10" height="10" fill="black"/>
                <rect x="180" y="100" width="10" height="10" fill="black"/>
                
                <rect x="70" y="140" width="10" height="10" fill="black"/>
                <rect x="80" y="160" width="10" height="10" fill="black"/>
                <rect x="100" y="150" width="10" height="10" fill="black"/>
                <rect x="110" y="170" width="10" height="10" fill="black"/>
                <rect x="130" y="140" width="10" height="10" fill="black"/>
                
                <rect x="140" y="140" width="10" height="10" fill="black"/>
                <rect x="160" y="150" width="10" height="10" fill="black"/>
                <rect x="150" y="170" width="10" height="10" fill="black"/>
                <rect x="170" y="160" width="10" height="10" fill="black"/>
                <rect x="180" y="180" width="10" height="10" fill="black"/>
              </svg>
              
              {/* Overlay for non-pending states */}
              {paymentStatus !== 'pending' && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                  <div className="text-center">
                    {getStatusIcon()}
                    <p className="text-sm font-medium mt-2">{getStatusMessage()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusMessage()}</span>
          </div>

          {/* Timer */}
          {paymentStatus === 'pending' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">QR expires in {formatTime(countdown)}</span>
            </div>
          )}

          {/* UPI Apps */}
          {paymentStatus === 'pending' && (
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">Supported UPI Apps</p>
              <div className="flex gap-3 justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  PhPe
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  GPay
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  Paytm
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  BHIM
                </div>
              </div>
            </div>
          )}

          {/* Simulate Payment Button (for demo) */}
          {paymentStatus === 'pending' && (
            <Button 
              onClick={simulatePayment}
              className="w-full"
              variant="hero"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Simulate QR Scan (Demo)
            </Button>
          )}

          {/* Cancel Button */}
          {paymentStatus === 'pending' && (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Cancel Payment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPaymentModal;
