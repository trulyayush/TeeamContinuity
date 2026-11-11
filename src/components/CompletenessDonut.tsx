import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HandoverProject } from '../types';
import { Award, ChevronDown, CheckCircle2, AlertTriangle, ArrowUpRight, Sparkles } from 'lucide-react';

interface CompletenessDonutProps {
  project: HandoverProject;
}

export interface StageContribution {
  name: string;
  stageNum: number;
  value: number;
  max: number;
  color: string;
  detail: string;
}

export function calculateStageContributions(project: HandoverProject): StageContribution[] {
  const sourceCount = project.sources.length;
  const connectRaw = Math.min(20, Math.max(10, Math.round(sourceCount * 3.5)));

  const decisionPoints = Math.min(15, project.decisions.length * 4.5);
  const ownershipPoints = Math.min(10, project.ownershipMap.length * 3);
  const reconstructRaw = Math.min(25, Math.round(decisionPoints + ownershipPoints));

  const openConflicts = project.conflicts.filter(c => c.status === 'OPEN_CONTRADICTION').length;
  const totalGaps = project.gaps.length;
  const resolvedGaps = project.gaps.filter(g => g.resolved).length;
  const verifyRaw = Math.min(25, Math.max(8, Math.round(
    (project.metrics.supportedClaimRate / 100) * 16 + 
    (resolvedGaps / (totalGaps || 1)) * 5 - 
    (openConflicts * 2)
  )));

  const reviewRaw = project.reviewState.isApproved ? 15 : 8;

  const completedActions = project.actions.filter(a => a.completed).length;
  const totalActions = project.actions.length;
  const handoverRaw = Math.min(15, Math.max(4, Math.round((completedActions / (totalActions || 1)) * 12 + 3)));

  const target = project.completenessScore;
  const rawSum = connectRaw + reconstructRaw + verifyRaw + reviewRaw + handoverRaw;
  const scale = target / (rawSum || 1);

  const rawStages = [
    { name: 'Connect', stageNum: 1, raw: connectRaw, max: 20, color: '#38bdf8', detail: `${sourceCount} Scoped Sources Ingested` },
    { name: 'Reconstruct', stageNum: 2, raw: reconstructRaw, max: 25, color: '#f59e0b', detail: `${project.decisions.length} Decisions & Causal Graph` },
    { name: 'Verify', stageNum: 3, raw: verifyRaw, max: 25, color: '#10b981', detail: `${project.metrics.supportedClaimRate}% Supported Claims` },
    { name: 'Review', stageNum: 4, raw: reviewRaw, max: 15, color: '#a855f7', detail: project.reviewState.isApproved ? 'Approved by Human Lead' : 'Pending Formal Sign-off' },
    { name: 'Handover', stageNum: 5, raw: handoverRaw, max: 15, color: '#fb7185', detail: `${completedActions}/${totalActions} Continuation Tasks` },
  ];

  const calculated = rawStages.map(s => ({
    name: s.name,
    stageNum: s.stageNum,
    value: Math.max(1, Math.round(s.raw * scale)),
    max: s.max,
    color: s.color,
    detail: s.detail,
  }));

  const currentTotal = calculated.reduce((acc, curr) => acc + curr.value, 0);
  const diff = target - currentTotal;
  if (diff !== 0 && calculated.length > 0) {
    const maxIdx = calculated.reduce((maxI, curr, i, arr) => curr.value > arr[maxI].value ? i : maxI, 0);
    calculated[maxIdx].value += diff;
  }

  return calculated;
}

export const CompletenessDonut: React.FC<CompletenessDonutProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const stagesData = calculateStageContributions(project);
  const completeness = project.completenessScore;

  // Find the stage that contributes the most
  const topContributor = [...stagesData].sort((a, b) => b.value - a.value)[0];

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const scoreColor = completeness >= 85 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                     completeness >= 70 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                     'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="relative" ref={popoverRef}>
      {/* Clickable Header Widget */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border p-1.5 pr-2.5 transition cursor-pointer hover:border-amber-500/50 ${scoreColor}`}
        title="View 5-Stage Completeness Breakdown"
      >
        {/* Small Recharts Donut Chart */}
        <div className="h-10 w-10 shrink-0 relative flex items-center justify-center">
          <ResponsiveContainer width={40} height={40}>
            <PieChart>
              <Pie
                data={stagesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={13}
                outerRadius={19}
                paddingAngle={2}
                stroke="none"
              >
                {stagesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered tiny icon or pulse dot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Text Details */}
        <div className="text-left text-xs leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm font-bold text-white">{completeness}%</span>
            <span className="text-[10px] uppercase font-mono text-amber-300 font-semibold">Score</span>
            <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          <div className="text-[10px] text-zinc-400 truncate max-w-[125px]">
            Top: {topContributor.name} ({topContributor.value}pts)
          </div>
        </div>
      </button>

      {/* Flyout Popover Breakdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border border-zinc-800 bg-[#0f1017] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-zinc-100">
          
          {/* Popover Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Completeness Breakdown</span>
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {completeness} / 100 Handover Points
              </div>
            </div>

            <div className="h-12 w-12 shrink-0">
              <ResponsiveContainer width={48} height={48}>
                <PieChart>
                  <Pie
                    data={stagesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={16}
                    outerRadius={23}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {stagesData.map((entry, index) => (
                      <Cell key={`cell-popover-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Contributor Badge */}
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs flex items-start gap-2.5">
            <Award className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Top Contributor: Stage 0{topContributor.stageNum} ({topContributor.name})</span>
              <p className="text-[11px] text-zinc-300 mt-0.5">
                Provides <strong className="text-white">{topContributor.value} pts</strong> ({Math.round((topContributor.value / completeness) * 100)}% of total earned score).
              </p>
            </div>
          </div>

          {/* Breakdown by 5 Stages */}
          <div className="space-y-2.5 text-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-1">
              Contribution by Core Loop Stage:
            </div>

            {stagesData.map((stage) => {
              const percentageOfTotal = Math.round((stage.value / completeness) * 100);
              const percentageOfMax = Math.round((stage.value / stage.max) * 100);

              return (
                <div key={stage.name} className="rounded-lg bg-zinc-900/60 border border-zinc-800/80 p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-semibold text-white">
                        0{stage.stageNum}. {stage.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="font-bold text-white">{stage.value}</span>
                      <span className="text-zinc-500">/ {stage.max} pts</span>
                      <span className="text-zinc-400">({percentageOfTotal}%)</span>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, percentageOfMax)}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>

                  <div className="text-[10px] text-zinc-400 truncate">
                    {stage.detail}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unearned Points Callout if < 100 */}
          {completeness < 100 && (
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                <span>{100 - completeness} pts remaining</span>
              </span>
              <span className="text-zinc-500">Resolve gaps to reach 100%</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
