import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  ExternalLink, 
  Check, 
  FileQuestion, 
  Key, 
  BookX, 
  Zap,
  MessageSquareQuote,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { HandoverProject, DetectedConflict, KnowledgeGap, ProjectSource } from '../types';

interface StageVerifyProps {
  project: HandoverProject;
  onInspectSource: (source: ProjectSource, highlightQuote?: string) => void;
  onOpenTacitProbeModal: () => void;
  onResolveConflict: (conflictId: string, resolution: string) => void;
  onResolveGap: (gapId: string, resolutionNote: string) => void;
  onProceedToReview: () => void;
}

export const StageVerify: React.FC<StageVerifyProps> = ({
  project,
  onInspectSource,
  onOpenTacitProbeModal,
  onResolveConflict,
  onResolveGap,
  onProceedToReview,
}) => {
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [resolvingGapId, setResolvingGapId] = useState<string | null>(null);
  const [gapNoteText, setGapNoteText] = useState('');

  const findSource = (sourceId: string) => project.sources.find(s => s.id === sourceId);

  const handleResolveConflictSubmit = (conflictId: string) => {
    if (!resolutionText.trim()) return;
    onResolveConflict(conflictId, resolutionText.trim());
    setSelectedConflictId(null);
    setResolutionText('');
  };

  const handleResolveGapSubmit = (gapId: string) => {
    if (!gapNoteText.trim()) return;
    onResolveGap(gapId, gapNoteText.trim());
    setResolvingGapId(null);
    setGapNoteText('');
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'MISSING_DOCUMENTATION':
        return { label: 'Missing Documentation', icon: BookX, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'UNTESTED_FAILURE_MODE':
        return { label: 'Untested Failure Mode', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'SECRET_OR_ACCESS':
        return { label: 'Secret / Access Risk', icon: Key, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'TACIT_ASSUMPTION':
        return { label: 'Tacit Assumption', icon: FileQuestion, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      default:
        return { label: category, icon: HelpCircle, color: 'text-zinc-400 bg-zinc-800 border-zinc-700' };
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
                Stage 3 of 5 · The Core Loop
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Round 2 Acceptance Test 01</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Verify Evidence, Contradictions & Knowledge Gaps</span>
              <span className="rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 text-xs font-mono">
                {project.conflicts.filter(c => c.status === 'OPEN_CONTRADICTION').length} Open Contradictions
              </span>
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-3xl">
              <strong className="text-amber-300 font-semibold">The Differentiator:</strong> Unlike generic summarization models that smooth over discrepancies, ContinuityOS surfaces conflicting claims side-by-side and highlights missing information so it stays missing until verified.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenTacitProbeModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-4 py-2.5 text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Tacit Knowledge Probe</span>
            </button>

            <button
              onClick={onProceedToReview}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold px-4 py-2.5 text-xs border border-zinc-700 transition cursor-pointer"
            >
              <span>Next: Human-in-the-Loop Review</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Evaluation Metrics Row (Slide 18) */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="rounded-lg bg-zinc-900/60 p-3 border border-zinc-800">
            <div className="text-zinc-400 text-[11px]">Supported-Claim Rate</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{project.metrics.supportedClaimRate}%</div>
          </div>
          <div className="rounded-lg bg-zinc-900/60 p-3 border border-zinc-800">
            <div className="text-zinc-400 text-[11px]">Unresolved Gaps</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{project.gaps.filter(g => !g.resolved).length} detected</div>
          </div>
          <div className="rounded-lg bg-zinc-900/60 p-3 border border-zinc-800">
            <div className="text-zinc-400 text-[11px]">Open Contradictions</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{project.conflicts.filter(c => c.status === 'OPEN_CONTRADICTION').length} flagged</div>
          </div>
          <div className="rounded-lg bg-zinc-900/60 p-3 border border-zinc-800">
            <div className="text-zinc-400 text-[11px]">Completeness Score</div>
            <div className="text-lg font-bold text-white mt-0.5">{project.completenessScore}/100</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: CONTRADICTION & CONFLICT DETECTION (Slide 17) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              Detected Contradictions Across Sources
            </h3>
            <span className="text-xs text-zinc-400">
              (Never merge conflicting statements without human authorization)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {project.conflicts.map((conflict) => {
            const srcA = findSource(conflict.claimA.sourceId);
            const srcB = findSource(conflict.claimB.sourceId);
            const isResolving = selectedConflictId === conflict.id;

            return (
              <div
                key={conflict.id}
                className={`rounded-2xl border p-5 transition ${
                  conflict.status === 'RESOLVED'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/50 bg-zinc-950/90 shadow-md shadow-rose-500/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      conflict.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {conflict.status === 'RESOLVED' ? 'Resolved' : 'Active Contradiction'}
                    </span>
                    <h4 className="font-bold text-white text-base">{conflict.topic}</h4>
                  </div>

                  {conflict.status !== 'RESOLVED' && (
                    <button
                      onClick={() => setSelectedConflictId(isResolving ? null : conflict.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 text-xs transition cursor-pointer"
                    >
                      <span>Resolve Conflict</span>
                    </button>
                  )}
                </div>

                {/* Side-by-Side Claim Comparison */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Claim A */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
                      <span className="text-amber-400 font-bold">Source A: {conflict.claimA.sourceTitle}</span>
                      <span>{conflict.claimA.date} by {conflict.claimA.author}</span>
                    </div>
                    <blockquote className="text-zinc-200 font-serif italic pl-3 border-l-2 border-amber-500">
                      "{conflict.claimA.statement}"
                    </blockquote>
                    {srcA && (
                      <button
                        onClick={() => onInspectSource(srcA, conflict.claimA.statement)}
                        className="mt-3 text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect Raw Source Record</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Claim B */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
                      <span className="text-rose-400 font-bold">Source B: {conflict.claimB.sourceTitle}</span>
                      <span>{conflict.claimB.date} by {conflict.claimB.author}</span>
                    </div>
                    <blockquote className="text-zinc-200 font-serif italic pl-3 border-l-2 border-rose-500">
                      "{conflict.claimB.statement}"
                    </blockquote>
                    {srcB && (
                      <button
                        onClick={() => onInspectSource(srcB, conflict.claimB.statement)}
                        className="mt-3 text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect Raw Source Record</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Real-World Operational Risk */}
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs">
                  <span className="font-semibold text-rose-400">Operational Consequence: </span>
                  <span className="text-zinc-300">{conflict.impact}</span>
                </div>

                {/* Resolution input drawer */}
                {isResolving && (
                  <div className="mt-4 rounded-xl border border-amber-500/40 bg-zinc-950 p-4 animate-in fade-in duration-200">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Enter Authoritative Resolution & Architectural Direction:
                    </label>
                    <textarea
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="e.g. Upgrade ioredis to v5.3 in PR #192 before toggling cluster mode endpoint in Helm values..."
                      className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 h-24"
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedConflictId(null)}
                        className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleResolveConflictSubmit(conflict.id)}
                        className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-1.5 text-xs transition"
                      >
                        Confirm & Record Resolution
                      </button>
                    </div>
                  </div>
                )}

                {/* If resolved */}
                {conflict.status === 'RESOLVED' && conflict.resolution && (
                  <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300">Authoritative Resolution Recorded:</span>
                      <p className="text-emerald-100 mt-0.5">{conflict.resolution}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: KNOWLEDGE-GAP RADAR (Slide 9 & 10) */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Knowledge-Gap Radar (Missing & Uncertain State)
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {project.gaps.filter(g => g.resolved).length} of {project.gaps.length} Gaps Documented
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.gaps.map((gap) => {
            const badge = getCategoryBadge(gap.category);
            const Icon = badge.icon;
            const isResolving = resolvingGapId === gap.id;

            return (
              <div
                key={gap.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
                  gap.resolved
                    ? 'border-emerald-500/30 bg-zinc-950/60 opacity-80'
                    : 'border-zinc-800 bg-zinc-950/90 hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${badge.color}`}>
                      <Icon className="h-3 w-3" />
                      <span>{badge.label}</span>
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      gap.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      gap.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {gap.severity}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1.5">{gap.title}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">{gap.description}</p>

                  <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 text-xs">
                    <span className="text-amber-400 font-semibold block mb-0.5">Recommended Action:</span>
                    <span className="text-zinc-300 leading-relaxed">{gap.recommendedAction}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60">
                  {gap.resolved ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Gap Documented & Addressed</span>
                    </div>
                  ) : isResolving ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={gapNoteText}
                        onChange={(e) => setGapNoteText(e.target.value)}
                        placeholder="Resolution note (e.g. Documented in wiki / script containerized)..."
                        className="w-full rounded bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs text-white focus:outline-none"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setResolvingGapId(null)}
                          className="px-2 py-1 text-xs text-zinc-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleResolveGapSubmit(gap.id)}
                          className="px-2.5 py-1 text-xs rounded bg-emerald-500 text-zinc-950 font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setResolvingGapId(gap.id)}
                      className="w-full text-center py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition"
                    >
                      Resolve / Document Gap
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
