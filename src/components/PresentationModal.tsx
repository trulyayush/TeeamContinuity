import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  ExternalLink, 
  GraduationCap, 
  Users, 
  AlertCircle, 
  Target, 
  Cpu, 
  ShieldCheck, 
  Award,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const [activeSlide, setActiveSlide] = useState(1);

  if (!isOpen) return null;

  const slides = [
    {
      num: 1,
      title: "Continuity, when people move on",
      subtitle: "Prevent Critical Knowledge From Leaving With People",
      category: "KNOWLEDGE CONTINUITY PLATFORM · HACKATHON ROUND 1",
      highlight: "Team: VISIONX · SAPTHAGIRI NPS UNIVERSITY",
      points: [
        "Team Leader: AYUSHKUMAR NAYAK",
        "Team Members: BHARATH R, BHARGAVI A, BHAVANASHREE R",
        "Institution: Sapthagiri NPS University",
        "Official Hackathon Submission: Round 1 Strategy & Architecture"
      ]
    },
    {
      num: 2,
      title: "The Problem: When people leave, knowledge leaves with them",
      subtitle: "Project truth is distributed across documents, conversations, code, task boards and meeting notes.",
      category: "THE PROBLEM",
      highlight: 'Official challenge: "Build a system that converts scattered project activity into a usable handover when a team member leaves."',
      points: [
        "Incoming members receive disconnected fragments, not coherent context",
        "Crucial tacit decisions live only in engineers' heads",
        "Past discussions and rationale get buried across Slack, PR comments, and ephemeral chats",
        "Result: Incoming members waste weeks guessing why systems were built a certain way"
      ]
    },
    {
      num: 3,
      title: "Why It Matters: The Continuity Tax",
      subtitle: "When context disappears, the project pays in time, confidence and repeated effort.",
      category: "WHY IT MATTERS",
      highlight: "Cause → Fragmentation → Uncertainty → Rework → Delay",
      points: [
        "01 Fragmentation: Facts sit scattered across separate tools",
        "02 Uncertainty: No clear picture of what matters or what breaks first",
        "03 Rework: Incoming people repeat already-solved questions and discarded mistakes",
        "04 Delay: Critical project decisions and ownership drift indefinitely"
      ]
    },
    {
      num: 4,
      title: "The Users: Everyone feels the gap differently",
      subtitle: "Different roles require fundamentally different continuity views.",
      category: "THE USERS & MVP FOCUS",
      highlight: "MVP focus: Student project teams and small technical teams, where source diversity is real but scope remains manageable.",
      points: [
        "Departing member: Cannot transfer tacit context efficiently under time pressure",
        "Incoming member: Does not know what matters first on Day 1",
        "Project manager: Lacks a reliable, objective continuity view",
        "Developer: Inherits code without the architectural decision trail",
        "HR / Administrator: Needs a safe, verifiable transition process and IP protection",
        "Students & Researchers: Rotate frequently across semesters and lab grants"
      ]
    },
    {
      num: 5,
      title: "The Insight: Documentation is not the same as knowledge",
      subtitle: "A record of activity is not yet an explanation of project state.",
      category: "THE CORE INSIGHT",
      highlight: "Our insight: Continuity requires reconstructing context and action, not merely summarising files.",
      points: [
        "What happened is not the same as WHY it happened",
        "A closed task in Jira can hide an unfinished, critical dependency",
        "A decision matters because it changed the project's trajectory",
        "A useful handover explains what remains, what is blocked, and what happens next"
      ]
    },
    {
      num: 6,
      title: "Meet ContinuityOS: Evidence-Backed Handover Platform",
      subtitle: "An evidence-backed project knowledge reconstruction and continuity platform.",
      category: "THE PROPOSED PRODUCT",
      highlight: "Turns authorised project activity into a reviewable handover for the next person responsible.",
      points: [
        "Value: Faster understanding without guessing",
        "Audience: Incoming members, project leads, and administrators",
        "Evidence-first: Every claim points to an immutable source record",
        "Missing information stays missing — no synthetic hallucinations"
      ]
    },
    {
      num: 7,
      title: "The Core Loop: From Scattered Activity to Trusted Handover",
      subtitle: "Each stage has an explicit input, operation, and reviewable output.",
      category: "THE 5-STAGE CORE LOOP",
      highlight: "Connect → Reconstruct → Verify → Review → Handover",
      points: [
        "1. Connect: Authorised sources in; scoped project data out",
        "2. Reconstruct: Decisions, ownership, risks, and hidden dependencies extracted",
        "3. Verify: Evidence links, gaps, contradictions, and uncertainty surfaced",
        "4. Review: Authorised humans correct and approve before publication",
        "5. Handover: Role-appropriate continuation plan and Day 1 action map"
      ]
    },
    {
      num: 8,
      title: "The Experience: A Map, Not a Data Dump",
      subtitle: "Organised around decisions, ownership, and next actions.",
      category: "THE EXPERIENCE",
      highlight: "Current State + Evidence Decision Trail + Concrete Actions",
      points: [
        "Project overview & current state: What changed, what remains, where attention goes next",
        "Decision timeline with direct evidence references",
        "Completed and pending work with hidden gotcha alerts",
        "Ownership, dependencies, blockers, and risks",
        "Source links beside important claims for instant audit"
      ]
    },
    {
      num: 9,
      title: "The Differentiator: Beyond Summarisation Towards Reconstruction",
      subtitle: "Reconstruction preserves conflicts and missing gaps instead of smoothing them away.",
      category: "THE DIFFERENTIATOR",
      highlight: "Proposed Completeness Score: Coverage of decisions, owners, pending work, risks, dependencies, and next actions.",
      points: [
        "Evidence-first intelligence: Claims point back to authorised sources",
        "Context reconstruction: Discussions, decisions, and actual code changes connect",
        "Knowledge-gap detection: Missing, conflicting, and uncertain info surfaces explicitly",
        "Dependency-aware handover: Blocked work and next actions become visible"
      ]
    },
    {
      num: 10,
      title: "The Intelligence Pipeline",
      subtitle: "Structured fact extraction and deterministic provenance verification.",
      category: "THE INTELLIGENCE PIPELINE",
      highlight: "Authorised sources → Extraction → Semantic Indexing → Project Reconstruction → Handover Review",
      points: [
        "LLMs: Draft structured facts and infer latent relationships",
        "Embeddings: Support retrieval across commits, PRs, and notes",
        "Deterministic checks: Preserve strict provenance and citation quotes",
        "Strict rule: Missing information stays missing"
      ]
    },
    {
      num: 11,
      title: "Build Plan & Modular Architecture",
      subtitle: "Sources → Orchestration → Extraction/Retrieval → Data Layer → Interface",
      category: "BUILD PLAN",
      highlight: "React + TypeScript + Tailwind CSS interface paired with intelligent AI orchestration.",
      points: [
        "Sources: GitHub PRs/Commits, Authorised Documents, Tasks & Communications",
        "AI Services: Extraction, Retrieval, Embeddings, Evidence Verification",
        "Data Layer: Relational project state, vector store, and secure audit store",
        "Interface: Verified Handover & Human Review Workspace"
      ]
    },
    {
      num: 12,
      title: "Trust by Design: Trust is a Product Requirement",
      subtitle: "Conflicting claims appear as conflicts. Missing evidence appears as a gap. Unauthorised content never enters.",
      category: "TRUST BY DESIGN",
      highlight: "Access · Scope · Protection · Audit · Review",
      points: [
        "Access: Authentication and role-based access control",
        "Scope: Project-level and source-level permission checks",
        "Protection: Sensitive-data redaction, credential scrubbing, secure storage",
        "Audit: Immutable logs for ingestion, edits, approvals, and sharing",
        "Review: Authorised human approval before a handover is shared"
      ]
    },
    {
      num: 17,
      title: "Round 2 Acceptance Tests: Three Commitments We Will Earn",
      subtitle: "Each improvement is demonstrated with a before/after test scenario, not a promise without a check.",
      category: "ROUND 2 ACCEPTANCE TESTS",
      highlight: "01 Evidence & Contradictions | 02 Dependency Graph | 03 Role Personalisation",
      points: [
        "01 Evidence reliability & contradiction detection: Measure supported-claim coverage and show conflicts instead of merging them",
        "02 Dependency graph & continuation planning: Demonstrate blocked-task paths and next actions",
        "03 Role-aware permissions & personalisation: Show different approved handovers for different authorised roles"
      ]
    },
    {
      num: 20,
      title: "People may leave projects. Their knowledge shouldn't.",
      subtitle: "ContinuityOS · Evidence-backed handovers for projects in motion.",
      category: "VISIONX CONCLUSION",
      highlight: "Team: VisionX · SAPATHGIRI NPS UNIVERSITY · Ayushkumar Nayak (theayushnayak01@gmail.com)",
      points: [
        "Lead: AYUSHKUMAR NAYAK",
        "Members: BHARATH R, BHARGAVI A, BHAVANASHREE R",
        "Preserving human ingenuity and institutional velocity across team transitions",
        "Round 1 Plan → Round 2 Working MVP Demo"
      ]
    }
  ];

  const current = slides.find(s => s.num === activeSlide) || slides[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-zinc-800 bg-[#0f1017] shadow-2xl text-zinc-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Team VisionX Pitch Deck Reference</h3>
                <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 border border-amber-500/30">
                  Sapthagiri NPS University
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Official Hackathon Round 1 Strategy & Product Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/assets/aistudio/Continuity-when-people-move-on.pptx_6022897a.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Raw PDF Attachment</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Slide viewer body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Slide thumbnail navigation pills */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-800/60">
            {slides.map(s => (
              <button
                key={s.num}
                onClick={() => setActiveSlide(s.num)}
                className={`px-3 py-1 text-xs rounded-md font-mono transition cursor-pointer ${
                  activeSlide === s.num
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                Slide {s.num}
              </button>
            ))}
          </div>

          {/* Slide Card Presentation */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/90 p-8 shadow-inner relative overflow-hidden">
            {/* Subtle decorative glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

            <div className="text-[11px] font-mono tracking-wider uppercase text-amber-400 font-semibold mb-2">
              {current.category}
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              {current.title}
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
              {current.subtitle}
            </p>

            {/* Core highlight callout box */}
            <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm font-semibold flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>{current.highlight}</div>
            </div>

            {/* Slide bullet points */}
            <div className="space-y-3">
              {current.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Team VisionX Roster Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              <span>Sapthagiri NPS University — Team VisionX</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-2.5">
                <div className="text-xs font-semibold text-white">Ayushkumar Nayak</div>
                <div className="text-[11px] text-amber-400 font-medium">Team Leader & Architect</div>
                <div className="text-[10px] text-zinc-400 mt-1">theayushnayak01@gmail.com</div>
              </div>
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-2.5">
                <div className="text-xs font-semibold text-white">Bharath R</div>
                <div className="text-[11px] text-zinc-400">Core Engineering</div>
                <div className="text-[10px] text-zinc-400 mt-1">Extraction & Pipelines</div>
              </div>
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-2.5">
                <div className="text-xs font-semibold text-white">Bhargavi A</div>
                <div className="text-[11px] text-zinc-400">Frontend & UX</div>
                <div className="text-[10px] text-zinc-400 mt-1">Review Workflows</div>
              </div>
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-2.5">
                <div className="text-xs font-semibold text-white">Bhavanashree R</div>
                <div className="text-[11px] text-zinc-400">QA & Verification</div>
                <div className="text-[10px] text-zinc-400 mt-1">Evidence Integrity</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with slide pagination */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 px-6 py-4 bg-zinc-950/80 text-xs">
          <div className="text-zinc-400 font-mono">
            Slide <span className="text-amber-400 font-bold">{activeSlide}</span> of 20 (Key Deck Milestones)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const prev = slides[slides.findIndex(s => s.num === activeSlide) - 1];
                if (prev) setActiveSlide(prev.num);
              }}
              disabled={activeSlide === slides[0].num}
              className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => {
                const next = slides[slides.findIndex(s => s.num === activeSlide) + 1];
                if (next) setActiveSlide(next.num);
              }}
              disabled={activeSlide === slides[slides.length - 1].num}
              className="flex items-center gap-1 rounded-lg bg-amber-500 text-zinc-950 font-semibold px-3 py-1.5 disabled:opacity-40 hover:bg-amber-400 transition"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
