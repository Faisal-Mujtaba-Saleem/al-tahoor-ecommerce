"use client";

import React, { useEffect, useState } from "react";
import useCompareStore from "@/store/compareStore";
import { Scale, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const CompareFloatingBar = () => {
    const { items, removeItem, clearCompare } = useCompareStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [prevItemsCount, setPrevItemsCount] = useState(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (items.length > prevItemsCount) {
            setIsDismissed(false);
        }
        setPrevItemsCount(items.length);
    }, [items.length, prevItemsCount]);

    if (!isMounted || items.length === 0 || isDismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-full max-w-4xl px-4"
            >
                <div className="relative bg-darkColor text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-6 border border-white/10 backdrop-blur-lg bg-opacity-95">
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="absolute -top-2 -right-2 bg-darkColor text-white rounded-full p-1 border border-white/20 hover:bg-red-500 transition-colors z-70"
                        title="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                        <div className="bg-white/10 p-2.5 rounded-xl hidden sm:block">
                            <Scale className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight">Compare Products</span>
                            <span className="text-sm text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'} selected</span>
                        </div>

                        <div className="hidden md:flex items-center gap-2 ml-4 overflow-x-auto no-scrollbar py-1">
                            {items.map((item) => (
                                <div key={item._id} className="relative group shrink-0">
                                    <div className="w-12 h-12 bg-white rounded-lg p-1 overflow-hidden">
                                        {item.images && item.images[0] && (
                                            <Image
                                                src={urlFor(item.images[0]).url()}
                                                alt={item.name || ""}
                                                width={48}
                                                height={48}
                                                className="object-contain w-full h-full"
                                            />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearCompare}
                            className="text-sm text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline px-2 hidden sm:block"
                        >
                            Clear
                        </button>
                        <Link href="/compare">
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 flex items-center gap-2">
                                Compare Now
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CompareFloatingBar;
