"use client";

import { Product } from "@/sanity.types";
import useWishlistStore from "@/store/wishlistStore";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AddToWishlistButtonProps {
    product: Product;
    className?: string;
    iconSize?: number;
}

const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({
    product,
    className,
    iconSize = 20,
}) => {
    const { addItem, removeItem, isInWishlist } = useWishlistStore();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsWishlisted(isInWishlist(product._id));
    }, [product._id, isInWishlist]);

    // Sync with store changes (though Zustand usually handles this, specific syncing helps with hydration/updates)
    useEffect(() => {
        const unsubscribe = useWishlistStore.subscribe((state) => {
            setIsWishlisted(state.items.some((item) => item._id === product._id));
        });
        return () => unsubscribe();
    }, [product._id]);


    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a link
        e.stopPropagation();

        if (isWishlisted) {
            removeItem(product._id);
        } else {
            addItem(product);
        }
        // State will update via the subscription
    };

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <button
            onClick={handleToggleWishlist}
            className={cn(
                "p-2 rounded-full transition-colors duration-200 hover:bg-gray-100",
                className
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={iconSize}
                className={cn(
                    "transition-colors",
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                )}
            />
        </button>
    );
};

export default AddToWishlistButton;
