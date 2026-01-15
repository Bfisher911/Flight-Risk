import React from 'react';
import { AdBanner } from "@/components/ads/AdBanner";
import { TechnicalCard } from "@/components/ui/TechnicalCard";
import { TechnicalButton } from "@/components/ui/TechnicalButton";
import { BookOpen, Search, Clock, User, ChevronRight } from "lucide-react";
import Link from 'next/link';

const articles = [
    {
        slug: "how-to-solder",
        title: "Mastering FPV Soldering: The Professional Guide",
        excerpt: "Learn how to solder motors, flight controllers, and VTX units with precision. Avoid cold joints and bridge defects.",
        author: "ADMIN_PILOT",
        date: "2026-01-12",
        readTime: "8 min read",
        tag: "MAINTENANCE"
    },
    {
        slug: "pid-tuning-basics",
        title: "PID Tuning 101: Taming the Whoop",
        excerpt: "Understand Proportional, Integral, and Derivative gains. Get that 'locked-in' feel for your 65mm build.",
        author: "FLIGHT_ENGINEER",
        date: "2026-01-10",
        readTime: "12 min read",
        tag: "SOFTWARE"
    },
    {
        slug: "battery-care",
        title: "1S LiHV Battery Protocol",
        excerpt: "Maximizing the life of your 300mAh cells. Charging safety, storage voltage, and connector upgrades.",
        author: "BATTERY_TECH",
        date: "2026-01-08",
        readTime: "6 min read",
        tag: "HARDWARE"
    }
];

export default function KnowledgeBasePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <BookOpen className="text-accent-blue" /> KNOWLEDGE_BASE
                    </h1>
                    <p className="text-slate-500 font-mono text-sm uppercase">Advanced technical documentation and flight theory.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="SEARCH_PROTOCOLS..."
                        className="w-full bg-slate-900 border border-accent-blue/20 px-10 py-2 font-mono text-xs focus:outline-none focus:border-accent-amber transition-colors"
                    />
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <AdBanner label="LEADERBOARD_MID" width="728px" height="90px" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {articles.map((article) => (
                        <Link href={`/knowledge-base/${article.slug}`} key={article.slug} className="block group">
                            <TechnicalCard>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 h-32 bg-slate-800 border border-accent-blue/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent" />
                                        <span className="text-[10px] font-mono text-accent-blue/40 uppercase font-bold px-4 text-center">{article.title}</span>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-2 py-0.5 rounded font-mono uppercase tracking-tighter">
                                                {article.tag}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                                                <Clock className="w-3 h-3" /> {article.readTime}
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 group-hover:text-accent-amber transition-colors">
                                            {article.title}
                                        </h2>

                                        <p className="text-slate-400 text-sm font-mono mb-4 leading-relaxed line-clamp-2 uppercase tracking-tight">
                                            {article.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                                                <User className="w-3 h-3" /> BY_{article.author} | {article.date}
                                            </div>
                                            <div className="text-accent-amber text-xs font-mono flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                READ_FULL_FILE <ChevronRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TechnicalCard>
                        </Link>
                    ))}
                </div>

                <aside className="space-y-8">
                    <TechnicalCard title="POPULAR_FILES" subtitle="TRENDING_NOW">
                        <ul className="space-y-4">
                            {articles.map((a, i) => (
                                <li key={i} className="flex gap-3 group border-b border-white/5 pb-3 last:border-0 last:pb-0 cursor-pointer">
                                    <span className="text-accent-blue font-mono font-bold">0{i + 1}.</span>
                                    <div>
                                        <h4 className="text-[10px] font-bold group-hover:text-accent-amber transition-colors uppercase">{a.title}</h4>
                                        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">{a.date}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </TechnicalCard>

                    <AdBanner label="SIDEBAR_BOX" width="300px" height="250px" className="mx-auto" />

                    <TechnicalCard accent="amber" title="SYSTEM_ALERT" subtitle="MAINTENANCE_REQUIRED">
                        <p className="text-[10px] font-mono text-slate-400 uppercase leading-tight mb-4">
                            All build tutorials updated for Betaflight 4.5. Check Bluejay firmware settings for 19.2kHz vs 48kHz ESC compatibility.
                        </p>
                        <TechnicalButton variant="danger" className="w-full text-[10px] py-1">
                            Read FW ChangeLog
                        </TechnicalButton>
                    </TechnicalCard>
                </aside>
            </div>
        </div>
    );
}
