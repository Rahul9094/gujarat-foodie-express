import { Link } from 'react-router-dom';
import { categories } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';

const CategorySection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Explore Food Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From traditional thalis to crispy street snacks, discover the diverse flavors of Gujarat
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/menu?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-background mb-1">
                  {category.name}
                </h3>
                <p className="text-background/70 text-sm">
                  {category.itemCount} items
                </p>
                <div className="mt-3 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
