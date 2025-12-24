"use client";

// React & Next.js core
import React, { useEffect, useState } from "react";

// Third-party libraries
import { motion, AnimatePresence } from "motion/react";

// SDKs (Sanity, Clerk, Google)
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERYResult } from "@/sanity.types";

// Internal absolute imports (@/)
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";

const DealsSection = () => {
  const [products, setProducts] = useState<PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = `*[_type == "product"] | order(name asc)`;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query);
        setProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="">
      <h2 className="my-5 font-semibold text-xl underline underline-offset-4 decoration-1">
        Get your best shopping deals with us
      </h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <AnimatePresence key={product?._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard key={product?._id} product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      )}
    </Container>
  );
};

export default DealsSection;
