"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { AdBanner } from "@/components/ads/AdBanner";
import { TechnicalCard } from "@/components/ui/TechnicalCard";
import { TechnicalButton } from "@/components/ui/TechnicalButton";
import { Cpu, Settings, Camera, Zap, Radio, Battery, Info, CheckCircle2, Share2, Copy, Gamepad2, Glasses, Shield, Crosshair, Map } from "lucide-react";
import productsData from "@/data/products.json";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const Typewriter = ({ text, delay = 30 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = React.useState('');

    React.useEffect(() => {
        setDisplayText('');
        let i = 0;
        const interval = setInterval(() => {
            const char = text.charAt(i);
            setDisplayText((prev) => prev + char);
            i++;
            if (i >= text.length) clearInterval(interval);
        }, delay);
        return () => clearInterval(interval);
    }, [text, delay]);

    return <span className="after:content-['|'] after:animate-pulse after:ml-0.5">{displayText}</span>;
};

const categories = [
    { name: "Frame / Model", icon: Settings, key: "Frame" },
    { name: "Motors", icon: Zap, key: "Motors" },
    { name: "Flight Controller", icon: Cpu, key: "Flight Controllers" },
    { name: "Camera", icon: Camera, key: "Camera" },
    { name: "VTX", icon: Radio, key: "VTX" },
    { name: "Battery", icon: Battery, key: "Batteries" },
    { name: "Radio System", icon: Gamepad2, key: "Radio" },
    { name: "Goggles / Video", icon: Glasses, key: "Goggles" },
];

const PRESETS = [
    {
        id: "starter",
        name: "THE STARTER",
        description: "Zero to Hero. Everything you need to learn without breaking the bank.",
        parts: {
            "Frame": "happymodel-mobula6-2-10",
            "Radio": "radio-03",
        },
        icon: Shield,
        color: "text-green-400"
    },
    {
        id: "bando",
        name: "THE BANDO BASHER",
        description: "Designed for impact. Nazgul airframe with robust video link.",
        parts: {
            "Frame": "iflight-nazgul-evoqu-46",
            "Radio": "radio-03",
            "Goggles": "dji-goggles-integra-34"
        },
        icon: Zap,
        color: "text-accent-amber"
    },
    {
        id: "long_range",
        name: "THE LONG RANGER",
        description: "Mountain surfing capability. High efficiency, long endurance.",
        parts: {
            "Frame": "flywoo-explorer-lr-4-36",
            "Batteries": "geprc-vtc6-18650-4s1p-3000mah-148v-li-ion-battery-xt60-71"
        },
        icon: Map,
        color: "text-blue-400"
    }
];

function PartPickerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize state from URL
    const [selections, setSelections] = useState<Record<string, string | null>>(() => {
        const initialSelections: Record<string, string | null> = {
            Frame: null,
            Motors: null,
            "Flight Controllers": null,
            Camera: null,
            VTX: null,
            Batteries: null,
            Radio: null,
            Goggles: null
        };

        categories.forEach(cat => {
            const paramValue = searchParams.get(cat.key);
            if (paramValue) initialSelections[cat.key] = paramValue;
        });

        return initialSelections;
    });

    const [isCopied, setIsCopied] = useState(false);

    // Update URL when selections change
    const updateUrl = (newSelections: Record<string, string | null>) => {
        const params = new URLSearchParams();
        Object.entries(newSelections).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleSelect = (category: string, productId: string) => {
        setSelections(prev => {
            const next = {
                ...prev,
                [category]: prev[category] === productId ? null : productId
            };
            updateUrl(next);
            return next;
        });
    };

    const handleShare = () => {
        const params = new URLSearchParams();
        Object.entries(selections).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        const url = `${window.location.origin}${pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Configurator Area */}
                <div className="flex-grow">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <Settings className="text-accent-amber animate-[spin_5s_linear_infinite]" /> BUILD_CONFIGURATOR
                        </h1>
                        <p className="text-slate-500 font-mono text-sm uppercase">Select components to initialize your build sequence.</p>
                    </div>

                    <div className="space-y-12">
                        {categories.map((cat) => (
                            <section key={cat.key} id={cat.key.toLowerCase()}>
                                <div className="flex items-center gap-3 mb-6 border-b border-accent-blue/10 pb-2">
                                    <cat.icon className="w-5 h-5 text-accent-blue" />
                                    <h2 className="text-xl font-bold font-mono uppercase tracking-widest">{cat.name}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {productsData.products
                                        .filter(p => {
                                            if (cat.key === "Frame") return p.category === "Frame" || p.category === "Drones";
                                            return p.category === cat.key;
                                        })
                                        .map((product: any) => (
                                            <TechnicalCard
                                                key={product.id}
                                                className={`transition-all cursor-pointer ${selections[cat.key] === product.id ? 'border-accent-amber bg-accent-amber/10 animate-shimmer shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'hover:border-accent-blue/50'}`}
                                                onClick={() => handleSelect(cat.key, product.id)}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 relative bg-slate-800 border border-accent-blue/10 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {product.imageUrl && product.imageUrl.endsWith('.png') ? (
                                                            <Image
                                                                src={product.imageUrl}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover opacity-60"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] font-mono text-accent-blue/30 uppercase text-center px-1">{product.name}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="font-bold text-sm uppercase">{product.name}</h3>
                                                            {selections[cat.key] === product.id && <CheckCircle2 className="w-4 h-4 text-accent-amber" />}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-mono mb-3 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-accent-amber font-mono font-bold text-xs">${product.price.toFixed(2)}</span>
                                                            <a href={product.amazonLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                                <TechnicalButton variant="secondary" className="px-2 py-1 text-[8px]">
                                                                    View on Amazon
                                                                </TechnicalButton>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TechnicalCard>
                                        ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>

                {/* Build Summary Sidebar */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-24 space-y-6">

                        {/* Verified Loadouts */}
                        <TechnicalCard accent="blue" title="SYSTEM_VERIFIED_LOADOUTS" subtitle="ONE-CLICK_CONFIG">
                            <div className="space-y-3 mb-2">
                                {PRESETS.map((preset) => (
                                    <div
                                        key={preset.id}
                                        onClick={() => {
                                            const newSelections: Record<string, string | null> = { ...selections };
                                            Object.entries(preset.parts).forEach(([key, value]) => {
                                                if (value !== undefined) newSelections[key] = value;
                                            });
                                            setSelections(newSelections);
                                            updateUrl(newSelections);
                                        }}
                                        className="group relative border border-white/5 bg-slate-900/50 hover:bg-slate-800/80 p-3 cursor-pointer transition-all hover:border-accent-blue/50"
                                    >
                                        <div className="flex items-start gap-3">
                                            <preset.icon className={`w-5 h-5 mt-1 ${preset.color} shrink-0`} />
                                            <div>
                                                <h4 className={`font-mono font-bold text-sm ${preset.color} mb-1 group-hover:underline decoration-1 underline-offset-4`}>{preset.name}</h4>
                                                <p className="text-[10px] text-slate-400 leading-relaxed">{preset.description}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TechnicalCard>

                        <TechnicalCard accent="amber" title="BUILD_SUMMARY" subtitle="REAL-TIME_ANALYSIS">
                            <div className="space-y-4 mb-6">
                                {categories.map((cat) => {
                                    const selectedId = selections[cat.key];
                                    const product = productsData.products.find((p: any) => p.id === selectedId) as any;

                                    return (
                                        <div key={cat.key} className="flex justify-between items-start gap-2 border-b border-white/5 pb-2 min-h-12">
                                            <div className="text-[10px] font-mono text-slate-500 uppercase">{cat.name}:</div>
                                            <div className="text-right flex-grow pl-4">
                                                {product ? (
                                                    <div className="text-[10px] font-mono text-accent-amber uppercase leading-tight">
                                                        <Typewriter text={product.name} />
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] font-mono text-slate-700 italic">WAITING_FOR_INPUT...</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-accent-blue/5 border border-accent-blue/20 p-3 mb-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-accent-blue/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-2 mb-1 relative z-10">
                                    <Info className="w-3 h-3 text-accent-blue" />
                                    <span className="text-[10px] font-mono text-accent-blue uppercase font-bold">Incompatibility_Check</span>
                                </div>
                                <div className="text-[9px] font-mono text-green-500/80 uppercase relative z-10">All systems nominal. Ready for assembly.</div>
                                <div className="absolute bottom-0 left-0 h-[1px] bg-accent-blue transition-all duration-1000 w-0 group-hover:w-full" />
                            </div>

                            <TechnicalButton className="w-full justify-center gap-2 group" onClick={handleShare}>
                                {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4 group-hover:text-accent-blue" />}
                                {isCopied ? "LINK_COPIED_TO_CLIPBOARD" : "SHARE_SYSTEM_CONFIG"}
                            </TechnicalButton>
                        </TechnicalCard>

                        <AdBanner label="SIDEBAR_SKY" width="300px" height="250px" className="mx-auto" />

                        <div className="border border-accent-blue/10 p-4 bg-slate-900/40">
                            <div className="text-[10px] font-mono text-accent-blue/40 uppercase mb-2 italic">// SYSTEM_MESSAGES</div>
                            <div className="text-[9px] font-mono text-slate-500 leading-tight">
                                WARNING: Solder skills required for FC and Motors. Use 1S BT2.0 for optimal performance on this build spec.
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function PartPickerPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-20 text-center font-mono text-accent-amber animate-pulse">
                INITIALIZING_CONFIGURATOR_MODULE...
            </div>
        }>
            <PartPickerContent />
        </Suspense>
    );
}
