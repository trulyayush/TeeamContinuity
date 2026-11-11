import React, { useState } from 'react';
import { 
  GitPullRequest, 
  MessageSquare, 
  FileCode, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  Lock, 
  Eye, 
  Plus, 
  Sparkles,
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';
import { HandoverProject, ProjectSource, SourceType } from '../types';

interface StageConnectProps {
  project: HandoverProject;
  onInspectSource: (source: ProjectSource) => void;
  onOpenNewSourceModal: () => void;
  onProceedToReconstruct: () => void;
}

export const StageConnect: React.FC<StageConnectProps> = ({
  project,
  onInspectSource,
  onOpenNewSourceModal,
  onProceedToReconstruct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredSources = project.sources.filter(source => {
    const matchesSearch = 
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || source.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getSourceBadge = (type: SourceType) => {
    switch (type) {
      case 'GITHUB_PR':
      case 'GITHUB_COMMIT':
        return { label: 'GitHub', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: GitPullRequest };
      case 'SLACK_CONVERSATION':
        return { label: 'Slack', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: MessageSquare };
      case 'ADR':
        return { label: 'ADR', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: FileCode };
      case 'JIRA_TASK':
        return { label: 'Jira Task', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Layers };
      case 'MEETING_NOTES':
        return { label: 'Notes', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: FileCode };
      default:
        return { label: 'Document', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20', icon: FileCode };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stage Header Banner */}
      <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
                Stage 1 of 5 · The Core Loop
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">Authorised Sources In → Scoped Project Data Out</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Connect & Ingest Authorised Activity
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-2xl">
              Project truth is scattered across code, PRs, task boards, Slack discussions, and architecture docs. ContinuityOS establishes scoped connections with cryptographic provenance and deterministic PII redaction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewSourceModal}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Ingest New Activity</span>
            </button>
            <button
              onClick={onProceedToReconstruct}
              className="flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold px-4 py-2.5 text-xs border border-zinc-700 transition cursor-pointer"
            >
              <span>Next: Reconstruct Context</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Trust by design indicator strip (Slide 12) */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-zinc-200">Role-Based Access</div>
              <div className="text-[11px] text-zinc-400">Project scope verified</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Lock className="h-4 w-4 text-amber-400" />
            <div>
              <div className="font-semibold text-zinc-200">Sensitive Redaction</div>
              <div className="text-[11px] text-zinc-400">Tokens & PII masked</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="h-4 w-4 text-sky-400" />
            <div>
              <div className="font-semibold text-zinc-200">Audit Provenance</div>
              <div className="text-[11px] text-zinc-400">Immutable source hashing</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Database className="h-4 w-4 text-purple-400" />
            <div>
              <div className="font-semibold text-zinc-200">Zero Ingestion Bleed</div>
              <div className="text-[11px] text-zinc-400">Only authorized repos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commits, PRs, tickets, discussions..."
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'GITHUB_PR', 'SLACK_CONVERSATION', 'ADR', 'JIRA_TASK', 'MEETING_NOTES'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 text-xs rounded-md transition cursor-pointer font-medium ${
                selectedType === type
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {type === 'ALL' ? 'All Sources' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const badge = getSourceBadge(source.type);
          const Icon = badge.icon;

          return (
            <div
              key={source.id}
              onClick={() => onInspectSource(source)}
              className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 hover:border-amber-500/50 hover:bg-zinc-900/40 transition cursor-pointer shadow-sm hover:shadow-md hover:shadow-amber-500/5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${badge.color}`}>
                    <Icon className="h-3 w-3" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">{source.timestamp}</span>
                </div>

                <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {source.title}
                </h3>

                <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {source.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-1 font-mono text-[11px] truncate max-w-[180px]">
                  <span>by</span>
                  <span className="text-zinc-300 font-medium">{source.author}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 group-hover:translate-x-0.5 transition-transform">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-medium">Inspect Record</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSources.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-400 text-sm">
          No authorized sources match your filter. Try adjusting your search query or ingest a new activity source.
        </div>
      )}
    </div>
  );
};
