import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag, ArrowLeft } from 'lucide-react';
import { useFetch } from '../hooks';
import { ArticleCard, SkeletonCard } from '../components/Card';
import { LoadingState } from '../components/Loading';
import { ErrorState } from '../components/Error';
import { fetchAPI } from '../services/api';
import type { Category, Article } from '../types/strapi';

export function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: categoryData, loading: categoryLoading, error: categoryError, refetch: refetchCategory } = useFetch(() =>
    fetchAPI<{ id: number; documentId: string }[]>({
      endpoint: 'categories',
      filters: { slug: { $eq: slug } },
      populate: '*',
    })
  );

  const category = categoryData?.data?.[0] as Category | undefined;

  const { data: articlesData, loading: articlesLoading } = useFetch(() =>
    fetchAPI<{ id: number; documentId: string }[]>({
      endpoint: 'articles',
      filters: { category: { slug: { $eq: slug } } },
      populate: '*',
      sort: 'publishedAt:desc',
    })
  );

  const articles = articlesData?.data?.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    ...item,
  })) || [];

  useEffect(() => {
    if (category) {
      document.title = `${category.name} | Blogul Meu`;
    }
  }, [category]);

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <LoadingState message="Se incarca categoria..." />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <ErrorState
          title="Categorie negasita"
          message="Categoria pe care o cauti nu exista sau a fost eliminata."
          onRetry={refetchCategory}
        />
        <div className="text-center mt-4">
          <Link to="/categories" className="text-primary hover:underline font-sans">
            Rasfoieste toate categoriile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/categories"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-4 transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Inapoi la Categorii</span>
          </Link>

          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
              <Tag className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground font-serif">
              {category.name}
            </h1>
          </div>

          {category.description && (
            <p className="text-xl text-muted-foreground max-w-2xl font-sans">
              {category.description}
            </p>
          )}

          <p className="text-muted-foreground mt-4 font-sans">
            {articles.length} articol{articles.length !== 1 ? 'e' : ''} in aceasta categorie
          </p>
        </div>

        {/* Content */}
        {articlesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground mb-4 font-sans">
              Nu au fost publicate articole in aceasta categorie inca.
            </p>
            <Link
              to="/articles"
              className="text-primary font-medium hover:underline font-sans"
            >
              Rasfoieste toate articolele
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <ArticleCard key={article.documentId} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
