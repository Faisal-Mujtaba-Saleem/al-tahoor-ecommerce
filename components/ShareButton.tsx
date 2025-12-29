"use client";

import React from "react";
import { FiShare2 } from "react-icons/fi";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";

interface ShareButtonProps {
    product: Product;
}

const ShareButton: React.FC<ShareButtonProps> = ({ product }) => {
    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on Al-Tahoor!`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect"
        >
            <FiShare2 className="text-lg" />
            <p>Share</p>
        </button>
    );
};

export default ShareButton;
