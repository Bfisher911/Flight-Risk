import React from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black">
            <div className="container mx-auto px-4 py-16 max-w-3xl">

                {/* Header Block */}
                <div className="border-b border-white/20 pb-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-sm md:text-base tracking-widest mb-1">SYSTEM IDENTITY: FLIGHT RISK</h1>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">
                                OPERATOR: BLAINE FISHER <span className="mx-2">|</span> STATUS: ACTIVE <span className="mx-2">|</span> CLEARANCE: UNRESTRICTED
                            </div>
                        </div>
                        <Terminal className="w-6 h-6 text-white/40" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-12 text-sm md:text-base leading-relaxed text-zinc-300 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">

                    <section>
                        <h2 className="text-white font-bold mb-4 uppercase tracking-wider text-xs border-l-2 border-white pl-4">The Signal and the Noise</h2>
                        <p className="mb-4">
                            The modern FPV market is not a store; it is a landfill of incompatible parts. There are ten thousand motors, five hundred flight controllers, and three different video standards that refuse to talk to each other. If you are new here, the noise is deafening. You don’t need more choices. You need the right choice.
                        </p>
                        <p className="mb-4">
                            That is why this system exists.
                        </p>
                        <p className="text-white border border-white/20 bg-white/5 p-4 inline-block">
                            I am not a warehouse. I am a filter.
                        </p>
                        <p className="mt-4">
                            The giants of this industry—the mega-retailers—operate like vending machines. They will sell you anything you touch, regardless of whether it flies or catches fire on the bench. They have logistics; I have a soldering iron and a graveyard of broken carbon fiber.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold mb-4 uppercase tracking-wider text-xs border-l-2 border-white pl-4">Why "Flight Risk"?</h2>
                        <p className="mb-4">
                            Because in this hobby, gravity is the only law that is actually enforced.
                        </p>
                        <p className="mb-4">
                            You are going to crash. You are going to solder a wire backward and watch a hundred dollars turn into blue smoke. You are going to lose a drone in a tree that is too tall to climb. This is the nature of the beast. We do not hide from the risk; we manage it.
                        </p>
                        <p>
                            Every piece of hardware in this catalog has been assessed for survivability. If a frame breaks every time it touches concrete, you won't find it here. If a VTX overheats while sitting on the launch pad, I will tell you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold mb-4 uppercase tracking-wider text-xs border-l-2 border-white pl-4">The Trade</h2>
                        <p className="mb-4">
                            Transparency is the only currency that matters.
                        </p>
                        <p className="mb-4">
                            This is an affiliate operation. When you click a link here and buy the gear, the big warehouses send a small commission back to this terminal. It costs you nothing, but it keeps the lights on and the soldering station hot.
                        </p>
                        <p className="mb-4">
                            You could go directly to them. You could bypass this system entirely. But here is the trade:
                        </p>
                        <ul className="space-y-4 my-8 pl-4 border-l border-white/10">
                            <li className="opacity-50">They give you a product page.</li>
                            <li className="text-white font-bold">I give you the truth about whether that product is actually worth the plastic it’s wrapped in.</li>
                        </ul>
                        <p>
                            Use the intel. Click the links. Keep the system online.
                        </p>
                    </section>

                    <div className="pt-12 border-t border-white/20 mt-16 flex items-center gap-4 opacity-50">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="text-xs tracking-widest uppercase">End Log</div>
                    </div>

                </div>
            </div>
        </div>
    );
}
