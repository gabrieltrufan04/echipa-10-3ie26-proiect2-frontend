import { useEffect, useState } from 'react';
import { Mail, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { LoadingState } from '../components/Loading';
import { ErrorState } from '../components/Error';
import { fetchSingleAPI } from '../services/api';

interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
}

interface RichTextBlock {
  __component: 'shared.rich-text';
  id: number;
  body: string;
}

interface MediaBlock {
  __component: 'shared.media';
  id: number;
  data?: StrapiMedia;
  file?: StrapiMedia;
}

interface QuoteBlock {
  __component: 'shared.quote';
  id: number;
  body: string;
}

type Block = RichTextBlock | MediaBlock | QuoteBlock | Record<string, unknown>;

interface AboutData {
  id: number;
  documentId: string;
  title: string;
  blocks?: Block[];
  skills?: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

function renderBlock(block: Block, index: number) {
  try {
    const componentType = (block as Record<string, unknown>).__component as string;
    const blockId = (block as Record<string, unknown>).id as number || index;

    switch (componentType) {
      case 'shared.rich-text': {
        const richTextBlock = block as RichTextBlock;
        if (!richTextBlock.body) return null;
        return (
          <div
            key={blockId}
            className="prose prose-lg dark:prose-invert max-w-none mb-8 last:mb-0 font-sans whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: richTextBlock.body }}
          />
        );
      }
      case 'shared.quote': {
        const quoteBlock = block as QuoteBlock;
        if (!quoteBlock.body) return null;
        return (
          <blockquote
            key={blockId}
            className="border-l-4 border-orange-500 pl-6 py-4 my-6 italic text-muted-foreground bg-muted rounded-r-lg font-serif"
          >
            <div dangerouslySetInnerHTML={{ __html: quoteBlock.body }} />
          </blockquote>
        );
      }
      case 'shared.media':
        // Ignore media blocks
        return null;
      default:
        console.warn(`Unknown block type: ${componentType}`, block);
        return null;
    }
  } catch (err) {
    console.error('Error rendering block:', err, block);
    return null;
  }
}

export function AboutPage() {
  const [data, setData] = useState<{ data: AboutData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchSingleAPI<{ id: number; documentId: string }>({
          endpoint: 'about',
          populate: '*',
        });

        console.log('API Response:', result);
        console.log('Blocks data:', result.data);

        setData(result as { data: AboutData });
      } catch (err) {
        console.error('Error fetching about page:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  const about = data?.data;

  useEffect(() => {
    document.title = 'Despre | Blogul Meu';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <LoadingState message="Se incarca pagina despre..." />
      </div>
    );
  }

  if (error || !about) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <ErrorState
          title="Pagina despre indisponibila"
          message="Nu s-a putut incarca pagina despre. Te rog incearca mai tarziu."
        />
        <div className="text-center mt-4">
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline font-sans"
          >
            Reincarca pagina
          </button>
        </div>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return Twitter;
      case 'email':
        return Mail;
      case 'website':
        return Globe;
      default:
        return Globe;
    }
  };

  const blocks = about.blocks || [];

  console.log('Rendering blocks:', blocks);
  console.log('About data:', about);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-4">
            {about.title || 'Despre Mine'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/70 rounded mx-auto" />
        </div>

        {/* Content Section - show if blocks exist */}
        {blocks.length > 0 ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-6 md:p-8">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-6 md:p-8 text-center">
            <p className="text-muted-foreground font-sans">Nu exista continut momentan.</p>
          </div>
        )}

        {/* Skills Section */}
        {about.skills && about.skills.length > 0 && (
          <div className="mt-8 bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 font-serif">
              Abilitati & Expertiza
            </h2>
            <div className="flex flex-wrap gap-3">
              {about.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium font-sans"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {about.socialLinks && about.socialLinks.length > 0 && (
          <div className="mt-8 bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 font-serif">
              Conecteaza-te cu Mine
            </h2>
            <div className="flex flex-wrap gap-4">
              {about.socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-3 bg-muted rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-sans"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
