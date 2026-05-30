import { useEffect, useState } from 'react';
import { Mail, Github, Linkedin, Twitter, Globe, Users } from 'lucide-react';
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

const teamMembers = [
  {
    name: 'Strian Romulus Vlad Filip',
    role: 'Lider Echipă & Dezvoltator',
    category: 'Tehnologie',
    description: 'Pasionat de tehnologie și inteligență artificială.',
  },
  {
    name: 'Trufan Gabriel',
    role: 'Dezvoltator Frontend',
    category: 'Sport',
    description: 'Iubitor de sport și viață sănătoasă.',
  },
  {
    name: 'Luiza Tonț',
    role: 'Designer & Content Creator',
    category: 'Călătorii',
    description: 'Exploratoare de destinații europene și culturi noi.',
  },
  {
    name: 'Șeitan Larisa',
    role: 'Content Creator',
    category: 'Cultură',
    description: 'Entuziastă a festivalurilor și evenimentelor culturale.',
  },
];

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
        return null;
      default:
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
        setData(result as { data: AboutData });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const about = data?.data;

  useEffect(() => {
    document.title = 'Despre Echipa 10 | Blogul Meu';
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

  const blocks = about.blocks || [];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif mb-4">
            {about.title || 'Despre Echipa 10'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/70 rounded mx-auto" />
        </div>

        {/* Content Blocks */}
        {blocks.length > 0 ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-6 md:p-8">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-6 md:p-8 text-center">
            <p className="text-muted-foreground font-sans">Nu exista continut momentan.</p>
          </div>
        )}

        {/* Membri Echipă */}
        <div className="mt-8 bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-card-foreground font-serif">
              Membrii Echipei
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="p-4 bg-muted rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <h3 className="font-bold text-foreground font-serif mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-medium font-sans mb-1">{member.role}</p>
                <p className="text-xs text-muted-foreground font-sans mb-2">Categoria: {member.category}</p>
                <p className="text-sm text-muted-foreground font-sans">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
