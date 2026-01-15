import React from 'react';
import { AdBanner } from "@/components/ads/AdBanner";
import { TechnicalCard } from "@/components/ui/TechnicalCard";
import { TechnicalButton } from "@/components/ui/TechnicalButton";
import { ArrowLeft, Clock, User, Share2, Printer, Bookmark, Tag } from "lucide-react";
import Link from 'next/link';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // In a real app, you'd fetch article data by slug.
    // Here we'll just mock the content for the sample slug.
    const article = {
        title: slug === 'how-to-solder' ? "Mastering FPV Soldering: The Professional Guide" : "Technical Tutorial // Flight_Risk_OS",
        author: "ADMIN_PILOT",
        date: "2026-01-12",
        readTime: "8 min read",
        category: "MAINTENANCE"
    };

    return (
        <article className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <Link href="/knowledge-base" className="text-accent-blue font-mono text-xs flex items-center gap-1 hover:text-accent-amber transition-colors mb-6">
                    <ArrowLeft className="w-3 h-3" /> BACK_TO_DATABASE
                </Link>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] bg-accent-amber/10 text-accent-amber border border-accent-amber/20 px-2 py-0.5 rounded font-mono uppercase tracking-tighter">
                                {article.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">ID: DOC-772-SOLDER</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight uppercase font-mono tracking-tighter">
                            {article.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                        <div className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</div>
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</div>
                    </div>
                </div>
                <div className="h-[1px] w-full bg-accent-blue/10 mt-6" />
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="flex-grow lg:max-w-4xl">
                    <div className="prose prose-invert prose-slate max-w-none font-sans text-slate-300 leading-relaxed uppercase tracking-tight text-sm">
                        <p className="mb-6 font-mono text-accent-blue/80 italic border-l-2 border-accent-blue/40 pl-4 py-1">
                            "Soldering is the most important skill in FPV. A bad joint is a crash waiting to happen. Follow these protocols to ensure build integrity."
                        </p>

                        <h2 className="text-xl font-bold font-mono text-foreground mt-10 mb-4 border-b border-white/5 pb-2 border-dashed">01. PRE-FLIGHT_PREP</h2>
                        <p className="mb-6">
                            Before you touch iron to pad, ensure you have the correct thermal mass. A 60W iron with adjustable temperature is mandatory. Set to 350°C for signal pads and 400°C for large battery lead pads.
                        </p>

                        <div className="my-8 flex justify-center">
                            <AdBanner label="IN_ARTICLE_MID" width="100%" height="150px" />
                        </div>

                        <h2 className="text-xl font-bold font-mono text-foreground mt-10 mb-4 border-b border-white/5 pb-2 border-dashed">02. TINNING_PROTOCOL</h2>
                        <p className="mb-4 text-accent-amber/90 font-mono">
                            [SYSTEM_REQUIREMENT] Always tin your iron tip and the component wire before attempting a joint.
                        </p>
                        <p className="mb-6">
                            Apply flux generously. Flux is not optional. It breaks surface tension and prevents oxidation. Clean your tip on a brass sponge after every single joint.
                        </p>

                        <TechnicalCard accent="amber" className="my-10">
                            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4" /> PRO_TIP_v.01
                            </h3>
                            <p className="text-xs font-mono lowercase">
                                use leaded solder (63/37) for easier flow and better reliability in high-vibration environments like racing whoops.
                            </p>
                        </TechnicalCard>

                        <h2 className="text-xl font-bold font-mono text-foreground mt-10 mb-4 border-b border-white/5 pb-2 border-dashed">03. INSPECTION</h2>
                        <p className="mb-6">
                            A perfect joint should look like a shiny Hershey's Kiss. If it's dull, it's a cold joint. Re-flux and re-flow immediately. Scan for bridges using a magnifying glass or a macro lens on your phone.
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                        <TechnicalButton variant="secondary" icon={<Share2 className="w-3 h-3" />} className="text-[10px]">
                            SHARE_DOC
                        </TechnicalButton>
                        <TechnicalButton variant="secondary" icon={<Printer className="w-3 h-3" />} className="text-[10px]">
                            PRINT_HARDCOPY
                        </TechnicalButton>
                        <TechnicalButton variant="secondary" icon={<Bookmark className="w-3 h-3" />} className="text-[10px]">
                            SAVE_OFFLINE
                        </TechnicalButton>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-24 space-y-8">
                        <AdBanner label="SIDEBAR_300x250" width="300px" height="250px" className="mx-auto" />

                        <TechnicalCard title="RELATED_FILES" subtitle="DOC_SEQUENCING">
                            <ul className="space-y-4">
                                <li className="text-[10px] font-mono group cursor-pointer border-b border-white/5 pb-2 last:border-0 uppercase">
                                    <span className="text-slate-600 block mb-1">NEXT_PROTOCOL:</span>
                                    <span className="group-hover:text-accent-amber transition-colors">ESC_FIRMWARE_FLASHING_v2</span>
                                </li>
                                <li className="text-[10px] font-mono group cursor-pointer border-b border-white/5 pb-2 last:border-0 uppercase">
                                    <span className="text-slate-600 block mb-1">PREV_PROTOCOL:</span>
                                    <span className="group-hover:text-accent-amber transition-colors">PARTS_LIST_INITIALIZATION</span>
                                </li>
                            </ul>
                        </TechnicalCard>

                        <TechnicalCard accent="blue" title="ENGINEERING_HUB">
                            <div className="text-[9px] font-mono text-slate-400 uppercase leading-relaxed mb-4">
                                Access over 50+ technical build guides for the FPV community.
                            </div>
                            <Link href="/knowledge-base" className="block text-center border border-accent-blue/40 py-2 text-[10px] font-mono text-accent-blue hover:bg-accent-blue/10 transition-colors uppercase">
                                Browse Full Database
                            </Link>
                        </TechnicalCard>
                    </div>
                </aside>
            </div>
        </article>
    );
}
