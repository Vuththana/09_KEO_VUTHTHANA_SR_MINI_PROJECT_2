import { getProducts } from "@/service/product.service";

export async function getProductsAction() {
    const products = await getProducts();

    return products;
}