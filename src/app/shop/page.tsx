"use client";

import React, { useState, useMemo } from 'react';
import productsData from "@/data/products.json";
import { ProductCard } from "@/components/ui/ProductCard";
import { Search, Tag, ChevronRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ShopPage() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setSelectedCategory(cat);
    }, [searchParams]);

    const categories = ["All", ...new Set(productsData.products.map(p => p.category))];
    const brands = ["All", ...new Set(productsData.products.map(p => p.brand))];

    const filteredProducts = useMemo(() => {
        return productsData.products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
            return matchesSearch && matchesCategory && matchesBrand;
        });
    }, [searchQuery, selectedCategory, selectedBrand]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* HUD Header */}
            <div className="mb-12 border-b border-accent-blue/20 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter">STORE_CATALOG</h1>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase">
                        <span>Items_Detected: {filteredProducts.length}</span>
                        <span className="text-accent-blue/40">//</span>
                        <span>System: Ready</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                    <div className="hidden xl:flex items-center gap-6 font-mono text-[9px] text-slate-500 uppercase">
                        <div>
                            <div className="text-accent-blue opacity-50 mb-1">// GLOBAL_STOCKS</div>
                            <div className="flex gap-2">
                                <span className="text-foreground animate-pulse">4,192_UNT</span>
                                <span className="text-green-500/50">NOMINAL</span>
                            </div>
                        </div>
                        <div className="border-l border-white/5 pl-6">
                            <div className="text-accent-amber opacity-50 mb-1">// WH_LATENCY</div>
                            <div className="text-foreground">14.2_MS</div>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-blue/40 group-focus-within:text-accent-blue transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH_BY_SYSTEM_ID..."
                            className="w-full bg-slate-900/50 border border-accent-blue/20 py-3 pl-10 pr-4 font-mono text-xs focus:border-accent-blue focus:outline-none transition-all placeholder:text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-accent-blue font-bold tracking-widest uppercase">
                            <Tag className="w-3 h-3" /> CATEGORIES
                        </div>
                        <div className="space-y-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-3 py-2 text-[10px] font-mono uppercase transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-accent-blue/10 text-accent-blue border-l-2 border-accent-blue' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {cat}
                                    <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${selectedCategory === cat ? 'opacity-100' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-accent-amber font-bold tracking-widest uppercase">
                            <BarChart3 className="w-3 h-3" /> BRANDS
                        </div>
                        <div className="space-y-1">
                            {brands.map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => setSelectedBrand(brand)}
                                    className={`w-full text-left px-3 py-2 text-[10px] font-mono uppercase transition-all flex items-center justify-between group ${selectedBrand === brand ? 'bg-accent-amber/10 text-accent-amber border-l-2 border-accent-amber' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {brand}
                                    <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${selectedBrand === brand ? 'opacity-100' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border border-accent-blue/10 bg-accent-blue/5 rounded-sm">
                        <div className="text-[10px] font-mono text-accent-blue/60 uppercase mb-2">// SYSTEM_UPDATE</div>
                        <p className="text-[9px] font-mono text-slate-500 leading-tight">
                            Filter by category or brand to isolate specific components for your build sequence.
                        </p>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-grow">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product: any) => (
                                <Link href={`/product/${product.id}`} key={product.id}>
                                    <ProductCard product={product} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800">
                            <div className="text-slate-700 font-mono text-sm uppercase animate-pulse">NO_SYSTEMS_MATCH_SEARCH_CRITERIA</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
