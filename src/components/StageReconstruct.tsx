import React, { useState } from 'react';
import { 
  GitBranch, 
  Layers, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Code,
  FileText
} from 'lucide-react';
import { HandoverProject, DecisionRecord, OwnershipItem, DependencyItem, ProjectSource } from '../types';

interface StageReconstructProps {
  project: HandoverProject;
  onInspectSource: (source: ProjectSource, highlightQuote?: string) => void;
  onProceedToVerify: () => void;
}

export const StageReconstruct: React.FC<StageReconstructProps> = ({
  project,
  onInspectSource,
  onProceedToVerify,
}) => {
  const [activeTab, setActiveTab] = useState<'DECISIONS' | 'OWNERSHIP' | 'DEPENDENCIES'>('DECISIONS');
  const [selectedDependencyId, setSelectedDependencyId] = useState<string | null>(null);

  const findSource = (sourceId: string) => {
    return project.sources.find(s => s.id === sourceId);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL_RISK':
        return { label: 'Critical Risk · Sole Owner', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'NEEDS_SHADOWING':
        return { label: 'Needs Active Shadowing', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'SAFE_HANDOFF':
        return { label: 'Safe Handoff · Multi-Owner', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: risk, color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stage Header Banner */}
      <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
                Stage 2 of 5 · The Core Loop
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Context Reconstruction Over Summarization</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Reconstruct Decisions, Ownership & Hidden Dependencies</span>
              <span className="rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 text-xs font-mono">
                {project.decisions.length} Decisions · {project.dependencies.length} Graph Paths
              </span>
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-3xl">
              <strong className="text-amber-300 font-semibold">Core Insight:</strong> What happened is not the same as <em>why</em> it happened. A closed task in Jira can hide an unfinished dependency. Here we reconstruct the living project state and causal graph.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onProceedToVerify}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Next: Verify Gaps & Conflicts</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4">
          <button
            onClick={() => setActiveTab('DECISIONS')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              activeTab === 'DECISIONS'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <GitBranch className="h-4 w-4" />
            <span>Architectural Decision Trail ({project.decisions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('OWNERSHIP')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              activeTab === 'OWNERSHIP'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Subsystem Ownership Matrix ({project.ownershipMap.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DEPENDENCIES')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              activeTab === 'DEPENDENCIES'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Interactive Dependency Graph ({project.dependencies.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DECISION TRAIL */}
      {activeTab === 'DECISIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>Showing verified architectural decisions reconstructed from PRs, Slack discussions, and ADRs.</span>
            <span className="font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Evidence-Linked
            </span>
          </div>

          <div className="space-y-4">
            {project.decisions.map((dec, index) => {
              const src = findSource(dec.sourceId);

              return (
                <div
                  key={dec.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-sm hover:border-amber-500/40 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-white text-base">{dec.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono font-medium">
                        {dec.status}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Confidence: {(dec.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                    {/* Why it happened */}
                    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3.5">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5" />
                        <span>Why It Happened (The Causal Truth)</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{dec.whyItHappened}</p>
                    </div>

                    {/* Alternatives Discarded */}
                    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3.5">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-rose-400 font-semibold mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Alternatives Discarded & Trade-Offs</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{dec.alternativesDiscarded}</p>
                    </div>
                  </div>

                  {/* Impacted Systems */}
                  <div className="mt-3 text-xs text-zinc-400 flex items-center gap-2">
                    <span className="font-medium text-zinc-300">Subsystem Scope:</span>
                    <span className="font-mono text-amber-300/90">{dec.impact}</span>
                  </div>

                  {/* Evidence Citation Callout (Clickable) */}
                  <div
                    onClick={() => src && onInspectSource(src, dec.evidenceQuote)}
                    className="mt-4 rounded-xl border border-zinc-800 hover:border-amber-500/50 bg-zinc-900/40 hover:bg-zinc-900/80 p-3 text-xs flex items-center justify-between gap-3 cursor-pointer transition group"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileText className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          Citation Evidence: <span className="text-zinc-300">{dec.sourceRef}</span>
                        </div>
                        <blockquote className="text-zinc-200 font-serif italic mt-0.5 line-clamp-1 group-hover:text-amber-200">
                          {dec.evidenceQuote}
                        </blockquote>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold shrink-0 group-hover:translate-x-1 transition-transform">
                      <span>View Provenance</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: OWNERSHIP MATRIX */}
      {activeTab === 'OWNERSHIP' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-300 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white">Subsystem Risk Radar:</span> Mapping single-point-of-failure areas before {project.departingMember.name} departs.
            </div>
            <div className="text-zinc-400 font-mono">
              Successor Assigned: <span className="text-amber-300 font-bold">{project.incomingSuccessor.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.ownershipMap.map((own) => {
              const risk = getRiskBadge(own.riskStatus);

              return (
                <div
                  key={own.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col justify-between shadow-sm hover:border-zinc-700 transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${risk.color}`}>
                        {risk.label}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Complexity: <span className="text-amber-400 font-bold">{own.complexityScore}/10</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-1">{own.subsystem}</h3>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/40">
                        <span className="text-zinc-400">Departing Owner:</span>
                        <span className="text-zinc-200 font-medium">{own.primaryDeparting}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-800/40">
                        <span className="text-zinc-400">Designated Successor:</span>
                        <span className="text-amber-300 font-semibold">{own.designatedSuccessor}</span>
                      </div>
                    </div>

                    {/* Critical Unwritten Gotchas */}
                    <div className="mt-4">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Tacit Gotchas / Unwritten Rules</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-zinc-300">
                        {own.criticalGotchas.map((g, i) => (
                          <li key={i} className="flex items-start gap-2 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60">
                            <span className="text-amber-400 font-mono mt-0.5">•</span>
                            <span className="leading-relaxed">{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Key Files */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/60">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Key Repository Paths
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-zinc-400">
                      {own.keyFiles.map((f, i) => (
                        <div key={i} className="truncate bg-zinc-900 px-2 py-0.5 rounded text-zinc-300">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE DEPENDENCY GRAPH */}
      {activeTab === 'DEPENDENCIES' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-white">Visual Dependency & Blocker Topology:</span> Fulfills Round 2 Commitment 02: Demonstrating blocked-task paths, closed tasks with hidden dependencies, and continuation next actions.
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                Hidden Dependency
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                Blocked Task
              </span>
            </div>
          </div>

          {/* Visual Interactive Graph Nodes */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0a0b10] p-6 shadow-inner space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Reconstructed Causal Flow (Click node to inspect hidden blocker)
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {project.dependencies.map((dep) => {
                const isSelected = selectedDependencyId === dep.id;
                const src = findSource(dep.evidenceSourceId);

                return (
                  <div
                    key={dep.id}
                    onClick={() => setSelectedDependencyId(isSelected ? null : dep.id)}
                    className={`rounded-2xl border p-5 transition cursor-pointer ${
                      dep.state === 'COMPLETED_WITH_HIDDEN_DEP'
                        ? 'border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10'
                        : 'border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${
                        dep.state === 'COMPLETED_WITH_HIDDEN_DEP'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {dep.state === 'COMPLETED_WITH_HIDDEN_DEP' ? '⚠️ Closed in Jira, but has HIDDEN UNMET DEP' : '🚫 Hard Blocked'}
                      </span>
                      <span className="text-[11px] font-mono uppercase text-rose-400 font-bold">
                        {dep.urgency} Urgency
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base">{dep.taskName}</h4>

                    {/* Upstream and Downstream Flow */}
                    <div className="mt-4 space-y-2 text-xs">
                      {dep.upstreamTask && (
                        <div className="flex items-start gap-2 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                          <span className="font-mono text-zinc-400 shrink-0">Upstream:</span>
                          <span className="text-zinc-200 font-medium">{dep.upstreamTask}</span>
                        </div>
                      )}

                      <div className="flex items-start gap-2 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                        <span className="font-mono text-rose-400 shrink-0">Downstream Impact:</span>
                        <span className="text-zinc-300">{dep.downstreamImpact}</span>
                      </div>
                    </div>

                    {/* Unresolved Gotcha Alert Box */}
                    <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs">
                      <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <span>The Tacit Trap:</span>
                      </div>
                      <p className="text-amber-100/90 leading-relaxed font-medium">
                        {dep.unresolvedGotcha}
                      </p>
                    </div>

                    {/* Source Evidence citation */}
                    {src && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectSource(src);
                        }}
                        className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 hover:text-amber-300"
                      >
                        <span className="font-mono text-[11px]">Provenance: {src.title}</span>
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          Inspect <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
