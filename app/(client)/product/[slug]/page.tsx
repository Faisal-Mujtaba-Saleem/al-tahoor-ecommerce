// React & Next.js core
import { notFound } from "next/navigation";
import React from "react";

// Internal absolute imports (@/)
import AddToCartButton from "@/components/AddToCartButton";
import AddToWishlistButton from "@/components/AddToWishlistButton";
import AskQuestionButton from "@/components/AskQuestionButton";
import CompareButton from "@/components/CompareButton";
import Container from "@/components/Container";
import DeliveryReturnButton from "@/components/DeliveryReturnButton";
import ImageView from "@/components/new/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ShareButton from "@/components/ShareButton";
import ProductQA from "@/components/ProductQA";
import { getProductBySlug } from "@/sanity/helpers";
import { getQuestionsByProductId } from "@/app/actions/productActions";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const questions = await getQuestionsByProductId(product._id);

  return (
    <div>
      <Container className="flex flex-col md:flex-row gap-10 py-10">
        {product?.images && <ImageView images={product?.images} />}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div>
            <p className="text-4xl font-bold mb-2">{product?.name}</p>
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-lg font-bold"
            />
          </div>
          {product?.stock && (
            <p className="bg-green-100 w-24 text-center text-green-600 text-sm py-2.5 font-semibold rounded-lg">
              In Stock
            </p>
          )}

          <p className="text-sm text-gray-600 tracking-wide">
            {product?.description}
          </p>
          <div className="flex items-center gap-2.5 lg:gap-5">
            <AddToCartButton
              product={product}
              className="bg-darkColor/80 text-white hover:bg-darkColor hoverEffect"
            />
            <AddToWishlistButton
              product={product}
              className="border-2 border-darkColor/30 text-darkColor/60 px-2.5 py-1.5 rounded-md hover:text-darkColor hover:border-darkColor hoverEffect"
            />
          </div>
          <ProductCharacteristics product={product} />
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
            <CompareButton product={product} />
            <AskQuestionButton product={product} />
            <DeliveryReturnButton />
            <ShareButton product={product} />
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue hoverEffect rounded-md">
              <p className="text-base font-semibold text-black">
                Free Shipping
              </p>
              <p className="text-sm text-gray-500">
                Free shipping over order $120
              </p>
            </div>
            <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue hoverEffect rounded-md">
              <p className="text-base font-semibold text-black">
                100% Authentic
              </p>
              <p className="text-sm text-gray-500">
                Guaranteed genuine brand products
              </p>
            </div>
          </div>
        </div>
      </Container>
      <Container>
        <ProductQA questions={questions} />
      </Container>
    </div>
  );
};

export default ProductPage;
