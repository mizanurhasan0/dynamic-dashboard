'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, FolderOpen, Folder, Search } from 'lucide-react';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parentId: number | null;
    children?: Category[];
    productCount: number;
    isExpanded?: boolean;
}

// Sample hierarchical category data
const sampleCategories: Category[] = [
    {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        parentId: null,
        productCount: 45,
        children: [
            {
                id: 2,
                name: 'Computers',
                slug: 'computers',
                parentId: 1,
                productCount: 20,
                children: [
                    { id: 3, name: 'Laptops', slug: 'laptops', parentId: 2, productCount: 12 },
                    { id: 4, name: 'Desktops', slug: 'desktops', parentId: 2, productCount: 8 },
                ]
            },
            {
                id: 5,
                name: 'Mobile Devices',
                slug: 'mobile-devices',
                parentId: 1,
                productCount: 25,
                children: [
                    { id: 6, name: 'Smartphones', slug: 'smartphones', parentId: 5, productCount: 18 },
                    { id: 7, name: 'Tablets', slug: 'tablets', parentId: 5, productCount: 7 },
                ]
            }
        ]
    },
    {
        id: 8,
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        parentId: null,
        productCount: 120,
        children: [
            {
                id: 9,
                name: "Men's Clothing",
                slug: 'mens-clothing',
                parentId: 8,
                productCount: 60,
                children: [
                    { id: 10, name: 'Shirts', slug: 'mens-shirts', parentId: 9, productCount: 25 },
                    { id: 11, name: 'Pants', slug: 'mens-pants', parentId: 9, productCount: 20 },
                    { id: 12, name: 'Accessories', slug: 'mens-accessories', parentId: 9, productCount: 15 },
                ]
            },
            {
                id: 13,
                name: "Women's Clothing",
                slug: 'womens-clothing',
                parentId: 8,
                productCount: 60,
                children: [
                    { id: 14, name: 'Dresses', slug: 'womens-dresses', parentId: 13, productCount: 30 },
                    { id: 15, name: 'Tops', slug: 'womens-tops', parentId: 13, productCount: 30 },
                ]
            }
        ]
    },
    {
        id: 16,
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        parentId: null,
        productCount: 35,
        children: [
            { id: 17, name: 'Furniture', slug: 'furniture', parentId: 16, productCount: 20 },
            { id: 18, name: 'Garden Tools', slug: 'garden-tools', parentId: 16, productCount: 15 },
        ]
    }
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(sampleCategories);
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1, 8]));
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedCategory) return;
        
        // Recursive function to remove category and its children
        const removeCategory = (cats: Category[], idToRemove: number): Category[] => {
            return cats.filter(cat => {
                if (cat.id === idToRemove) return false;
                if (cat.children) {
                    cat.children = removeCategory(cat.children, idToRemove);
                }
                return true;
            });
        };

        setCategories(prev => removeCategory(prev, selectedCategory.id));
        setShowDeleteModal(false);
        setSelectedCategory(null);
    };

    const filterCategories = (cats: Category[], query: string): Category[] => {
        if (!query) return cats;

        return cats.reduce((acc: Category[], cat) => {
            const matchesSearch = cat.name.toLowerCase().includes(query.toLowerCase()) ||
                                cat.slug.toLowerCase().includes(query.toLowerCase());
            
            const filteredChildren = cat.children ? filterCategories(cat.children, query) : [];
            
            if (matchesSearch || filteredChildren.length > 0) {
                acc.push({
                    ...cat,
                    children: filteredChildren.length > 0 ? filteredChildren : cat.children
                });
                // Auto-expand matching categories
                if (filteredChildren.length > 0) {
                    setExpandedIds(prev => new Set([...prev, cat.id]));
                }
            }
            
            return acc;
        }, []);
    };

    const filteredCategories = filterCategories(categories, searchQuery);

    const CategoryTreeItem: React.FC<{ category: Category; level: number }> = ({ category, level }) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedIds.has(category.id);

        return (
            <div>
                <div
                    className="flex items-center justify-between p-3 hover:bg-[var(--color-background)] rounded-lg transition-colors group"
                    style={{ marginLeft: `${level * 24}px` }}
                >
                    <div className="flex items-center gap-3 flex-1">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-[var(--color-surface)] rounded transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-[var(--color-textSecondary)]" />
                                )}
                            </button>
                        ) : (
                            <div className="w-6" />
                        )}
                        
                        {isExpanded && hasChildren ? (
                            <FolderOpen className="w-5 h-5 text-[var(--color-warning)]" />
                        ) : (
                            <Folder className="w-5 h-5 text-[var(--color-primary)]" />
                        )}

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-[var(--color-text)]">{category.name}</span>
                                <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-medium">
                                    {category.productCount} products
                                </span>
                            </div>
                            {category.description && (
                                <p className="text-sm text-[var(--color-textSecondary)] mt-1">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/dashboard/categories/${category.id}/edit`}
                            className="p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
                            title="Edit Category"
                        >
                            <Edit className="w-4 h-4 text-[var(--color-warning)]" />
                        </Link>
                        <button
                            onClick={() => handleDelete(category)}
                            className="p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
                            title="Delete Category"
                        >
                            <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                        </button>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div>
                        {category.children!.map(child => (
                            <CategoryTreeItem key={child.id} category={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getTotalCategories = (cats: Category[]): number => {
        return cats.reduce((total, cat) => {
            return total + 1 + (cat.children ? getTotalCategories(cat.children) : 0);
        }, 0);
    };

    const getTotalProducts = (cats: Category[]): number => {
        return cats.reduce((total, cat) => {
            return total + cat.productCount + (cat.children ? getTotalProducts(cat.children) : 0);
        }, 0);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Categories</h1>
                    <p className="text-[var(--color-textSecondary)] mt-1">
                        Manage your product categories
                    </p>
                </div>
                <Link
                    href="/dashboard/categories/create"
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Total Categories</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                        {getTotalCategories(categories)}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Root Categories</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                        {categories.length}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Total Products</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                        {getTotalProducts(categories)}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                    />
                </div>
            </div>

            {/* Category Tree */}
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4">
                <div className="space-y-1">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                            <CategoryTreeItem key={category.id} category={category} level={0} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Folder className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-4" />
                            <p className="text-[var(--color-text)] font-medium">No categories found</p>
                            <p className="text-[var(--color-textSecondary)] text-sm mt-1">
                                {searchQuery ? 'Try adjusting your search' : 'Create your first category to get started'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-surface)] rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Delete Category</h2>
                        <p className="text-[var(--color-text)] mb-4">
                            Are you sure you want to delete <strong>{selectedCategory.name}</strong>?
                        </p>
                        {selectedCategory.children && selectedCategory.children.length > 0 && (
                            <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg p-3 mb-4">
                                <p className="text-sm text-[var(--color-warning)]">
                                    ⚠️ This will also delete all subcategories and reassign {selectedCategory.productCount} products.
                                </p>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedCategory(null);
                                }}
                                className="flex-1 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background)] transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

