import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="flex items-center gap-2 mb-8 font-mono text-[9px] uppercase tracking-widest text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-accent-blue transition-colors flex items-center gap-1">
                <Home className="w-3 h-3" /> [ROOT]
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="w-2 h-2 text-slate-700 shrink-0" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-accent-blue transition-colors">
                            [{item.label.replace(/\s+/g, '_')}]
                        </Link>
                    ) : (
                        <span className="text-foreground/60">{item.label.replace(/\s+/g, '_')}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};
