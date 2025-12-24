"use client";
import useCartStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CartIcon = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { items } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={"/cart"} className="group relative" prefetch={false}>
      <ShoppingBag className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
      <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
        {isMounted ? (items?.length ? items?.length : 0) : 0}
      </span>
    </Link>
  );
};

export default CartIcon;
