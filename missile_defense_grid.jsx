import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ lon: 0, lat: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [defcon, setDefcon] = useState(2);
  const [interceptActive, setInterceptActive] = useState(false);
  const [interceptSuccess, setInterceptSuccess] = useState(false);

  // Ballistic Trajectory State
  const [threats, setThreats] = useState([
    {
      id: "T-904",
      origin: { name: "Barents Sea SLBM", lat: 71.0, lon: 38.0 },
      target: { name: "NORAD Cheyenne Mtn", lat: 38.7, lon: -104.8 },
      progress: 0.42,
      speed: "Mach 19.4",
      apogee: "1,240 km",
      status: "BOOST_PHASE_COMPLETE",
      tti: 384
    },
    {
      id: "T-905",
      origin: { name: "Okhotsk Sub Platform", lat: 53.0, lon: 150.0 },
      target: { name: "Pentagon / DC", lat: 38.8, lon: -77.0 },
      progress: 0.28,
      speed: "Mach 22.1",
      apogee: "1,410 km",
      status: "MIDCOURSE_GLIDE",
      tti: 512
    }
  ]);

  // Audio cue via Web Audio
  const playAlertSound = (freq = 880, duration = 0.15) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  };

  // Convert Spherical Lat/Lon to Canvas 2D Projected Coordinates
  const project = (lat, lon, centerLat, centerLon, radius, cx, cy) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = (lon * Math.PI) / 180;
    const phi0 = (centerLat * Math.PI) / 180;
    const lambda0 = (centerLon * Math.PI) / 180;

    const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);
    if (cosC < 0) return null; // Behind globe horizon

    const k = 1;
    const x = cx + radius * k * Math.cos(phi) * Math.sin(lambda - lambda0);
    const y = cy - radius * k * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0));
    return { x, y, visible: cosC >= 0 };
  };

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = canvas.width = canvas.clientWidth;
      const h = canvas.height = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;

      ctx.clearRect(0, 0, w, h);

      // Deep space background grid
      ctx.strokeStyle = "rgba(15, 23, 42, 0.6)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Globe Base Halo
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.05);
      grad.addColorStop(0, "rgba(2, 6, 23, 0.95)");
      grad.addColorStop(0.85, "rgba(8, 47, 73, 0.4)");
      grad.addColorStop(1, "rgba(56, 189, 248, 0.15)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude / Longitude Graticules
      ctx.lineWidth = 0.75;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.strokeStyle = "rgba(30, 41, 59, 0.8)";
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lat, lon, rotation.lat, rotation.lon, radius, cx, cy);
          if (pt) {
            if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
            else ctx.lineTo(pt.x, pt.y);
          } else { first = true; }
        }
        ctx.stroke();
      }

      for (let lon = -180; lon < 180; lon += 30) {
        ctx.strokeStyle = "rgba(30, 41, 59, 0.8)";
        ctx.beginPath();
        let first = true;
        for (let lat = -85; lat <= 85; lat += 5) {
          const pt = project(lat, lon, rotation.lat, rotation.lon, radius, cx, cy);
          if (pt) {
            if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
            else ctx.lineTo(pt.x, pt.y);
          } else { first = true; }
        }
        ctx.stroke();
      }

      // Render Trajectories and Impact Arcs
      threats.forEach((threat) => {
        const startPt = project(threat.origin.lat, threat.origin.lon, rotation.lat, rotation.lon, radius, cx, cy);
        const endPt = project(threat.target.lat, threat.target.lon, rotation.lat, rotation.lon, radius, cx, cy);

        // Draw Great-Circle ballistic arc
        ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        let first = true;
        let headPos = null;

        for (let t = 0; t <= 1; t += 0.02) {
          // Linear interpolation in lat/lon with parabolic altitude bulge
          const curLat = threat.origin.lat + (threat.target.lat - threat.origin.lat) * t;
          const curLon = threat.origin.lon + (threat.target.lon - threat.origin.lon) * t;
          const altBoost = Math.sin(t * Math.PI) * 35; // Exo-atmospheric apogee

          const pt = project(curLat, curLon, rotation.lat, rotation.lon, radius + altBoost, cx, cy);
          if (pt) {
            if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
            else ctx.lineTo(pt.x, pt.y);
            if (Math.abs(t - threat.progress) < 0.02) headPos = pt;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Warhead Warping Head
        if (headPos) {
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(headPos.x, headPos.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
          ctx.beginPath();
          ctx.arc(headPos.x, headPos.y, 8, 0, Math.PI * 2);
          ctx.stroke();

          // Threat Vector Tag
          ctx.fillStyle = "#fca5a5";
          ctx.font = "10px monospace";
          ctx.fillText(`▲ ${threat.id} [${threat.speed}]`, headPos.x + 12, headPos.y - 4);
        }

        // Target Reticle
        if (endPt) {
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(endPt.x, endPt.y, 6, 0, Math.PI * 2);
          ctx.moveTo(endPt.x - 9, endPt.y); ctx.lineTo(endPt.x + 9, endPt.y);
          ctx.moveTo(endPt.x, endPt.y - 9); ctx.lineTo(endPt.x, endPt.y + 9);
          ctx.stroke();
          ctx.fillStyle = "#7dd3fc";
          ctx.font = "9px monospace";
          ctx.fillText(threat.target.name, endPt.x + 10, endPt.y + 12);
        }

        // Interceptor Arc (If active)
        if (interceptActive && endPt && headPos) {
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(endPt.x, endPt.y);
          ctx.lineTo(headPos.x + (endPt.x - headPos.x) * 0.4, headPos.y + (endPt.y - headPos.y) * 0.4);
          ctx.stroke();
        }
      });

      // Auto-rotation when not dragging
      if (!isDragging) {
        setRotation(r => ({ ...r, lon: (r.lon + 0.15) % 360 }));
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [rotation, isDragging, threats, interceptActive]);

  // Mouse / Touch Drag Handlers
  const onPointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    setDragStart({ x: clientX, y: clientY });
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    setRotation(r => ({
      lon: (r.lon + dx * 0.4) % 360,
      lat: Math.max(-80, Math.min(80, r.lat - dy * 0.4))
    }));
    setDragStart({ x: clientX, y: clientY });
  };

  const onPointerUp = () => setIsDragging(false);

  // Trigger Kinetic Interceptor
  const handleIntercept = () => {
    playAlertSound(1200, 0.2);
    setInterceptActive(true);
    setTimeout(() => {
      setInterceptSuccess(true);
      playAlertSound(440, 0.4);
      setThreats(prev => prev.map(t => ({ ...t, status: "INTERCEPTED_EXO_ATMOSPHERE", speed: "0 km/h" })));
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden p-3 md:p-6">
      
      {/* Top Banner / Defcon Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 backdrop-blur shadow-2xl gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase font-bold">NORAD STRATCOM // SPACE TRACK NODE</span>
          </div>
          <h1 className="text-lg md:text-2xl font-black tracking-wide text-white font-mono mt-0.5">
            GLOBAL BALLISTIC EARLY WARNING & INTERCEPT MATRIX
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className={`px-3 py-1 rounded font-bold ${defcon === 1 ? 'bg-red-600 text-white animate-pulse' : 'bg-red-950/60 text-red-400'}`}>DEFCON 1</span>
            <span className={`px-3 py-1 rounded font-bold ${defcon === 2 ? 'bg-amber-600 text-white' : 'text-slate-500'}`}>DEFCON 2</span>
          </div>
          <button 
            onClick={handleIntercept}
            disabled={interceptActive}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition shadow-lg flex items-center gap-2 ${
              interceptActive 
                ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' 
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60 active:scale-95'
            }`}>
            {interceptActive ? '⚡ KKV INTERCEPTORS EN ROUTE' : '🚀 LAUNCH GMD INTERCEPTORS'}
          </button>
        </div>
      </header>

      {/* Main Grid: Interactive Radar Globe + Tactical Feed */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Radar Globe Viewport (2 Cols on desktop) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col min-h-[420px] md:min-h-[540px] shadow-2xl">
          <div className="absolute top-3 left-3 z-10 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-cyan-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            DRAG TO ROTATE VECTOR GLOBE [LAT: {rotation.lat.toFixed(1)}° | LON: {rotation.lon.toFixed(1)}°]
          </div>

          {interceptSuccess && (
            <div className="absolute top-3 right-3 z-10 bg-emerald-950/90 border border-emerald-500/50 px-4 py-2 rounded-xl text-xs font-mono text-emerald-300 font-bold flex items-center gap-2 animate-bounce">
              <span>✓</span> KINETIC KILL VEHICLE IMPACT CONFIRMED (EXO-ATMOSPHERIC PURGE)
            </div>
          )}

          <canvas 
            ref={canvasRef}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
            className="w-full flex-1 cursor-grab active:cursor-grabbing block"
          />
        </div>

        {/* Threat Telemetry Deck */}
        <div className="flex flex-col gap-3">
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-3 font-bold">
              TRACKED INBOUND CONTACTS (ACTIVE ARCS)
            </span>

            <div className="space-y-2.5">
              {threats.map((t) => (
                <div key={t.id} className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 text-xs font-mono relative overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-red-400 font-bold">{t.id} // {t.origin.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">Target: <span className="text-cyan-300">{t.target.name}</span></div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px]">
                    <div>VELOCITY: <span className="text-white font-bold">{t.speed}</span></div>
                    <div>APOGEE: <span className="text-white font-bold">{t.apogee}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Status Dials */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">SBIRS Satellite Lock</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-2">100%</span>
              <span className="text-[9px] font-mono text-slate-500 mt-1">Constellation synced</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Phased Array SNR</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-2">+34.8 dB</span>
              <span className="text-[9px] font-mono text-slate-500 mt-1">C-Band Clear</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
