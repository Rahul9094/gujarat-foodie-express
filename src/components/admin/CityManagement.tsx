import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface City {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  restaurant_count: number;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

interface CityFormData {
  name: string;
  slug: string;
  restaurant_count: string;
  lat: string;
  lng: string;
}

const defaultForm: CityFormData = {
  name: '',
  slug: '',
  restaurant_count: '0',
  lat: '',
  lng: '',
};

const CityManagement = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [form, setForm] = useState<CityFormData>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchCities(); }, []);

  const fetchCities = async () => {
    setLoading(true);
    const { data } = await supabase.from('db_cities').select('*').order('name');
    setCities(data || []);
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingCity(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (city: City) => {
    setEditingCity(city);
    setForm({
      name: city.name,
      slug: city.slug,
      restaurant_count: String(city.restaurant_count),
      lat: city.lat ? String(city.lat) : '',
      lng: city.lng ? String(city.lng) : '',
    });
    setImageFile(null);
    setImagePreview(city.image_url || null);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from('city-images').upload(fileName, file);
    if (error) {
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from('city-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      toast.error('Name and slug are required');
      return;
    }
    setSaving(true);

    let imageUrl = editingCity?.image_url || null;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      image_url: imageUrl,
      restaurant_count: parseInt(form.restaurant_count) || 0,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
    };

    if (editingCity) {
      const { error } = await supabase.from('db_cities').update(payload).eq('id', editingCity.id).select();
      if (error) { toast.error(`Failed to update: ${error.message}`); setSaving(false); return; }
      toast.success('City updated successfully');
    } else {
      const { error } = await supabase.from('db_cities').insert(payload).select();
      if (error) { toast.error(`Failed to add: ${error.message}`); setSaving(false); return; }
      toast.success('City added successfully');
    }

    setSaving(false);
    setDialogOpen(false);
    fetchCities();
  };

  const deleteCity = async (id: string) => {
    const { error } = await supabase.from('db_cities').delete().eq('id', id);
    if (error) { toast.error('Failed to delete city'); return; }
    toast.success('City deleted');
    fetchCities();
  };

  const filtered = cities.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground font-display">City Management</h2>
        <Button onClick={openAddDialog}><Plus className="w-4 h-4 mr-2" />Add City</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search cities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center"><p className="text-muted-foreground">No cities found.</p></div>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Restaurants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(city => (
                <TableRow key={city.id}>
                  <TableCell>
                    {city.image_url ? (
                      <img src={city.image_url} alt={city.name} className="w-16 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{city.name}</TableCell>
                  <TableCell className="text-muted-foreground">{city.slug}</TableCell>
                  <TableCell className="text-muted-foreground">{city.restaurant_count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(city)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete City</AlertDialogTitle>
                            <AlertDialogDescription>Delete "{city.name}"? All restaurants and products in this city may be affected.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCity(city.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>City Name *</Label>
              <Input value={form.name} onChange={e => { setForm(prev => ({ ...prev, name: e.target.value, slug: editingCity ? prev.slug : generateSlug(e.target.value) })); }} placeholder="e.g. Ahmedabad" />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} placeholder="e.g. ahmedabad" />
            </div>
            <div>
              <Label>Restaurant Count</Label>
              <Input type="number" value={form.restaurant_count} onChange={e => setForm(prev => ({ ...prev, restaurant_count: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Latitude</Label><Input value={form.lat} onChange={e => setForm(prev => ({ ...prev, lat: e.target.value }))} placeholder="e.g. 23.03" /></div>
              <div><Label>Longitude</Label><Input value={form.lng} onChange={e => setForm(prev => ({ ...prev, lng: e.target.value }))} placeholder="e.g. 72.58" /></div>
            </div>
            <div>
              <Label>City Image</Label>
              <div className="mt-1">
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />}
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : 'Upload image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : editingCity ? 'Update City' : 'Add City'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CityManagement;
