import ManageProductComponent from './_components/ManageProductComponent';
import headerToken from "@/lib/headerToken";

const productApiUrl = `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/products`;
const categoryApiUrl = `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/categories`;

async function fetchWithAuth(url) {
    const res = await fetch(url, {
        headers: await headerToken()
    });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    return Array.isArray(data?.payload) ? data.payload : [];
}

export default async function ProductManagementPage() {
    const [products, categories] = await Promise.all([
        fetchWithAuth(productApiUrl),
        fetchWithAuth(categoryApiUrl),
    ]);

    return (
        <div className="bg-gray-50 p-8">
            <ManageProductComponent
                products={products}
                categories={categories}
                productApiUrl={productApiUrl}
            />
        </div>
    );
}