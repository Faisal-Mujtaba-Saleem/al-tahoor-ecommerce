"use client";

// React & Next.js core
import Image from "next/image";
import React, { useRef } from "react";

// Third-party libraries
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";

// SDKs (Sanity, Clerk, Google)
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

// Internal absolute imports (@/)
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import useCartStore from "@/store";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { addItem } = useCartStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Order_${order?.orderNumber || "Receipt"}`,
  });

  if (!order) return null;

  const handleReorder = () => {
    if (order.products) {
      order.products.forEach((item) => {
        if (item.product) {
          addItem(item.product);
        }
      });
      toast.success("Items added to cart!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-scroll bg-white">
        <DialogHeader className="print:hidden">
          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
        </DialogHeader>

        {/* Formal Printable Invoice Area Start */}
        <div className="mt-4 print:mt-0 p-0 md:p-4 print:p-0" id="order-receipt" ref={contentRef}>
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tighter">
                Tax Invoice
              </h1>
              <p className="text-gray-500 font-medium">Invoice No: {order.orderNumber?.slice(0, 13).toUpperCase()}</p>
              <p className="text-gray-500 font-medium">Date: {order.orderDate && format(new Date(order.orderDate), "MMMM dd, yyyy")}</p>
            </div>
            <div className="text-right space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">Al-Tahoor Healthcare</h2>
              <p className="text-sm text-gray-500">Premium Medicated Personal Care</p>
              <p className="text-sm text-gray-500">faisalmujtaba2005@gmail.com</p>
              <p className="text-sm text-gray-500">+92 3XX XXXXXXX</p>
            </div>
          </div>

          {/* Billing & Shipping Section */}
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Bill To:</h3>
              <p className="text-lg font-bold text-gray-900 leading-tight">{order.customerName}</p>
              <p className="text-gray-600 font-medium">{order.email}</p>
              <p className="text-gray-600 font-medium">{order.phone}</p>
            </div>
            <div className="text-right space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Ship To:</h3>
              <p className="text-gray-900 font-medium">{order.address}</p>
              <p className="text-gray-900 font-medium">{order.city}, {order.postalCode}</p>
              <div className="pt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                  Status: {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead className="w-12 text-center text-gray-900 font-bold uppercase text-[10px]">#</TableHead>
                  <TableHead className="text-gray-900 font-bold uppercase text-[10px]">Product Description</TableHead>
                  <TableHead className="text-right text-gray-900 font-bold uppercase text-[10px]">Qty</TableHead>
                  <TableHead className="text-right text-gray-900 font-bold uppercase text-[10px]">Unit Price</TableHead>
                  <TableHead className="text-right text-gray-900 font-bold uppercase text-[10px]">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products?.map((item, index) => (
                  <TableRow key={index} className="border-gray-100">
                    <TableCell className="text-center text-gray-500 font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] && (
                          <div className="print:hidden h-10 w-10 shrink-0">
                            <Image
                              src={urlFor(item.product.images[0]).url()}
                              alt={item.product.name!}
                              width={40}
                              height={40}
                              className="rounded border object-cover"
                            />
                          </div>
                        )}
                        <span className="font-bold text-gray-900">{item.product?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-700">{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">
                      <PriceFormatter amount={item.product?.price} />
                    </TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      <PriceFormatter amount={(item.product?.price || 0) * (item.quantity || 0)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-full max-w-[280px] space-y-3">
              <div className="flex justify-between items-center text-sm text-gray-600 px-2">
                <span>Subtotal (Amount before discount)</span>
                <PriceFormatter
                  amount={(order.totalPrice || 0) + (order.amountDiscount || 0)}
                  className="font-medium text-gray-900"
                />
              </div>
              {order.amountDiscount !== 0 && (
                <div className="flex justify-between items-center text-sm text-red-600 px-2">
                  <span>Order Discount</span>
                  <PriceFormatter amount={-(order.amountDiscount || 0)} className="font-medium" />
                </div>
              )}
              <div className="flex justify-between items-center p-3 bg-gray-900 text-white rounded-lg">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total Amount Due</span>
                <PriceFormatter amount={order.totalPrice} className="text-xl font-black text-white" />
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-20 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400 font-medium mb-1">Thank you for choosing Al-Tahoor Healthcare</p>
            <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em]">This is a computer generated invoice and requires no signature</p>
          </div>
        </div>
        {/* Formal Printable Invoice Area End */}

        <div className="mt-6 flex items-center justify-end gap-4 print:hidden">
          <Button variant="outline" onClick={() => handlePrint()} className="gap-2">
            Print Receipt
          </Button>
          <Button onClick={handleReorder} className="gap-2">
            Reorder Item/s
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
