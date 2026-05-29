import { useEffect } from 'react';
import { useFetch } from '../hooks';
import { CategoryCard, SkeletonCard } from '../components/Card';
import { ErrorState } from '../components/Error';
import { fetchAPI } from '../services/api';

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

  useEffect(() => {
    document.title = 'Categorii | Blogul Meu';
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground font-serif mb-2">
            Categorii
          </h1>
          <p className="text-muted-foreground font-sans">
            Rasfoieste continutul organizat pe teme
          </p>
        </div>

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
