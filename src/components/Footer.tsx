import { Link } from 'react-router-dom';
import { Newspaper, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground font-serif">
                Blogul Meu
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md font-sans">
              Un blog personal care imparte ganduri, idei si perspective despre tehnologie, viata si tot ce se afla intre ele.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 font-sans">
              Link-uri Rapide
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Acasa
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Articole
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Categorii
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Despre
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 font-sans">
              Categorii
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Tehnologie
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Stil de Viata
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors font-sans">
                  Tutoriale
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm font-sans">
              {currentYear} Blogul Meu. Toate drepturile rezervate.
            </p>
            <p className="text-muted-foreground text-sm flex items-center mt-2 sm:mt-0 font-sans">
              Realizat cu <Heart className="w-4 h-4 mx-1 text-red-500" /> folosind React & Strapi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
