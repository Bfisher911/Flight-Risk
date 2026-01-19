import React from 'react';
import { Shield, Radio, Mountain, Crosshair, X } from 'lucide-react';

interface MissionSelectorProps {
    onSelectMission: (mission: string) => void;
    activeMission: string | null;
}

export const MissionSelector: React.FC<MissionSelectorProps> = ({ onSelectMission, activeMission }) => {
    const missions = [
        {
            id: 'HULL_INTEGRITY',
            label: 'HULL_INTEGRITY_PRIORITY',
            subLabel: 'MISSION PROFILE: HIGH KINETIC',
            description: 'For pilots who plan to impact concrete at 60mph. Filters for maximum durability.',
            icon: <Shield className="w-5 h-5" />,
            color: 'text-accent-amber',
            borderColor: 'border-accent-amber/50',
            bgHover: 'hover:bg-accent-amber/10'
        },
        {
            id: 'RANGE_MAX',
            label: 'RANGE_MAXIMIZATION',
            subLabel: 'MISSION PROFILE: LONG RANGE RECON',
            description: 'Efficiency & endurance. Gear designed to get you to the mountain peak and back.',
            icon: <Mountain className="w-5 h-5" />,
            color: 'text-accent-blue',
            borderColor: 'border-accent-blue/50',
            bgHover: 'hover:bg-accent-blue/10'
        },
        {
            id: 'STEALTH_OPS',
            label: 'STEALTH_OPERATIONS',
            subLabel: 'MISSION PROFILE: COVERT / TRAVEL',
            description: 'Low footprint, high portability. Backpack-ready systems.',
            icon: <Radio className="w-5 h-5" />,
            color: 'text-green-500',
            borderColor: 'border-green-500/50',
            bgHover: 'hover:bg-green-500/10'
        }
    ];

    if (activeMission) {
        const active = missions.find(m => m.id === activeMission);
        return (
            <div className="mb-8 border border-white/10 bg-slate-900/50 p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full border ${active?.borderColor} bg-slate-950`}>
                        {active?.icon}
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Mission Profile</div>
                        <div className={`text-sm font-bold font-mono ${active?.color}`}>{active?.label}</div>
                    </div>
                </div>
                <button
                    onClick={() => onSelectMission('')}
                    className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-accent-blue font-bold tracking-widest uppercase">
                <Crosshair className="w-4 h-4" /> SELECT_MISSION_PROFILE
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {missions.map(mission => (
                    <button
                        key={mission.id}
                        onClick={() => onSelectMission(mission.id)}
                        className={`text-left p-4 border border-white/5 bg-slate-900/40 hover:border-white/20 transition-all group relative overflow-hidden ${mission.bgHover}`}
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className={`w-2 h-2 rounded-full ${mission.color} animate-pulse`} />
                        </div>

                        <div className="mb-3 text-slate-400 group-hover:text-white transition-colors">
                            {mission.icon}
                        </div>

                        <div className={`text-[10px] font-mono opacity-60 mb-1 uppercase tracking-tighter ${mission.color}`}>
                            {mission.subLabel}
                        </div>

                        <div className="font-bold text-sm mb-2 font-mono uppercase text-slate-200">
                            {mission.label}
                        </div>

                        <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
                            {mission.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};
