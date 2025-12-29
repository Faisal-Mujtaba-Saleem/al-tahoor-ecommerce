"use client";

import React, { useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { getPolicyBySlug } from "@/app/actions/productActions";
import { PortableText } from "next-sanity";
import { ScrollArea } from "@/components/ui/scroll-area";

const DeliveryReturnButton = () => {
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [policy, setPolicy] = useState<{ content: any } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleOpen = async () => {
        if (!policy) {
            setLoading(true);
            const data = await getPolicyBySlug("delivery-return");
            setPolicy(data);
            setLoading(false);
        }
        setOpen(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    onClick={handleOpen}
                    className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect"
                >
                    <TbTruckDelivery className="text-lg" />
                    <p>Delivery & Return</p>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Delivery & Return Policy</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full max-h-[60vh] pr-4">
                    <div className="py-4 prose prose-sm max-w-none">
                        {loading ? (
                            <p>Loading policy...</p>
                        ) : policy ? (
                            <PortableText value={policy.content} />
                        ) : (
                            <p>No policy found. Please contact support for assistance.</p>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default DeliveryReturnButton;
