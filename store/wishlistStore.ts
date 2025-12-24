import { Product } from "../sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    getWishlistCount: () => number;
}

const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const { items } = get();
                const existingItem = items.find((item) => item._id === product._id);
                if (!existingItem) {
                    set({ items: [...items, product] });
                }
            },
            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item._id !== productId),
                }));
            },
            isInWishlist: (productId) => {
                return get().items.some((item) => item._id === productId);
            },
            getWishlistCount: () => {
                return get().items.length;
            },
        }),
        { name: "wishlist-store" } // unique name for localStorage key
    )
);

export default useWishlistStore;
