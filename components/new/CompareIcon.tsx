"use client";
import useCompareStore from "@/store/compareStore";
import { Scale } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CompareIcon = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { items } = useCompareStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Link href={"/compare"} className="group relative">
            <Scale className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
            <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {isMounted ? (items?.length ? items?.length : 0) : 0}
            </span>
        </Link>
    );
};

export default CompareIcon;
