import { getCollection, getEntry } from "astro:content";
import { Prodigi } from "./prodigi";
import { PRODIGI_API_KEY } from "astro:env/server";
import { PRODIGI_API_URL } from "astro:env/client";

const prodigi = new Prodigi(PRODIGI_API_KEY, PRODIGI_API_URL);

export async function getProductInfo() {
    
    const product = await prodigi.getProductDetails("GLOBAL-FAP-16x24");
    console.log(product.ok ? product.value : product.error);
    
    if (!product.ok) {
        throw product.error;
    }

    return product;
}

let _products: object[];
async function getProductsImpl(): Promise<object[]> {
    return [
        {}
    ];
}

export async function getProducts(): Promise<any[]> {

    if (!_products) {
        _products = await getProductsImpl();
    }

    return _products;
}

const products = await getCollection("products");
const blanket = await getEntry("products", "blanket");