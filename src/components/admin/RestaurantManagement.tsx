import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DbCity { id: string; name: string; }

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  city_id: string;
  image_url: string | null;
  cuisine: string | null;
  delivery_time: string | null;
  price_range: string | null;
  rating: number;
  review_count: number;
  is_veg: boolean;
  menu_categories: string[] | null;
  address: string | null;
  created_at: string;
}

interface RestaurantFormData {
  name: string;
  slug: string;
  city_id: string;
  cuisine: string;
  delivery_time: string;
  price_range: string;
  rating: string;
  review_count: string;
  is_veg: boolean;
}

const defaultForm: RestaurantFormData = {
  name: '', slug: '', city_id: '', cuisine: '', delivery_time: '', price_range: '', rating: '0', review_count: '0', is_veg: true,
};

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cities, setCities] = useState<DbCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRest, setEditingRest] = useState<Restaurant | null>(null);
  const [form, setForm] = useState<RestaurantFormData>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [citiesRes, restsRes] = await Promise.all([
      supabase.from('db_cities').select('id, name').order('name'),
      supabase.from('db_restaurants').select('*').order('name'),
    ]);
    setCities(citiesRes.data || []);
    setRestaurants(restsRes.data || []);
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingRest(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (r: Restaurant) => {
    setEditingRest(r);
    setForm({
      name: r.name, slug: r.slug, city_id: r.city_id,
      cuisine: r.cuisine || '', delivery_time: r.delivery_time || '',
      price_range: r.price_range || '', rating: String(r.rating),
      review_count: String(r.review_count), is_veg: r.is_veg,
    });
    setImageFile(null);
    setImagePreview(r.image_url || null);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from('restaurant-images').upload(fileName, file);
    if (error) { toast.error(`Failed to upload image: ${error.message}`); return null; }
    const { data } = supabase.storage.from('restaurant-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.city_id) {
      toast.error('Name, slug, and city are required');
      return;
    }
    setSaving(true);

    let imageUrl = editingRest?.image_url || null;
    if (imageFile) { const uploaded = await uploadImage(imageFile); if (uploaded) imageUrl = uploaded; }

    const payload = {
      name: form.name, slug: form.slug, city_id: form.city_id,
      image_url: imageUrl, cuisine: form.cuisine || null,
      delivery_time: form.delivery_time || null, price_range: form.price_range || null,
      rating: parseFloat(form.rating) || 0, review_count: parseInt(form.review_count) || 0,
      is_veg: form.is_veg,
    };

    if (editingRest) {
      const { error } = await supabase.from('db_restaurants').update(payload).eq('id', editingRest.id).select();
      if (error) { toast.error(`Failed to update: ${error.message}`); setSaving(false); return; }
      toast.success('Restaurant updated');
    } else {
      const { error } = await supabase.from('db_restaurants').insert(payload).select();
      if (error) { toast.error(`Failed to add: ${error.message}`); setSaving(false); return; }
      toast.success('Restaurant added');
    }

    setSaving(false);
    setDialogOpen(false);
    fetchAll();
  };

  const deleteRestaurant = async (id: string) => {
    const { error } = await supabase.from('db_restaurants').delete().eq('id', id);
    if (error) { toast.error('Failed to delete restaurant'); return; }
    toast.success('Restaurant deleted');
    fetchAll();
  };

  const getCityName = (cityId: string) => cities.find(c => c.id === cityId)?.name || '-';

  const filtered = restaurants.filter(r => {
    const matchSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = filterCity === 'all' || r.city_id === filterCity;
    return matchSearch && matchCity;
  });

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground font-display">Restaurant Management</h2>
        <Button onClick={openAddDialog}><Plus className="w-4 h-4 mr-2" />Add Restaurant</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search restaurants..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Cities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center"><p className="text-muted-foreground">No restaurants found.</p></div>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="hidden md:table-cell">Cuisine</TableHead>
                <TableHead className="hidden md:table-cell">Rating</TableHead>
                <TableHead className="hidden lg:table-cell">Delivery</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>
                    {r.image_url ? (
                      <img src={r.image_url} alt={r.name} className="w-16 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{r.name}</p>
                    {r.is_veg && <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 mt-1">Pure Veg</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{getCityName(r.city_id)}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{r.cuisine || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">⭐ {r.rating}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{r.delivery_time || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(r)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
                            <AlertDialogDescription>Delete "{r.name}"? Products linked to this restaurant may be affected.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteRestaurant(r.id)}>Delete</AlertDialogAction>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRest ? 'Edit Restaurant' : 'Add New Restaurant'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Restaurant Name *</Label>
              <Input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value, slug: editingRest ? prev.slug : generateSlug(e.target.value) }))} placeholder="e.g. Kathiyavadi Rasoi" />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} />
            </div>
            <div>
              <Label>City *</Label>
              <Select value={form.city_id} onValueChange={v => setForm(prev => ({ ...prev, city_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>{cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cuisine</Label>
              <Input value={form.cuisine} onChange={e => setForm(prev => ({ ...prev, cuisine: e.target.value }))} placeholder="e.g. Gujarati, Kathiyawadi" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Delivery Time</Label><Input value={form.delivery_time} onChange={e => setForm(prev => ({ ...prev, delivery_time: e.target.value }))} placeholder="e.g. 30-45 min" /></div>
              <div><Label>Price Range</Label><Input value={form.price_range} onChange={e => setForm(prev => ({ ...prev, price_range: e.target.value }))} placeholder="e.g. ₹₹" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Rating</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(prev => ({ ...prev, rating: e.target.value }))} /></div>
              <div><Label>Review Count</Label><Input type="number" value={form.review_count} onChange={e => setForm(prev => ({ ...prev, review_count: e.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_veg} onCheckedChange={v => setForm(prev => ({ ...prev, is_veg: v }))} />
              <Label>Pure Veg Restaurant</Label>
            </div>
            <div>
              <Label>Restaurant Image</Label>
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
            <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : editingRest ? 'Update Restaurant' : 'Add Restaurant'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantManagement;
