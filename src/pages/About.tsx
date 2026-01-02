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
                  Gujarat Food Express is a college semester project designed to showcase the rich 
                  culinary heritage of Gujarat through a modern food delivery platform. Our mission 
                  is to make authentic Gujarati cuisine accessible to everyone across the state.
                </p>
                <p>
                  From the famous Gujarati Thali with its perfect balance of sweet and savory, 
                  to the beloved street foods like Dhokla and Fafda-Jalebi, we bring the essence 
                  of Gujarat's food culture right to your doorstep.
                </p>
                <p>
                  This project demonstrates a full-stack web application built with modern 
                  technologies including React, Node.js, Express.js, and MongoDB, implementing 
                  real-world features like user authentication, cart management, and order processing.
                </p>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600"
                alt="Gujarati Thali"
                className="rounded-2xl shadow-card"
              />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-card">
                <p className="font-display text-2xl font-bold text-primary">5+</p>
                <p className="text-sm text-muted-foreground">Cities Covered</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-card rounded-xl p-4 shadow-card">
                <p className="font-display text-2xl font-bold text-primary">100+</p>
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

        {/* Project Info */}
        <div className="container mx-auto px-4 py-16">
          <div className="bg-card rounded-2xl p-8 shadow-card max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              College Semester Project
            </h2>
            <p className="text-muted-foreground mb-6">
              This project is developed as part of a web development course to demonstrate 
              practical implementation of modern web technologies and best practices.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="bg-secondary rounded-lg p-3">
                <p className="font-medium text-foreground">React</p>
                <p className="text-muted-foreground">Frontend</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="font-medium text-foreground">Node.js</p>
                <p className="text-muted-foreground">Backend</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="font-medium text-foreground">MongoDB</p>
                <p className="text-muted-foreground">Database</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="font-medium text-foreground">Express</p>
                <p className="text-muted-foreground">API</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
