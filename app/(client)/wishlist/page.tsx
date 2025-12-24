"use client";

import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import useWishlistStore from "@/store/wishlistStore";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const WishlistPage = () => {
    const { items } = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Container className="py-10">
            <Title className="text-2xl font-bold mb-5">Your Wishlist</Title>
            {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {items.map((item) => (
                        <ProductCard key={item._id} product={item} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <p className="text-lg text-gray-600">Your wishlist is empty.</p>
                    <Link
                        href="/"
                        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </Container>
    );
};

export default WishlistPage;
