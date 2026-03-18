import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72, 'Password must be less than 72 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validateField = (name: string, value: string) => {
    const schema = isLogin ? loginSchema : signupSchema;
    const partial = { ...formData, [name]: value };
    const result = schema.safeParse(partial);
    if (!result.success) {
      const fieldError = result.error.errors.find(e => e.path[0] === name);
      return fieldError?.message || '';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = isLogin ? loginSchema : signupSchema;
    const result = schema.safeParse(formData);

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = { email: true, password: true };
    if (!isLogin) allTouched.name = true;
    setTouched(allTouched);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        if (!errors[field]) errors[field] = err.message;
      });
      setFieldErrors(errors);
      toast.error('Please fill all fields correctly');
      return;
    }
    setFieldErrors({});

    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          toast.success('Welcome back! Login successful.');
          navigate('/');
        } else {
          toast.error(res.error || 'Invalid email or password');
        }
      } else {
        const res = await signup(formData.name, formData.email, formData.password);
        if (res.success) {
          toast.success('Account created successfully!');
          navigate('/');
        } else {
          toast.error(res.error || 'Failed to create account');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFieldErrors({});
    setTouched({});
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4 animate-fade-in">
          <div className="bg-card rounded-2xl p-8 shadow-card">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center mb-4">
                <span className="text-primary-foreground font-bold text-2xl">G</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin 
                  ? 'Sign in to continue ordering' 
                  : 'Join Gujarat Food Express today'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your name"
                      className={`pl-10 ${fieldErrors.name && touched.name ? 'border-destructive' : ''}`}
                      maxLength={100}
                    />
                  </div>
                  {fieldErrors.name && touched.name && <p className="text-xs text-destructive mt-1">{fieldErrors.name}</p>}
                </div>
              )}

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    className={`pl-10 ${fieldErrors.email && touched.email ? 'border-destructive' : ''}`}
                    maxLength={255}
                  />
                </div>
                {fieldErrors.email && touched.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter password"
                    className={`pl-10 pr-10 ${fieldErrors.password && touched.password ? 'border-destructive' : ''}`}
                    maxLength={72}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password && touched.password && <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>}
              </div>

              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Please wait...' 
                  : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary font-medium hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
