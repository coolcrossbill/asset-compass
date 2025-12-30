import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ipAddressApi } from '@/services/api';
import { IPAddress, Host } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

interface IPEditDialogProps {
  ipAddress: IPAddress;
  hosts: Host[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function IPEditDialog({ ipAddress, hosts, open, onOpenChange, onSuccess }: IPEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: ipAddress.address,
    type: ipAddress.type,
    hostId: ipAddress.hostId || '',
  });

  useEffect(() => {
    setFormData({
      address: ipAddress.address,
      type: ipAddress.type,
      hostId: ipAddress.hostId || '',
    });
  }, [ipAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updateData = {
        ...formData,
        hostId: formData.hostId || undefined,
      };
      await ipAddressApi.update(ipAddress.id, updateData);
      toast({
        title: "IP Address updated",
        description: "The IP address has been successfully updated.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : 'Failed to update IP address',
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
          <DialogTitle>Edit IP Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="address">IP Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., 192.168.1.1"
                required
              />
            </div>
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
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="dhcp">DHCP</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="host">Assigned Host</Label>
              <Select
                value={formData.hostId}
                onValueChange={(value) => setFormData({ ...formData, hostId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select host (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {hosts.map((host) => (
                    <SelectItem key={host.id} value={host.id}>
                      {host.hostname}
                    </SelectItem>
                  ))}
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

