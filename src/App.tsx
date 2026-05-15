import { motion } from 'motion/react';
import { ConfluenceView } from './components/ConfluenceView';
import { ContextView } from './components/ContextView';
import { useEffect, useState } from 'react';
import { FileCode2, BookOpen, Info, X } from 'lucide-react';

type FeedbackTone = 'info' | 'warning' | 'success';

type DemoFeedback = {
  id: number;
  title: string;
  message: string;
  tone: FeedbackTone;
};

const feedbackStyles: Record<FeedbackTone, string> = {
  info: 'border-blue-500/40 bg-[#161b22] text-blue-100',
  warning: 'border-yellow-500/40 bg-[#211a08] text-yellow-100',
  success: 'border-green-500/40 bg-[#0f1f17] text-green-100',
};

export default function App() {
  const [view, setView] = useState<'confluence' | 'context'>('confluence');
  const [feedback, setFeedback] = useState<DemoFeedback | null>(null);

  const showFeedback = (title: string, message: string, tone: FeedbackTone = 'info') => {
    setFeedback({
      id: Date.now(),
      title,
      message,
      tone,
    });
  };

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

  return (
    <div className="min-safe-screen flex w-full flex-col overflow-hidden bg-[#0e1117] font-sans text-gray-900">
      {/* Global Header */}
      <header className="z-20 flex shrink-0 flex-col gap-3 border-b border-gray-700/50 bg-[#161b22] px-4 py-3 md:h-14 md:flex-row md:items-center md:justify-between md:py-0">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold tracking-tight text-white">
            voku/itp-context_post <span className="ml-2 text-sm font-normal text-gray-400">Interactive Demo</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-700 bg-[#0e1117] p-1">
          <button
            onClick={() => setView('confluence')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              view === 'confluence'
                ? 'bg-[#21262d] text-blue-400 shadow-sm border border-gray-600/50'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Stale Confluence
          </button>
          <button
            onClick={() => setView('context')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              view === 'context'
                ? 'bg-[#21262d] text-green-400 shadow-sm border border-gray-600/50'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50 border border-transparent'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Living Architecture
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative min-h-0 flex-1 overflow-hidden bg-white">
        {view === 'confluence' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 bg-white"
          >
            <ConfluenceView onSwitch={() => setView('context')} onFeedback={showFeedback} />
          </motion.div>
        )}
        
        {view === 'context' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 bg-[#0e1117]"
          >
            <ContextView onFeedback={showFeedback} />
          </motion.div>
        )}
      </main>

      {feedback && (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end">
          <div
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${feedbackStyles[feedback.tone]}`}
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{feedback.title}</div>
              <p className="mt-1 text-sm opacity-90">{feedback.message}</p>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setFeedback(null)}
              className="rounded-full p-1 text-current/70 transition hover:bg-white/10 hover:text-current"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
