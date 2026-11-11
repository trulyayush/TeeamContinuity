import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ShieldCheck, 
  Lock, 
  FileText, 
  GitPullRequest, 
  MessageSquare, 
  Layers, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ProjectSource, SourceType } from '../types';

interface NewSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (newSource: ProjectSource) => void;
}

export const NewSourceModal: React.FC<NewSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SourceType>('GITHUB_PR');
  const [author, setAuthor] = useState('marcusvance');
  const [urlOrRef, setUrlOrRef] = useState('github.com/nexuspay/core/pull/');
  const [fullContent, setFullContent] = useState('');
  const [isRedacting, setIsRedacting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fullContent.trim()) return;

    // Deterministic redaction of potential keys and tokens (Slide 12: Trust by Design)
    let sanitizedContent = fullContent
      .replace(/(?:ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35}|sk_[a-zA-Z0-9]{24,48})/g, '[REDACTED_API_KEY]')
      .replace(/(?:Bearer\s+[a-zA-Z0-9._-]{20,})/gi, 'Bearer [REDACTED_TOKEN]')
      .replace(/(?:password\s*[:=]\s*["'][^"']+["'])/gi, 'password="[REDACTED_PASSWORD]"');

    const excerpt = sanitizedContent.slice(0, 180) + (sanitizedContent.length > 180 ? '...' : '');

    const newSource: ProjectSource = {
      id: `src-custom-${Date.now()}`,
      type,
      title: title.trim(),
      author: author.trim() || 'Contributor',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      urlOrRef: urlOrRef.trim() || 'internal/record',
      excerpt,
      fullContent: sanitizedContent,
      tags: ['custom', type.toLowerCase()],
      redactedElements: ['Sensitive tokens automatically scrubbed by ContinuityOS Redactor'],
    };

    onAddSource(newSource);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0f1017] shadow-2xl text-zinc-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Ingest New Authorised Activity</h3>
              <p className="text-xs text-zinc-400">Scoped Project Data In · Deterministic PII & Secret Redaction</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Source Type:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SourceType)}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="GITHUB_PR">GitHub Pull Request</option>
                <option value="GITHUB_COMMIT">GitHub Commit</option>
                <option value="SLACK_CONVERSATION">Slack Conversation</option>
                <option value="ADR">Architectural Decision Record (ADR)</option>
                <option value="JIRA_TASK">Jira / Linear Task</option>
                <option value="MEETING_NOTES">Meeting / Standup Notes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Author / Contributor:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. marcusvance or Elena Davis"
                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Title / Header:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PR #204: Add multi-region read replicas with CockroachDB"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Canonical URL or Path:
            </label>
            <input
              type="text"
              value={urlOrRef}
              onChange={(e) => setUrlOrRef(e.target.value)}
              placeholder="e.g. github.com/nexuspay/core/pull/204 or docs/adr/005.md"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Raw Record Content / Discussion Thread / Diff:
            </label>
            <textarea
              required
              rows={5}
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              placeholder="Paste raw markdown, PR description, code snippet, or Slack chat snippet here..."
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* Privacy Guarantee */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400 flex items-start gap-2.5">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-zinc-200">Trust Guarantee:</strong> Secrets, API keys, and auth headers are automatically scrubbed prior to storage and semantic indexing.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-5 py-2 text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Ingest & Index Activity
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
