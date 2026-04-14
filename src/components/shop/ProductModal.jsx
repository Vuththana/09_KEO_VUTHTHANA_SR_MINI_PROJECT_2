"use client";

import { useRef } from "react";
import { getSession } from "next-auth/react";

export default function ProductModal({ isOpen, onClose, onSuccess, initialData, categories }) {
    const formRef = useRef(null);

    if (!isOpen) return null;

    const colors = ["green", "white", "gray", "red", "blue"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const session = await getSession();

        const selectedColors = formData.getAll("colors");
        const selectedSizes = formData.getAll("sizes");

        const payload = {
            name: formData.get("name"),
            price: parseFloat(formData.get("price")),
            categoryId: formData.get("categoryId"),
            imageUrl: formData.get("imageUrl") || "",
            description: formData.get("description") || "",
            colors: selectedColors,
            sizes: selectedSizes,
            star: initialData?.star || 0
        };

        const url = initialData
            ? `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/products/${initialData.productId}`
            : `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/products`;

        const method = initialData ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.payload?.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {initialData ? "Edit Product" : "Create New Product"}
                </h2>

                <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                name="name"
                                type="text"
                                defaultValue={initialData?.name || ""}
                                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-lime-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={initialData?.price || ""}
                                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-lime-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="categoryId"
                                defaultValue={initialData?.categoryId || ""}
                                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories?.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                name="imageUrl"
                                type="text"
                                defaultValue={initialData?.imageUrl || ""}
                                placeholder="https://example.com/image.png"
                                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-lime-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                                <label key={color} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        name="colors"
                                        value={color}
                                        type="checkbox"
                                        defaultChecked={initialData?.colors?.includes(color)}
                                        className="peer hidden"
                                    />
                                    <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium capitalize transition peer-checked:bg-lime-600 peer-checked:text-white peer-checked:border-lime-600 group-hover:bg-gray-50">
                                        {color}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                        <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <label key={size} className="flex items-center gap-1 text-xs border px-3 py-1 rounded-md cursor-pointer hover:bg-gray-50">
                                    <input
                                        name="sizes"
                                        value={size}
                                        type="checkbox"
                                        className="rounded text-lime-600"
                                        defaultChecked={initialData?.sizes?.includes(size)}
                                    /> {size}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={initialData?.description || ""}
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-lime-500 resize-none"
                            placeholder="Tell us about this product..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                        <button type="submit" className="bg-lime-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-lime-700 transition">
                            {initialData ? "Update Changes" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}