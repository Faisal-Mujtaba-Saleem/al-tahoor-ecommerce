"use client";

import { Product } from "@/sanity.types";
import useCompareStore from "@/store/compareStore";
import { RxBorderSplit } from "react-icons/rx";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface CompareButtonProps {
    product: Product;
    className?: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({ product, className }) => {
    const { addItem, removeItem, isInCompare } = useCompareStore();
    const isCompared = isInCompare(product._id);

    const toggleCompare = () => {
        if (isCompared) {
            removeItem(product._id);
            toast.success("Removed from comparison");
        } else {
            addItem(product);
            toast.success("Added to comparison");
        }
    };

    return (
        <button
            onClick={toggleCompare}
            className={cn(
                "flex items-center gap-2 text-sm hoverEffect",
                isCompared ? "text-red-600 font-semibold" : "text-black hover:text-red-600",
                className
            )}
        >
            <RxBorderSplit className="text-lg" />
            <p>{isCompared ? "In Comparison" : "Compare products"}</p>
        </button>
    );
};

export default CompareButton;
