// Third-party libraries
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function upsertOrderToSheet(orderData: { sanityId: string; orderNumber: string; customerName: string; email: string; phone: string; address: string; city: string; products: { productName?: string; name?: string; quantity: number; variant?: string }[]; totalPrice: number; status?: string }) {
    try {
        const doc = new GoogleSpreadsheet(
            process.env.GOOGLE_SHEET_ID!,
            serviceAccountAuth
        );

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // Ensure header row exists
        try {
            await sheet.loadHeaderRow();
        } catch {
            await sheet.setHeaderRow([
                "Sanity ID",
                "Order ID",
                "Date",
                "Customer Name",
                "Email",
                "Phone",
                "Address",
                "Products",
                "Total Amount",
                "Status",
            ]);
        }

        const rows = await sheet.getRows();
        const existingRow = rows.find(
            (row) => row.get("Sanity ID") === orderData.sanityId
        );

        const productsString = orderData.products
            .map(
                (p: { productName?: string; name?: string; quantity: number; variant?: string }) =>
                    `${p.productName || p.name} (x${p.quantity})${p.variant ? ` [${p.variant}]` : ""}`
            )
            .join(", ");

        const rowData = {
            "Sanity ID": orderData.sanityId,
            "Order ID": orderData.orderNumber,
            Date: new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
            "Customer Name": orderData.customerName,
            Email: orderData.email,
            Phone: orderData.phone,
            Address: `${orderData.address}, ${orderData.city}`,
            Products: productsString,
            "Total Amount": orderData.totalPrice,
            Status: orderData.status || "Placed",
        };

        if (existingRow) {
            existingRow.assign(rowData);
            await existingRow.save();
            console.log(`Updated existing order ${orderData.orderNumber} in Google Sheet`);
        } else {
            await sheet.addRow(rowData);
            console.log(`Added new order ${orderData.orderNumber} to Google Sheet`);
        }

        return true;
    } catch (error) {
        console.error("Error upserting to Google Sheet:", error);
        return false;
    }
}

export async function updateOrderStatusInSheet(orderNumber: string, newStatus: string) {
    try {
        const doc = new GoogleSpreadsheet(
            process.env.GOOGLE_SHEET_ID!,
            serviceAccountAuth
        );

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        const row = rows.find((row) => row.get("Order ID") === orderNumber);

        if (row) {
            row.set("Status", newStatus);
            await row.save();
            console.log(`Updated order ${orderNumber} status to ${newStatus}`);
            return true;
        } else {
            console.warn(`Order ${orderNumber} not found in Google Sheet`);
            return false;
        }
    } catch (error) {
        console.error("Error updating Google Sheet:", error);
        return false;
    }
}

export async function deleteOrderFromSheet(sanityId: string, orderNumber?: string) {
    try {
        const doc = new GoogleSpreadsheet(
            process.env.GOOGLE_SHEET_ID!,
            serviceAccountAuth
        );

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        // Try finding by Sanity ID first
        let row = rows.find((row) => row.get("Sanity ID") === sanityId);

        // Fallback: Try finding by Order Number if Sanity ID didn't match (legacy data)
        if (!row && orderNumber) {
            console.log(`Sanity ID not found or missing from sheet. Falling back to Order ID: ${orderNumber}`);
            row = rows.find((row) => row.get("Order ID") === orderNumber);
        }

        if (row) {
            await row.delete();
            console.log(`Deleted order (Sanity ID: ${sanityId} / Order ID: ${orderNumber}) from Google Sheet`);
            return true;
        } else {
            console.warn(`Order not found in Google Sheet for deletion. Sanity ID: ${sanityId}, Order ID: ${orderNumber}`);
            return false;
        }
    } catch (error) {
        console.error("Error deleting from Google Sheet:", error);
        return false;
    }
}
