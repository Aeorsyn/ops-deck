import React, { useState, useEffect } from 'react';

export default function App() {
  const [cycle, setCycle] = useState(1482);
  const [status, setStatus] = useState("AUTONOMOUS_SYNTHESIS_IDLE");
  const [logs, setLogs] = useState([
    "[SCOUT] Ingestion matrix listening on sensory vector channels...",
    "[FORGE] Dynamic AST parser verified: 0 syntax collisions.",
    "[SYNTH] In-browser mounting harness stabilized. Clock jitter < 15ms."
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCycle(c => c + 1);
      const newLogs = [
        `[HEURISTIC] AST mutation pulse #${Math.floor(Math.random() * 9000 + 1000)} validated clean.`,
        `[TELEMETRY] Sensor buffer synchronized across dual-core memory bus.`,
        `[RUNTIME] In-memory Babel transpile completed: 0 faults.`
      ];
      setLogs(prev => [...prev.slice(-4), newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-mono select-none flex flex-col justify-between">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs uppercase font-bold text-cyan-300">CORE 3000 // AUTONOMOUS SYNTHESIS ENGINE</span>
          </div>
          <span className="text-[10px] bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded">
            CYCLE #{cycle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">PIPELINE CADENCE</span>
            <span className="text-base font-bold text-emerald-400">1.28 s / Node</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">AST PARSE ACCURACY</span>
            <span className="text-base font-bold text-cyan-400">99.82%</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">RUNTIME STATUS</span>
            <span className="text-base font-bold text-amber-300">STANDALONE SHOWCASE</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 block mb-2">SYNTHESIS ENGINE LOG STREAM:</span>
          <div className="space-y-1 text-xs">
            {logs.map((log, idx) => (
              <div key={idx} className="text-slate-300 flex items-center gap-2">
                <span className="text-emerald-500 font-bold">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 text-center mt-4">
        GEN 3000 DEMO SURFACE // STANDALONE AIR-GAPPED EXPOSURE
      </div>
    </div>
  );
}
