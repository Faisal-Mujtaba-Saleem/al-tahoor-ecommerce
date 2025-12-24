// React & Next.js core
import Image from "next/image";
import Link from "next/link";
import React from "react";

// SDKs (Sanity, Clerk, Google)
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

// Internal absolute imports (@/)
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";
import PriceView from "./PriceView";
import Title from "./Title";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="rounded-2xl overflow-hidden group text-sm bg-white border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className="overflow-hidden relative bg-linear-to-br from-zinc-100 to-zinc-200 h-72 flex items-center justify-center">
        {product?.images && product.images[0] && (
          <Link href={`/product/${product?.slug?.current}`} className="w-full h-full block">
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              // loading="lazy"
              priority
              className={`w-full h-full object-contain p-4 transition-transform duration-500 ${product?.stock !== 0 && "group-hover:scale-110"}`}
            />
          </Link>
        )}
        <AddToWishlistButton
          product={product}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white z-10"
        />
      </div>
      <div className="py-4 px-4 flex flex-col gap-2 bg-white">
        <Title className="text-lg font-bold line-clamp-1 text-darkColor">{product?.name}</Title>
        <p className="text-lightColor text-sm line-clamp-2 min-h-[40px]">{product?.intro}</p>
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-lg font-bold text-primary"
        />
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
