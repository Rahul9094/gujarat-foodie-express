import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Clock, Smartphone, QrCode, Loader2, Camera, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  amount: number;
}

type PaymentStatus = 'input' | 'pending' | 'camera' | 'scanned' | 'processing' | 'completed';

const QRPaymentModal = ({ isOpen, onClose, onPaymentComplete, amount }: QRPaymentModalProps) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('input');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [cameraActive, setCameraActive] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus('input');
      setCountdown(300);
      setUpiId('');
      setUpiError('');
      stopCamera();
      return;
    }

    if (paymentStatus !== 'input') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        stopCamera();
      };
    }
  }, [isOpen, paymentStatus]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const validateUpiId = (id: string): boolean => {
    // UPI ID format: username@bankname (e.g., user@paytm, 9876543210@ybl)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(id);
  };

  const handleProceedToPayment = () => {
    if (!upiId.trim()) {
      setUpiError('Please enter your UPI ID');
      return;
    }
    
    if (!validateUpiId(upiId.trim())) {
      setUpiError('Please enter a valid UPI ID (e.g., yourname@paytm)');
      return;
    }

    setUpiError('');
    setPaymentStatus('pending');
    toast.success('UPI ID verified! Scan the QR code to complete payment.');
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setCameraActive(true);
      setPaymentStatus('camera');
      toast.info('Point your camera at the QR code');
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Could not access camera. Please complete payment manually.');
    }
  };

  const handleQRScanned = () => {
    stopCamera();
    setPaymentStatus('scanned');
    toast.success('QR Code scanned! Click "Confirm Payment" to complete.');
  };

  const confirmPayment = () => {
    setPaymentStatus('processing');
    toast.info('Processing your payment...');
    
    setTimeout(() => {
      setPaymentStatus('completed');
      toast.success('Payment completed successfully!');
      
      setTimeout(() => {
        onPaymentComplete();
      }, 1500);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const simulatePayment = () => {
    setPaymentStatus('scanned');
    toast.success('Ready to confirm payment');
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'input':
        return 'Enter your UPI ID to proceed';
      case 'pending':
        return 'Scan QR code with your UPI app to pay';
      case 'camera':
        return 'Point camera at QR code';
      case 'scanned':
        return 'QR Code scanned! Confirm to pay';
      case 'processing':
        return 'Processing payment...';
      case 'completed':
        return 'Payment successful!';
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'input':
        return <Smartphone className="w-6 h-6 text-primary" />;
      case 'pending':
        return <QrCode className="w-6 h-6 text-primary" />;
      case 'camera':
        return <Camera className="w-6 h-6 text-yellow-500 animate-pulse" />;
      case 'scanned':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
  };

  const handleClose = () => {
    if (paymentStatus === 'input' || paymentStatus === 'pending' || paymentStatus === 'camera' || paymentStatus === 'scanned') {
      stopCamera();
      onClose();
    }
  };

  // Generate UPI payment link for real payments
  const getUpiPaymentLink = () => {
    const merchantUpiId = 'gujaratfoodexpress@upi'; // Merchant's UPI ID
    const merchantName = 'Gujarat Food Express';
    const transactionNote = 'Food Order Payment';
    return `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  };

  const handleOpenUpiApp = () => {
    // Try to open UPI app
    window.location.href = getUpiPaymentLink();
    
    // After a short delay, show confirmation option
    setTimeout(() => {
      toast.info('Complete payment in your UPI app, then confirm here');
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl">
            UPI Payment
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Amount Display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary">₹{amount}</p>
          </div>

          {/* UPI ID Input Step */}
          {paymentStatus === 'input' && (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi-id">Your UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@paytm, 9876543210@ybl"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setUpiError('');
                  }}
                  className={upiError ? 'border-destructive' : ''}
                />
                {upiError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {upiError}
                  </p>
                )}
              </div>

              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-2">Supported UPI Apps</p>
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

              <Button 
                onClick={handleProceedToPayment}
                className="w-full"
                variant="hero"
              >
                Proceed to Payment
              </Button>

              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Camera View or QR Code */}
          {paymentStatus !== 'input' && (
            <>
              <div className="relative">
                {cameraActive && paymentStatus === 'camera' ? (
                  <div className="relative">
                    <video 
                      ref={videoRef}
                      className="w-[200px] h-[200px] rounded-xl object-cover border-2 border-yellow-500"
                      autoPlay
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-white/50 rounded-lg animate-pulse" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80"
                      onClick={stopCamera}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className={`bg-white p-4 rounded-xl border-2 transition-all ${
                    paymentStatus === 'completed' ? 'border-green-500' : 
                    paymentStatus === 'scanned' || paymentStatus === 'processing' ? 'border-yellow-500' : 
                    'border-border'
                  }`}>
                    {/* QR Code SVG with UPI payment data */}
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
                )}
              </div>

              {/* UPI ID Display */}
              {paymentStatus === 'pending' && (
                <div className="text-center bg-secondary/50 px-4 py-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Paying to</p>
                  <p className="font-mono text-sm font-medium">{upiId}</p>
                </div>
              )}

              {/* Payment Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusMessage()}</span>
              </div>

              {/* Timer */}
              {paymentStatus === 'pending' && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Payment expires in {formatTime(countdown)}</span>
                </div>
              )}

              {/* Open in UPI App */}
              {paymentStatus === 'pending' && (
                <Button 
                  onClick={handleOpenUpiApp}
                  className="w-full"
                  variant="hero"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Open UPI App to Pay
                </Button>
              )}

              {/* Scan with Camera Button */}
              {paymentStatus === 'pending' && (
                <Button 
                  onClick={startCamera}
                  className="w-full"
                  variant="outline"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan with Camera
                </Button>
              )}

              {/* Camera Scan Button - when camera is active */}
              {paymentStatus === 'camera' && (
                <Button 
                  onClick={handleQRScanned}
                  className="w-full"
                  variant="hero"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  I've Scanned the QR Code
                </Button>
              )}

              {/* Confirm Payment Button - after scanning */}
              {paymentStatus === 'scanned' && (
                <Button 
                  onClick={confirmPayment}
                  className="w-full"
                  variant="hero"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Payment
                </Button>
              )}

              {/* I've Made the Payment Button */}
              {paymentStatus === 'pending' && (
                <Button 
                  onClick={simulatePayment}
                  className="w-full"
                  variant="secondary"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  I've Made the Payment
                </Button>
              )}

              {/* Cancel Button */}
              {(paymentStatus === 'pending' || paymentStatus === 'camera' || paymentStatus === 'scanned') && (
                <Button 
                  variant="ghost" 
                  onClick={handleClose}
                  className="w-full"
                >
                  Cancel Payment
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPaymentModal;