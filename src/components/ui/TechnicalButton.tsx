import React from 'react';
import { Power } from 'lucide-react';

interface TechnicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const TechnicalButton: React.FC<TechnicalButtonProps> = ({
    variant = 'primary',
    icon,
    children,
    className = "",
    ...props
}) => {
    const variants = {
        primary: "border-accent-amber text-accent-amber hover:bg-accent-amber/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
        secondary: "border-accent-blue text-accent-blue hover:bg-accent-blue/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
        danger: "border-red-500 text-red-500 hover:bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    };

    return (
        <button
            className={`relative border group px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2 ${variants[variant]} ${className} overflow-hidden`}
            {...props}
        >
            {/* Glitch Layers (Visible on hover) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-current opacity-20 animate-glitch [clip-path:inset(50%_0_30%_0)]" />
                <div className="absolute inset-0 bg-current opacity-20 animate-glitch [clip-path:inset(10%_0_80%_0)] [animation-delay:0.1s]" />
                <div className="absolute inset-0 bg-current opacity-20 animate-glitch [clip-path:inset(80%_0_5%_0)] [animation-delay:0.2s]" />
            </div>

            {/* Decorative skewed background */}
            <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity" />

            <div className="relative z-20 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                {icon && <span className="w-4 h-4">{icon}</span>}
                <span className="relative z-10">{children}</span>
            </div>

            {/* Corner accents */}
            <div className="absolute -top-[1px] -left-[1px] w-1 h-1 bg-current group-hover:w-2 group-hover:h-2 transition-all" />
            <div className="absolute -bottom-[1px] -right-[1px] w-1 h-1 bg-current group-hover:w-2 group-hover:h-2 transition-all" />

            {/* HUD Scanline on button */}
            <div className="absolute inset-0 bg-gradient-to-t from-current to-transparent opacity-0 group-hover:opacity-10 pointer-events-none" />
        </button>
    );
};
