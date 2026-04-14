"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { StarRow } from "../ProductCardComponent";
import ButtonAddComponent from "../ButtonAddComponent";

export default function ManageProductCard({ product, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);
    const { productId, name, price, imageUrl, star } = product;

    console.log(product)

    return (
        <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="absolute right-4 top-4 z-20">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="rounded-full p-1.5 bg-white/90 shadow-sm border border-gray-100 hover:bg-white transition text-gray-600 hover:text-gray-900"
                >
                    <MoreVertical size={18} />
                </button>

                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                        <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-20 overflow-hidden">
                            <div className="flex flex-col">
                                <button
                                    onClick={() => { onEdit(product); setShowMenu(false); }}
                                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    <Edit size={14} className="text-gray-400" /> Edit
                                </button>
                                <button
                                    onClick={() => { onDelete(productId); setShowMenu(false); }}
                                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-50"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
                {imageUrl ? (
                    <Image src={imageUrl} alt="" fill className="object-cover transition group-hover:scale-[1.02]" />
                ) : (
                    <div className="flex size-full items-center justify-center text-gray-300">◇</div>
                )}
            </div>

            <div className="mt-4">
                <StarRow rating={star} />
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-lime-700 transition">
                    {name}
                </h3>
                <p className="mt-2 text-base font-bold text-gray-900">${price}</p>
            </div>
            <div className="absolute bottom-4 right-4">
                <ButtonAddComponent product={product} />
            </div>
        </article>
    );
}