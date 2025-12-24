"use server";

// Framework SDKs
import { defineQuery } from "next-sanity";

// Internal absolute imports (@/)
import { backendClient } from "@/sanity/lib/backendClient";
import { client } from "@/sanity/lib/client";

export interface OrderData {
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    cnic: string;
    address: string;
    city: string;
    postalCode: string;
    clerkUserId: string;
    products: {
        product: {
            _id: string;
            // Removed price from input to prevent manipulation
        };
        quantity: number;
    }[];
    // Removed totalPrice from input
}

export async function createOrder(data: OrderData) {
    try {
        // 1. Fetch current product data from Sanity to get trusted prices
        const productIds = data.products.map(p => p.product._id);
        const fetchedProducts = await client.fetch(
            defineQuery(`*[_type == "product" && _id in $ids] {
                _id,
                name,
                price
            }`),
            { ids: productIds }
        );

        // 2. Calculate Total Price and construct Sanity products array with snapshots
        let calculatedTotal = 0;
        const sanityProducts = data.products.map((item) => {
            const product = fetchedProducts.find((p: any) => p._id === item.product._id);

            if (!product) {
                throw new Error(`Product not found: ${item.product._id}`);
            }

            const price = product.price || 0;
            calculatedTotal += price * item.quantity;

            return {
                _key: crypto.randomUUID(),
                product: {
                    _type: "reference",
                    _ref: item.product._id,
                },
                quantity: item.quantity,
                // SNAPSHOTS: Save price and name at time of purchase
                price: price,
                productName: product.name
            };
        });

        // 3. Create Order
        const order = await backendClient.create({
            _type: "order",
            orderNumber: data.orderNumber,
            customerName: data.customerName,
            email: data.email,
            phone: data.phone,
            cnic: data.cnic,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            clerkUserId: data.clerkUserId,

            products: sanityProducts,
            totalPrice: calculatedTotal, // Using server-calculated total
            currency: "USD",
            amountDiscount: 0,
            status: "placed",
            orderDate: new Date().toISOString(),
        });

        // NOTE: Email and Google Sheets sync are handled by the Sanity Webhook.
        // This ensures creating the order is fast and side-effects are reliable (eventually consistent).

        return { success: true, orderId: order._id };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
}
