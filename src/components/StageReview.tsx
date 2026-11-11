import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  ArrowRight, 
  Edit3, 
  AlertTriangle, 
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HandoverProject } from '../types';

interface StageReviewProps {
  project: HandoverProject;
  onApproveProject: (approverName: string, notes: string) => void;
  onProceedToHandover: () => void;
}

export const StageReview: React.FC<StageReviewProps> = ({
  project,
  onApproveProject,
  onProceedToHandover,
}) => {
  const [approverName, setApproverName] = useState('Chloe Zhang & Elena Davis (VP Eng)');
  const [reviewNotes, setReviewNotes] = useState(
    'All architectural decisions verified with evidence. Critical gotchas acknowledged and assigned to Day 1 roadmap.'
  );
  const [showComparison, setShowComparison] = useState(false);

  const handleApprove = () => {
    onApproveProject(approverName, reviewNotes);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ffffff'],
      });
    } catch {
      // confetti fallback
    }
  };

  const isApproved = project.reviewState.isApproved;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stage Header Banner */}
      <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
                Stage 4 of 5 · The Core Loop
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Trust is a Product Requirement</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Authorised Human Review & Formal Sign-Off</span>
              {isApproved ? (
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approved & Verified
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-xs font-mono font-bold">
                  Pending Human Signoff
                </span>
              )}
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-3xl">
              Handover dossiers are never blindly published by AI. Authorised project leads and incoming successors review extracted facts, correct nuances, and sign off with tamper-evident audit records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-4 py-2.5 text-xs border border-zinc-700 transition cursor-pointer"
            >
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>{showComparison ? 'Hide' : 'View'} Before/After Proof</span>
            </button>

            <button
              onClick={onProceedToHandover}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>View Continuation Handover Plan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide 18 Evaluation: Before vs After Test Scenario Comparison */}
      {showComparison && (
        <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/90 p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                Slide 18 Acceptance Test: Before vs After Comparison
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Impact we measure, not invent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Status Quo */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-3">
              <div className="font-bold text-rose-300 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Status Quo: Scattered Raw Sources</span>
              </div>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Onboarding Ramp:</strong> 3-4 weeks spent digging through PRs and asking repeated questions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Hidden Traps:</strong> Jira NEX-412 marked "Done" conceals missing production database migration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Silent Failure:</strong> Bastion cron job dies quietly in 14 days without anyone knowing it existed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Contradictions:</strong> Devs deploy Redis Cluster and crash production due to unupgraded library.</span>
                </li>
              </ul>
            </div>

            {/* ContinuityOS */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
              <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>ContinuityOS Evidence-Backed Handover</span>
              </div>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Onboarding Ramp:</strong> Day 1 operational readiness with a structured decision map.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Dependency Intelligence:</strong> Unmet database migration explicitly surfaced in Day 1 checklist.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Tacit Discovery:</strong> Bastion script flagged in Knowledge-Gap Radar before departure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Conflict Resolution:</strong> Slack vs README discrepancy caught and recorded authoritatively.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Review & Sign-Off Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-6">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span>Handover Verification Protocol Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Decisions Reconstructed</span>
            </div>
            <div className="text-sm font-semibold text-white">
              {project.decisions.length} Architectural Choices
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              All linked to PRs, ADRs, and commits with confidence &gt; 90%.
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Ownership Handoff</span>
            </div>
            <div className="text-sm font-semibold text-white">
              {project.ownershipMap.length} Subsystems Mapped
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Primary departing owner ({project.departingMember.name}) mapped to successor ({project.incomingSuccessor.name}).
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Risks & Gaps</span>
            </div>
            <div className="text-sm font-semibold text-white">
              {project.gaps.length} Total Gaps Detected
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              {project.gaps.filter(g => g.resolved).length} resolved · {project.gaps.filter(g => !g.resolved).length} open
            </div>
          </div>
        </div>

        {/* Approval Form */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Authorised Reviewer(s):
              </label>
              <input
                type="text"
                value={approverName}
                disabled={isApproved}
                onChange={(e) => setApproverName(e.target.value)}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Designated Successor:
              </label>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-amber-300 font-semibold font-mono">
                {project.incomingSuccessor.name} ({project.incomingSuccessor.role})
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Reviewer Sign-Off Endorsement Notes:
            </label>
            <textarea
              rows={2}
              value={reviewNotes}
              disabled={isApproved}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-zinc-400">
              {isApproved ? (
                <span className="text-emerald-400">
                  Signed: {project.reviewState.signatureHash || 'sha256:e84f29a0c8b3...'}
                </span>
              ) : (
                <span>Requires human authorization before handover transition</span>
              )}
            </div>

            {!isApproved ? (
              <button
                onClick={handleApprove}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold px-6 py-2.5 text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Authorize & Digitally Sign Handover</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="h-4 w-4" />
                <span>Handover Approved & Ready for Distribution</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
