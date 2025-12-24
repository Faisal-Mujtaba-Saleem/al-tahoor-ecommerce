// React & Next.js core
import Link from "next/link";
import React from "react";

// Third-party libraries
import { ListOrdered } from "lucide-react";

// SDKs (Sanity, Clerk, Google)
import { auth, currentUser } from "@clerk/nextjs/server";

// Internal absolute imports (@/)
import { getAllCategories, getMyOrders } from "@/sanity/helpers";
import Container from "./Container";
import CartIcon from "./new/CartIcon";
import HeaderMenu from "./new/HeaderMenu";
import Logo from "./new/Logo";
import MobileMenu from "./new/MobileMenu";
import SearchBar from "./new/SearchBar";
import UserButtonWrapper from "./UserButtonWrapper";
import WishlistIcon from "./new/WishlistIcon";

const Header = async () => {
  await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }
  const categories = await getAllCategories(3);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 py-4">
      <Container className="flex items-center justify-between gap-7 text-darkText">
        <HeaderMenu categories={categories} />
        <div className="w-auto md:w-1/3 flex items-center justify-center gap-2.5">
          <MobileMenu categories={categories} />
          <Logo>Al-Tahoor</Logo>
        </div>
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <WishlistIcon />
          <CartIcon />
          {userId && (
            <Link href={"/orders"} className="group relative">
              <ListOrdered className="w-6 h-6 group-hover:text-primary hoverEffect" />
              <span className="absolute -top-1 -right-1 bg-primary text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span>
            </Link>
          )}

          {userId ? (
            <UserButtonWrapper />
          ) : (
            <Link
              href="/signin"
              className="text-sm font-semibold hover:text-primary hoverEffect"
            >
              Login
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
