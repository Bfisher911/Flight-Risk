import { AdBanner } from "@/components/ads/AdBanner";
import { TechnicalButton } from "@/components/ui/TechnicalButton";
import { TechnicalCard } from "@/components/ui/TechnicalCard";
import { Activity, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import productsData from "@/data/products.json";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const trendingParts = productsData.products.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Ad Space */}
      <div className="flex justify-center mb-12">
        <AdBanner label="LEADERBOARD_TOP" width="728px" height="90px" />
      </div>

      {/* Hero Section */}
      <section className="relative mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent-amber/30 bg-accent-amber/5 mb-6">
              <Activity className="w-4 h-4 text-accent-amber" />
              <span className="text-[10px] font-mono text-accent-amber uppercase tracking-widest">System_Ready // Flight_Risk_Authorized</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-none">
              PUSH THE <br />
              <span className="text-accent-amber">LIMITS</span> OF <br />
              MICRO FPV
            </h1>

            <p className="text-slate-400 font-mono mb-10 max-w-lg leading-relaxed">
              Precision engineering for 65mm and 75mm brushless whoops. Configurator, tutorials, and field-tested components.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/part-picker">
                <TechnicalButton icon={<Zap />} className="px-8 py-4 text-lg">
                  Start Your First Build
                </TechnicalButton>
              </Link>
              <Link href="/knowledge-base">
                <TechnicalButton variant="secondary" icon={<Target />}>
                  View Tutorials
                </TechnicalButton>
              </Link>
            </div>
          </div>

          <div className="relative">
            <TechnicalCard accent="amber" className="h-[400px] flex items-center justify-center border-dashed">
              <div className="text-center relative z-20">
                <div className="relative inline-block scale-125 md:scale-150">
                  {/* Outer Tech Ring */}
                  <div className="w-48 h-48 border-2 border-accent-amber/40 rounded-full animate-[spin_15s_linear_infinite] flex items-center justify-center">
                    <div className="absolute inset-0 border-t-4 border-accent-amber rounded-full" />
                  </div>

                  {/* Mid Ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-accent-amber/20 rounded-full animate-[spin_10s_linear_infinite_reverse] flex items-center justify-center border-dashed">
                    <div className="absolute inset-0 border-l-2 border-accent-amber/60 rounded-full" />
                  </div>

                  {/* Inner Ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-accent-amber/30 rounded-full animate-[spin_5s_linear_infinite] flex items-center justify-center">
                    <div className="w-16 h-16 border border-accent-amber/50 rounded-full border-dotted" />
                  </div>

                  <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-accent-amber animate-shimmer" />

                  {/* HUD Data Markers */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[8px] text-accent-amber uppercase tracking-widest bg-slate-950 px-2 border border-accent-amber/20">ALT_READY</div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[8px] text-accent-amber uppercase tracking-widest bg-slate-950 px-2 border border-accent-amber/20">SIG_LOCK</div>
                  <div className="absolute top-1/2 -left-12 -translate-y-1/2 font-mono text-[8px] text-accent-amber/40 rotate-90 uppercase">NAV_v4.2</div>
                  <div className="absolute top-1/2 -right-12 -translate-y-1/2 font-mono text-[8px] text-accent-amber/40 -rotate-90 uppercase">WP_ACTIVE</div>
                </div>
                <div className="mt-16 font-mono text-[10px] text-accent-amber animate-pulse tracking-[0.3em] font-bold">
                  [ SCANNING_FOR_TARGET_BUILD ]
                </div>
              </div>

              {/* Decorative Corner Text */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-accent-amber/40 uppercase leading-tight">
                X: 47.112<br />
                Y: 19.458
              </div>
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-accent-amber/40 uppercase leading-tight">
                LAT: 40.7128 N<br />
                LON: 74.0060 W
              </div>
              <div className="absolute top-4 right-4 font-mono text-[9px] text-accent-amber/40 uppercase text-right leading-tight">
                HDG: 284°<br />
                SPD: 0.00 M/S
              </div>
            </TechnicalCard>

            {/* HUD Decorative overlays */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-accent-blue/40 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-accent-blue/40 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Categorical Index Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8 border-b border-accent-blue/10 pb-4">
          <Target className="w-5 h-5 text-accent-blue" />
          <h2 className="text-2xl font-bold font-mono tracking-[0.2em] uppercase">SYSTEM_INDEX // CATEGORIES</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Frames", icon: <Target />, count: "12 Systems", link: "/shop?category=Frame" },
            { name: "Electronics", icon: <Zap />, count: "24 Systems", link: "/shop?category=Flight%20Controllers" },
            { name: "Propulsion", icon: <TrendingUp />, count: "18 Systems", link: "/shop?category=Motors" },
            { name: "Optics", icon: <Target />, count: "10 Systems", link: "/shop?category=Camera" }
          ].map((cat, i) => (
            <Link href={cat.link} key={i}>
              <TechnicalCard className="group hover:bg-accent-blue/5 transition-all cursor-pointer h-full">
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-12 h-12 rounded-full border border-accent-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-accent-blue transition-all">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-xs font-mono uppercase tracking-widest mb-1">{cat.name}</h3>
                  <div className="text-[9px] font-mono text-slate-500 uppercase">{cat.count}</div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3 h-3 text-accent-blue" />
                  </div>
                </div>
              </TechnicalCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Parts grid */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8 border-b border-accent-blue/10 pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp className="text-accent-blue" /> Trending_Parts
          </h2>
          <Link href="/part-picker" className="text-xs font-mono text-accent-blue hover:text-accent-amber transition-colors flex items-center gap-1">
            Browse_All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingParts.map((product: any) => (
            <TechnicalCard key={product.id} title={product.category} subtitle={`ID: ${product.id}`}>
              <div className="aspect-video relative mb-4 flex items-center justify-center overflow-hidden border border-accent-blue/10 bg-slate-800/50">
                {product.imageUrl && product.imageUrl.endsWith('.png') ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="text-accent-blue/20 rotate-12 font-mono font-bold text-2xl uppercase select-none p-4 text-center">
                    {product.name}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-4 h-8 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-accent-amber font-mono font-bold">${product.price.toFixed(2)}</span>
                <a href={product.amazonLink} target="_blank" rel="noopener noreferrer">
                  <TechnicalButton variant="secondary" className="px-3 py-1 text-[10px]">
                    Check Price
                  </TechnicalButton>
                </a>
              </div>
            </TechnicalCard>
          ))}
        </div>
      </section>
    </div>
  );
}

function Crosshair(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  );
}
