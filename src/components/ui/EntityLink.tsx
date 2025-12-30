import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface EntityLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function EntityLink({ to, children, className, showIcon = false }: EntityLinkProps) {
  return (
    <Link 
      to={to}
      className={cn(
        "inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors font-medium",
        className
      )}
    >
      {children}
      {showIcon && <ExternalLink className="h-3 w-3" />}
    </Link>
  );
}
