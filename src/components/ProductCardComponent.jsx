"use client";

import Image from "next/image";
import Link from "next/link";
import ButtonAddComponent from "./ButtonAddComponent";

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

export default function ProductCardComponent({ product }) {
  const { productId, name, price, imageUrl, star } = product;

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link href={`/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-lime-50/30 text-gray-400">
              ◇
            </div>
          )}
        </div>
      </Link>
      <div className="relative mt-4 pr-14">
        <StarRow rating={star} />
        <Link href={`/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-lime-700">
            {name}
          </h3>
        </Link>
        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">${price}</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <ButtonAddComponent product={product} />
      </div>
    </article>
  );
}
