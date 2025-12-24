import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import { deleteOrderFromSheet } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { orderId } = await req.json();

    // Validate orderId
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Delete the order from Sanity
    await backendClient.delete(orderId);

    // Also delete from Google Sheet to ensure sync
    await deleteOrderFromSheet(orderId);

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
