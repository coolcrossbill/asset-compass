# CRUD Implementation Guide

This guide shows how to implement full CRUD operations for all entity pages in the frontend.

## Pattern Overview

Each list and detail page follows this pattern:

### List Page Pattern

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiQuery } from '@/hooks/useApi';
import { entityApi } from '@/services/api';
import { Entity } from '@/types/cmdb';

export default function EntityList() {
  const navigate = useNavigate();
  
  // Fetch data with custom hook
  const { data: entities = [], loading, error, refetch } = useApiQuery(() => entityApi.getAll());
  
  // Handle error state
  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Entities" />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">Error: {error}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }
  
  return (
    // ... render with entities data
    <DataTable 
      data={entities}
      emptyMessage={loading ? "Loading..." : "No entities found"}
    />
  );
}
```

### Detail Page Pattern

```typescript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { entityApi } from '@/services/api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

export default function EntityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await entityApi.getById(id);
        setEntity(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      await entityApi.delete(id);
      toast({ title: "Entity deleted", description: "Successfully deleted." });
      navigate('/entities');
    } catch (err) {
      toast({ 
        title: "Delete failed", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Loading/error states...
  
  return (
    <>
      <PageHeader
        actions={
          <div className="flex gap-2">
            <Button variant="outline">Edit</Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        }
      />
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Entity"
        description="Are you sure? This cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}
```

## Implementation Status

### ✅ Completed
- Dashboard - Full API integration
- Datacenters List - Read operations with error handling
- Datacenters Detail - Read + Delete operations
- Servers List - Read operations with error handling  
- Servers Detail - Read + Delete operations

### 🔄 Needs Update
- Hosts List & Detail
- IP Addresses List & Detail
- Operating Systems List & Detail
- Persons List & Detail

## Key Components

### useApiQuery Hook
Location: `/src/hooks/useApi.ts`

Provides:
- `data` - fetched data
- `loading` - loading state
- `error` - error message
- `refetch()` - manual refetch function

### ConfirmDialog Component
Location: `/src/components/ui/ConfirmDialog.tsx`

Props:
- `open` - dialog open state
- `onOpenChange` - open state handler
- `onConfirm` - confirm action
- `title` - dialog title
- `description` - dialog description
- `variant` - "default" | "destructive"

### API Services
Location: `/src/services/api.ts`

Available services:
- `datacenterApi`
- `serverApi`
- `hostApi`
- `ipAddressApi`
- `osApi`
- `personApi`
- `assignmentApi`

Each provides:
- `getAll()` - fetch all entities
- `getById(id)` - fetch single entity
- `create(data)` - create new entity
- `update(id, data)` - update existing entity
- `delete(id)` - delete entity

## Create/Edit Forms

For create and edit operations, use dialogs with forms:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

// In component:
const [createDialogOpen, setCreateDialogOpen] = useState(false);

const form = useForm({
  defaultValues: {
    name: '',
    // ...other fields
  }
});

const onSubmit = async (values) => {
  try {
    await entityApi.create(values);
    toast({ title: "Created successfully" });
    refetch();
    setCreateDialogOpen(false);
  } catch (err) {
    toast({ title: "Failed", variant: "destructive" });
  }
};

// In render:
<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Entity</DialogTitle>
    </DialogHeader>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* form fields */}
        <Button type="submit">Create</Button>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

## Next Steps

1. Update remaining list pages with `useApiQuery`
2. Update remaining detail pages with delete functionality
3. Add create dialogs to all list pages
4. Add edit dialogs to all detail pages
5. Add proper form validation with zod schemas

