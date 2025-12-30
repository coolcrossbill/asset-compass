import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { serverApi } from '@/services/api';
import { Server, Datacenter } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

interface ServerEditDialogProps {
  server: Server;
  datacenters: Datacenter[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ServerEditDialog({ server, datacenters, open, onOpenChange, onSuccess }: ServerEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hostname: server.hostname,
    datacenterId: server.datacenterId,
    model: server.model,
    serialNumber: server.serialNumber,
    status: server.status,
  });

  useEffect(() => {
    setFormData({
      hostname: server.hostname,
      datacenterId: server.datacenterId,
      model: server.model,
      serialNumber: server.serialNumber,
      status: server.status,
    });
  }, [server]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await serverApi.update(server.id, formData);
      toast({
        title: "Server updated",
        description: "The server has been successfully updated.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : 'Failed to update server',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Server</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
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
              <Label htmlFor="datacenter">Datacenter *</Label>
              <Select
                value={formData.datacenterId}
                onValueChange={(value) => setFormData({ ...formData, datacenterId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select datacenter" />
                </SelectTrigger>
                <SelectContent>
                  {datacenters.map((dc) => (
                    <SelectItem key={dc.id} value={dc.id}>
                      {dc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                required
              />
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
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
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

