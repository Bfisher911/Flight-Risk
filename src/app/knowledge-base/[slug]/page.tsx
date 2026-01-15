import { getArticleBySlug, getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TechnicalCard } from "@/components/ui/TechnicalCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Calendar, User, Tag, Share2 } from "lucide-react";
import Image from "next/image";
import type { Metadata } from 'next';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = getArticleBySlug(params.slug);
    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | Flight Risk Knowledge Base`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.date,
            authors: [article.author],
            images: [article.image || '/images/og-share.png'],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
        }
    };
}

export default function ArticlePage({ params }: Props) {
    const article = getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Breadcrumbs items={[
                { label: "KNOWLEDGE_BASE", href: "/knowledge-base" },
                { label: article.title }
            ]} />

            <article className="mt-8">
                {/* Header Section */}
                <div className="mb-12 border-b border-accent-blue/10 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-accent-blue/10 text-accent-blue text-xs font-mono px-2 py-1 rounded border border-accent-blue/20">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase">
                            <Calendar className="w-3 h-3" /> {article.date}
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight uppercase">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-white/10">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="text-xs font-mono text-slate-400">
                                <span className="block text-[10px] uppercase text-slate-600">Log_Author</span>
                                {article.author}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <TechnicalCard className="p-8 md:p-12 relative overflow-visible">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-3xl pointer-events-none" />

                    <div className="prose prose-invert prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-slate-200
                        prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-l-4 prose-h2:border-accent-blue prose-h2:pl-4 prose-h3:text-xl
                        prose-p:text-slate-400 prose-p:leading-relaxed prose-p:mb-6
                        prose-a:text-accent-blue prose-a:no-underline prose-a:border-b prose-a:border-accent-blue/30 hover:prose-a:border-accent-blue transition-colors
                        prose-strong:text-white prose-strong:font-bold
                        prose-blockquote:border-l-accent-amber prose-blockquote:bg-accent-amber/5 prose-blockquote:text-accent-amber prose-blockquote:not-italic prose-blockquote:px-6 prose-blockquote:py-2
                        prose-li:text-slate-400
                        prose-img:rounded-lg prose-img:border prose-img:border-white/10
                    ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {article.content}
                        </ReactMarkdown>
                    </div>

                    {/* Footer Tags */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-2">
                        {article.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-xs font-mono text-slate-500 bg-slate-900 border border-white/5 px-2 py-1 uppercase">
                                <Tag className="w-3 h-3" /> {tag}
                            </span>
                        ))}
                    </div>
                </TechnicalCard>
            </article>
        </div>
    );
}
