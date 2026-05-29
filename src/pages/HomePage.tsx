import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useFetch } from '../hooks';
import { ArticleCard, CategoryCard, SkeletonCard } from '../components/Card';
import { ErrorState } from '../components/Error';
import { fetchAPI } from '../services/api';

const HERO_IMAGE = 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260';

export function HomePage() {
  const { data: articlesData, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = useFetch(() =>
    fetchAPI<{ id: number; documentId: string }[]>({
      endpoint: 'articles',
      populate: '*',
      sort: 'publishedAt:desc',
      pagination: { pageSize: 6 },
    })
  );

  const { data: categoriesData, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useFetch(() =>
    fetchAPI<{ id: number; documentId: string }[]>({
      endpoint: 'categories',
      populate: {
        articles: {
          count: true,
        },
      },
      pagination: { pageSize: 6 },
    })
  );

  const articles = articlesData?.data?.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    ...item,
  })) || [];

  const categories = categoriesData?.data?.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    ...item,
    articleCount: item.articles?.count ?? 0,
  })) || [];

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium font-sans">Bun venit in spatiul meu digital</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-serif leading-tight">
            Povesti, Idei &
            <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Inspiratie
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
            Exploreaza articole cu privire la tehnologie, creativitate si arta de a construi lucruri semnificative.
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium font-sans transition-colors"
          >
            <span>Exploreaza Articolele</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground font-serif">
                Ultimele Articole
              </h2>
              <p className="text-muted-foreground mt-2 font-sans">
                Perspective si idei proaspete pentru tine
              </p>
            </div>
            <Link
              to="/articles"
              className="hidden md:flex items-center space-x-2 text-primary hover:text-primary/80 font-medium font-sans transition-colors"
            >
              <span>Vezi Toate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {articlesError ? (
            <ErrorState message="Nu s-au putut incarca articolele" onRetry={refetchArticles} />
          ) : articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-sans">Nu s-au gasit articole.</p>
              <Link to="/articles" className="mt-4 inline-block text-primary hover:underline font-sans">
                Verifica mai tarziu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 6).map((article) => (
                <ArticleCard key={article.documentId} article={article} />
              ))}
            </div>
          )}

          <div className="mt-8 md:hidden text-center">
            <Link
              to="/articles"
              className="inline-flex items-center space-x-2 text-primary font-medium font-sans"
            >
              <span>Vezi Toate Articolele</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-card-foreground font-serif">
                Rasfoieste pe Categorii
              </h2>
              <p className="text-muted-foreground mt-2 font-sans">
                Gaseste continut care conteaza pentru tine
              </p>
            </div>
            <Link
              to="/categories"
              className="hidden md:flex items-center space-x-2 text-primary hover:text-primary/80 font-medium font-sans transition-colors"
            >
              <span>Vezi Toate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categoriesError ? (
            <ErrorState message="Nu s-au putut incarca categoriile" onRetry={refetchCategories} />
          ) : categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} type="category" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-sans">Nu s-au gasit categorii.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard
                  key={category.documentId}
                  category={category}
                  articleCount={category.articleCount}
                />
              ))}
            </div>
          )}

          <div className="mt-8 md:hidden text-center">
            <Link
              to="/categories"
              className="inline-flex items-center space-x-2 text-primary font-medium font-sans"
            >
              <span>Vezi Toate Categoriile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
