import { Metadata } from "next";
import productsData from "@/data/products.json";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = productsData.products.find((p: any) => p.id === id);
    if (!product) return { title: "Product Not Found" };

    return {
        title: `${product.name} | Flight Risk`,
        description: product.description,
        openGraph: {
            title: `${product.name} - ${product.category} | Flight Risk`,
            description: product.description,
            images: [product.imageUrl || '/images/og-share.png'],
        }
    };
}

export default function Page() {
    return <ProductClient />;
}

export async function generateStaticParams() {
    return productsData.products.map((product) => ({
        id: product.id,
    }));
}
