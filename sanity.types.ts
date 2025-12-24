export type Product = {
    _id: string;
    _type: "product";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name?: string;
    slug?: { current: string; _type: "slug" };
    images?: Array<{
        asset?: {
            _ref: string;
            _type: "reference";
        };
        hotspot?: {
            x: number;
            y: number;
            height: number;
            width: number;
        };
        crop?: {
            top: number;
            bottom: number;
            left: number;
            right: number;
        };
        _type: "image";
        _key: string;
    }>;
    intro?: string;
    description?: string;
    price?: number;
    discount?: number;
    categories?: Array<{
        _ref: string;
        _type: "reference";
        _key: string;
    }>;
    stock?: number;
    status?: "new" | "hot" | "sale";
    form?: "solid" | "liquid" | "cream" | "oil";
    usage?: string;
    ingredients?: string;
    isMedicated?: boolean;
};

export type Category = {
    _id: string;
    _type: "category";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    title?: string;
    slug?: { current: string; _type: "slug" };
    description?: string;
    image?: {
        asset?: {
            _ref: string;
            _type: "reference";
        };
        hotspot?: {
            x: number;
            y: number;
            height: number;
            width: number;
        };
        crop?: {
            top: number;
            bottom: number;
            left: number;
            right: number;
        };
        _type: "image";
    };
};

export type CATEGORIES_QUERYResult = Array<Category>;

export type PRODUCTS_QUERYResult = Array<Product>;

export type Sale = {
    _id: string;
    _type: "sale";
    title?: string;
    description?: string;
    badge?: string;
    discountAmount?: number;
    couponCode?: string;
    validFrom?: string;
    validUntil?: string;
    isActive?: boolean;
    image?: {
        asset?: {
            _ref: string;
            _type: "reference";
        };
        _type: "image";
    };
};

export type SALE_QUERYResult = Array<Sale>;

export type Order = {
    _id: string;
    _type: "order";
    _createdAt: string;
    orderNumber?: string;
    customerName?: string;
    email?: string;
    phone?: string;
    cnic?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    totalPrice?: number;
    currency?: string;
    amountDiscount?: number;
    status?: "placed" | "paid" | "shipped" | "delivered" | "cancelled";
    orderDate?: string;
    products?: Array<{
        _key: string;
        product?: Product;
        quantity?: number;
    }>;
};

export type MY_ORDERS_QUERYResult = Array<Order>;
