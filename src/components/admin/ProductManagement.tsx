import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

interface DbCity {
  id: string;
  slug: string;
  name: string;
}

interface DbCategory {
  id: string;
  slug: string;
  name: string;
}

interface DbRestaurant {
  id: string;
  slug: string;
  name: string;
  city_id: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  rating: number;
  review_count: number;
  restaurant_id: string;
  category_id: string | null;
  city_id: string;
  is_veg: boolean;
  is_popular: boolean;
  is_published: boolean;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  city_id: string;
  restaurant_id: string;
  is_veg: boolean;
  is_popular: boolean;
  is_available: boolean;
  is_published: boolean;
  display_order: string;
}

const defaultForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  city_id: '',
  restaurant_id: '',
  is_veg: true,
  is_popular: false,
  is_available: true,
  is_published: false,
  display_order: '0',
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<DbCity[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [restaurants, setRestaurants] = useState<DbRestaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<DbRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (form.city_id) {
      setFilteredRestaurants(restaurants.filter(r => r.city_id === form.city_id));
      // Reset restaurant if it doesn't belong to the new city
      const current = restaurants.find(r => r.id === form.restaurant_id);
      if (current && current.city_id !== form.city_id) {
        setForm(prev => ({ ...prev, restaurant_id: '' }));
      }
    } else {
      setFilteredRestaurants([]);
    }
  }, [form.city_id, restaurants]);

  const fetchAll = async () => {
    setLoading(true);
    const [citiesRes, catsRes, restsRes, prodsRes] = await Promise.all([
      supabase.from('db_cities').select('id, slug, name').order('name'),
      supabase.from('db_categories').select('id, slug, name').order('display_order'),
      supabase.from('db_restaurants').select('id, slug, name, city_id').order('name'),
      supabase.from('products').select('*').order('display_order', { ascending: true }),
    ]);
    if (citiesRes.data) setCities(citiesRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    if (restsRes.data) setRestaurants(restsRes.data);
    if (prodsRes.data) setProducts(prodsRes.data as Product[]);
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category_id: product.category_id || '',
      city_id: product.city_id,
      restaurant_id: product.restaurant_id,
      is_veg: product.is_veg,
      is_popular: product.is_popular,
      is_available: product.is_available,
      is_published: product.is_published,
      display_order: String(product.display_order),
    });
    setImageFile(null);
    setImagePreview(product.image_url || null);
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
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);
    if (error) {
      toast.error('Failed to upload image');
      return null;
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.city_id || !form.restaurant_id) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    let imageUrl = editingProduct?.image_url || null;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      image_url: imageUrl,
      category_id: form.category_id || null,
      city_id: form.city_id,
      restaurant_id: form.restaurant_id,
      is_veg: form.is_veg,
      is_popular: form.is_popular,
      is_available: form.is_available,
      is_published: form.is_published,
      display_order: parseInt(form.display_order) || 0,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id);
      if (error) {
        toast.error('Failed to update product');
        setSaving(false);
        return;
      }
      toast.success('Product updated successfully');
    } else {
      const { error } = await supabase
        .from('products')
        .insert(payload);
      if (error) {
        toast.error('Failed to add product');
        setSaving(false);
        return;
      }
      toast.success('Product added successfully');
    }

    setSaving(false);
    setDialogOpen(false);
    fetchAll();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete product');
      return;
    }
    toast.success('Product deleted');
    fetchAll();
  };

  const togglePublish = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_published: !product.is_published })
      .eq('id', product.id);
    if (error) {
      toast.error('Failed to update');
      return;
    }
    fetchAll();
  };

  const toggleAvailability = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id);
    if (error) {
      toast.error('Failed to update');
      return;
    }
    fetchAll();
  };

  const getCityName = (cityId: string) => cities.find(c => c.id === cityId)?.name || '-';
  const getCategoryName = (catId: string | null) => catId ? categories.find(c => c.id === catId)?.name || '-' : '-';
  const getRestaurantName = (restId: string) => restaurants.find(r => r.id === restId)?.name || '-';

  const filteredProducts = products.filter(p => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = filterCity === 'all' || p.city_id === filterCity;
    const matchCat = filterCategory === 'all' || p.category_id === filterCategory;
    return matchSearch && matchCity && matchCat;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground font-display">Product Management</h2>
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">City</TableHead>
                <TableHead className="hidden md:table-cell">Restaurant</TableHead>
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-muted-foreground">
                    <GripVertical className="w-4 h-4 inline mr-1" />
                    {product.display_order}
                  </TableCell>
                  <TableCell>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <div className="flex gap-1 mt-1">
                        {product.is_veg ? (
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">Veg</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-600">Non-Veg</Badge>
                        )}
                        {product.is_popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{product.price}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{getCityName(product.city_id)}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{getRestaurantName(product.restaurant_id)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{getCategoryName(product.category_id)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        className={`text-xs cursor-pointer ${product.is_published ? 'bg-green-500/20 text-green-600' : 'bg-muted text-muted-foreground'}`}
                        onClick={() => togglePublish(product)}
                      >
                        {product.is_published ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        {product.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge
                        className={`text-xs cursor-pointer ${product.is_available ? 'bg-blue-500/20 text-blue-600' : 'bg-muted text-muted-foreground'}`}
                        onClick={() => toggleAvailability(product)}
                      >
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct(product.id)}>Delete</AlertDialogAction>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Gujarati Thali" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Product description..." rows={3} />
            </div>

            {/* Price + Display Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <Input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} placeholder="149" />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={e => setForm(prev => ({ ...prev, display_order: e.target.value }))} placeholder="0" />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm(prev => ({ ...prev, category_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>City *</Label>
              <Select value={form.city_id} onValueChange={v => setForm(prev => ({ ...prev, city_id: v, restaurant_id: '' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Restaurant (filtered by city) */}
            <div className="space-y-2">
              <Label>Restaurant *</Label>
              <Select value={form.restaurant_id} onValueChange={v => setForm(prev => ({ ...prev, restaurant_id: v }))} disabled={!form.city_id}>
                <SelectTrigger>
                  <SelectValue placeholder={form.city_id ? 'Select Restaurant' : 'Select city first'} />
                </SelectTrigger>
                <SelectContent>
                  {filteredRestaurants.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <Label>Veg</Label>
                <Switch checked={form.is_veg} onCheckedChange={v => setForm(prev => ({ ...prev, is_veg: v }))} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <Label>Popular</Label>
                <Switch checked={form.is_popular} onCheckedChange={v => setForm(prev => ({ ...prev, is_popular: v }))} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <Label>Available</Label>
                <Switch checked={form.is_available} onCheckedChange={v => setForm(prev => ({ ...prev, is_available: v }))} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <Label>Published</Label>
                <Switch checked={form.is_published} onCheckedChange={v => setForm(prev => ({ ...prev, is_published: v }))} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
