import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';
import { useFetch } from '../hooks';
import { LoadingState } from '../components/Loading';
import { ErrorState } from '../components/Error';
import { fetchAPI } from '../services/api';
import { getArticleDetailImageUrl, FALLBACKS } from '../utils/images';
import type { Article } from '../types/strapi';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [imageError, setImageError] = useState(false);

  const { data, loading, error, refetch } = useFetch(() =>
    fetchAPI<{ id: number; documentId: string }[]>({
      endpoint: 'articles',
      filters: { slug: { $eq: slug } },
      populate: '*',
    })
  );

  const article = data?.data?.[0] as Article | undefined;

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Blogul Meu`;
    }
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <LoadingState message="Se incarca articolul..." />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <ErrorState
          title="Articol negasit"
          message="Articolul pe care il cauti nu exista sau a fost eliminat."
          onRetry={refetch}
        />
        <div className="text-center mt-4">
          <Link to="/articles" className="text-primary hover:underline font-sans">
            Rasfoieste toate articolele
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = imageError
    ? FALLBACKS.articleDetail
    : getArticleDetailImageUrl(article.cover);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readTime = Math.ceil(article.content?.split(' ').length / 200) || 1;
  const readTimeText = readTime === 1 ? '1 min citire' : `${readTime} min citire`;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={imageUrl}
          alt={article.cover?.alternativeText || article.title}
          crossOrigin="anonymous"
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/articles"
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-4 transition-colors font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Inapoi la Articole</span>
            </Link>

            {article.category && (
              <Link
                to={`/categories/${article.category.slug}`}
                className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-sm font-medium mb-4 hover:bg-primary transition-colors font-sans"
              >
                <Tag className="w-3 h-3" />
                <span>{article.category.name}</span>
              </Link>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-4 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-sans">
              {article.author && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{article.author.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <Clock className="w-4 h-4" />
                <span>{readTimeText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div
            className="article-content font-sans"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {article.category && (
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground mb-4 font-sans">Publicat in:</p>
            <Link
              to={`/categories/${article.category.slug}`}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-sans"
            >
              <Tag className="w-4 h-4" />
              <span>{article.category.name}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
