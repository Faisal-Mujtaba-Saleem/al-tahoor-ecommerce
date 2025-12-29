"use client";

import React, { useEffect, useState } from "react";
import useCompareStore from "@/store/compareStore";
import Container from "@/components/Container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceView from "@/components/PriceView";
import AddToCartButton from "@/components/AddToCartButton";
import { Trash2, Eye } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ComparePage = () => {
    const { items, removeItem, clearCompare } = useCompareStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (items.length === 0) {
        return (
            <Container className="py-20 flex flex-col items-center justify-center gap-5">
                <h1 className="text-3xl font-bold text-darkColor">Your Comparison List is Empty</h1>
                <p className="text-lightColor">Add some products to compare them side-by-side.</p>
                <Link href="/">
                    <Button>Browse Products</Button>
                </Link>
            </Container>
        );
    }

    const attributes = [
        { label: "Price", key: "price" },
        { label: "Description", key: "intro" },
        { label: "Stock Status", key: "stock" },
        { label: "Form", key: "form" },
        { label: "Medicated", key: "isMedicated" },
    ];

    return (
        <Container className="py-10">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-bold text-darkColor">Product Comparison</h1>
                <Button
                    variant="destructive"
                    onClick={() => {
                        clearCompare();
                        toast.success("Comparison list cleared");
                    }}
                    size="sm"
                >
                    Clear All
                </Button>
            </div>

            <div className="relative border rounded-lg overflow-hidden bg-white shadow-sm">
                <ScrollArea className="w-full">
                    <div className="min-w-[800px]">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50/50">
                                    <th className="sticky left-0 z-20 bg-gray-50 p-4 text-left font-bold text-darkColor border-r w-48">
                                        Product
                                    </th>
                                    {items.map((product) => (
                                        <th key={product._id} className="p-4 border-r min-w-[250px]">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="relative w-32 h-32">
                                                    {product.images && product.images[0] && (
                                                        <Image
                                                            src={urlFor(product.images[0]).url()}
                                                            alt={product.name || "Product"}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    )}
                                                </div>
                                                <p className="font-bold text-center line-clamp-2 h-10">
                                                    {product.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/product/${product.slug?.current}`}>
                                                        <Button size="icon" variant="outline" className="h-8 w-8">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="h-8 w-8"
                                                        onClick={() => {
                                                            removeItem(product._id);
                                                            toast.success("Removed from comparison");
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {attributes.map((attr, index) => (
                                    <tr key={attr.key} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                                        <td className="sticky left-0 z-20 bg-inherit p-4 font-semibold text-darkColor border-r border-b">
                                            {attr.label}
                                        </td>
                                        {items.map((product) => (
                                            <td key={`${product._id}-${attr.key}`} className="p-4 border-r border-b text-sm text-lightColor">
                                                {attr.key === "price" ? (
                                                    <PriceView price={product.price} discount={product.discount} />
                                                ) : attr.key === "stock" ? (
                                                    <span className={product.stock && product.stock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                                        {product.stock && product.stock > 0 ? "In Stock" : "Out of Stock"}
                                                    </span>
                                                ) : attr.key === "isMedicated" ? (
                                                    <span>{product.isMedicated ? "Yes" : "No"}</span>
                                                ) : (
                                                    <p className="line-clamp-3">{(product as Record<string, unknown>)[attr.key] as string || "N/A"}</p>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <td className="sticky left-0 z-20 bg-white p-4 font-semibold text-darkColor border-r">
                                        Action
                                    </td>
                                    {items.map((product) => (
                                        <td key={`${product._id}-action`} className="p-4 border-r">
                                            <AddToCartButton product={product} />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </Container>
    );
};
export default ComparePage;
