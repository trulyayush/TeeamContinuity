import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Briefcase, 
  Code, 
  GraduationCap,
  MessageSquare,
  FileText
} from 'lucide-react';
import { HandoverProject, UserRole } from '../types';

interface HeaderProps {
  currentProject: HandoverProject;
  projects: HandoverProject[];
  onSelectProject: (projectId: string) => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenDeckModal: () => void;
  onOpenChat: () => void;
  onOpenNewSourceModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  activeRole,
  onChangeRole,
  onOpenDeckModal,
  onOpenChat,
  onOpenNewSourceModal,
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'INCOMING_DEVELOPER':
        return { label: 'Incoming Developer', icon: Code, desc: 'Architecture, unwritten gotchas, PR evidence' };
      case 'PROJECT_MANAGER':
        return { label: 'Project Manager', icon: Briefcase, desc: 'Milestone risks, blockers, ownership transitions' };
      case 'HR_ADMIN':
        return { label: 'HR / Administrator', icon: ShieldCheck, desc: 'Safe offboarding, access audits, compliance' };
      case 'DEPARTING_MEMBER':
        return { label: 'Departing Member', icon: UserCheck, desc: 'Tacit knowledge debrief & handover checklist' };
    }
  };

  const completeness = currentProject.completenessScore;
  const scoreColor = completeness >= 85 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                     completeness >= 70 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                     'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0c0d12]/95 backdrop-blur-md">
      {/* Top utility row */}
      <div className="border-b border-zinc-800/40 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-zinc-400">Sapthagiri NPS University · Hackathon Round 1 → 2</span>
            <span className="text-zinc-600">|</span>
            <button 
              onClick={onOpenDeckModal}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Team VisionX Pitch Deck & Architecture</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Evidence-First Intelligence: Claims linked to provenance</span>
            </div>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400 font-mono">Missing info stays missing</span>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-zinc-950 font-black shadow-lg shadow-amber-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Continuity<span className="text-amber-400 font-black">OS</span>
              </h1>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                Hackathon Build
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Evidence-backed project knowledge reconstruction & handover
            </p>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-3">
          {/* Project dropdown */}
          <div className="relative">
            <select
              value={currentProject.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-700 bg-zinc-900/90 py-1.5 pl-3 pr-8 text-xs font-medium text-zinc-200 shadow-sm transition hover:border-amber-500/50 focus:border-amber-500 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.departingMember.name})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Completeness Score Badge */}
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${scoreColor}`}>
            <span className="font-mono text-sm font-bold">{completeness}%</span>
            <div className="hidden sm:block text-left text-[11px] leading-tight font-normal text-zinc-300">
              <div>Handover Completeness</div>
              <div className="text-[10px] text-zinc-400">
                {currentProject.metrics.conflictsDetected > 0 ? `${currentProject.metrics.conflictsDetected} conflict flagged` : 'Zero conflicts'}
              </div>
            </div>
          </div>

          {/* AI Project Memory Assistant button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/25 cursor-pointer shadow-sm shadow-amber-500/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Ask Continuity AI</span>
            <span className="md:hidden">Ask AI</span>
          </button>

          {/* Add Source button */}
          <button
            onClick={onOpenNewSourceModal}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Ingest Source</span>
          </button>
        </div>
      </div>

      {/* Role Navigation Bar (Slide 4 & 17: Role-aware personalisation) */}
      <div className="border-t border-zinc-800/60 bg-zinc-950/60 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mr-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Personalized Lens:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(['INCOMING_DEVELOPER', 'PROJECT_MANAGER', 'HR_ADMIN', 'DEPARTING_MEMBER'] as UserRole[]).map((role) => {
              const meta = getRoleLabel(role);
              const Icon = meta.icon;
              const isActive = activeRole === role;

              return (
                <button
                  key={role}
                  onClick={() => onChangeRole(role)}
                  title={meta.desc}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 shadow-sm font-semibold'
                      : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Context Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-400">Transitioning:</span>
            <span className="font-semibold text-zinc-200">{currentProject.departingMember.name}</span>
            <span className="text-zinc-400">→</span>
            <span className="font-semibold text-amber-300">{currentProject.incomingSuccessor.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
