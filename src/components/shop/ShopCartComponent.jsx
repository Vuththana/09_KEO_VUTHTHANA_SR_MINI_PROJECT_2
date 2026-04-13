'use client'

import useCart from '@/lib/cart';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';
import { getSession } from "next-auth/react";
import { Minus, Plus } from 'lucide-react';

const fetcher = async (url) => {
    const session = await getSession();
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.payload?.token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
};

export default function ShopCartComponent() {
    const { data: products, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/products`, fetcher);
    const { items, clearCart, updateQuantity, removeFromCart } = useCart();

    const cartProducts = products?.payload?.filter(product =>
        items.some(item => item.id === product.productId)
    ) || [];

    const subtotal = cartProducts.reduce((acc, product) => {
        const cartItem = items.find(item => item.id === product.productId);
        const quantity = cartItem?.quantity?.length || 1;
        return acc + (product.price * quantity);
    }, 0);

    const totalQuantity = items.length;

    const handleQuantity = (id, currentQty, newAmount) => {
        const newQty = currentQty + newAmount;
        if (newQty >= 1) {
            console.log(newQty);
            updateQuantity(id, newQty);
        } else {
            removeFromCart(id);
        }
    };

    if (isLoading) return <div className="mt-10 text-center">Loading cart...</div>;

    return (
        <div className='mt-[20px]'>
            {items.length === 0 ? (
                <div className='rounded-xl border py-20'>
                    <div className='flex flex-col gap-[40px] text-center'>
                        <div>
                            <p className='font-semibold'>Your cart is empty</p>
                            <p className='text-sm text-gray-500 font-light'>Open a product, set quantity, then tap "Add to cart"</p>
                        </div>
                        <div>
                            <Link href="/products" className='bg-black rounded-[20px] py-2 px-6 text-white'>
                                Shop a product
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-[20px]'>
                    <p className='text-[12px] font-semibold'>
                        {totalQuantity} <span className='font-normal'>product{totalQuantity > 1 ? 's' : ''} in cart</span>
                    </p>

                    <div className='flex flex-col gap-[30px]'>
                        <div className='rounded-xl border p-4'>
                            <div className='flex flex-col gap-6'>
                                {cartProducts.map((product, index) => {
                                    const itemKey = product.id || `cart-item-${index}`;
                                    const cartItem = items.find(item => item.id === product.productId);
                                    const itemQty = cartItem?.quantity || 1;
                                    return (
                                        <div key={itemKey} className="flex items-center gap-4 border-b last:border-0">
                                            <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                                                <Image
                                                    src={product.imageUrl || '/placeholder.png'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className='flex flex-col gap-3'>
                                                    <div className='flex justify-between'>
                                                        <h3 className="font-medium">{product.name}</h3>
                                                        <div className="flex items-center mt-2">
                                                            <div className="flex items-center border rounded-xl">
                                                                <button
                                                                    onClick={() => handleQuantity(product.productId, itemQty, -1)}
                                                                    className="p-2 hover:bg-gray-100 transition"
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span className="text-xs font-semibold w-6 text-center">{itemQty}</span>
                                                                <button
                                                                    onClick={() => handleQuantity(product.productId, itemQty, 1)}
                                                                    className="p-2 hover:bg-gray-100 transition"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='flex justify-between'>
                                                        <p className="text-sm font-bold">${product.price.toFixed(2)} each</p>
                                                        <div className='flex flex-col gap-3 text-right'>
                                                            <p className="font-semibold">${product.price * cartItem?.quantity}</p>
                                                            <button
                                                                onClick={() => removeFromCart(product.productId)}
                                                                className="text-gray-400 text-red-500 transition"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='rounded-xl border py-10 px-3'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <p>Subtotal</p>
                                    <p className='font-bold'>${subtotal.toFixed(2)}</p>
                                </div>

                                <div className='flex flex-col gap-[20px]'>
                                    <p className='text-gray-500 text-[14px]'>Tax and shipping calculated at checkout (demo).</p>
                                    <button className='w-full py-2 rounded-[15px] text-[14px] bg-black text-white hover:bg-gray-800 transition'>
                                        Checkout
                                    </button>
                                    <button
                                        onClick={() => clearCart()}
                                        className='w-full py-2 rounded-[15px] text-[14px] bg-transparent border text-black font-semibold hover:bg-gray-50 transition'
                                    >
                                        Clear cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}