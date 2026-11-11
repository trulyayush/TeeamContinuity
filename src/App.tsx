/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GitBranch, 
  Layers, 
  ShieldCheck, 
  FileCheck, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  ShieldAlert,
  Info,
  Clock,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { initialProjects } from './data/mockProjects';
import { HandoverProject, UserRole, ProjectSource } from './types';
import { Header } from './components/Header';
import { PresentationModal } from './components/PresentationModal';
import { EvidenceModal } from './components/EvidenceModal';
import { TacitKnowledgeProbeModal } from './components/TacitKnowledgeProbeModal';
import { ContinuityChat } from './components/ContinuityChat';
import { NewSourceModal } from './components/NewSourceModal';

import { StageConnect } from './components/StageConnect';
import { StageReconstruct } from './components/StageReconstruct';
import { StageVerify } from './components/StageVerify';
import { StageReview } from './components/StageReview';
import { StageHandover } from './components/StageHandover';

type StageNumber = 1 | 2 | 3 | 4 | 5;

export default function App() {
  const [projects, setProjects] = useState<HandoverProject[]>(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string>(initialProjects[0].id);
  const [activeStage, setActiveStage] = useState<StageNumber>(1);
  const [activeRole, setActiveRole] = useState<UserRole>('INCOMING_DEVELOPER');

  // Modals state
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNewSourceModalOpen, setIsNewSourceModalOpen] = useState(false);
  const [isTacitProbeModalOpen, setIsTacitProbeModalOpen] = useState(false);
  
  // Evidence inspector modal state
  const [inspectedSource, setInspectedSource] = useState<ProjectSource | null>(null);
  const [highlightQuote, setHighlightQuote] = useState<string | undefined>(undefined);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  const handleInspectSource = (source: ProjectSource, quote?: string) => {
    setInspectedSource(source);
    setHighlightQuote(quote);
  };

  const handleInspectEvidenceById = (sourceId: string, quote?: string) => {
    const src = currentProject.sources.find((s) => s.id === sourceId);
    if (src) {
      setInspectedSource(src);
      setHighlightQuote(quote);
    }
  };

  // Add newly ingested source
  const handleAddSource = (newSource: ProjectSource) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        const updatedSources = [newSource, ...proj.sources];
        return {
          ...proj,
          sources: updatedSources,
          completenessScore: Math.min(100, proj.completenessScore + 3),
        };
      })
    );
  };

  // Resolve contradiction
  const handleResolveConflict = (conflictId: string, resolution: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        const updatedConflicts = proj.conflicts.map((c) =>
          c.id === conflictId
            ? { ...c, status: 'RESOLVED' as const, resolution }
            : c
        );
        const openConflictsCount = updatedConflicts.filter(
          (c) => c.status === 'OPEN_CONTRADICTION'
        ).length;
        return {
          ...proj,
          conflicts: updatedConflicts,
          metrics: {
            ...proj.metrics,
            conflictsDetected: openConflictsCount,
          },
          completenessScore: Math.min(100, proj.completenessScore + 5),
        };
      })
    );
  };

  // Resolve gap
  const handleResolveGap = (gapId: string, resolutionNote: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        const updatedGaps = proj.gaps.map((g) =>
          g.id === gapId
            ? { ...g, resolved: true, resolutionNote }
            : g
        );
        return {
          ...proj,
          gaps: updatedGaps,
          completenessScore: Math.min(100, proj.completenessScore + 4),
        };
      })
    );
  };

  // Record tacit answer from departing member
  const handleRecordTacitAnswer = (question: string, answer: string, category: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        const newGotcha = `[Tacit Probe - ${category}]: ${answer}`;
        const updatedOwnership = proj.ownershipMap.map((own, idx) =>
          idx === 0
            ? { ...own, criticalGotchas: [newGotcha, ...own.criticalGotchas] }
            : own
        );
        return {
          ...proj,
          ownershipMap: updatedOwnership,
          completenessScore: Math.min(100, proj.completenessScore + 3),
        };
      })
    );
  };

  // Approve project
  const handleApproveProject = (approverName: string, notes: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        return {
          ...proj,
          reviewState: {
            isApproved: true,
            approvedBy: approverName,
            approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            signatureHash: `sha256:${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
            notes,
          },
          completenessScore: 100,
        };
      })
    );
  };

  // Toggle action completion
  const handleToggleAction = (actionId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        const updatedActions = proj.actions.map((a) =>
          a.id === actionId ? { ...a, completed: !a.completed } : a
        );
        return {
          ...proj,
          actions: updatedActions,
        };
      })
    );
  };

  const stages = [
    { num: 1, name: 'Connect', desc: 'Authorised Sources In', icon: Layers },
    { num: 2, name: 'Reconstruct', desc: 'Decisions & Dependencies', icon: GitBranch },
    { num: 3, name: 'Verify', desc: 'Gaps & Contradictions', icon: ShieldCheck },
    { num: 4, name: 'Review', desc: 'Human Authorisation', icon: FileCheck },
    { num: 5, name: 'Handover', desc: 'Role Continuation Plan', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-[#0c0d12] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(id) => setCurrentProjectId(id)}
        activeRole={activeRole}
        onChangeRole={(role) => setActiveRole(role)}
        onOpenDeckModal={() => setIsDeckModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenNewSourceModal={() => setIsNewSourceModalOpen(true)}
        onOpenBusFactor={() => setActiveStage(2)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Transition Overview Hero Bar */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentProject.departingMember.avatar}
                alt={currentProject.departingMember.name}
                className="h-13 w-13 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                !
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Active Knowledge Transition
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-mono text-zinc-400">
                  Departure: {currentProject.departingMember.departureDate}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {currentProject.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span>Departing: <strong className="text-zinc-200">{currentProject.departingMember.name}</strong> ({currentProject.departingMember.role})</span>
                <span className="text-zinc-600">→</span>
                <span>Successor: <strong className="text-amber-300">{currentProject.incomingSuccessor.name}</strong> ({currentProject.incomingSuccessor.role})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveStage(2)}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-2 text-xs font-semibold transition cursor-pointer"
              title="Inspect Bus Factor Risk Matrix"
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>Bus Factor: 1.0 (Critical)</span>
            </button>

            <button
              onClick={() => setIsTacitProbeModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-2 text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Probe Tacit Gotchas</span>
            </button>

            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3.5 py-2 text-xs font-medium transition cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-zinc-400" />
              <span>Ask Project Memory</span>
            </button>
          </div>
        </div>

        {/* 5-Step Core Loop Stepper Navigation (Slide 7) */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0e0f17] p-2 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {stages.map((stage) => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.num;
              const isPast = activeStage > stage.num;

              return (
                <button
                  key={stage.num}
                  onClick={() => setActiveStage(stage.num as StageNumber)}
                  className={`flex flex-col items-start p-3 rounded-xl transition text-left cursor-pointer relative ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                      : isPast
                      ? 'bg-zinc-900/60 text-zinc-200 hover:bg-zinc-900 border border-zinc-800/80'
                      : 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`}>
                      Stage 0{stage.num}
                    </span>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-zinc-950' : 'text-amber-400'}`} />
                  </div>
                  <div className={`text-xs font-bold ${isActive ? 'text-zinc-950' : 'text-white'}`}>
                    {stage.name}
                  </div>
                  <div className={`text-[10px] truncate w-full ${isActive ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}>
                    {stage.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Body */}
        {activeStage === 1 && (
          <StageConnect
            project={currentProject}
            onInspectSource={(source) => handleInspectSource(source)}
            onOpenNewSourceModal={() => setIsNewSourceModalOpen(true)}
            onProceedToReconstruct={() => setActiveStage(2)}
          />
        )}

        {activeStage === 2 && (
          <StageReconstruct
            project={currentProject}
            onInspectSource={(source, quote) => handleInspectSource(source, quote)}
            onProceedToVerify={() => setActiveStage(3)}
          />
        )}

        {activeStage === 3 && (
          <StageVerify
            project={currentProject}
            onInspectSource={(source, quote) => handleInspectSource(source, quote)}
            onOpenTacitProbeModal={() => setIsTacitProbeModalOpen(true)}
            onResolveConflict={handleResolveConflict}
            onResolveGap={handleResolveGap}
            onProceedToReview={() => setActiveStage(4)}
          />
        )}

        {activeStage === 4 && (
          <StageReview
            project={currentProject}
            onApproveProject={handleApproveProject}
            onProceedToHandover={() => setActiveStage(5)}
          />
        )}

        {activeStage === 5 && (
          <StageHandover
            project={currentProject}
            activeRole={activeRole}
            onChangeRole={(role) => setActiveRole(role)}
            onToggleAction={handleToggleAction}
            onInspectEvidence={(sourceId, quote) => handleInspectEvidenceById(sourceId, quote)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/80 px-4 py-6 mt-12 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">ContinuityOS</span>
            <span className="text-zinc-600">•</span>
            <span>Prevent Critical Knowledge From Leaving With People</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <span>Sapthagiri NPS University</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Team VisionX</span>
            <span>•</span>
            <button
              onClick={() => setIsDeckModalOpen(true)}
              className="text-zinc-300 hover:text-amber-300 transition underline cursor-pointer"
            >
              Pitch Deck Reference
            </button>
          </div>
        </div>
      </footer>

      {/* Presentation Deck Modal */}
      <PresentationModal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
      />

      {/* Evidence Provenance Modal */}
      <EvidenceModal
        source={inspectedSource}
        highlightQuote={highlightQuote}
        onClose={() => setInspectedSource(null)}
      />

      {/* AI Tacit Knowledge Probe Modal */}
      <TacitKnowledgeProbeModal
        isOpen={isTacitProbeModalOpen}
        onClose={() => setIsTacitProbeModalOpen(false)}
        project={currentProject}
        onRecordTacitAnswer={handleRecordTacitAnswer}
      />

      {/* AI Continuous Project Memory Chat Drawer */}
      <ContinuityChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        project={currentProject}
        onInspectSource={handleInspectSource}
      />

      {/* Ingest Activity Modal */}
      <NewSourceModal
        isOpen={isNewSourceModalOpen}
        onClose={() => setIsNewSourceModalOpen(false)}
        onAddSource={handleAddSource}
      />
    </div>
  );
}
