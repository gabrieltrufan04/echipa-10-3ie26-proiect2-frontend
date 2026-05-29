const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/261599/pexels-photo-261599.jpeg?auto=compress&cs=tinysrgb&w=800';
const FALLBACK_IMAGE_DETAIL = 'https://images.pexels.com/photos/261599/pexels-photo-261599.jpeg?auto=compress&cs=tinysrgb&w=1260';

export function getStrapiImageUrl(url: string | undefined): string {
  if (!url) {
    return '';
  }

  // If the URL already starts with https:// or http://, it's a full URL (Strapi Cloud)
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url;
  }

  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function getArticleImageUrl(coverImage: { url?: string } | undefined | null): string {
  if (!coverImage?.url) {
    return FALLBACK_IMAGE;
  }

  // Use the URL directly - Strapi 5 Cloud provides full URLs
  return getStrapiImageUrl(coverImage.url);
}

export function getArticleDetailImageUrl(coverImage: { url?: string } | undefined | null): string {
  if (!coverImage?.url) {
    return FALLBACK_IMAGE_DETAIL;
  }

  // Use the URL directly - Strapi 5 Cloud provides full URLs
  return getStrapiImageUrl(coverImage.url);
}

export const FALLBACKS = {
  article: FALLBACK_IMAGE,
  articleDetail: FALLBACK_IMAGE_DETAIL,
  profile: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600',
};
