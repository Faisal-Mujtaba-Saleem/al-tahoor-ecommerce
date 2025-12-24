// Next.js core
import { NextRequest, NextResponse } from "next/server";

// Third-party libraries
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

// SDKs (Sanity, Clerk, Google)
import { backendClient } from "@/sanity/lib/backendClient";

// Internal absolute imports (@/)
import { sendOrderEmails } from "@/lib/email";
import { upsertOrderToSheet, deleteOrderFromSheet } from "@/lib/googleSheets";

const STATUS_MAP: Record<string, string> = {
    placed: "Placed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

export async function POST(req: NextRequest) {
    const signature = req.headers.get(SIGNATURE_HEADER_NAME);
    const body = await req.text();

    if (!signature) {
        return NextResponse.json({ message: "Missing signature" }, { status: 401 });
    }

    if (process.env.SANITY_WEBHOOK_SECRET) {
        const isValid = await isValidSignature(body, signature, process.env.SANITY_WEBHOOK_SECRET);
        if (!isValid) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }
    }

    let payload;
    try {
        payload = JSON.parse(body);
    } catch {
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    if (payload._type && payload._type !== "order") {
        return NextResponse.json({ message: "Not an order type" }, { status: 200 });
    }

    const { _id } = payload;

    if (_id && _id.startsWith("drafts.")) {
        return NextResponse.json({ message: "Ignored draft" }, { status: 200 });
    }

    if (!_id) {
        return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    // Fetch the FULL order document to ensure we have fresh data and expanded references
    // We use useCdn: false to get the absolute latest data suitable for backend processing
    const order = await backendClient.fetch(
        `*[_type == "order" && _id == $id][0]{
            ...,
            products[]{
                ...,
                product->{
                    name,
                    price,
                    image
                }
            }
        }`,
        { id: _id },
        { useCdn: false }
    );

    if (!order) {
        // If order is not found, it was deleted.
        console.log(`Order ${_id} deleted. Removing from Sheets.`);
        await deleteOrderFromSheet(_id, payload.orderNumber); // Payload might have orderNumber if it was a delete event with projection
        return NextResponse.json({ message: "Order deleted handling" });
    }

    // --- Data Mapping ---
    const orderData = {
        sanityId: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        totalPrice: order.totalPrice,
        status: STATUS_MAP[order.status] || order.status,
        products: order.products.map((p: { productName?: string; product?: { name?: string; price?: number }; quantity: number; variant?: string; price?: number }) => ({
            name: p.productName || p.product?.name || "Unknown Product", // Prefer snapshot, fallback to ref
            quantity: p.quantity,
            variant: p.variant, // if variants exist
            price: p.price || p.product?.price // Snapshot or current
        }))
    };

    // --- Side Effects ---

    // 1. Google Sheets Upsert
    await upsertOrderToSheet(orderData);


    // 2. Email Sending
    // Heuristic: Send order confirmation email only if status is 'placed'.
    // Ideally we would check if we already sent it, but for now this ensures the user gets the email on creation.
    // We might want to restrict this to only when the previous state wasn't 'placed', but we don't have that info easily here without caching.
    // For now, consistent "Placed" orders get emails.
    if (order.status === 'placed') {
        // Create the productDetails structure expected by sendOrderEmails
        const productDetails = orderData.products.map((p: { name: string; quantity: number; price?: number }) => ({
            name: p.name,
            quantity: p.quantity,
            price: p.price
        }));

        try {
            await sendOrderEmails({
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                email: order.email,
                phone: order.phone,
                address: order.address,
                city: order.city,
                totalPrice: order.totalPrice,
                products: productDetails,
            });
            console.log(`Email sent for order ${order.orderNumber}`);
        } catch (emailErr) {
            console.error(`Failed to send email for order ${order.orderNumber}`, emailErr);
            // We do NOT fail the webhook response, as the order is safely in DB and Sheet.
        }
    }

    return NextResponse.json({ message: "Order processed successfully" });
}

export async function GET() {
    return NextResponse.json({ message: "Webhook is active!" });
}
