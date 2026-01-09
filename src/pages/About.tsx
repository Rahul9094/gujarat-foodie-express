import { Target, Heart, Users, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
              About Gujarat Food Express
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Bringing the authentic flavors of Gujarat to your doorstep
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Gujarat Food Express was born from a deep love for the authentic flavors that 
                  have been passed down through generations of Gujarati families. Our journey 
                  began with a simple mission: to bring the true essence of Gujarat's culinary 
                  heritage to every home across the state.
                </p>
                <p>
                  From the perfectly spiced Undhiyu that warms your soul to the delicate sweetness 
                  of Basundi, every dish we serve carries the spirit of traditional Gujarati kitchens. 
                  Our recipes are crafted using age-old techniques, authentic spices, and the freshest 
                  ingredients to ensure that each bite takes you on a journey through Gujarat's rich 
                  culinary landscape.
                </p>
                <p>
                  We take immense pride in celebrating Gujarat's vibrant food culture - from the 
                  bustling streets of Ahmedabad serving piping hot Fafda-Jalebi to the coastal 
                  delicacies of Surat. Our passionate team of chefs and dedicated partners work 
                  tirelessly to preserve these cherished traditions while making them accessible 
                  to food lovers everywhere.
                </p>
                <p>
                  At Gujarat Food Express, food is not just sustenance - it's a celebration of 
                  our heritage, our community, and our love for authentic Gujarati flavors.
                </p>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"
                alt="Restaurant Interior"
                className="rounded-2xl shadow-card"
              />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-card">
                <p className="font-display text-2xl font-bold text-primary">7+</p>
                <p className="text-sm text-muted-foreground">Cities Covered</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-card rounded-xl p-4 shadow-card">
                <p className="font-display text-2xl font-bold text-primary">35+</p>
                <p className="text-sm text-muted-foreground">Restaurants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
              What We Stand For
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Target,
                  title: 'Our Mission',
                  description: 'To preserve and promote the authentic flavors of Gujarat through technology',
                },
                {
                  icon: Heart,
                  title: 'Quality First',
                  description: 'Partnering with restaurants that maintain highest hygiene and quality standards',
                },
                {
                  icon: Users,
                  title: 'Community',
                  description: 'Supporting local restaurants and celebrating Gujarat\'s culinary heritage',
                },
                {
                  icon: Award,
                  title: 'Excellence',
                  description: 'Striving for excellence in every order, from kitchen to doorstep',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-card text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default About;
