import React from 'react';
import { Cpu, Terminal, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="mt-20 border-t border-accent-blue/20 bg-slate-950/80 pt-10 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu className="text-accent-amber w-6 h-6" />
                            <span className="text-lg font-bold tracking-tighter uppercase font-mono">
                                FLIGHT<span className="text-accent-amber">RISK</span>
                            </span>
                        </div>
                        <p className="text-slate-400 font-mono text-sm max-w-md uppercase tracking-tight">
                            A high-performance engineering hub for 1S micro whoop pilots. Hardcore specs. Zero fluff. Stay airborne.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-mono text-accent-blue text-sm mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> [PROTOCOLS]
                        </h4>
                        <ul className="space-y-2 text-xs font-mono text-slate-500 uppercase">
                            <li><a href="#" className="hover:text-accent-amber transition-colors">Privacy_Policy</a></li>
                            <li><a href="#" className="hover:text-accent-amber transition-colors">Affiliate_Disclaimer</a></li>
                            <li><a href="#" className="hover:text-accent-amber transition-colors">Command_Terms</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-accent-blue text-sm mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> [SECURITY]
                        </h4>
                        <div className="border border-green-500/20 bg-green-500/5 p-3 rounded">
                            <div className="text-[10px] font-mono text-green-500/60 uppercase">System_Encrypted</div>
                            <div className="h-1 w-full bg-green-500/10 mt-1">
                                <div className="h-full bg-green-500 w-3/4 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-accent-blue/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        © 2026 FLIGHT_RISK_OS v1.0.4 | ALL_RIGHTS_RESERVED
                    </div>
                    <div className="flex gap-4 text-accent-blue/40 text-[10px] font-mono italic">
                        <span>TX_STRENGTH: 85dBm</span>
                        <span>LATENCY: 4.2ms</span>
                        <span>OSD: ACTIVE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
