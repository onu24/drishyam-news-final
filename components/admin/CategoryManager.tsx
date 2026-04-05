'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Category } from '@/lib/types';
import { CategoryForm } from './CategoryForm';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { deleteCategory } from '@/lib/dashboard'; // Note: Client side calling might fail if it's admin SDK, usually better to use actions.

// We'll use the action for delete if available, but for now we follow the existing pattern in the project.

interface CategoryManagerProps {
  initialCategories: Category[];
  categoryCounts: Record<string, number>;
}

export function CategoryManager({ initialCategories, categoryCounts }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleAdd = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage editorial structure and coverage areas.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-sm hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <PlusCircle size={18} />
          New Category
        </button>
      </div>

      {isFormOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-lg m-auto">
            <CategoryForm 
              category={editingCategory} 
              onClose={handleClose}
              onSuccess={() => {
                // Actions refresh naturally
              }}
            />
          </div>
        </div>,
        document.body
      )}

      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="py-4 px-6 font-semibold">Category Name</th>
              <th className="py-4 px-6 font-semibold">Description</th>
              <th className="py-4 px-6 font-semibold text-center">Article Count</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-secondary/20 transition-colors group">
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{cat.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">/{cat.slug}</div>
                </td>
                <td className="py-4 px-6 text-muted-foreground max-w-sm truncate">
                  {cat.description}
                </td>
                <td className="py-4 px-6 text-center">
                   <span className="inline-flex items-center justify-center px-2 py-1 bg-secondary text-foreground font-bold rounded-sm text-xs min-w-[2rem] border border-border">
                     {categoryCounts[cat.id] || 0}
                   </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
                  >
                    <Pencil size={14} />
                    <span className="hidden md:inline">Edit</span>
                  </button>
                  <button 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest opacity-50 cursor-not-allowed hidden md:inline-flex" 
                    title="Disabled in mock mode"
                    disabled
                  >
                    <Trash2 size={14} />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
