"use client";
import useWishlistStore from "@/store/wishlistStore";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const WishlistIcon = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { items } = useWishlistStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Link href={"/wishlist"} className="group relative">
            <Heart className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
            <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {isMounted ? (items?.length ? items?.length : 0) : 0}
            </span>
        </Link>
    );
};

export default WishlistIcon;
