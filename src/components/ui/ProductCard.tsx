import React from 'react';
import { TechnicalCard } from './TechnicalCard';
import { Weight, Tag, Zap } from 'lucide-react';
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

    return (
        <TechnicalCard
            accent={isFrame ? 'amber' : 'blue'}
            className="h-full flex flex-col group cursor-pointer"
        >
            <div className="flex flex-col h-full">
                {/* Brand & Category */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                            {product.brand}
                        </span>
                        {product.isRecommended && (
                            <span className="text-[7px] font-mono text-green-500 font-bold tracking-widest border border-green-500/30 px-1 py-0.5 rounded-sm bg-green-500/5 animate-pulse">
                                [EXPERT_PICK]
                            </span>
                        )}
                    </div>
                    <span className={`px-2 py-0.5 text-[8px] font-mono border rounded-full uppercase ${isFrame ? 'border-accent-amber/30 text-accent-amber' : 'border-accent-blue/30 text-accent-blue'}`}>
                        {product.category}
                    </span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-accent-amber transition-colors">
                    {product.name}
                </h3>

                {/* Technical Quick-Icons */}
                <div className="flex gap-4 mb-4">
                    {product.weight && (
                        <div className="flex items-center gap-1">
                            <Weight className="w-3 h-3 text-slate-600" />
                            <span className="text-[10px] font-mono text-slate-400">{product.weight}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] font-mono text-slate-400">System_OK</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-500 font-mono mb-6 line-clamp-2 leading-relaxed">
                    {product.description}
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
