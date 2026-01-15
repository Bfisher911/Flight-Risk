"use client";

import React from 'react';
import productsData from "@/data/products.json";
import { TechnicalCard } from "@/components/ui/TechnicalCard";
import { TechnicalButton } from "@/components/ui/TechnicalButton";
import { ArrowLeft, Box, Weight, Shield, Info, Cpu, Zap, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id;

    // Safety check for static generation
    if (!productId) return null;

    const product = productsData.products.find((p: any) => p.id === productId);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center text-red-500 font-mono">
                <h1 className="text-4xl font-bold mb-4">SYSTEM_ERROR: PRODUCT_NOT_FOUND</h1>
                <Link href="/shop">
                    <TechnicalButton variant="secondary">REINITIALIZE_CATALOG</TechnicalButton>
                </Link>
            </div>
        );
    }

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [product.imageUrl],
        "description": product.description,
        "sku": product.id,
        "mpn": product.id,
        "brand": {
            "@type": "Brand",
            "name": product.brand
        },
        "offers": {
            "@type": "Offer",
            "url": `https://flight-risk-store-v1.netlify.app/product/${product.id}`,
            "priceCurrency": "USD",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    const relatedProducts = productsData.products
        .filter((p: any) => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    return (
        <div className="container mx-auto px-4 py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumbs items={[
                { label: "SHOP", href: "/shop" },
                { label: product.category, href: `/shop?category=${product.category}` },
                { label: product.name }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                {/* Product Visualization Space */}
                <div className="relative">
                    <TechnicalCard accent={product.id.includes('frame') ? 'amber' : 'blue'} className="aspect-square flex items-center justify-center p-0 overflow-hidden group">
                        {/* Static HUD Decoration */}
                        <div className="absolute inset-0 border border-current opacity-5 pointer-events-none" />
                        <div className="absolute top-4 left-4 font-mono text-[8px] opacity-20 uppercase">PRD_VIZ_v2.0</div>

                        {/* Placeholder for Product Image */}
                        <div className="w-64 h-64 border border-dashed border-current opacity-20 rounded-full animate-pulse flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                            <Box className="w-20 h-20 text-current" />
                        </div>

                        {/* Background Data Stream */}
                        <div className="absolute bottom-4 right-4 text-right font-mono text-[8px] opacity-20 leading-tight uppercase">
                            X_AUTH: GRANTED<br />
                            SPEC_LOCK: 100%
                        </div>
                    </TechnicalCard>
                </div>

                {/* Product Information */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-mono text-accent-blue bg-accent-blue/5 px-2 py-1 border border-accent-blue/20">
                            {product.brand}
                        </span>
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest underline underline-offset-4">
                            {product.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter uppercase">{product.name}</h1>

                    <p className="text-slate-400 font-mono text-sm leading-relaxed mb-8 border-l-2 border-accent-blue/20 pl-6 italic">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                        <div className="bg-slate-900/40 p-3 border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Weight className="w-3 h-3" />
                                <span className="text-[9px] font-mono uppercase tracking-tighter">Net_Weight</span>
                            </div>
                            <div className="text-sm font-mono font-bold">{product.weight || "N/A"}</div>
                        </div>
                        <div className="bg-slate-900/40 p-3 border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Shield className="w-3 h-3" />
                                <span className="text-[9px] font-mono uppercase tracking-tighter">Reliability</span>
                            </div>
                            <div className="text-sm font-mono font-bold text-green-500">GRADE_A</div>
                        </div>
                        <div className="bg-slate-900/40 p-3 border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Zap className="w-3 h-3" />
                                <span className="text-[9px] font-mono uppercase tracking-tighter">Performance</span>
                            </div>
                            <div className="text-sm font-mono font-bold">OPTIMAL</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Estimated Cost</div>
                            <div className="text-4xl font-bold text-foreground mb-1">${product.price.toFixed(2)}</div>
                        </div>
                        <div className="flex-grow flex gap-4">
                            <a href={product.amazonLink} target="_blank" className="flex-grow">
                                <TechnicalButton icon={<ShoppingCart />} className="w-full justify-center py-4">
                                    Acquire System
                                </TechnicalButton>
                            </a>
                            <Link href="/part-picker" className="flex-grow">
                                <TechnicalButton variant="secondary" icon={<Cpu />} className="w-full justify-center py-4">
                                    Add to build
                                </TechnicalButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="mb-20">
                <div className="flex items-center gap-2 mb-6 text-xs font-mono text-accent-blue font-bold tracking-widest uppercase">
                    <Info className="w-4 h-4" /> TECHNICAL_SPECIFICATION_MANIFEST
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
                    {product.specs && Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="bg-slate-950 p-4 flex justify-between items-center group hover:bg-slate-900/50 transition-colors">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{key}</span>
                            <span className="text-xs font-mono text-foreground font-bold group-hover:text-accent-blue transition-colors">{value}</span>
                        </div>
                    ))}
                    <div className="bg-slate-950 p-4 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Build_Compatibility</span>
                        <span className="text-xs font-mono text-green-500 font-bold">WHOOP_CLASS // 65-75MM</span>
                    </div>
                    <div className="bg-slate-950 p-4 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Solder_Required</span>
                        <span className="text-xs font-mono text-accent-amber font-bold">{product.category === 'Motors' || product.category === 'Flight Controllers' ? 'YES // HIGH_SKILL' : 'NO // PLUG_PLAY'}</span>
                    </div>
                </div>
            </div>

            {/* Related Components */}
            {relatedProducts.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-6 text-xs font-mono text-slate-500 font-bold tracking-widest uppercase">
                        <Box className="w-4 h-4" /> ALTERNATIVE_CONFIGURATIONS
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedProducts.map(rel => (
                            <Link href={`/product/${rel.id}`} key={rel.id} className="block group">
                                <TechnicalCard className="p-4 border-white/5 hover:border-accent-blue/30 transition-all">
                                    <div className="text-[10px] font-mono text-slate-600 uppercase mb-2">{rel.brand}</div>
                                    <h4 className="font-bold text-sm mb-2 group-hover:text-accent-blue transition-colors uppercase">{rel.name}</h4>
                                    <div className="text-lg font-bold text-accent-blue opacity-80 group-hover:opacity-100 transition-opacity">${rel.price.toFixed(2)}</div>
                                </TechnicalCard>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
