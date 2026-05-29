import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Ceva nu a mers bine',
  message = 'A aparut o eroare la incarcarea continutului.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 font-serif">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-4 font-sans">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-sans"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Incearca Din Nou</span>
        </button>
      )}
    </div>
  );
}
