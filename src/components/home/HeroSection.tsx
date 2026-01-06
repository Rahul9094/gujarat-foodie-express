import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dhoklaImage from '@/assets/khaman-dhokla.jpg';
import fafdaImage from '@/assets/fafda-jalebi.jpeg';
import basundiImage from '@/assets/basundi.jpg';
import paniPuriImage from '@/assets/pani-puri.jpg';
const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-warm" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-spice-turmeric blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Delivering across Gujarat
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Taste the Authentic{' '}
              <span className="text-gradient">Gujarat</span>{' '}
              at Your Doorstep
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              From the famous Gujarati Thali to mouth-watering street food, 
              experience the rich culinary heritage of Gujarat delivered fresh to you.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="xl" variant="hero" className="group">
                  Order Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/cities">
                <Button size="xl" variant="outline">
                  Explore Cities
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground">4.8+</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">30 min</p>
                  <p className="text-xs text-muted-foreground">Avg. Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-spice-turmeric/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-spice-turmeric" />
                </div>
                <div>
                  <p className="font-bold text-foreground">5 Cities</p>
                  <p className="text-xs text-muted-foreground">Coverage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Food Images */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px]">
              {/* Main Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full overflow-hidden shadow-card border-8 border-background animate-float">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop"
                  alt="Gujarati Thali"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Food Cards */}
              <div className="absolute top-10 left-10 bg-card p-3 rounded-xl shadow-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <img
                  src={dhoklaImage}
                  alt="Dhokla"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-xs font-medium mt-2 text-center">Dhokla</p>
              </div>

              <div className="absolute top-20 right-0 bg-card p-3 rounded-xl shadow-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <img
                  src={fafdaImage}
                  alt="Fafda"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-xs font-medium mt-2 text-center">Fafda</p>
              </div>

              <div className="absolute bottom-20 left-0 bg-card p-3 rounded-xl shadow-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <img
                  src={basundiImage}
                  alt="Basundi"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-xs font-medium mt-2 text-center">Basundi</p>
              </div>

              <div className="absolute bottom-10 right-10 bg-card p-3 rounded-xl shadow-card animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <img
                  src={paniPuriImage}
                  alt="Pani Puri"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-xs font-medium mt-2 text-center">Pani Puri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
