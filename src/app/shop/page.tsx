"use client";

import React, { useState, Suspense } from 'react';
import productsData from "@/data/products.json";
import { ProductCard } from "@/components/ui/ProductCard";
import { MissionSelector } from "@/components/ui/MissionSelector";
import { Search, Tag, ChevronRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function ShopContent() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [missionProfile, setMissionProfile] = useState<string>("");

    // Mission Profile Logic
    useEffect(() => {
        if (!missionProfile) return;
        setSelectedCategory("All");
        setSelectedBrand("All");
    }, [missionProfile]);

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setSelectedCategory(cat);
    }, [searchParams]);

    // Easter Egg: Konami Code
    useEffect(() => {
        let keys: string[] = [];
        const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

        const handleKeyDown = (e: KeyboardEvent) => {
            keys.push(e.key);
            keys = keys.slice(-10);
            if (JSON.stringify(keys) === JSON.stringify(konami)) {
                alert("SYSTEM_OVERRIDE_INITIATED // ADMIN_ACCESS_GRANTED \n\nDISCOUNT_CODE: 'RISKY_BUSINESS' ACTIVATED");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const categories = ["All", ...new Set(productsData.products.map((p: any) => p.category))];
    const brands = ["All", ...new Set(productsData.products.map((p: any) => p.brand))];

    const filteredProducts = productsData.products.filter((product: any) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;

        let matchesMission = true;
        if (missionProfile === 'HULL_INTEGRITY') {
            matchesMission = (product.category === 'Frames' || product.category === 'Motors' || product.subCategory === 'Freestyle') && product.price > 50;
        } else if (missionProfile === 'RANGE_MAX') {
            matchesMission = product.subCategory === 'Long Range' || product.name.includes("GPS") || product.name.includes("Li-Ion");
        } else if (missionProfile === 'STEALTH_OPS') {
            matchesMission = product.subCategory === 'Tiny Whoop' || product.category === 'Radio' || product.category === 'Goggles' || product.name.includes("Pocket");
        }

        return matchesSearch && matchesCategory && matchesBrand && matchesMission;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* HUD Header */}
            <div className="mb-12 border-b border-accent-blue/20 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter uppercase flex items-center gap-4">
                        <BarChart3 className="text-accent-blue animate-pulse" /> SYSTEM_CATALOG
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase">
                        <span>ACTIVE_RESOURCES: {filteredProducts.length}/{productsData.products.length}</span>
                        <span className="hidden md:inline text-accent-blue/40">//</span>
                        <span className="hidden md:inline">ENCRYPTION: AES-256_ACTIVE</span>
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

            <MissionSelector activeMission={missionProfile} onSelectMission={setMissionProfile} />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    {/* Category Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-accent-blue uppercase tracking-widest font-bold">
                            <Tag className="w-3 h-3" /> MISSION_LOADOUT
                        </div>
                        <div className="space-y-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-3 py-2 text-xs font-mono transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-accent-blue/20 text-accent-blue border-l-2 border-accent-blue pl-4' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                                >
                                    <span>{cat.replace(/\s+/g, '_').toUpperCase()}</span>
                                    {selectedCategory === cat && <ChevronRight className="w-3 h-3 animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-accent-amber uppercase tracking-widest font-bold">
                            <BarChart3 className="w-3 h-3" /> SUPPLY_CHAIN_AUTH
                        </div>
                        <div className="space-y-1">
                            {brands.map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => setSelectedBrand(brand)}
                                    className={`w-full text-left px-3 py-2 text-xs font-mono transition-all flex items-center justify-between ${selectedBrand === brand ? 'bg-accent-amber/20 text-accent-amber border-l-2 border-accent-amber pl-4' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                                >
                                    <span>{brand.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <div className="text-[10px] font-mono text-accent-blue/60 uppercase mb-2">// SYSTEM_UPDATE</div>
                        <p className="text-[9px] font-mono text-slate-500 leading-tight">
                            Filter by mission profile to isolate specific components for your build sequence.
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
        </div >
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-20 text-center font-mono text-accent-blue animate-pulse">
                INITIALIZING_CATALOG_STREAM...
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
