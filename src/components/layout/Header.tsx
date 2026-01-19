import React from 'react';
import Link from 'next/link';
import { Crosshair, Menu, Zap, ShoppingCart } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-accent-blue/20 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative animate-shimmer">
                        <Crosshair className="w-8 h-8 text-accent-amber" />
                        <div className="absolute inset-0 bg-accent-amber/20 blur-sm rounded-full" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tighter text-foreground group-hover:text-accent-amber transition-colors">
                            FLIGHT<span className="text-accent-amber">RISK</span>
                        </span>
                        <div className="text-[10px] font-mono text-accent-blue/60 leading-tight uppercase tracking-widest">
                            FPV_SYSTEMS_INIT
                        </div>
                    </div>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/about" className="font-mono text-sm hover:text-accent-blue transition-colors flex items-center gap-1 group">
                        [LOG]
                    </Link>
                    <Link href="/shop" className="font-mono text-sm hover:text-accent-blue transition-colors flex items-center gap-1 group">
                        <ShoppingCart className="w-4 h-4 group-hover:animate-pulse" /> [SHOP]
                    </Link>
                    <Link href="/part-picker" className="font-mono text-sm hover:text-accent-amber transition-colors flex items-center gap-1">
                        <Zap className="w-4 h-4" /> [BUILD]
                    </Link>
                    <Link href="/knowledge-base" className="font-mono text-sm hover:text-accent-amber transition-colors underline-offset-4 decoration-accent-amber/50">
                        GUIDES
                    </Link>
                    <button className="border border-accent-blue/40 px-3 py-1 text-xs font-mono hover:bg-accent-blue/10 transition-colors uppercase flex items-center gap-2 group">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-heartbeat shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        SYSTEM: <span className="text-green-500 underline group-hover:text-green-400 transition-colors">ACTIVE</span>
                    </button>
                </nav>

                <button className="md:hidden text-accent-blue">
                    <Menu />
                </button>
            </div>

            {/* Decorative HUD scanning line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </header>
    );
};
