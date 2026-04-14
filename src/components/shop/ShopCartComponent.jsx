'use client'

import useCart from '@/lib/cart';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';
import { getSession } from "next-auth/react";
import { Minus, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

    const [isPending, setIsPending] = useState(false);

    const cartProducts = products?.payload?.filter(product =>
        items.some(item => item.id === product.productId)
    ) || [];

    const subtotal = cartProducts.reduce((acc, product) => {
        const cartItem = items.find(item => item.id === product.productId);
        const quantity = cartItem?.quantity || 1;
        return acc + (product.price * quantity);
    }, 0);

    const totalQuantity = items.length;

    const handleCheckout = async () => {
        if (items.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setIsPending(true);

        const checkoutPromise = (async () => {
            const session = await getSession();

            const body = {
                orderDetailRequests: items.map(item => ({
                    productId: item.id,
                    orderQty: item.quantity
                }))
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.payload?.token}`,
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Checkout failed");
            }

            const result = await response.json();
            clearCart();
            return result;
        })();

        toast.promise(checkoutPromise, {
            loading: 'Processing your order...',
            success: <b>Order placed successfully!</b>,
            error: (err) => <b>{err.message || "Something went wrong."}</b>,
        }, {
            style: {
                minWidth: '250px',
            },
            success: {
                duration: 5000,
                icon: '🎉',
            },
        });

        try {
            await checkoutPromise;
        } catch (err) {
            console.error("Checkout Error:", err);
        } finally {
            setIsPending(false);
        }
    };

    const handleQuantity = (id, currentQty, newAmount) => {
        const newQty = currentQty + newAmount;
        if (newQty >= 1) {
            updateQuantity(id, newQty);
        } else {
            removeFromCart(id);
        }
    };

    if (isLoading) return <div className="mt-10 text-center">Loading cart...</div>;
    if (error) return <div className="p-5 text-center text-red-500">Error loading products.</div>;

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
                                {cartProducts.map((product) => {
                                    const cartItem = items.find(item => item.id === product.productId);
                                    const itemQty = cartItem?.quantity || 1;
                                    return (
                                        <div key={product.productId} className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0">
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

                                                    <div className='flex justify-between items-center'>
                                                        <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                                                        <div className='flex flex-col gap-1 text-right'>
                                                            <p className="font-semibold">${(product.price * itemQty).toFixed(2)}</p>
                                                            <button
                                                                onClick={() => removeFromCart(product.productId)}
                                                                className="text-red-500 text-xs hover:underline"
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
                                    <p className='text-gray-500 text-[14px]'>Tax and shipping calculated at checkout.</p>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={isPending}
                                        className='w-full py-2 rounded-[15px] text-[14px] bg-black text-white hover:bg-gray-800 transition flex items-center justify-center gap-2'
                                    >
                                        {isPending && <Loader2 size={16} className="animate-spin" />}
                                        {isPending ? 'Processing...' : 'Checkout'}
                                    </button>

                                    <button
                                        onClick={() => clearCart()}
                                        disabled={isPending}
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