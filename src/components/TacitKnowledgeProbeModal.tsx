import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Flame, 
  AlertTriangle, 
  ArrowRight,
  UserCheck,
  Brain
} from 'lucide-react';
import { HandoverProject } from '../types';

interface TacitKnowledgeProbeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: HandoverProject;
  onRecordTacitAnswer: (question: string, answer: string, category: string) => void;
}

export const TacitKnowledgeProbeModal: React.FC<TacitKnowledgeProbeModalProps> = ({
  isOpen,
  onClose,
  project,
  onRecordTacitAnswer,
}) => {
  const [topic, setTopic] = useState('Deployment gotchas & operational edge cases');
  const [isLoading, setIsLoading] = useState(false);
  const [probeQuestions, setProbeQuestions] = useState<any[]>([
    {
      id: 'q1',
      category: 'Firefighting Intuition',
      question: `If the clearing pipeline alerts at 2:00 AM on Sunday with high replication lag, what is your exact first intuition before looking at dashboards?`,
      whyWeAsk: 'Critical first-response intuition lives only in the senior engineer\'s mind.'
    },
    {
      id: 'q2',
      category: 'Buried Dependencies',
      question: `Is there any undocumented cron job, bastion host script, or manual token refresh that will fail if you do not perform it for 30 days?`,
      whyWeAsk: 'Tacit operational tasks are the #1 cause of post-departure outages.'
    },
    {
      id: 'q3',
      category: 'Discarded Dead-ends',
      question: `What architectural direction or library did you attempt to use in this repo that utterly failed, so ${project.incomingSuccessor.name} does not repeat the exact same mistake?`,
      whyWeAsk: 'Saves incoming developers weeks of exploring discarded options.'
    }
  ]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [recordedSuccess, setRecordedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentQ = probeQuestions[activeQuestionIndex];

  const handleFetchAiProbes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interview-probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departingMember: project.departingMember,
          topic,
          knownContext: `Project: ${project.name}. Gaps detected: ${project.gaps.map(g => g.title).join(', ')}`,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setProbeQuestions(data.questions);
        setActiveQuestionIndex(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!answerText.trim() || !currentQ) return;
    onRecordTacitAnswer(currentQ.question, answerText.trim(), currentQ.category);
    setAnswerText('');
    setRecordedSuccess(true);
    setTimeout(() => {
      setRecordedSuccess(false);
      if (activeQuestionIndex < probeQuestions.length - 1) {
        setActiveQuestionIndex(activeQuestionIndex + 1);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0f1017] shadow-2xl text-zinc-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                AI Tacit Knowledge Interview Probe
              </h3>
              <p className="text-xs text-zinc-400">
                Extracting unwritten intuition from {project.departingMember.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Topic selector */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic to probe (e.g. Caching gotchas, failure modes)..."
              className="flex-1 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleFetchAiProbes}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 text-xs transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isLoading ? 'Probing...' : 'Generate AI Probes'}</span>
            </button>
          </div>

          {/* Question Navigator */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {probeQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`px-3 py-1 rounded text-xs font-mono transition cursor-pointer shrink-0 ${
                  activeQuestionIndex === idx
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Q{idx + 1}: {q.category}
              </button>
            ))}
          </div>

          {/* Active Question Box */}
          {currentQ && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
                <span>{currentQ.category}</span>
                <span className="text-zinc-500">Why we ask: {currentQ.whyWeAsk}</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                "{currentQ.question}"
              </p>
            </div>
          )}

          {/* Answer Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              {project.departingMember.name}'s Response:
            </label>
            <textarea
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="e.g. Always check the Debezium replication slot status first. If it is inactive, do not restart Kubernetes pod or JVM heap will spike..."
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {recordedSuccess && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Tacit insight captured and linked into handover knowledge graph!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-3.5 bg-zinc-950/80 text-xs">
          <span className="text-zinc-500 font-mono">
            {activeQuestionIndex + 1} of {probeQuestions.length} questions
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-zinc-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={handleSubmitAnswer}
              disabled={!answerText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-1.5 text-xs transition disabled:opacity-40"
            >
              <span>Record Tacit Insight</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
