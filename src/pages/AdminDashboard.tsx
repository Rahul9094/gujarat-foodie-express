import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  MessageSquare, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Truck,
  Eye,
  Mail,
  MailOpen,
  Trash2,
  XCircle,
  ShoppingBag,
  MapPin,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProductManagement from '@/components/admin/ProductManagement';
import CityManagement from '@/components/admin/CityManagement';
import RestaurantManagement from '@/components/admin/RestaurantManagement';

interface Order {
  id: string;
  user_email: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  address: string;
  payment_method: string;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'bg-yellow-500/20 text-yellow-600' },
  in_progress: { icon: Truck, label: 'In Progress', color: 'bg-blue-500/20 text-blue-600' },
  delivered: { icon: CheckCircle2, label: 'Delivered', color: 'bg-green-500/20 text-green-600' },
  cancelled: { icon: XCircle, label: 'Cancelled', color: 'bg-red-500/20 text-red-600' },
};

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, logout, loading, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin-login');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    await Promise.all([fetchOrders(), fetchMessages()]);
    setLoadingData(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }
    
    const ordersData = (data || []).map(order => ({
      ...order,
      items: order.items as Array<{ name: string; price: number; quantity: number }>
    }));
    setOrders(ordersData);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    
    setMessages(data || []);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (error) {
      toast.error('Failed to update order status');
      return;
    }
    
    toast.success(`Order status updated to ${newStatus}`);
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', messageId);
    
    if (error) {
      console.error('Error marking message as read:', error);
      return;
    }
    
    fetchMessages();
  };

  const deleteOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
      return;
    }
    
    toast.success('Order deleted successfully');
    fetchOrders();
    setSelectedOrder(null);
  };

  const clearAllMessages = async () => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all messages
    
    if (error) {
      toast.error('Failed to clear messages');
      console.error('Error clearing messages:', error);
      return;
    }
    
    toast.success('All messages cleared successfully');
    fetchMessages();
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markMessageAsRead(message.id);
    }
  };

  const handleReplyEmail = (email: string, subject: string | null, name: string) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(`Re: ${subject || 'Your message to Gujarat Food Express'}`)}&body=${encodeURIComponent(`Dear ${name},\n\nThank you for contacting Gujarat Food Express.\n\n`)}`;
    window.open(gmailUrl, '_blank');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">G</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Gujarat Food Express
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name || 'Admin'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {unreadCount}
                </p>
                <p className="text-xs text-muted-foreground">Unread Messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages ({messages.length})
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-card rounded-xl p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                  
                  return (
                    <div key={order.id} className="bg-card rounded-xl p-4 shadow-card">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.user_email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Order Received</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="in_progress">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {(order.status === 'delivered' || order.status === 'cancelled') && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to permanently delete this order? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteOrder(order.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {(order.items as any[]).length} items • {order.payment_method}
                        </span>
                        <span className="font-semibold text-primary">₹{order.total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {messages.length > 0 && (
              <div className="flex justify-end mb-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Messages
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Messages</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently delete all messages? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAllMessages}>
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            {messages.length === 0 ? (
              <div className="bg-card rounded-xl p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`bg-card rounded-xl p-4 shadow-card cursor-pointer transition-colors hover:bg-secondary/20 ${
                      !message.is_read ? 'border-l-4 border-primary' : ''
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          message.is_read ? 'bg-muted' : 'bg-primary/10'
                        }`}>
                          {message.is_read ? (
                            <MailOpen className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Mail className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${!message.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {message.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                          <p className="text-sm text-foreground mt-1">
                            {message.subject || 'No Subject'}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {message.message}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.user_email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment</p>
                  <p className="font-medium">{selectedOrder.payment_method}</p>
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground text-sm mb-2">Delivery Address</p>
                <p className="text-sm bg-secondary/50 p-3 rounded-lg">{selectedOrder.address}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-2">Items</p>
                <div className="space-y-2">
                  {(selectedOrder.items as any[]).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm bg-secondary/50 p-3 rounded-lg">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary text-lg">₹{selectedOrder.total}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Details Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>
              
              {selectedMessage.subject && (
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Subject</p>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground text-sm mb-2">Message</p>
                <p className="text-sm bg-secondary/50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleReplyEmail(selectedMessage.email, selectedMessage.subject, selectedMessage.name)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply via Gmail
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
