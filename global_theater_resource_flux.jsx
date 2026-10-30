import React, { useState, useEffect, useMemo } from 'react';

export default function App() {
  const [activeDomain, setActiveDomain] = useState('theater'); // 'theater', 'resources', 'macro'
  const [selectedNation, setSelectedNation] = useState('ALL');
  const [selectedTheater, setSelectedTheater] = useState('ALL');
  const [tick, setTick] = useState(0);

  // Periodic ticker for live price flux and troop telemetry
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(timer);
  }, []);

  // 1. Ground Troop Deployments & Maneuver Units
  const groundDeployments = [
    {
      id: "TF-NORTH",
      nation: "NATO / USA",
      theater: "Eastern European Flank",
      unit: "V Corps (Forward) // 1st Cav Div Elements",
      strength: "18,400 Personnel",
      armor: "240x M1A2 SEPv3 // 160x Bradley M2A4",
      posture: "MANEUVER_READINESS",
      grid: "53.89°N, 22.98°E (Suwalki Gap)",
      status: "DEFCON_READY"
    },
    {
      id: "RU-WVO",
      nation: "Russian Federation",
      theater: "Eastern European Flank",
      unit: "1st Guards Tank Army // 20th Combined Arms",
      strength: "42,000 Personnel",
      armor: "410x T-90M/T-80BVM // 580x BMP-3",
      posture: "FORTIFIED_ASSAULT",
      grid: "48.37°N, 37.80°E (Donbas Axis)",
      status: "COMBAT_ACTIVE"
    },
    {
      id: "IDF-NORTH",
      nation: "Israel",
      theater: "Middle East / Levant",
      unit: "Northern Command // 36th Armored Division",
      strength: "22,500 Personnel",
      armor: "180x Merkava Mk4 Barak // 220x Namer APC",
      posture: "SCREENING_OPERATIONS",
      grid: "33.27°N, 35.58°E (Blue Line)",
      status: "COMBAT_ACTIVE"
    },
    {
      id: "PLA-ETC",
      nation: "China",
      theater: "Indo-Pacific / Taiwan Strait",
      unit: "73rd Group Army (Amphibious Combined Arms)",
      strength: "54,000 Personnel",
      armor: "310x Type 05 Amphibious // Type 99A MBT",
      posture: "STAGING_EXERCISE",
      grid: "24.47°N, 118.08°E (Xiamen Coastal)",
      status: "HIGH_ALERT"
    },
    {
      id: "ROK-7TH",
      nation: "South Korea",
      theater: "Korean Peninsula",
      unit: "7th Mobile Corps (Strategic Maneuver)",
      strength: "31,000 Personnel",
      armor: "280x K2 Black Panther // 200x K21 IFV",
      posture: "INTERDICTION_READY",
      grid: "37.95°N, 126.90°E (DMZ Corridor)",
      status: "ALERT_GUARD"
    }
  ];

  // 2. Nation-by-Nation Strategic Resources & Burn Rates
  const nationalResources = [
    {
      nation: "United States",
      flag: "🇺🇸",
      crudeReserves: "358M bbl (SPR Level)",
      semiconductorNeon: "42% Global Stockpile",
      uraniumStock: "48,000 MT HEU/LEU",
      rareEarths: "14% Supply Independence",
      grainSurplus: "+28.4M MT (Export Capable)",
      vulnerability: "Heavy Rare Earth Separation (Dysprosium/Terbium)"
    },
    {
      nation: "China",
      flag: "🇨🇳",
      crudeReserves: "980M bbl (Strategic + Comm)",
      semiconductorNeon: "28% Refining Capacity",
      uraniumStock: "17,500 MT Reserve",
      rareEarths: "68% Global Refined Monopolistic Flow",
      grainSurplus: "18-Month Self-Sustainment Buffer",
      vulnerability: "Malacca Strait Seaborne Hydrocarbon Influx"
    },
    {
      nation: "Russian Federation",
      flag: "🇷🇺",
      crudeReserves: "80B bbl Proven Reservoir",
      semiconductorNeon: "30% Raw Noble Gas Extraction",
      uraniumStock: "44% Global Enriched Fuel (SWU)",
      rareEarths: "Unrefined Siberian Deposits (18%)",
      grainSurplus: "+44.0M MT (Major Global Supplier)",
      vulnerability: "Advanced High-Bandwidth Fab Machinery"
    },
    {
      nation: "Taiwan",
      flag: "🇹🇼",
      crudeReserves: "14-Day Strategic Petroleum Buffer",
      semiconductorNeon: "Dependent on Global Sea Lines (18 Days)",
      uraniumStock: "Zero Indigenous Enrichment",
      rareEarths: "Zero Indigenous Reserves",
      grainSurplus: "Critical 30-Day Island Buffer",
      vulnerability: "Naval Quarantine / Maritime Port Blockade"
    },
    {
      nation: "Saudi Arabia",
      flag: "🇸🇦",
      crudeReserves: "267B bbl Proven Reserve Base",
      semiconductorNeon: "Minimal Domestic Refining",
      uraniumStock: "Early Stage Exploration",
      rareEarths: "Phosphate Sub-Deposits",
      grainSurplus: "Import Dependent (85%)",
      vulnerability: "Desalination Grid Kinetic Target Risk"
    }
  ];

  // 3. Currency Matrix & Macro Commodity Flux with Live Deltas
  const macroFlux = useMemo(() => {
    const jitter = (Math.sin(tick * 0.4) * 0.15);
    return [
      { asset: "USD / DXY", type: "FX", price: (104.22 + jitter).toFixed(2), delta: "+0.18%", trend: "up", note: "Treasury Yield Bid" },
      { asset: "USD / CNY", type: "FX", price: (7.2410 + jitter * 0.008).toFixed(4), delta: "-0.09%", trend: "down", note: "PBOC Liquidity Fixing" },
      { asset: "EUR / USD", type: "FX", price: (1.0835 - jitter * 0.005).toFixed(4), delta: "-0.14%", trend: "down", note: "ECB Rate Parity" },
      { asset: "Brent Crude", type: "Commodity", price: `$${(82.40 + jitter * 1.8).toFixed(2)}/bbl`, delta: "+2.41%", trend: "up", note: "Hormuz Transit Risk Premium" },
      { asset: "Gold (Spot)", type: "Commodity", price: `$${(2738.50 + jitter * 8.5).toFixed(2)}/oz`, delta: "+0.85%", trend: "up", note: "Central Bank Inflow" },
      { asset: "CBOT Wheat", type: "Commodity", price: `$${(582.25 - jitter * 3.2).toFixed(2)}/bu`, delta: "-0.45%", trend: "down", note: "Black Sea Grain Corridor Flow" },
      { asset: "Gallium (99.99%)", type: "Strategic", price: `$${(585.00 + jitter * 4.0).toFixed(2)}/kg`, delta: "+4.12%", trend: "up", note: "Export Quota Restriction" }
    ];
  }, [tick]);

  const filteredDeployments = groundDeployments.filter(d => 
    selectedTheater === 'ALL' || d.theater === selectedTheater
  );

  const filteredNations = nationalResources.filter(n =>
    selectedNation === 'ALL' || n.nation === selectedNation
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none p-3 md:p-6 overflow-x-hidden">
      
      {/* Top Cockpit Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-3 backdrop-blur shadow-2xl gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              THEATER LOGISTICS // STRATEGIC RESERVES & CURRENCY FLUX
            </span>
          </div>
          <h1 className="text-lg md:text-2xl font-black text-white font-mono mt-0.5">
            GROUND CORPS DISPOSITION & GLOBAL COMMODITY TICKER
          </h1>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button 
            onClick={() => setActiveDomain('theater')}
            className={`px-3 py-1 rounded transition ${activeDomain === 'theater' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}>
            Ground Forces
          </button>
          <button 
            onClick={() => setActiveDomain('resources')}
            className={`px-3 py-1 rounded transition ${activeDomain === 'resources' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}>
            National Resources
          </button>
          <button 
            onClick={() => setActiveDomain('macro')}
            className={`px-3 py-1 rounded transition ${activeDomain === 'macro' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}>
            Currency & Commodity Flux
          </button>
        </div>
      </header>

      {/* Realtime Live Ticker Bar (Always Visible Across All Tabs) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 mb-3 flex items-center gap-4 overflow-x-auto text-[11px] font-mono shadow-inner">
        <span className="text-slate-500 uppercase font-bold shrink-0 text-[10px] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> LIVE FLUX:
        </span>
        <div className="flex items-center gap-6 shrink-0">
          {macroFlux.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-slate-400">{item.asset}</span>
              <span className="text-white font-bold">{item.price}</span>
              <span className={item.trend === 'up' ? 'text-emerald-400 text-[10px]' : 'text-rose-400 text-[10px]'}>
                {item.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DOMAIN 1: Ground Troop Movement & Unit Readiness */}
      {activeDomain === 'theater' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 text-xs font-mono">
            <span className="text-slate-400">Filter Active Theater:</span>
            <div className="flex gap-1">
              {['ALL', 'Eastern European Flank', 'Middle East / Levant', 'Indo-Pacific / Taiwan Strait'].map(th => (
                <button 
                  key={th} 
                  onClick={() => setSelectedTheater(th)}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${selectedTheater === th ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}>
                  {th === 'ALL' ? 'Global Theaters' : th}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDeployments.map(dep => (
              <div key={dep.id} className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-amber-400 font-mono font-bold text-xs">{dep.id} // {dep.nation}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                      dep.status === 'COMBAT_ACTIVE' ? 'bg-rose-950/80 border-rose-800 text-rose-300 animate-pulse' : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}>
                      {dep.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 font-sans">{dep.unit}</h3>
                  <div className="text-[11px] font-mono text-cyan-300 mb-2">{dep.theater}</div>

                  <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800/70 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">MANPOWER:</span>
                      <span>{dep.strength}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">ARMOR / IFV:</span>
                      <span className="text-amber-200 text-right text-[10px]">{dep.armor}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-900">
                      <span className="text-slate-500">POSTURE:</span>
                      <span className="text-emerald-400">{dep.posture}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800 flex justify-between">
                  <span>DEPLOYED COORD:</span>
                  <span className="text-slate-200">{dep.grid}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOMAIN 2: Granular Nation-by-Nation Resource Reserves */}
      {activeDomain === 'resources' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 text-xs font-mono">
            <span className="text-slate-400">Select Sovereign Buffer:</span>
            <div className="flex gap-1">
              {['ALL', 'United States', 'China', 'Russian Federation', 'Taiwan', 'Saudi Arabia'].map(nat => (
                <button 
                  key={nat} 
                  onClick={() => setSelectedNation(nat)}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${selectedNation === nat ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}>
                  {nat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredNations.map(n => (
              <div key={n.nation} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{n.flag}</span>
                    <h3 className="text-base font-bold text-white font-mono">{n.nation}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                    STRATCOM REGISTER
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-3">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">CRUDE / SPR RESERVES</span>
                    <span className="text-amber-300 font-bold">{n.crudeReserves}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">SEMICONDUCTOR NOBLE GAS (NEON)</span>
                    <span className="text-cyan-300 font-bold">{n.semiconductorNeon}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">ENRICHED URANIUM / NUCLEAR FUEL</span>
                    <span className="text-purple-300 font-bold">{n.uraniumStock}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[9px]">REFINED RARE EARTHS (REE)</span>
                    <span className="text-emerald-300 font-bold">{n.rareEarths}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-[10px] font-mono flex justify-between items-center">
                  <span className="text-rose-400 font-bold">PRIMARY STRATEGIC BOTTLENECK:</span>
                  <span className="text-slate-300 text-right">{n.vulnerability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOMAIN 3: Deep Macro Currency & Commodity Pricing Flux */}
      {activeDomain === 'macro' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold block mb-3">
              MACRO CAPITAL & SOVEREIGN CURRENCY CORRIDORS
            </span>
            <div className="space-y-2">
              {macroFlux.map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center font-mono">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-xs">{item.asset}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{item.note}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{item.price}</div>
                    <span className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Metals & Logistics Pressure */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold block mb-3">
                CRITICAL CHOKEPOINT LOGISTICS
              </span>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-[10px]">BAB EL-MANDEB STRAIT</div>
                  <div className="text-white font-bold mt-0.5">Transit Volume: -58%</div>
                  <div className="text-amber-400 text-[10px] mt-0.5">Insurance Surcharge: +320 bps</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-[10px]">PANAMA CANAL LOCKS</div>
                  <div className="text-white font-bold mt-0.5">Daily Slots: 34 Vessels</div>
                  <div className="text-emerald-400 text-[10px] mt-0.5">Draft Limit: 44.0 ft (Normal)</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-[10px]">TAIWAN STRAIT AIR-SEA CORRIDOR</div>
                  <div className="text-white font-bold mt-0.5">ADIZ Sorties: 28 Aircraft / 24h</div>
                  <div className="text-rose-400 text-[10px] mt-0.5">Contested Transit Vector</div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-[9px] font-mono text-slate-500">
              AGGREGATED REAL-TIME TELEMETRY FEED // GEN 3000 CORE
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
