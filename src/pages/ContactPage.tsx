import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  useEffect(() => {
    document.title = 'Contact | Blogul Meu';
  }, []);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">
            Mesaj Trimis!
          </h2>
          <p className="text-muted-foreground mb-6 font-sans">
            Multumesc pentru mesaj. Te voi contacta cat mai curand posibil.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors font-sans"
          >
            Trimite Alt Mesaj
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-4">
            Ia Legatura
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            Ai o intrebare, feedback sau doar vrei sa spui salut? Mi-ar face placere sa aud de la tine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-1 font-serif">
                    Email
                  </h3>
                  <p className="text-muted-foreground font-sans">
                    contact@blogulmeu.ro
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-1 font-serif">
                    Telefon
                  </h3>
                  <p className="text-muted-foreground font-sans">
                    +40 123 456 789
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-1 font-serif">
                    Locatie
                  </h3>
                  <p className="text-muted-foreground font-sans">
                    Bucuresti, Romania
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 font-serif">
              Trimite un Mesaj
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2 font-sans">
                    Numele Tau
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-sans"
                    placeholder="Ion Popescu"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2 font-sans">
                    Adresa de Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-sans"
                    placeholder="ion@exemplu.ro"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-2 font-sans">
                  Subiect
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-sans"
                  placeholder="Despre ce este vorba?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2 font-sans">
                  Mesaj
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none font-sans"
                  placeholder="Mesajul tau aici..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-medium transition-colors font-sans"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                    <span>Se trimite...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Trimite Mesajul</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
