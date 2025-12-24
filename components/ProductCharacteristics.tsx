import { Product } from "@/sanity.types";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ProductCharacteristics = ({ product }: { product: Product }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-bold">
          {product?.name}: Details
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1">
          <p className="flex items-center justify-between">
            Form:{" "}
            <span className="font-semibold tracking-wide capitalize">
              {product?.form}
            </span>
          </p>
          <p className="flex items-center justify-between">
            Medicated:{" "}
            <span className="font-semibold tracking-wide">
              {product?.isMedicated ? "Yes" : "No"}
            </span>
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <span className="font-semibold">Usage Instructions:</span>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {product?.usage}
            </p>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="font-semibold">Ingredients:</span>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {product?.ingredients}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;
