import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hostApi } from '@/services/api';
import { Host, Server, OperatingSystem } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

interface HostEditDialogProps {
  host: Host;
  servers: Server[];
  operatingSystems: OperatingSystem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function HostEditDialog({ host, servers, operatingSystems, open, onOpenChange, onSuccess }: HostEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hostname: host.hostname,
    serverId: host.serverId,
    osId: host.osId || '',
    type: host.type,
    status: host.status,
    cpu: host.cpu,
    memoryGb: host.memoryGb,
  });

  useEffect(() => {
    setFormData({
      hostname: host.hostname,
      serverId: host.serverId,
      osId: host.osId || '',
      type: host.type,
      status: host.status,
      cpu: host.cpu,
      memoryGb: host.memoryGb,
    });
  }, [host]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updateData = {
        ...formData,
        osId: formData.osId || undefined,
      };
      await hostApi.update(host.id, updateData);
      toast({
        title: "Host updated",
        description: "The host has been successfully updated.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : 'Failed to update host',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Host</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hostname">Hostname *</Label>
                <Input
                  id="hostname"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server">Server *</Label>
                <Select
                  value={formData.serverId}
                  onValueChange={(value) => setFormData({ ...formData, serverId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    {servers.map((srv) => (
                      <SelectItem key={srv.id} value={srv.id}>
                        {srv.hostname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vm">VM</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="bare-metal">Bare Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="os">Operating System</Label>
              <Select
                value={formData.osId}
                onValueChange={(value) => setFormData({ ...formData, osId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select OS (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {operatingSystems.map((os) => (
                    <SelectItem key={os.id} value={os.id}>
                      {os.name} {os.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpu">CPU (vCPU) *</Label>
                <Input
                  id="cpu"
                  type="number"
                  min="1"
                  value={formData.cpu}
                  onChange={(e) => setFormData({ ...formData, cpu: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory">Memory (GB) *</Label>
                <Input
                  id="memory"
                  type="number"
                  min="1"
                  value={formData.memoryGb}
                  onChange={(e) => setFormData({ ...formData, memoryGb: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

