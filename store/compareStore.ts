import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/sanity.types";

interface CompareState {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    isInCompare: (productId: string) => boolean;
    clearCompare: () => void;
}

const useCompareStore = create<CompareState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const { items } = get();
                if (!items.some((item) => item._id === product._id)) {
                    set({ items: [...items, product] });
                }
            },
            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item._id !== productId),
                });
            },
            isInCompare: (productId) => {
                return get().items.some((item) => item._id === productId);
            },
            clearCompare: () => set({ items: [] }),
        }),
        {
            name: "compare-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCompareStore;
