"use client";

// React & Next.js core
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Third-party libraries
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Internal absolute imports (@/)
import { createOrder, OrderData } from "@/actions/createOrder";
import useCartStore from "@/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ManualCheckoutFormProps {
    onCancel: () => void;
    userData: {
        name: string;
        email: string;
        clerkUserId: string;
    };
}

const ManualCheckoutForm: React.FC<ManualCheckoutFormProps> = ({
    onCancel,
    userData,
}) => {
    const router = useRouter();
    const { getGroupedItems, resetCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        cnic: "",
        address: "",
        city: "",
        postalCode: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const groupedItems = getGroupedItems();
        const orderData: OrderData = {
            orderNumber: crypto.randomUUID(),
            customerName: userData.name,
            email: userData.email,
            clerkUserId: userData.clerkUserId,
            phone: formData.phone,
            cnic: formData.cnic,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            products: groupedItems.map((item) => ({
                product: {
                    _id: item.product?._id as string,
                },
                quantity: item.quantity,
            })),
        };

        try {
            const result = await createOrder(orderData);
            if (result.success) {
                toast.success("Order placed successfully!");
                resetCart();
                router.push("/success?orderNumber=" + orderData.orderNumber);
            } else {
                toast.error("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Please provide your contact and shipping details to finalize the order.
                    We will contact you for payment.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            required
                            placeholder="0300-1234567"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="cnic">CNIC</Label>
                        <Input
                            id="cnic"
                            name="cnic"
                            required
                            placeholder="12345-1234567-1"
                            value={formData.cnic}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                            id="address"
                            name="address"
                            required
                            placeholder="123 Main St"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                required
                                placeholder="Lahore"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                                id="postalCode"
                                name="postalCode"
                                required
                                placeholder="54000"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                "Place Order"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualCheckoutForm;
