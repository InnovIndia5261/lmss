import React from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { resetDemoData } from "@/lib/demoData/resetDemo";

const DemoModeBanner = () => {
  if (!DEMO_MODE) return null;

  const handleReset = () => {
    if (window.confirm("Reset all demo data to defaults? This will reload the page.")) {
      resetDemoData();
    }
  };

  return (
    <div className="bg-amber-500/90 text-white text-xs px-2 py-2 flex flex-col gap-2 flex-shrink-0">
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-amber-900/40 font-semibold uppercase tracking-wider w-fit">
        Demo Mode
      </span>
      <button
        onClick={handleReset}
        className="w-full px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-xs font-medium transition-colors text-left"
      >
        Reset Demo Data
      </button>
    </div>
  );
};

export default DemoModeBanner;
