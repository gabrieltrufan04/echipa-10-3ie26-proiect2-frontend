import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useFetch } from '../hooks';
import { ArticleCard, SkeletonCard } from '../components/Card';
import { ErrorState } from '../components/Error';
import { fetchAPI } from '../services/api';
import type { Article } from '../types/strapi';

export function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data, loading, error, refetch } = useFetch(() =>
    fetchAPI<{ id: number; documentId: string }[]>({
      endpoint: 'articles',
      populate: '*',
      sort: 'publishedAt:desc',
      pagination: { pageSize: 50 },
    })
  );

  const articles = data?.data?.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    ...item,
  })) || [];

  const filteredArticles = searchQuery
    ? articles.filter((article: Article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  useEffect(() => {
    document.title = 'Articole | Blogul Meu';
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground font-serif mb-2">
            Articole
          </h1>
          <p className="text-muted-foreground font-sans">
            Exploreaza toate articolele si descopera idei noi
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Cauta articole..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-sans"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </form>

          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-sans">
                {filteredArticles.length} rezultat{filteredArticles.length !== 1 ? 'e' : ''} pentru "{searchQuery}"
              </span>
              <button
                onClick={clearSearch}
                className="px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-border transition-colors font-sans"
              >
                Sterge
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {error ? (
          <ErrorState message="Nu s-au putut incarca articolele" onRetry={refetch} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            {searchQuery ? (
              <>
                <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">
                  Nu s-au gasit articole
                </h3>
                <p className="text-muted-foreground mb-4 font-sans">
                  Incearca sa ajustezi termenii de cautare
                </p>
                <button
                  onClick={clearSearch}
                  className="text-primary font-medium hover:underline font-sans"
                >
                  Sterge cautarea
                </button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground font-sans">Nu au fost publicate articole inca.</p>
                <p className="text-muted-foreground mt-2 font-sans">Verifica mai tarziu!</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article: Article) => (
              <ArticleCard key={article.documentId} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
