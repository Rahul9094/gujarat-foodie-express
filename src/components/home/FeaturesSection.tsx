import { Truck, Shield, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your food delivered within 30-45 minutes',
  },
  {
    icon: Shield,
    title: 'Safe & Hygienic',
    description: 'All our partner restaurants follow strict hygiene protocols',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Authentic recipes prepared by skilled local chefs',
  },
  {
    icon: Clock,
    title: 'Fresh & Hot',
    description: 'Food prepared fresh and delivered hot to your door',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-background/10 backdrop-blur-sm rounded-2xl hover:bg-background/20 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-background/20 rounded-full flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/80 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
