import type { SingleOrSeveral } from "@probablyduncan/common";

export class Prodigi {

    private key: string;
    private baseurl: string;

    constructor(key: string, baseurl: string) {

        if (!key || !baseurl) {
            throw new Error("Prodigi requires an API Key and API Url");
        }

        this.key = key;
        this.baseurl = baseurl;
    }

    async getProductDetails(sku: string): Promise<Result<Product>> {

        const res = await this.fetch("products/" + sku, "GET");
        if (!res.ok) {
            return res;
        }

        const productJson = (await res.value.json()).product as Product;
        return productJson ? {
            ok: true,
            value: productJson,
        } : {
            ok: false,
            error: new Error("Failed to parse Product Details"),
        }
    }

    async getOrders({ page = 0, filter = {}, }: { page: number, filter: OrderFilter, }): Promise<Result<GetOrdersResult>> {

        // defaults
        const data: Record<string, any> = {
            top: 20,
            skip: page * 20,
        };

        // apply filter
        Object.entries(filter).forEach(([k, v]) => {
            data[k] = v;
        })

        const res = await this.fetch("orders", "GET", data);
        if (!res.ok) {
            return res;
        }

        const json = await res.value.json() as GetOrdersResult;
        return json ? {
            ok: true,
            value: json,
        } : {
            ok: false,
            error: new Error("Failed to parse GetOrdersResult"),
        };
    }

    async getQuote(quote: Quote): Promise<Result<QuoteResult>> {

        const res = await this.fetch("quotes", "POST");
        if (!res.ok) {
            return res;
        }

        const json = await res.value.json() as QuoteResult;
        return json ? {
            ok: true,
            value: json,
        } : {
            ok: false,
            error: new Error("Failed to parse QuoteResult"),
        }
    }

    async postOrder(order: Order): Promise<Result<Order>> {

        const res = await this.fetch("orders", "POST", order);
        if (!res.ok) {
            return res;
        }

        const orderJson = (await res.value.json()).order as Order;
        return orderJson ? {
            ok: true,
            value: orderJson,
        } : {
            ok: false,
            error: new Error("Failed to parse Order"),
        }
    }

    private async fetch(
        endpoint: string,
        method: "GET" | "POST" | "PUT" | "DELETE",
        body: Record<string, any> = {}
    ): Promise<Result<Response>> {

        try {
            const res = await fetch(this.baseurl + endpoint, {
                method,
                headers: {
                    "X-Api-Key": this.key,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            return res.ok ? {
                ok: true,
                value: res,
            } : {
                ok: false,
                error: new Error(`${res.status} - ${res.statusText}`),
            }
        }
        catch (ex: any) {
            return {
                ok: false,
                error: new Error(ex),
            }
        }
    }
}

export type ShippingMethod = "Budget" | "Standard" | "Express" | "Overnight";
export type AssetSizing = "fillPrintArea" | "fitPrintArea" | "stretchToPrintArea";

export type Order = {
    callbackUrl: string;        // on order status change
    merchantReference: string;  // specific to this order
    shippingMethod: ShippingMethod;
    idempotencyKey?: string;    // used to prevent duplicate orders
    recipient: Recipient;
    items: Item[];
    metadata: Record<string, any>;
}

export type OrderFilter = {
    createdFrom?: Date,
    createdTo?: Date,
    status?: OrderStatus,
    orderIds?: string[],
    merchantReferences?: string[],
}

export type OrderStatus = "draft" | "awaitingPayment" | "inProgress" | "complete" | "cancelled";

export type GetOrdersResult = {
    orders: Order[];
    hasMore: boolean;
    nextUrl: string;
}

export type Quote = {
    // TODO
}

export type QuoteResult = {
    // TODO
}

export type Recipient = {
    name: string;
    address: Address;
    email?: string;
    phoneNumber?: string;
}

export type Address = {
    line1: string,
    line2?: string,
    postalOrZipCode: string,
    countryCode: string,    // two letter iso code
    townOrCity: string,
    stateOrCounty?: string,
}

export type Item = {
    sku: string;
    copies: number;
    sizing: AssetSizing;
    merchantReference: string;  // specific to this item/order
    recipientCost: Cost;
    attributes: Record<string, any>;
    assets: Asset[];
}

export type Cost = {
    amount: string;     // positive is charged, negative is credit
    currency: string;   // 3 letter iso code
}

export type Asset = {
    url: string;    // "/assets/file.jpg"
    thumbnailUrl: string;
    printArea?: "default" | "spine" | "jigsaw";
}

export type Product = {
    sku: string;
    description: string;
    productDimensions: ProductDimensions;
    attributes?: Attributes;
    printAreas?: Record<string, { required: boolean }>;
    variants: Variant[];
}

export type ProductDimensions = {
    width: number;
    height: number;
    units: string;
}

export type Attributes = Record<string, SingleOrSeveral<string>>;

export type Variant = {
    attributes: Attributes;
    shipsTo: string[];  // iso country code
    printAreaSizes: Record<string, {
        horizontalResolution: number;
        verticalResolution: number;
    }>;
}

export type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };