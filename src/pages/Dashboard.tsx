import { useState, useEffect } from 'react';
import { LayoutDashboard, Building2, Server, Monitor, Network, HardDrive, Users, Activity } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatsCard } from '@/components/ui/StatsCard';
import { EntityLink } from '@/components/ui/EntityLink';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { datacenterApi, serverApi, hostApi, ipAddressApi, osApi, personApi } from '@/services/api';
import type { Datacenter, Server as ServerType, Host, IPAddress, OperatingSystem, Person } from '@/types/cmdb';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [servers, setServers] = useState<ServerType[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [ipAddresses, setIpAddresses] = useState<IPAddress[]>([]);
  const [operatingSystems, setOperatingSystems] = useState<OperatingSystem[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dcData, srvData, hostData, ipData, osData, personData] = await Promise.all([
          datacenterApi.getAll(),
          serverApi.getAll(),
          hostApi.getAll(),
          ipAddressApi.getAll(),
          osApi.getAll(),
          personApi.getAll(),
        ]);
        setDatacenters(dcData);
        setServers(srvData);
        setHosts(hostData);
        setIpAddresses(ipData);
        setOperatingSystems(osData);
        setPersons(personData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onlineServers = servers.filter(s => s.status === 'online').length;
  const runningHosts = hosts.filter(h => h.status === 'running').length;
  const assignedIps = ipAddresses.filter(ip => ip.hostId).length;

  const recentActivity = [
    { action: 'Server updated', target: 'srv-chi-dev-01', time: '2 hours ago', type: 'maintenance' },
    { action: 'Host created', target: 'cache-prod-01', time: '1 day ago', type: 'running' },
    { action: 'IP assigned', target: '10.1.3.30', time: '2 days ago', type: 'static' },
    { action: 'Person added', target: 'Alex Turner', time: '3 days ago', type: 'admin' },
  ];

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title={t('dashboard.title')} 
          description={t('dashboard.quickStats')}
          icon={<LayoutDashboard className="h-6 w-6" />}
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={t('dashboard.title')} 
        description={t('dashboard.quickStats')}
        icon={<LayoutDashboard className="h-6 w-6" />}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        <StatsCard 
          title={t('dashboard.totalDatacenters')} 
          value={datacenters.length} 
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatsCard 
          title={t('dashboard.onlineServers')} 
          value={`${onlineServers}/${servers.length}`} 
          icon={<Server className="h-5 w-5" />}
        />
        <StatsCard 
          title={t('dashboard.runningHosts')} 
          value={`${runningHosts}/${hosts.length}`} 
          icon={<Monitor className="h-5 w-5" />}
        />
        <StatsCard 
          title={t('dashboard.assignedIPs')} 
          value={`${assignedIps}/${ipAddresses.length}`} 
          icon={<Network className="h-5 w-5" />}
        />
        <StatsCard 
          title={t('dashboard.totalOperatingSystems')} 
          value={operatingSystems.length} 
          icon={<HardDrive className="h-5 w-5" />}
        />
        <StatsCard 
          title={t('dashboard.totalPersons')} 
          value={persons.length} 
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">{t('dashboard.recentActivity')}</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.target}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={item.type} />
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <h2 className="font-semibold text-foreground mb-4">{t('dashboard.quickStats')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <EntityLink to="/datacenters" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors no-underline hover:no-underline">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-foreground">{t('navigation.datacenters')}</span>
            </EntityLink>
            <EntityLink to="/servers" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors no-underline hover:no-underline">
              <Server className="h-5 w-5 text-primary" />
              <span className="text-foreground">{t('navigation.servers')}</span>
            </EntityLink>
            <EntityLink to="/hosts" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors no-underline hover:no-underline">
              <Monitor className="h-5 w-5 text-primary" />
              <span className="text-foreground">{t('navigation.hosts')}</span>
            </EntityLink>
            <EntityLink to="/ips" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors no-underline hover:no-underline">
              <Network className="h-5 w-5 text-primary" />
              <span className="text-foreground">{t('navigation.ipAddresses')}</span>
            </EntityLink>
            <EntityLink to="/os" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors no-underline hover:no-underline">
              <HardDrive className="h-5 w-5 text-primary" />
              <span className="text-foreground">{t('navigation.operatingSystems')}</span>
            </EntityLink>
            <EntityLink to="/persons" className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors no-underline hover:no-underline">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-foreground">{t('navigation.persons')}</span>
            </EntityLink>
          </div>
        </div>
      </div>
    </div>
  );
}
