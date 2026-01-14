import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Server, 
  Monitor, 
  Network, 
  HardDrive, 
  Users,
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const getNavigation = (t: (key: string) => string) => [
  { name: t('navigation.dashboard'), href: '/', icon: LayoutDashboard },
  { name: t('navigation.datacenters'), href: '/datacenters', icon: Building2 },
  { name: t('navigation.servers'), href: '/servers', icon: Server },
  { name: t('navigation.hosts'), href: '/hosts', icon: Monitor },
  { name: t('navigation.ipAddresses'), href: '/ips', icon: Network },
  { name: t('navigation.operatingSystems'), href: '/os', icon: HardDrive },
  { name: t('navigation.persons'), href: '/persons', icon: Users },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigation = getNavigation(t);

  return (
    <aside 
      className={cn(
        "sidebar-gradient flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
          <Database className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-sidebar-foreground animate-fade-in">
            CMDB
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary shadow-sm" 
                  : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <span className="animate-fade-in">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>{t('common.collapse')}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
