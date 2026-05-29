import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';
import type { Article, Category } from '../types/strapi';
import { getArticleImageUrl, FALLBACKS } from '../utils/images';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = imageError
    ? FALLBACKS.article
    : getArticleImageUrl(article.cover);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/articles/${article.slug}`} className="group block">
      <article className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={article.cover?.alternativeText || article.title}
            crossOrigin="anonymous"
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5">
          {article.category && (
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary font-sans">
                {article.category.name}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors font-serif">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2 font-sans">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center text-muted-foreground text-sm font-mono">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

interface CategoryCardProps {
  category: Category;
  articleCount?: number;
}

export function CategoryCard({ category, articleCount = 0 }: CategoryCardProps) {
  return (
    <Link to={`/categories/${category.slug}`} className="group block">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <Tag className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm text-muted-foreground font-sans">
            {articleCount === 0 ? 'niciun articol' : `${articleCount} articol${articleCount !== 1 ? 'e' : ''}`}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors font-serif">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 font-sans">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}

interface SkeletonCardProps {
  type?: 'article' | 'category';
}

export function SkeletonCard({ type = 'article' }: SkeletonCardProps) {
  if (type === 'category') {
    return (
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-muted rounded-lg" />
          <div className="w-16 h-4 bg-muted rounded" />
        </div>
        <div className="w-24 h-6 bg-muted rounded mb-2" />
        <div className="w-full h-4 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-5">
        <div className="w-20 h-4 bg-muted rounded mb-3" />
        <div className="w-full h-6 bg-muted rounded mb-2" />
        <div className="w-3/4 h-4 bg-muted rounded mb-3" />
        <div className="w-32 h-4 bg-muted rounded" />
      </div>
    </div>
  );
}
