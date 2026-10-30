import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Users, ShieldAlert, Clock, Activity, Cpu, Server, Terminal, Database, Lock, Zap, BarChart2, Radio, Layers, Filter, CheckCircle2, RefreshCw, Sliders, Gauge, Flame, Network, Share2, Compass, RadioTower } from 'lucide-react';

export default function App() {
  const [nodes, setNodes] = useState([
    { id: 1, name: 'Quantum Quorum Command Alpha Gen 3000', status: 'Reconciled', heartbeat: '0.0000000000000001ms', load: '0.00%' },
    { id: 2, name: 'Neural Mesh Beta-Prime v3000', status: 'Active', heartbeat: '0.000000001ms', load: '0.01%' },
    { id: 3, name: 'RPC Relay Gateway Omega 3000', status: 'Optimal', heartbeat: '0.0000000000002ms', load: '0.01%' },
    { id: 4, name: 'Autonomous Telemetry Core v3000', status: 'Streaming', heartbeat: '0.0000000000003ms', load: '0.02%' },
    { id: 5, name: 'Fault Tolerance Watchdog 3000', status: 'Consensus', heartbeat: '0.00000000000005ms', load: '0.01%' },
    { id: 6, name: 'Swarm Synchronization Node Z-3000', status: 'Synchronized', heartbeat: '0.000000000000001ms', load: '0.00%' }
  ]);
  const [counter, setCounter] = useState(3000);
  const [telemetryLog, setTelemetryLog] = useState([
    'Initialized Gen #3000 Decentralized Quantum Byzantine Quorum Reconciliation Engine',
    'Multi-Node Heartbeat Monitors Synced Successfully via Advanced Quantum RPC Relay v3000',
    'Live Visual Graph Nodes, Executive Dashboard, and Automated Cryptographic Consensus Active'
  ]);
  const [systemHealth, setSystemHealth] = useState(100.0);
  const [activeTab, setActiveTab] = useState('overview');
  const [historyQueue, setHistoryQueue] = useState([3000, 3001, 3002, 3003, 3004]);
  const [sparklineData, setSparklineData] = useState([2995, 2996, 2997, 2998, 2999, 3000, 3001]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [throttleSpeed, setThrottleSpeed] = useState(100);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  const [performanceMeter, setPerformanceMeter] = useState(100.0);
  const [rpcStatus, setRpcStatus] = useState('Quantum Fault Tolerant Mesh Connected (Gen 3000)');
  const [consensusVotes, setConsensusVotes] = useState(3000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(function(c) {
        const nextC = c + 1;
        setHistoryQueue(function(hq) { return [nextC, ...hq.slice(0, 4)]; });
        return nextC;
      });
      setSystemHealth(function(h) { return +(Math.min(100, Math.max(96, h + (Math.random() * 0.4 - 0.2)))).toFixed(2); });
      setSparklineData(function(sd) { return [...sd.slice(1), Math.floor(Math.random() * 50) + 2950]; });
      setPerformanceMeter(function(pm) { return +(Math.min(100, Math.max(92, pm + (Math.random() * 2 - 1)))).toFixed(1); });
      setConsensusVotes(function(cv) { return cv + Math.floor(Math.random() * 3); });
    }, 1500);
    return function() { clearInterval(timer); };
  }, []);

  const filteredNodes = nodes.filter(function(n) { return n.name.toLowerCase().includes(filterQuery.toLowerCase()); });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center font-sans">
      <div className="max-w-6xl w-full bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></span>
            <h1 className="text-xl font-bold tracking-wide text-cyan-300 uppercase">Distributed Embodiment Architecture Suite (Gen 3000)</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={function() { setActiveTab('overview'); }} 
              className={'px-3 py-1 rounded text-xs font-mono transition ' + (activeTab === 'overview' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white')}
            >
              Overview & Swarm
            </button>
            <button 
              onClick={function() { setActiveTab('telemetry'); }} 
              className={'px-3 py-1 rounded text-xs font-mono transition ' + (activeTab === 'telemetry' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white')}
            >
              RPC & Heartbeat
            </button>
            <button 
              onClick={function() { setActiveTab('history'); }} 
              className={'px-3 py-1 rounded text-xs font-mono transition ' + (activeTab === 'history' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white')}
            >
              History Queue
            </button>
            <span className="text-xs font-mono px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full shadow-inner ml-2">
              Gen #3000 Active
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 font-mono leading-relaxed">
          Executive-tier React dashboard featuring autonomous swarm command matrices, multi-node heartbeat monitors, visual graph nodes, simulated RPC relays, and automated quorum reconciliation triggers (Generation 3000 Quantum Entangled Mesh).
        </p>

        {fallbackTriggered && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-500 flex items-center justify-between text-xs font-mono text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Automated Fallback Rendering Trigger Activated: Swarm operating in Quantum-resistant safe isolation mode (Gen 3000).</span>
            </div>
            <button 
              onClick={function() { setFallbackTriggered(false); }} 
              className="px-3 py-1 bg-amber-900 hover:bg-amber-800 text-white rounded text-[10px]"
            >
              Reset Fallback
            </button>
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 w-full max-w-sm bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <input 
                  type="text" 
                  placeholder="Filter Quantum Swarm Nodes..." 
                  value={filterQuery}
                  onChange={function(e) { setFilterQuery(e.target.value); }}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none w-full font-mono"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={function() { setFallbackTriggered(true); }}
                  className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/60 rounded-lg text-xs font-mono transition flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" /> Trigger Fallback
                </button>
                <span className="text-xs font-mono text-slate-400">Showing {filteredNodes.length} of {nodes.length} nodes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {filteredNodes.map(function(n) {
                return (
                  <div 
                    key={n.id} 
                    onClick={function() { setSelectedNode(n); }}
                    className="flex flex-col p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/40 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{n.name}</span>
                      <Network className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-slate-400 font-mono">Heartbeat: {n.heartbeat}</span>
                      <span className="text-xs font-mono text-cyan-300 font-bold px-2 py-0.5 bg-cyan-950/60 rounded border border-cyan-900">{n.load}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedNode && (
              <div className="mb-6 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/60 flex items-center justify-between font-mono text-xs shadow-lg">
                <div>
                  <span className="text-cyan-400 font-bold uppercase">Selected Quantum Node Diagnostics (Gen 3000):</span>
                  <div className="text-slate-200 mt-1">{selectedNode.name} | Heartbeat Latency: {selectedNode.heartbeat} | Node Status: {selectedNode.status}</div>
                </div>
                <button 
                  onClick={function() { setSelectedNode(null); }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                >
                  Close
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 font-mono">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">System Health</span>
                <div className="text-base font-bold text-cyan-400 mt-1">{systemHealth}%</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">Performance Meter</span>
                <div className="text-base font-bold text-teal-400 mt-1">{performanceMeter}%</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">Consensus Votes</span>
                <div className="text-base font-bold text-emerald-400 mt-1">{consensusVotes} TX</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase">RPC Relay Status</span>
                <div className="text-base font-bold text-cyan-300 mt-1">{rpcStatus}</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'telemetry' && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6 font-mono text-xs">
            <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
              <RadioTower className="w-4 h-4" /> Multi-Node Heartbeat Monitors & Simulated RPC Relays (Gen 3000)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-cyan-400" /> RPC Throughput Stream Frequency</span>
                  <span className="text-cyan-300 font-bold">{sparklineData[sparklineData.length - 1]} ops/s</span>
                </div>
                <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 100">
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={sparklineData.map(function(val, idx) { return (idx * 35) + ',' + (100 - ((val % 100) * 0.8)); }).join(' ')}
                  />
                </svg>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-teal-400" /> Swarm Distributed Embodiment Capacity</span>
                  <span className="text-teal-300 font-bold">{performanceMeter}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 p-0.5 mb-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: performanceMeter + '%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Heartbeat Latency: Optimal (0.0000000000000001ms)</span>
                  <span>Mesh Consensus: 100% (Gen 3000)</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-900 rounded border border-slate-800 mb-4">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-cyan-400" /> Swarm Core Throttle Speed</span>
                <span className="text-cyan-300 font-bold">{throttleSpeed}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={throttleSpeed} 
                onChange={function(e) { setThrottleSpeed(e.target.value); }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500">Heartbeat Monitor Alpha</span>
                <div className="text-cyan-300 text-sm font-bold mt-1">ONLINE [0.0000000000000001ms]</div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500">RPC Relay Beta</span>
                <div className="text-teal-300 text-sm font-bold mt-1">SYNCED [Active]</div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500">Swarm Command Gamma</span>
                <div className="text-emerald-300 text-sm font-bold mt-1">VERIFIED (Gen 3000)</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6 font-mono text-xs">
            <h3 className="text-cyan-400 font-bold mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> State History Queue (Gen 3000)
            </h3>
            <div className="space-y-2">
              {historyQueue.map(function(item, idx) {
                return (
                  <div key={idx} className="p-3 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Queue Index #{idx}</span>
                    <span className="text-cyan-300 font-bold">State Payload: {item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-6 font-mono text-xs text-slate-300 space-y-1">
          <div className="text-cyan-400 font-bold mb-2 uppercase text-[10px] tracking-wider flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Swarm Telemetry Feed (Gen 3000):
          </div>
          {telemetryLog.map(function(log, idx) {
            return (
              <div key={idx} className="text-slate-400 truncate">&gt; {log}</div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button 
            onClick={function() {
              setCounter(function(c) { return c + 10; });
              setTelemetryLog(function(logs) { return ['Swarm Pulse executed at ' + new Date().toLocaleTimeString() + ' (Value: ' + counter + ')'].concat(logs.slice(0, 3)); });
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-950/50 cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Pulse Swarm Core: {counter}
          </button>
          <span className="text-[10px] font-mono text-slate-500">Autonomous Runtime v3000</span>
        </div>
      </div>
    </div>
  );
