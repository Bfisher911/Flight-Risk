import React, { useState } from 'react';
import { TechnicalCard } from './TechnicalCard';
import { Weight, Tag, Zap, Box } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        brand: string;
        category: string;
        weight?: string;
        price: number;
        imageUrl?: string;
        description: string;
        specs?: any;
        isRecommended?: boolean;
    };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const isFrame = product.category.toLowerCase() === 'frame';
    const [imageError, setImageError] = useState(false);

    // Lore Helpers (Fallbacks if data missing)
    // Deterministic hash for consistent lore across reloads
    const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hazardLevel = (product as any).hazardLevel || ['LOW', 'MED', 'HIGH', 'CRIT'][hash % 4];
    const isVerified = (product as any).systemVerified || (hash % 3 === 0);

    const hazardColor: Record<string, string> = {
        'LOW': 'text-slate-400',
        'MED': 'text-accent-amber',
        'HIGH': 'text-orange-500',
        'CRIT': 'text-red-500'
    };

    return (
        <TechnicalCard
            accent={isFrame ? 'amber' : 'blue'}
            className="h-full flex flex-col group cursor-pointer relative overflow-hidden"
        >
            {/* Hazard Strip */}
            <div className={`absolute top-0 right-0 px-2 py-1 text-[7px] font-mono font-bold tracking-widest border-b border-l border-white/5 bg-slate-950 z-10 ${hazardColor[hazardLevel] || 'text-slate-400'}`}>
                HAZARD: {hazardLevel}
            </div>

            <div className="flex flex-col h-full pt-4">
                {/* Product Image */}
                <div className="relative w-full h-40 mb-4 bg-slate-900/50 rounded overflow-hidden">
                    {product.imageUrl && !imageError ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Box className="w-12 h-12 text-slate-700" />
                        </div>
                    )}

                    {/* System Verified Badge overlay */}
                    {isVerified && (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-green-500/10 border border-green-500/30 text-[7px] font-mono text-green-400 font-bold tracking-widest flex items-center gap-1 backdrop-blur-sm">
                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            SYS_VERIFIED
                        </div>
                    )}
                </div>

                {/* Brand & Category */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                            {product.brand}
                        </span>
                    </div>
                    <span className={`px-2 py-0.5 text-[8px] font-mono border rounded-full uppercase ${isFrame ? 'border-accent-amber/30 text-accent-amber' : 'border-accent-blue/30 text-accent-blue'}`}>
                        {product.category}
                    </span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-accent-amber transition-colors">
                    {product.name}
                </h3>

                {/* technical/Lore Details */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {product.weight && (
                        <div className="flex items-center gap-1">
                            <Weight className="w-3 h-3 text-slate-600" />
                            <span className="text-[10px] font-mono text-slate-400">{product.weight}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] font-mono text-slate-400">
                            {isVerified ? 'Optimized' : 'Standard'}
                        </span>
                    </div>
                </div>

                {/* Description / Dossier Snippet */}
                <p className="text-[11px] text-slate-500 font-mono mb-6 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {(product as any).dossier || product.description}
                </p>

                {/* Price & Action */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <div className="text-[8px] font-mono text-slate-600 uppercase">Est_Price</div>
                        <div className="text-xl font-bold text-foreground">
                            ${product.price ? product.price.toFixed(2) : "0.00"}
                        </div>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-accent-blue/20 flex items-center justify-center group-hover:bg-accent-blue/10 group-hover:border-accent-blue transition-all">
                        <Tag className="w-3 h-3 text-accent-blue" />
                    </div>
                </div>
            </div>
        </TechnicalCard>
    );
};
