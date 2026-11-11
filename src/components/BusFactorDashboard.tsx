import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  PieChart,
  Pie
} from 'recharts';
import { HandoverProject, OwnershipItem } from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Flame, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface BusFactorDashboardProps {
  project: HandoverProject;
  onNavigateToStage?: (stageNum: number) => void;
}

export const BusFactorDashboard: React.FC<BusFactorDashboardProps> = ({
  project,
  onNavigateToStage,
}) => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<string | null>(null);

  // 1. Calculate Bus Factor per subsystem
  // CRITICAL_RISK = 1, NEEDS_SHADOWING = 2, SAFE_HANDOFF = 3
  const subsystemData = project.ownershipMap.map((own) => {
    const busFactor = own.riskStatus === 'CRITICAL_RISK' ? 1 :
                      own.riskStatus === 'NEEDS_SHADOWING' ? 2 : 3;

    return {
      id: own.id,
      name: own.subsystem.length > 22 ? own.subsystem.slice(0, 20) + '...' : own.subsystem,
      fullName: own.subsystem,
      busFactor,
      complexity: own.complexityScore,
      gotchasCount: own.criticalGotchas.length,
      primaryOwner: own.primaryDeparting,
      successor: own.designatedSuccessor,
      riskStatus: own.riskStatus,
      rawItem: own,
    };
  });

  // Calculate project-wide metrics
  const minBusFactor = Math.min(...subsystemData.map(d => d.busFactor));
  const spofCount = subsystemData.filter(d => d.busFactor === 1).length;
  const avgComplexity = (subsystemData.reduce((acc, curr) => acc + curr.complexity, 0) / (subsystemData.length || 1)).toFixed(1);

  // 2. Team Knowledge Distribution Data
  // Estimate percentage based on ownership distribution
  const totalSubsystems = subsystemData.length || 1;
  const departingSoloCount = subsystemData.filter(d => d.riskStatus === 'CRITICAL_RISK').length;
  const sharedCount = subsystemData.filter(d => d.riskStatus === 'NEEDS_SHADOWING').length;
  const safeCount = subsystemData.filter(d => d.riskStatus === 'SAFE_HANDOFF').length;

  const departingKnowledgeShare = Math.round(
    ((departingSoloCount * 1.0 + sharedCount * 0.6 + safeCount * 0.3) / totalSubsystems) * 100
  );
  const successorKnowledgeShare = Math.round(
    ((sharedCount * 0.4 + safeCount * 0.5) / totalSubsystems) * 100
  );
  const peripheralKnowledgeShare = Math.max(5, 100 - departingKnowledgeShare - successorKnowledgeShare);

  const teamDistributionData = [
    {
      name: `${project.departingMember.name} (Departing)`,
      role: project.departingMember.role,
      share: departingKnowledgeShare,
      color: '#f43f5e', // Rose/Red for high concentration risk
    },
    {
      name: `${project.incomingSuccessor.name} (Successor)`,
      role: project.incomingSuccessor.role,
      share: successorKnowledgeShare,
      color: '#f59e0b', // Amber for ramp-up
    },
    {
      name: 'Secondary Peers & Ops',
      role: 'Team / DevOps',
      share: peripheralKnowledgeShare,
      color: '#38bdf8', // Sky blue
    },
  ];

  // 3. Radar Risk Assessment Data
  const radarData = [
    {
      metric: 'Single Point Failure',
      value: spofCount >= 2 ? 95 : spofCount === 1 ? 70 : 30,
      fullMark: 100,
    },
    {
      metric: 'Tacit Gotcha Density',
      value: Math.min(100, subsystemData.reduce((acc, curr) => acc + curr.gotchasCount, 0) * 22),
      fullMark: 100,
    },
    {
      metric: 'Code Complexity',
      value: Math.round((Number(avgComplexity) / 10) * 100),
      fullMark: 100,
    },
    {
      metric: 'Shadowing Gap',
      value: safeCount === totalSubsystems ? 15 : sharedCount > 0 ? 65 : 85,
      fullMark: 100,
    },
    {
      metric: 'Deployment Fragility',
      value: project.conflicts.filter(c => c.status === 'OPEN_CONTRADICTION').length > 0 ? 90 : 35,
      fullMark: 100,
    },
  ];

  const getBusFactorColor = (bf: number) => {
    if (bf === 1) return '#f43f5e'; // Critical / Red
    if (bf === 2) return '#f59e0b'; // Moderate / Amber
    return '#10b981'; // Safe / Green
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-zinc-700 bg-[#0e0f17] p-3 text-xs shadow-xl text-zinc-100 font-sans">
          <div className="font-bold text-white text-sm mb-1">{data.fullName}</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-zinc-400">Bus Factor:</span>
              <span className="font-mono font-bold" style={{ color: getBusFactorColor(data.busFactor) }}>
                {data.busFactor} ({data.busFactor === 1 ? 'Sole Owner / Critical SPOF' : data.busFactor === 2 ? 'Needs Active Shadowing' : 'Safe Handoff'})
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-400">Complexity Score:</span>
              <span className="font-mono text-purple-300 font-bold">{data.complexity}/10</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-400">Tacit Gotchas:</span>
              <span className="font-mono text-amber-300 font-bold">{data.gotchasCount} items</span>
            </div>
            <div className="pt-1.5 border-t border-zinc-800 text-[11px] text-zinc-400">
              Primary: <span className="text-zinc-200">{data.primaryOwner}</span> → Successor: <span className="text-amber-300">{data.successor}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Knowledge Vulnerability Matrix</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Team Bus Factor & Knowledge Distribution</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Bus Factor Risk Analysis: {project.name}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                minBusFactor === 1
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                Current Bus Factor: {minBusFactor}.0
              </span>
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-3xl">
              The <strong>Bus Factor</strong> is the minimum number of engineers who must depart before a subsystem stalls due to lost context. Visualizing knowledge concentration helps preempt catastrophic continuity failures before departure day.
            </p>
          </div>

          {onNavigateToStage && (
            <button
              onClick={() => onNavigateToStage(5)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
            >
              <span>Execute De-Risking Actions</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 4 Key Risk KPI Cards */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="rounded-xl bg-zinc-900/60 p-3.5 border border-zinc-800">
            <div className="text-zinc-400 text-[11px] flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>Project Bus Factor</span>
            </div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{minBusFactor}.0</div>
            <div className="text-[10px] text-rose-300/80 mt-0.5">Critical SPOF active</div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 p-3.5 border border-zinc-800">
            <div className="text-zinc-400 text-[11px] flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>Single Points of Failure</span>
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{spofCount} Subsystems</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Solely known by {project.departingMember.name}</div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 p-3.5 border border-zinc-800">
            <div className="text-zinc-400 text-[11px] flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              <span>Knowledge Lock-in</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">{departingKnowledgeShare}%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Held by departing lead</div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 p-3.5 border border-zinc-800">
            <div className="text-zinc-400 text-[11px] flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>Target Post-Handover</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">2.5+</div>
            <div className="text-[10px] text-emerald-300/80 mt-0.5">Target healthy factor</div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Subsystem Bus Factor & Complexity (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-400" />
                <span>Subsystem Bus Factor vs. Architecture Complexity</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Bus Factor (Scale 1–3) compared against Complexity (Scale 1–10). Subsystems with Bus Factor = 1 and High Complexity require emergency shadowing.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                BF: 1 (Critical)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                BF: 2 (Moderate)
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
                Complexity (1-10)
              </span>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subsystemData}
                margin={{ top: 10, right: 20, left: -10, bottom: 25 }}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false} 
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false} 
                  domain={[0, 10]} 
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="complexity" 
                  name="Architecture Complexity" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                />
                <Bar 
                  dataKey="busFactor" 
                  name="Bus Factor (1-3)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                >
                  {subsystemData.map((entry, index) => (
                    <Cell key={`cell-bf-${index}`} fill={getBusFactorColor(entry.busFactor)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Subsystem Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {subsystemData.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubsystem(sub.fullName)}
                className={`rounded-xl border p-3 text-xs transition cursor-pointer ${
                  sub.busFactor === 1
                    ? 'border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10'
                    : sub.busFactor === 2
                    ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10'
                    : 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    sub.busFactor === 1 ? 'bg-rose-500/20 text-rose-300' :
                    sub.busFactor === 2 ? 'bg-amber-500/20 text-amber-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    Bus Factor: {sub.busFactor}
                  </span>
                  <span className="font-mono text-purple-300 text-[11px] font-semibold">
                    Comp: {sub.complexity}/10
                  </span>
                </div>
                <div className="font-semibold text-white line-clamp-1">{sub.fullName}</div>
                <div className="text-[11px] text-zinc-400 mt-1 truncate">
                  {sub.gotchasCount} tacit gotchas detected
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Knowledge Share Across Team (1 col) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-400" />
                <span>Knowledge Distribution</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Proportion of critical context concentrated in individuals.
              </p>
            </div>

            {/* Recharts Pie Chart */}
            <div className="h-52 w-full relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teamDistributionData}
                    dataKey="share"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {teamDistributionData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value}% Knowledge Share`, name]}
                    contentStyle={{ backgroundColor: '#0f1017', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono text-xl font-bold text-white">{departingKnowledgeShare}%</span>
                <span className="text-[10px] text-zinc-400 uppercase font-mono">At Risk</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 text-xs">
              {teamDistributionData.map((member) => (
                <div key={member.name} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: member.color }} />
                    <div className="truncate max-w-[160px]">
                      <div className="font-semibold text-white truncate">{member.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{member.role}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-white">{member.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              Severe Knowledge Concentration
            </span>
            <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
              If {project.departingMember.name} leaves without completing the Stage 5 continuation items, {departingKnowledgeShare}% of operational context will evaporate.
            </p>
          </div>
        </div>

      </div>

      {/* Chart 3 & Actionable De-risking Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Risk Topology */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-lg space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Project Vulnerability Radar</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Multi-axial risk evaluation across 5 operational dimensions.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="metric" stroke="#a1a1aa" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525b" fontSize={9} />
                <Radar
                  name="Vulnerability Score"
                  dataKey="value"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.25}
                />
                <Tooltip contentStyle={{ backgroundColor: '#0f1017', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable De-Risking Protocol (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-lg space-y-4">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Actionable Protocol: Raising Bus Factor from 1.0 → 2.5</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Concrete actions to eliminate single points of failure before {project.departingMember.departureDate}.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              3 Steps to Safety
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                01
              </span>
              <div className="flex-1 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Eliminate Bastion Cron Script SPOF</span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    Raises Subsystem from BF 1 → 2
                  </span>
                </div>
                <p className="text-zinc-300 mt-1 leading-relaxed">
                  Extract <code className="bg-zinc-800 px-1 py-0.5 rounded text-amber-300">/opt/scripts/prune_keys.sh</code> from bastion-01 into the Git repository and deploy as a Kubernetes CronJob. Prevents database disk exhaustion if the EC2 instance is replaced.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                02
              </span>
              <div className="flex-1 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Pairing Session on Settlement CDC Offset & JVM Heap</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    Raises Settlement Engine from BF 1 → 2
                  </span>
                </div>
                <p className="text-zinc-300 mt-1 leading-relaxed">
                  Marcus and Chloe shadow-run the clearing cycle and practice restoring Debezium CDC offsets when replication lag exceeds 50k messages.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                03
              </span>
              <div className="flex-1 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Merge Migration 0089 & Resolve Valkey Contradiction</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Raises Gateway from BF 2 → 3
                  </span>
                </div>
                <p className="text-zinc-300 mt-1 leading-relaxed">
                  Coordinate off-peak execution of idempotency table schema migration and upgrade ioredis to v5.3 in PR #192, formalizing cluster mode support across documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
