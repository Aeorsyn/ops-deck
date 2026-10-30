import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('both'); // 'sats', 'fleet', 'both'
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Satellite Keplerian Orbital Tracks (Simulated SGP4 State Vectors)
  const satellites = [
    { id: 'USA-224', name: 'USA-224 (KH-11 Optical Recon)', inc: 97.9, alt: '280 km', vel: '7.74 km/s', period: 90.3, phase: 0.12, color: '#38bdf8' },
    { id: 'ISS', name: 'ISS (ZARYA / Modular)', inc: 51.6, alt: '418 km', vel: '7.66 km/s', period: 92.8, phase: 0.65, color: '#00ffaa' },
    { id: 'COSMOS-2558', name: 'COSMOS-2558 (Inspector)', inc: 97.4, alt: '445 km', vel: '7.64 km/s', period: 93.4, phase: 0.88, color: '#a855f7' },
    { id: 'STARLINK-G9', name: 'Starlink Gen2 Mesh Train', inc: 53.2, alt: '530 km', vel: '7.60 km/s', period: 95.2, phase: 0.38, color: '#3b82f6' }
  ];

  // Carrier Strike Groups (CSGs) & Surface Action Groups
  const fleets = [
    { id: 'CSG-12', name: 'USS Gerald R. Ford (CVN-78)', lat: 34.2, lon: 26.5, region: 'Eastern Mediterranean', escorts: 5, alert: 'DEFCON 3', airwing: 'CVW-8 (78 Aircraft)' },
    { id: 'CSG-2', name: 'USS Dwight D. Eisenhower (CVN-69)', lat: 14.8, lon: 52.4, region: 'Red Sea / Gulf of Aden', escorts: 4, alert: 'COMBAT_ACTIVE', airwing: 'CVW-3 (72 Aircraft)' },
    { id: 'CSG-5', name: 'USS Ronald Reagan (CVN-76)', lat: 31.8, lon: 135.2, region: 'Philippine Sea / WestPac', escorts: 6, alert: 'PATROL_ROUTINE', airwing: 'CVW-5 (68 Aircraft)' },
    { id: 'R08', name: 'HMS Queen Elizabeth (CSG-UK)', lat: 58.1, lon: -4.2, region: 'North Atlantic / GIUK Gap', escorts: 3, alert: 'EXERCISE_ACTIVE', airwing: '809 NAS (F-35B)' },
    { id: 'PLAN-18', name: 'Fujian (Type 003 CATOBAR)', lat: 24.5, lon: 119.8, region: 'Taiwan Strait / East China Sea', escorts: 4, alert: 'SEA_TRIALS', airwing: 'J-35 / J-15T Wing' }
  ];

  // Equirectangular projection
  const toCanvas = (lat, lon, w, h) => {
    const x = ((lon + 180) / 360) * w;
    const y = ((90 - lat) / 180) * h;
    return { x, y };
  };

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = canvas.width = canvas.clientWidth;
      const h = canvas.height = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      // Deep matrix grid styling
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // Latitude lines (Equator + Tropics)
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.9)';
      const eq = toCanvas(0, 0, w, h).y;
      ctx.beginPath(); ctx.moveTo(0, eq); ctx.lineTo(w, eq); ctx.stroke();

      // Render Keplerian Satellite Ground Tracks (GPpredict sine arcs)
      if (activeTab === 'sats' || activeTab === 'both') {
        const tSec = (currentTime / 1000) * 0.05;

        satellites.forEach(sat => {
          ctx.strokeStyle = sat.color;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();

          let currentPos = null;
          const shiftLon = (sat.phase * 360 + tSec * 15) % 360;

          for (let deg = -180; deg <= 180; deg += 3) {
            const lat = sat.inc * Math.sin(((deg + shiftLon) * Math.PI) / 180);
            const pt = toCanvas(lat, deg, w, h);
            if (deg === -180) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);

            // Satellite live position
            if (Math.abs(deg - ((shiftLon % 360) - 180)) < 2) {
              currentPos = pt;
            }
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Satellite node & sensor coverage footprint
          if (currentPos) {
            // Sensor footprint circle
            ctx.fillStyle = `${sat.color}18`;
            ctx.strokeStyle = `${sat.color}66`;
            ctx.beginPath();
            ctx.arc(currentPos.x, currentPos.y, 35, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Sat marker
            ctx.fillStyle = sat.color;
            ctx.beginPath();
            ctx.arc(currentPos.x, currentPos.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Solar panel wings
            ctx.strokeStyle = sat.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(currentPos.x - 8, currentPos.y); ctx.lineTo(currentPos.x + 8, currentPos.y);
            ctx.stroke();

            // Label
            ctx.font = '9px monospace';
            ctx.fillText(sat.id, currentPos.x + 10, currentPos.y - 6);
          }
        });
      }

      // Render Naval Carrier Strike Groups
      if (activeTab === 'fleet' || activeTab === 'both') {
        fleets.forEach(fleet => {
          const pt = toCanvas(fleet.lat, fleet.lon, w, h);

          // Radar exclusion zone
          ctx.strokeStyle = fleet.alert === 'COMBAT_ACTIVE' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 255, 170, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 24, 0, Math.PI * 2);
          ctx.stroke();

          // Carrier chevron marker
          ctx.fillStyle = fleet.alert === 'COMBAT_ACTIVE' ? '#ef4444' : '#00ffaa';
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y - 7);
          ctx.lineTo(pt.x + 5, pt.y + 6);
          ctx.lineTo(pt.x, pt.y + 3);
          ctx.lineTo(pt.x - 5, pt.y + 6);
          ctx.closePath();
          ctx.fill();

          // Fleet ID Tag
          ctx.font = '10px monospace';
          ctx.fillText(`⚓ ${fleet.id}`, pt.x + 9, pt.y + 3);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, currentTime]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none p-3 md:p-6 overflow-x-hidden">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-3 backdrop-blur shadow-2xl gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
              DOM_AWARENESS // AEROSPACE & MARITIME TELEMETRY
            </span>
          </div>
          <h1 className="text-lg md:text-2xl font-black text-white font-mono mt-0.5">
            ORBITAL RECON (GPREDICT) & GLOBAL CARRIER FLEET MATRIX
          </h1>
        </div>

        {/* Layer Filter Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button 
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1 rounded transition ${activeTab === 'both' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}>
            Dual Grid
          </button>
          <button 
            onClick={() => setActiveTab('sats')}
            className={`px-3 py-1 rounded transition ${activeTab === 'sats' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}>
            Satellites
          </button>
          <button 
            onClick={() => setActiveTab('fleet')}
            className={`px-3 py-1 rounded transition ${activeTab === 'fleet' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}>
            Carrier Strike Groups
          </button>
        </div>
      </header>

      {/* Main Vector Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* World Tracking Canvas (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col min-h-[400px] md:min-h-[520px] shadow-2xl">
          <div className="absolute top-3 left-3 z-10 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl text-[10px] font-mono text-cyan-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            REALTIME EQUATORIAL PROJECTION // SGP4 KEPLER ENGINE ACTIVE
          </div>

          <canvas ref={canvasRef} className="w-full flex-1 block" />
        </div>

        {/* Detailed Feed Sidebar */}
        <div className="flex flex-col gap-3">
          
          {/* Active Fleets Feed */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold block mb-2.5">
              DEPLOYED CARRIER STRIKE GROUPS (CSG)
            </span>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {fleets.map(f => (
                <div 
                  key={f.id} 
                  onClick={() => setSelectedEntity(f)}
                  className="bg-slate-950 border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer rounded-xl p-2.5 text-xs font-mono transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-emerald-300 font-bold">{f.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                      f.alert === 'COMBAT_ACTIVE' ? 'bg-red-950/80 border-red-800 text-red-300' : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    }`}>
                      {f.alert}
                    </span>
                  </div>
                  <div className="text-[11px] text-white font-sans">{f.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>{f.region}</span>
                    <span>{f.escorts} Escorts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Recon Satellites Feed */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold block mb-2.5">
              ORBITAL PASS PREDICTIONS (GPREDICT FEED)
            </span>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {satellites.map(s => (
                <div key={s.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-300 font-bold">{s.id}</span>
                    <span className="text-[9px] text-slate-400">{s.period} min orbit</span>
                  </div>
                  <div className="text-[11px] text-white font-sans truncate">{s.name}</div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-900">
                    <div>ALT: <span className="text-slate-200">{s.alt}</span></div>
                    <div>VEL: <span className="text-slate-200">{s.vel}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
