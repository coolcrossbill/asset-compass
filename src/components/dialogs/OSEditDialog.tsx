import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { operatingSystemApi } from '@/services/api';
import { OperatingSystem } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

interface OSEditDialogProps {
  os: OperatingSystem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OSEditDialog({ os, open, onOpenChange, onSuccess }: OSEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: os.name,
    version: os.version,
    family: os.family,
  });

  useEffect(() => {
    setFormData({
      name: os.name,
      version: os.version,
      family: os.family,
    });
  }, [os]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await operatingSystemApi.update(os.id, formData);
      toast({
        title: "Operating System updated",
        description: "The operating system has been successfully updated.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : 'Failed to update operating system',
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
          <DialogTitle>Edit Operating System</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="family">Family *</Label>
              <Select
                value={formData.family}
                onValueChange={(value: any) => setFormData({ ...formData, family: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linux">Linux</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                  <SelectItem value="unix">Unix</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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

