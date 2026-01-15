import React from 'react';

interface TechnicalCardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    accent?: 'amber' | 'blue';
    onClick?: () => void;
}

export const TechnicalCard: React.FC<TechnicalCardProps> = ({
    title,
    subtitle,
    children,
    className = "",
    accent = 'blue',
    onClick
}) => {
    const accentColor = accent === 'amber' ? 'border-accent-amber/50' : 'border-accent-blue/30';
    const glowColor = accent === 'amber' ? 'shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'shadow-[0_0_15px_rgba(59,130,246,0.05)]';

    return (
        <div
            className={`relative border group overflow-hidden ${accentColor} bg-slate-900/40 backdrop-blur-sm p-4 ${glowColor} ${className}`}
            onClick={onClick}
        >
            {/* Infinite Scanning Line */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                <div className="w-[200%] h-20 bg-accent-blue animate-scanline blur-3xl -left-1/2" />
            </div>

            {/* Decorative corners */}
            <div className={`absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-[0_0_10px_currentColor] ${accent === 'amber' ? 'border-accent-amber' : 'border-accent-blue'}`} />
            <div className={`absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-[0_0_10px_currentColor] ${accent === 'amber' ? 'border-accent-amber' : 'border-accent-blue'}`} />

            {/* Mid-point accents for group hover */}
            <div className={`absolute top-1/2 -left-px w-[2px] h-0 group-hover:h-8 -translate-y-1/2 transition-all duration-500 bg-current opacity-0 group-hover:opacity-100 ${accent === 'amber' ? 'text-accent-amber' : 'text-accent-blue'}`} />
            <div className={`absolute top-1/2 -right-px w-[2px] h-0 group-hover:h-8 -translate-y-1/2 transition-all duration-500 bg-current opacity-0 group-hover:opacity-100 ${accent === 'amber' ? 'text-accent-amber' : 'text-accent-blue'}`} />

            {title && (
                <div className="mb-4 relative z-20">
                    <h3 className={`font-mono text-sm font-bold tracking-widest uppercase ${accent === 'amber' ? 'text-accent-amber' : 'text-accent-blue'}`}>
                        {title}
                    </h3>
                    {subtitle && (
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                            {subtitle}
                        </div>
                    )}
                    <div className={`h-[1px] w-full mt-2 bg-gradient-to-r from-current to-transparent opacity-20 ${accent === 'amber' ? 'text-accent-amber' : 'text-accent-blue'}`} />
                </div>
            )}

            <div className="relative z-10">
                {children}
            </div>

            {/* Background technical markings */}
            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-700 select-none group-hover:text-slate-500 transition-colors">
                MOD_REQ_v.01
            </div>
        </div>
    );
};
