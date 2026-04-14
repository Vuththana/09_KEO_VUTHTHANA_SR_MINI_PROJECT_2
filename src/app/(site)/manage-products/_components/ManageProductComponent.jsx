"use client";

import React, { useState } from 'react';
import { getSession } from "next-auth/react";
import { Plus, Loader2 } from 'lucide-react';
import ManageProductCard from '@/components/shop/ManageProductCard';
import ProductModal from '@/components/shop/ProductModal';

export default function ManageProductComponent({ products, categories, mutateProducts, productApiUrl }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterType, setFilterType] = useState('asc');

    const handleOpenCreate = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const session = await getSession();
        const res = await fetch(`${productApiUrl}/${productId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${session?.user?.payload?.token}` },
        });

        if (res.ok) mutateProducts();
    };

    const sortedProducts = [...(Array.isArray(products) ? products : [])].sort((a, b) => {
        if (filterType === 'asc') return a.name.localeCompare(b.name);
        if (filterType === 'desc') return b.name.localeCompare(a.name);
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                    <p className="text-sm text-gray-500">Create, update and delete products in this demo (local state only).</p>
                </div>
                <div className="flex items-center gap-3">
                    <p className='text-sm text-gray-500'>Sort</p>
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="text-sm bg-transparent outline-none font-medium text-gray-700"
                        >
                            <option value="asc">Name (A-Z)</option>
                            <option value="desc">Name (Z-A)</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className='flex flex-col gap-3 bg-white p-6 rounded-xl'>
                <div className='self-end'>
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-lime-400 hover:bg-lime-200 text-black px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                    >
                        <Plus size={18} /> Create Product
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <ManageProductCard
                            key={product.productId}
                            product={product}
                            onDelete={handleDelete}
                            onEdit={handleOpenEdit}
                        />
                    ))}
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                initialData={selectedProduct}
                categories={categories}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => mutateProducts()}
            />
        </div>
    );
}