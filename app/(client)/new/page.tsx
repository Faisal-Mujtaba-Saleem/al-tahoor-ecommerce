import Container from "@/components/Container";
import NoProductAvailable from "@/components/new/NoProductAvailable";
import ProductCard from "@/components/ProductCard";
import { getNewArrivals } from "@/sanity/helpers";

import { Product } from "@/sanity.types";

export default async function NewArrivalsPage() {
    const products = await getNewArrivals();

    return (
        <Container className="py-10">
            <h1 className="text-3xl font-bold mb-8 uppercase">New Arrivals</h1>
            {products?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product: Product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <NoProductAvailable selectedTab="New Arrivals" />
            )}
        </Container>
    );
}
