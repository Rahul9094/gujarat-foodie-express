import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">G</span>
              </div>
              <h3 className="font-display text-xl font-bold">Gujarat Food Express</h3>
            </div>
            <p className="text-background/70 text-sm mb-4">
              Bringing authentic Gujarati flavors to your doorstep. Experience the rich culinary heritage of Gujarat with every order.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cities" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Cities
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">We Deliver In</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cities/ahmedabad" className="text-background/70 hover:text-primary transition-colors text-sm">Ahmedabad</Link>
              </li>
              <li>
                <Link to="/cities/surat" className="text-background/70 hover:text-primary transition-colors text-sm">Surat</Link>
              </li>
              <li>
                <Link to="/cities/vadodara" className="text-background/70 hover:text-primary transition-colors text-sm">Vadodara</Link>
              </li>
              <li>
                <Link to="/cities/rajkot" className="text-background/70 hover:text-primary transition-colors text-sm">Rajkot</Link>
              </li>
              <li>
                <Link to="/cities/bhavnagar" className="text-background/70 hover:text-primary transition-colors text-sm">Bhavnagar</Link>
              </li>
              <li>
                <Link to="/cities/patan" className="text-background/70 hover:text-primary transition-colors text-sm">Patan</Link>
              </li>
              <li>
                <Link to="/cities/gandhinagar" className="text-background/70 hover:text-primary transition-colors text-sm">Gandhinagar</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                Patan, Gujarat, India
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                +91 78638 21747
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                rahulsinh123123123@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2026 Gujarat Food Express. College Semester Project.
          </p>
          <p className="text-background/40 text-xs mt-1">
            Made with ❤️ for Gujarat's culinary heritage
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
