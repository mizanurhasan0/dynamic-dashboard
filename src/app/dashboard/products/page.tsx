'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
    createdAt: string;
    image?: string;
}

// Sample data
const sampleProducts: Product[] = [
    { id: 1, name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', price: 99.99, stock: 45, status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Smart Watch', sku: 'SW-002', category: 'Electronics', price: 299.99, stock: 23, status: 'active', createdAt: '2024-01-20' },
    { id: 3, name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', price: 49.99, stock: 100, status: 'active', createdAt: '2024-02-01' },
    { id: 4, name: 'USB-C Cable', sku: 'UC-004', category: 'Accessories', price: 19.99, stock: 0, status: 'inactive', createdAt: '2024-02-10' },
    { id: 5, name: 'Mechanical Keyboard', sku: 'MK-005', category: 'Electronics', price: 149.99, stock: 67, status: 'active', createdAt: '2024-02-15' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(sampleProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const productDate = new Date(product.createdAt);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - productDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (dateFilter === 'today') matchesDate = diffDays === 0;
            else if (dateFilter === 'week') matchesDate = diffDays <= 7;
            else if (dateFilter === 'month') matchesDate = diffDays <= 30;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">All Products</h1>
                    <p className="text-[var(--color-textSecondary)] mt-1">
                        Manage your product inventory
                    </p>
                </div>
                <Link
                    href="/dashboard/products/create"
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    Add New Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Total Products</p>
                    <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{filteredProducts.length}</p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Active Products</p>
                    <p className="text-2xl font-bold text-[var(--color-success)] mt-1">
                        {filteredProducts.filter(p => p.status === 'active').length}
                    </p>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-textSecondary)]">Out of Stock</p>
                    <p className="text-2xl font-bold text-[var(--color-error)] mt-1">
                        {filteredProducts.filter(p => p.stock === 0).length}
                    </p>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--color-background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-[var(--color-background)] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-[var(--color-text)]">{product.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-textSecondary)]">
                                        {product.sku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                        <span className={product.stock === 0 ? 'text-[var(--color-error)]' : ''}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'active'
                                            ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                                            : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                                            }`}>
                                            {product.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewDetails(product)}
                                                className="p-1 hover:bg-[var(--color-background)] rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-[var(--color-info)]" />
                                            </button>
                                            <Link
                                                href={`/dashboard/products/${product.id}/edit`}
                                                className="p-1 hover:bg-[var(--color-background)] rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-[var(--color-warning)]" />
                                            </Link>
                                            <button
                                                className="p-1 hover:bg-[var(--color-background)] rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick View Modal */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-surface)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-[var(--color-text)]">Product Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                                >
                                    <XCircle className="w-6 h-6 text-[var(--color-textSecondary)]" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[var(--color-textSecondary)]">Product Name</p>
                                        <p className="text-lg font-medium text-[var(--color-text)]">{selectedProduct.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-textSecondary)]">SKU</p>
                                        <p className="text-lg font-medium text-[var(--color-text)]">{selectedProduct.sku}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-textSecondary)]">Category</p>
                                        <p className="text-lg font-medium text-[var(--color-text)]">{selectedProduct.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-textSecondary)]">Price</p>
                                        <p className="text-lg font-medium text-[var(--color-text)]">${selectedProduct.price.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-textSecondary)]">Stock</p>
                                        <p className="text-lg font-medium text-[var(--color-text)]">{selectedProduct.stock}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--color-textSecondary)]">Status</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedProduct.status === 'active'
                                            ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                                            : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                                            }`}>
                                            {selectedProduct.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-[var(--color-textSecondary)]">Created At</p>
                                        <p className="text-lg font-medium text-[var(--color-text)]">{selectedProduct.createdAt}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                                    <Link
                                        href={`/dashboard/products/${selectedProduct.id}`}
                                        className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-center"
                                    >
                                        View Full Details
                                    </Link>
                                    <Link
                                        href={`/dashboard/products/${selectedProduct.id}/edit`}
                                        className="flex-1 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-background)] transition-colors text-center"
                                    >
                                        Edit Product
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

