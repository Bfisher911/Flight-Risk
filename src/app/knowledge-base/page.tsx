import { getAllArticles } from "@/lib/articles";
import { TechnicalCard } from "@/components/ui/TechnicalCard";
import { TechnicalButton } from "@/components/ui/TechnicalButton";
import Link from "next/link";
import { BookOpen, Calendar, Tag, ChevronRight, Hash } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Knowledge Base | Flight Risk",
    description: "Technical mission logs, build guides, and FPV drone tutorials.",
};

export default function KnowledgeBaseIndex() {
    const articles = getAllArticles();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-accent-blue/10 pb-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter uppercase flex items-center gap-4">
                        <BookOpen className="text-accent-blue animate-pulse" /> KNOWLEDGE_BASE
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase">
                        <span>ARCHIVED_LOGS: {articles.length}</span>
                        <span className="opacity-20">//</span>
                        <span>CLEARANCE: LEVEL_1</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <Link href={`/knowledge-base/${article.slug}`} key={article.slug} className="group">
                        <TechnicalCard className="h-full flex flex-col hover:border-accent-blue/40 transition-all">
                            {/* Image Placeholder or Actual Image */}
                            <div className="aspect-video relative bg-slate-900 border-b border-white/5 mb-4 overflow-hidden">
                                <div className="absolute inset-0 bg-accent-blue/5 group-hover:bg-accent-blue/10 transition-colors" />
                                {article.image ? (
                                    // In a real app, you'd use valid images. For now, we fallback to a tech pattern if image fails or just show the pattern
                                    <div className="absolute inset-0 flex items-center justify-center text-accent-blue/20 font-mono text-4xl font-bold uppercase rotate-12 select-none">
                                        FLIGHT_LOG
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-accent-blue/20">
                                        <Hash className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur px-2 py-1 text-[10px] font-mono border border-accent-blue/20 text-accent-blue uppercase">
                                    {article.category}
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h2 className="text-xl font-bold mb-3 uppercase leading-tight group-hover:text-accent-blue transition-colors">
                                    {article.title}
                                </h2>
                                <p className="text-slate-400 font-mono text-xs leading-relaxed line-clamp-3 mb-4">
                                    {article.excerpt}
                                </p>
                            </div>

                            <div className="mt-auto border-t border-white/5 pt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
                                    <Calendar className="w-3 h-3" />
                                    {article.date}
                                </div>
                                <TechnicalButton variant="secondary" className="px-2 py-1 text-[10px]">
                                    ACCESS_LOG <ChevronRight className="w-3 h-3 ml-1" />
                                </TechnicalButton>
                            </div>
                        </TechnicalCard>
                    </Link>
                ))}
            </div>
        </div>
    );
}
