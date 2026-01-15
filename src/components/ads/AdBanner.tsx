import React from 'react';

interface AdBannerProps {
  label: string;
  width: string;
  height: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ label, width, height, className = "" }) => {
  return (
    <div 
      className={`relative border border-dashed border-accent-blue/30 bg-accent-blue/5 flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div className="absolute top-0 left-0 p-1 text-[10px] font-mono text-accent-blue/50 uppercase tracking-tighter">
        AD_UNIT_PLACEHOLDER
      </div>
      <div className="text-center">
        <div className="text-accent-blue/40 font-mono text-sm uppercase">{label}</div>
        <div className="text-accent-blue/20 font-mono text-xs italic">{width} x {height}</div>
      </div>
      {/* HUD decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-blue/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-blue/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-blue/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-blue/40" />
    </div>
  );
};
