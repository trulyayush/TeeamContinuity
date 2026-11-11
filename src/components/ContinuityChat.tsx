import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Bot, 
  User, 
  ExternalLink,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { HandoverProject, ProjectSource } from '../types';

interface ContinuityChatProps {
  isOpen: boolean;
  onClose: () => void;
  project: HandoverProject;
  onInspectSource: (source: ProjectSource, quote?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  text: string;
  evidenceCitations?: {
    sourceId: string;
    sourceTitle: string;
    quote: string;
  }[];
  isMissingInfoNotice?: boolean;
}

export const ContinuityChat: React.FC<ContinuityChatProps> = ({
  isOpen,
  onClose,
  project,
  onInspectSource,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ASSISTANT',
      text: `Hello! I am the ContinuityOS Project Memory Assistant for ${project.name}. Every answer I provide is strictly backed by ingested PRs, commit records, and architectural debriefs. If critical context was never written down, I will explicitly flag it as missing rather than guessing.`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const sampleQuestions = [
    `Why did we reject Two-Phase Commit in settlement?`,
    `What will crash if we toggle Valkey Cluster mode?`,
    `What is the secret script running on bastion-01?`,
    `What disaster recovery procedures exist for US-West?`,
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: q.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Call server reconstruction endpoint or simulate intelligent evidence query
      const lower = q.toLowerCase();
      let answerText = '';
      let citations: any[] = [];
      let isMissing = false;

      if (lower.includes('two-phase') || lower.includes('2pc') || lower.includes('outbox')) {
        answerText = `We discarded synchronous Two-Phase Commit (2PC) because it caused row-level locks across microservices, resulting in 4 cascading production outages during the June flash sales. Instead, Marcus Vance adopted the Transactional Outbox Pattern backed by Debezium CDC on PostgreSQL.`;
        citations = [
          {
            sourceId: 'src-adr-004',
            sourceTitle: 'ADR-004: Two-Phase Commit vs Outbox Pattern',
            quote: 'Synchronous 2PC locks database rows across multiple services, which caused 4 cascading timeouts during the June Flash Sale.',
          },
        ];
      } else if (lower.includes('valkey') || lower.includes('cluster') || lower.includes('redis') || lower.includes('sentinel')) {
        answerText = `CRITICAL CONFLICT DETECTED: While Marcus decided in Slack to move to AWS ElastiCache Valkey Cluster, the current README and Helm charts are locked to Redis Sentinel mode with ioredis v4.28. If you deploy cluster endpoints without bumping ioredis to v5.3 in PR #192, settlement pods will immediately CrashLoopBackOff!`;
        citations = [
          {
            sourceId: 'src-readme',
            sourceTitle: 'services/settlement/README.md',
            quote: 'CRITICAL: Do NOT enable cluster mode! Connection pooling library (ioredis v4.28) is locked to sentinel mode.',
          },
          {
            sourceId: 'src-slack-arch',
            sourceTitle: 'Slack #arch-infra debate',
            quote: 'Sentinel reached 98% CPU saturation... switch to AWS ElastiCache Valkey Cluster.',
          },
        ];
      } else if (lower.includes('bastion') || lower.includes('cron') || lower.includes('script') || lower.includes('prune')) {
        answerText = `In the departure debrief sync, Marcus revealed an unversioned bash script (/opt/scripts/prune_keys.sh) running under ec2-user cron on bastion-01 every Sunday at 02:00 UTC. It prunes PostgreSQL partition records. If bastion-01 is terminated by ASG health check, the DB disk will fill up in ~14 days. Successor Chloe Zhang must containerize this into a Kubernetes CronJob.`;
        citations = [
          {
            sourceId: 'src-notes-standup',
            sourceTitle: 'Senior Staff Sync Debrief Notes',
            quote: 'If bastion-01 is terminated during auto-healing, the disk will fill up in ~14 days.',
          },
        ];
      } else if (lower.includes('disaster recovery') || lower.includes('dr') || lower.includes('us-west') || lower.includes('failover')) {
        isMissing = true;
        answerText = `MISSING KNOWLEDGE GAP: No documented procedure or runbook exists in the repository for secondary region failover (US-West-2). This is flagged as a HIGH-severity knowledge gap in the Verify Radar. You must schedule a 45-minute DR walkthrough with Marcus Vance before his departure on Nov 14.`;
      } else {
        answerText = `Based on verified project records for ${project.name}: The project is undergoing handover from ${project.departingMember.name} to ${project.incomingSuccessor.name}. All key decisions, ownership maps, and pending migrations are cataloged with source provenance.`;
      }

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'ASSISTANT',
        text: answerText,
        evidenceCitations: citations,
        isMissingInfoNotice: isMissing,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-zinc-800 bg-[#0e0f17] shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 bg-zinc-950/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Continuity Project Memory</h3>
            <p className="text-[11px] text-zinc-400 font-mono">Evidence-Backed · Gemini 3.8 Flash</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Suggested prompts strip */}
      <div className="border-b border-zinc-800/60 bg-zinc-950/40 p-3 space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
          High-Yield Tacit Questions:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:text-amber-300 text-left transition cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`rounded-2xl p-4 max-w-[92%] leading-relaxed ${
                m.sender === 'USER'
                  ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
              }`}
            >
              {m.isMissingInfoNotice && (
                <div className="mb-2 flex items-center gap-1.5 font-bold text-rose-400 uppercase tracking-wider text-[10px]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Unresolved Knowledge Gap Detected</span>
                </div>
              )}

              <p className="whitespace-pre-wrap">{m.text}</p>

              {/* Citations */}
              {m.evidenceCitations && m.evidenceCitations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Evidence Provenance Citations:</span>
                  </div>
                  {m.evidenceCitations.map((cit, idx) => {
                    const src = project.sources.find((s) => s.id === cit.sourceId);
                    return (
                      <div
                        key={idx}
                        onClick={() => src && onInspectSource(src, cit.quote)}
                        className="rounded-lg bg-zinc-950/80 border border-zinc-800 p-2 text-[11px] text-zinc-300 hover:border-amber-500/50 cursor-pointer transition flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-white">{cit.sourceTitle}: </span>
                          <span className="font-serif italic text-amber-200/90">"{cit.quote}"</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-amber-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>Verifying evidence provenance...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-3 bg-zinc-950">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about architecture, unwritten rules, or blockers..."
            className="flex-1 rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isLoading}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 p-2 font-bold transition disabled:opacity-40 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500">
          <span>Continuous memory: Answers strictly derived from project evidence.</span>
          <span className="font-mono">Missing info stays missing</span>
        </div>
      </div>
    </div>
  );
};
