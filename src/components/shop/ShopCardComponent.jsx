'use client'
import Link from "next/link";
import Image from "next/image";
import { StarRow } from "../ProductCardComponent";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { ESSENTIALS_TABS } from "@/data/mockData";
import { Loader2 } from "lucide-react";

const categoryTone = {
  Skincare: "bg-sky-50 text-sky-800",
  Makeup: "bg-violet-50 text-violet-800",
  Fragrance: "bg-amber-50 text-amber-900",
  Haircare: "bg-emerald-50 text-emerald-900",
};

function badgeClass(label) {
  return categoryTone[label] ?? "bg-indigo-50 text-indigo-800";
}

const btnClass =
  "mt-2 block w-full rounded-xl border border-gray-900 bg-gray-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800";

const fetcher = async (url) => {
  const session = await getSession();
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.payload?.token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export default function ShopCardComponent() {
  const { data: productData, error: pError, isLoading: pLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/products`,
    fetcher
  );

  const { data: categoryData, error: cError, isLoading: cLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/categories`,
    fetcher
  );

  const products = productData?.payload || productData || [];
  const categories = categoryData?.payload || categoryData || [];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);

  const toggleCategory = (id) => {
    if (id === "all") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => (cat.id === categoryId || cat.categoryId === categoryId));
    return category?.name || "Unknown";
  };

  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      const id = product.categoryId;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesPrice = product.price <= maxPrice;
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categoryId);
      return matchesPrice && matchesCategory;
    });
  }, [products, maxPrice, selectedCategories]);

  if (pLoading || cLoading) return <div className="flex h-64 items-center justify-center">
    <Loader2 className="animate-spin text-lime-600" size={32} />
  </div>
  if (pError) return <div className="p-5 text-center text-red-500">Error loading products.</div>;

  return (
    <div className="mx-auto flex max-w-7xl flex gap-8 p-6">
      <aside className="w-[250px] h-fit bg-white p-6 rounded-xl border border-gray-100">
        <div className="sticky top-6 space-y-6">
          <div className="flex items-center justify-between text-sm">
            <p className="font-bold">Filters</p>
            <button
              className="text-xs text-gray-500 hover:underline hover:cursor-pointer"
              onClick={() => { setSelectedCategories([]); setMaxPrice(500); }}>
              Reset filters
            </button>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-sm tracking-wide text-gray-500 uppercase mb-2">Price Range</p>
            <p className="text-sm font-bold">$0 - ${maxPrice}</p>
            <input
              type="range"
              min="0"
              max="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-gray-900"
            />
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide text-gray-400 uppercase mb-3">Quick Select</p>
            <div className="grid grid-cols-2 gap-2">
              {[50, 100, 150, 500, 1000, 2000].map((val) => (
                <button
                  key={val}
                  onClick={() => setMaxPrice(val)}
                  className={`rounded-lg border py-2 text-xs font-medium transition-all ${maxPrice === val
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-900"
                    }`}
                >
                  {val === 2000 ? "All" : `Under $${val}`}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-sm font-bold tracking-wide text-gray-400 uppercase mb-4">Categories</p>
            <div className="space-y-3">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={selectedCategories.length === 0}
                    onChange={() => toggleCategory("all")}
                  />
                  <div className={`h-4 w-4 rounded border transition-all ${selectedCategories.length === 0 ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300 group-hover:border-gray-900'}`}>
                    {selectedCategories.length === 0 && (
                      <svg className="w-3 h-3 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`ml-3 text-sm transition-colors ${selectedCategories.length === 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                  All Categories
                </span>
              </label>
              {categories.map((category) => {
                const id = category.id || category.categoryId;
                const isChecked = selectedCategories.includes(id);
                const count = categoryCounts[id] || 0;
                return (
                  <label key={id} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={isChecked}
                        onChange={() => toggleCategory(id)}
                      />
                      <div className={`h-4 w-4 rounded border transition-all ${isChecked ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300 group-hover:border-gray-900'}`}>
                        {isChecked && (
                          <svg className="w-3 h-3 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <span className={`ml-3 text-sm transition-colors ${isChecked ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {category.name}
                      </span>
                      <span className="text-xs font-medium text-gray-400">{count}</span>
                    </div>

                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProducts?.map((product) => (
            <article
              key={product.productId}
              className="group flex flex-col w-[300px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.imageUrl || "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=1000&fit=crop"}
                  alt={product.name || "Product Image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <h3 className="font-semibold leading-snug text-gray-900">{product.name}</h3>
                  <p className="mt-1 min-h-10 line-clamp-2 text-sm leading-5 text-gray-500">{product.description}</p>
                </div>
                <StarRow rating={product.rating} />
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                  <p className="text-xl font-semibold tabular-nums text-gray-900">${product.price}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(getCategoryName(product.categoryId))}`}>
                    {getCategoryName(product.categoryId)}
                  </span>
                </div>
                <Link href={`/products/${product.productId}`} className={`${btnClass}`}>
                  View Product
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}