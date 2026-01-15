import { MetadataRoute } from 'next';
import productsData from '@/data/products.json';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://flight-risk-store-v1.netlify.app';

    // Static routes
    const routes = [
        '',
        '/shop',
        '/part-picker',
        '/knowledge-base',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic product routes
    const productRoutes = productsData.products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...productRoutes];
}
