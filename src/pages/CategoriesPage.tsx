import { useEffect } from 'react';
import { useFetch } from '../hooks';
import { CategoryCard, SkeletonCard } from '../components/Card';
import { ErrorState } from '../components/Error';
import { fetchAPI } from '../services/api';
import { Grid, Tag } from 'lucide-react';

export function CategoriesPage() {
  const { data, loading, error, refetch } = useFetch(() =>
    fetchAPI<{ id: number; documentId: string }[]>({
      endpoint: 'categories',
      populate: {
        articles: {
          count: true,
        },
      },
      sort: 'name:asc',
    })
  );

  const categories = data?.data?.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    ...item,
    articleCount: item.articles?.count ?? 0,
  })) || [];

  const totalArticles = categories.reduce((sum: number, cat: any) => sum + cat.articleCount, 0);

  useEffect(() => {
    document.title = 'Categorii | Blogul Meu';
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Grid className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground font-serif">
              Categorii
            </h1>
          </div>
          <p className="text-muted-foreground font-sans">
            Rasfoieste continutul organizat pe teme
          </p>
        </div>

        {/* Statistici - adăugat de Luiza Tonț */}
        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Grid className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-serif">{categories.length}</p>
                <p className="text-sm text-muted-foreground font-sans">Categorii</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-serif">{totalArticles}</p>
                <p className="text-sm text-muted-foreground font-sans">Articole Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {error ? (
          <ErrorState message="Nu s-au putut incarca categoriile" onRetry={refetch} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <SkeletonCard key={i} type="category" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-sans">Nu au fost create categorii inca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.documentId}
                category={category}
                articleCount={category.articleCount}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
