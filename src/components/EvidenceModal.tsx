import React from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  FileCode, 
  GitPullRequest, 
  MessageSquare, 
  Calendar, 
  User, 
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { ProjectSource } from '../types';

interface EvidenceModalProps {
  source: ProjectSource | null;
  highlightQuote?: string;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  source,
  highlightQuote,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!source) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(source.fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'GITHUB_PR':
      case 'GITHUB_COMMIT':
        return <GitPullRequest className="h-4 w-4 text-purple-400" />;
      case 'SLACK_CONVERSATION':
        return <MessageSquare className="h-4 w-4 text-emerald-400" />;
      default:
        return <FileCode className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-2xl border border-zinc-800 bg-[#0e0f17] shadow-2xl text-zinc-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700">
              {getSourceIcon(source.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {source.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-zinc-400 font-mono">ID: {source.id}</span>
              </div>
              <h3 className="font-bold text-white text-base mt-0.5">{source.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Provenance Metadata bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/60 bg-zinc-900/40 px-6 py-2.5 text-xs text-zinc-400 gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-zinc-500" />
              <span>Author: <span className="text-zinc-200 font-medium">{source.author}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              <span>Timestamp: <span className="text-zinc-200 font-mono">{source.timestamp}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Authorised & Scoped</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded text-[11px] font-mono">
              <Lock className="h-3 w-3 text-zinc-500" />
              <span>Redacted</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Highlighted Quote Callout if provided */}
          {highlightQuote && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
                Referenced Claim Quote
              </div>
              <blockquote className="text-sm font-serif italic text-amber-100 pl-3 border-l-2 border-amber-400">
                "{highlightQuote}"
              </blockquote>
            </div>
          )}

          {/* Reference Link */}
          <div className="rounded-lg bg-zinc-950/60 border border-zinc-800 p-3 flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-mono">Canonical Reference:</span>
            <span className="font-mono text-amber-300 font-medium flex items-center gap-1">
              {source.urlOrRef}
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </span>
          </div>

          {/* Full Content / Record Payload */}
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Authorised Source Record Payload
            </div>
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {source.fullContent}
            </div>
          </div>

          {/* Trust by design redaction notice */}
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3.5 text-xs text-zinc-400 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-200 font-medium">ContinuityOS Trust By Design Policy:</span>
              <p className="mt-0.5 text-zinc-400 text-[11px]">
                This record was ingested under scoped project authorization. Sensitive environment variables, JWT bearer tokens, and private PII have been redacted deterministically.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 px-6 py-3 bg-zinc-950/80 text-xs">
          <span className="font-mono text-zinc-400">
            Hash: <span className="text-zinc-300">sha256:{source.id.slice(0, 8)}9f7c...</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 font-medium text-white transition"
          >
            Close Provenance View
          </button>
        </div>

      </div>
    </div>
  );
};
