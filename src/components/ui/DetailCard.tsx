import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DetailCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DetailCard({ title, icon, children, className }: DetailCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card card-shadow", className)}>
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

interface DetailRowProps {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}

export function DetailRow({ label, value, className }: DetailRowProps) {
  return (
    <div className={cn("flex items-start justify-between py-2", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value ?? '-'}</span>
    </div>
  );
}
