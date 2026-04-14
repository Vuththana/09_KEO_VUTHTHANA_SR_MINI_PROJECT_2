'use client'

import React from 'react';
import useSWR from 'swr';
import { getSession } from "next-auth/react";
import { Package, Calendar, User, Hash, Loader2 } from 'lucide-react';

const fetcher = async (url) => {
    const session = await getSession();
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.payload?.token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
};



export default function Page() {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/orders`, fetcher);

    const orders = data?.payload || [];

    if (isLoading) return <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-lime-600" size={32} />
    </div>
    if (error) return <div className="p-5 text-center text-red-500">Error loading orders.</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className='flex flex-col gap-3 mb-8'>
                <h1 className="text-2xl font-bold">
                    Order Products
                </h1>
                <p className='text-sm text-gray-500'>{orders.length} orders from your account</p>

            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 border rounded-xl bg-gray-50">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="border p-6 rounded-xl overflow-hidden bg-white shadow-sm">
                            
                            <div className="p-4 border-b flex flex-wrap justify-between items-center gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-col ">
                                        <p className='text-xs text-gray-500 uppercase tracking-wide'>Order</p>
                                        <p className="text-sm font-semibold">{order.orderId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                                    <p className="text-lg font-bold text-black">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4 text-sm text-gray-700">
                                    <div className='flex flex-col text-gray-500'>
                                        <p className='text-xs text-gray-500 uppercase tracking-wide'>User ID</p>
                                        <span className="font-semibold text-black">{order.appUserId}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                                        <p>Order date</p>
                                        <div className='font-semibold text-black'>
                                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div></div>
                                </div>

                                <div className="space-y-1 bg-gray-50 p-4 rounded-xl">
                                    <p className='text-xs text-gray-500 uppercase tracking-wide'>Order details</p>
                                    {order.orderDetailsResponse?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="font-medium text-sm">{item.productName || "Product"}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.orderQty}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold">${item.orderTotal.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}