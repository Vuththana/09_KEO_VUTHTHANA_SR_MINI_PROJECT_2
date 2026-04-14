'use client'
import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Loader2, Minus, Plus } from 'lucide-react';
import useCart from '@/lib/cart';
import Link from "next/link";


export function StarRow({ rating }) {
    const hasRating = rating !== null && rating !== undefined;
    const totalStars = 5;
    const filledStars = hasRating ? Math.round(rating) : 0;

    return (
        <div className="flex items-center gap-2">
            <div
                className={`flex items-center gap-0.5 ${hasRating ? 'text-amber-400' : 'text-gray-300'}`}
                aria-label={`${hasRating ? rating : 0} out of 5 stars`}
            >
                {[...Array(totalStars)].map((_, index) => (
                    <span key={index} className="text-2xl leading-none">
                        {index < filledStars ? '★' : '☆'}
                    </span>
                ))}
            </div>
            <span className={`text-sm font-medium ${hasRating ? 'text-gray-600' : 'text-gray-400'}`}>
                {hasRating ? `(${rating.toFixed(1)})` : '(-)'}
            </span>
        </div>
    );
}

const fetcher = async (url) => {
    const session = await getSession();
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.payload?.token}`,
        },
    });
    if (!res.ok) throw new Error("Product not found");
    const data = await res.json();
    return data.payload;
};

export default function ProductDetailPage() {
    const params = useParams();
    const { id } = params;
    const { addToCart } = useCart();

    const { data: product, error, isLoading } = useSWR(
        id ? `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/products/${id}` : null,
        fetcher
    );

    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        if (product) {
            if (product.colors?.length >= 1) setSelectedColors([product.colors[0]]);
            if (product.sizes?.length >= 1) setSelectedSizes([product.sizes[0]]);
        }
    }, [product]);


    const handleQuantityChange = (amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.productId,
            quantity: quantity,
            selectedColors,
            selectedSizes
        });

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 4000);
    };

    const toggleSelection = (item, state, setState) => {
        setState((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    if (isLoading) return <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-lime-600" size={32} />
    </div>
    if (error) return <div className="p-20 text-center text-red-500">Error loading product.</div>;

    return (
        <main className="mx-auto max-w-7xl p-6 lg:p-12">
            <nav className="mb-8 flex items-center gap-2 text-sm font-medium">
                <Link
                    href="/"
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                    Home
                </Link>
                <p className="text-gray-400">/</p>
                <Link
                    href="/products"
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                    Products
                </Link>
                <p className="text-gray-400">/</p>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {product.name}
                </span>
            </nav>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100">
                    <Image src={product.imageUrl || "/placeholder.jpg"} alt={product.name} fill className="object-cover" />
                </div>

                <div className="flex flex-col space-y-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-gray-900">{product.name}</h1>
                        <div><StarRow rating={product.star} /></div>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">${product.price.toFixed(2)}</p>

                    {product.colors?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold tracking-wide">Choose a color</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => {
                                    const isSelected = selectedColors.includes(color);
                                    return (
                                        <div key={color}>
                                            <button
                                                onClick={() => toggleSelection(color, selectedColors, setSelectedColors)}
                                                className={`rounded-xl border-2 px-5 py-2 text-sm font-bold transition-all ${isSelected ? "border-black bg-black text-white" : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                            <p className="text-sm mt-2 text-gray-500n">Selected: {color}</p>
                                        </div>

                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {product.sizes?.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold tracking-wide">
                                    Choose a size
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size) => {
                                    const isSelected = selectedSizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                                            className={`group relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-all active:scale-95 ${isSelected
                                                ? "border-blue-500 bg-blue-300 text-black shadow-md"
                                                : "border-gray-100 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div
                                                className={`h-2 w-2 rounded-full transition-all duration-300 ${isSelected
                                                    ? "bg-blue-500 scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                                    : "bg-gray-300 group-hover:bg-gray-400"
                                                    }`}
                                            />

                                            <span className="relative">{size}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 border-t border-gray-100 pt-6">
                        <p className="text-lg leading-relaxed text-gray-600">{product.description}</p>
                    </div>
                    {addedToCart && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 rounded-full p-1">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-emerald-900">Added to cart!</p>
                                    <p className="text-xs text-emerald-700">{quantity}x {product.name}</p>
                                </div>
                            </div>
                            <Link
                                href="/cart"
                                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                            >
                                View Cart
                            </Link>
                        </div>
                    )}
                    <div className="flex justify-between gap-3">
                        <div className="space-y-3">
                            <div className="flex items-center border rounded-xl w-fit bg-white">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="p-3 hover:bg-gray-100 transition rounded-l-xl"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="text-sm font-bold px-6 text-center min-w-[50px]">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="p-3 hover:bg-gray-100 transition rounded-r-xl"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={(product.colors?.length > 0 && selectedColors.length === 0) || (product.sizes?.length > 0 && selectedSizes.length === 0)}
                            onClick={handleAddToCart}
                            className="w-full rounded-2xl bg-gray-900 text-center font-bold text-white transition-all hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
                        >
                            Add to Cart — ${(product.price * quantity).toFixed(2)}
                        </button>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </main>
    );
}