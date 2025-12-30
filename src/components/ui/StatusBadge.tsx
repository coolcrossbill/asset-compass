import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  online: 'bg-success/15 text-success border-success/30',
  running: 'bg-success/15 text-success border-success/30',
  offline: 'bg-destructive/15 text-destructive border-destructive/30',
  stopped: 'bg-destructive/15 text-destructive border-destructive/30',
  maintenance: 'bg-warning/15 text-warning border-warning/30',
  suspended: 'bg-warning/15 text-warning border-warning/30',
  static: 'bg-primary/15 text-primary border-primary/30',
  dhcp: 'bg-accent/15 text-accent border-accent/30',
  reserved: 'bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30',
  vm: 'bg-primary/15 text-primary border-primary/30',
  container: 'bg-accent/15 text-accent border-accent/30',
  'bare-metal': 'bg-secondary-foreground/15 text-secondary-foreground border-secondary-foreground/30',
  ipv4: 'bg-primary/15 text-primary border-primary/30',
  ipv6: 'bg-accent/15 text-accent border-accent/30',
  owner: 'bg-success/15 text-success border-success/30',
  admin: 'bg-primary/15 text-primary border-primary/30',
  operator: 'bg-warning/15 text-warning border-warning/30',
  viewer: 'bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || 'bg-muted text-muted-foreground border-muted';
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
    >
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full",
        normalizedStatus === 'online' || normalizedStatus === 'running' ? 'bg-success animate-pulse-soft' :
        normalizedStatus === 'offline' || normalizedStatus === 'stopped' ? 'bg-destructive' :
        normalizedStatus === 'maintenance' || normalizedStatus === 'suspended' ? 'bg-warning' :
        'bg-current'
      )} />
      {status}
    </span>
  );
}
