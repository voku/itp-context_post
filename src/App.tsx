import { motion } from 'motion/react';
import { ConfluenceView } from './components/ConfluenceView';
import { ContextView } from './components/ContextView';
import { useState } from 'react';
import { FileCode2, BookOpen } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'confluence' | 'context'>('confluence');

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0e1117] flex flex-col font-sans text-gray-900">
      {/* Global Header */}
      <header className="h-14 border-b border-gray-700/50 bg-[#161b22] px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="text-white font-semibold tracking-tight text-lg">
            voku/itp-context <span className="text-gray-400 font-normal text-sm ml-2">Interactive Guide</span>
          </div>
        </div>

        <div className="flex bg-[#0e1117] p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setView('confluence')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
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
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
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
      <main className="flex-1 relative overflow-hidden bg-white">
        {view === 'confluence' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 bg-white"
          >
            <ConfluenceView onSwitch={() => setView('context')} />
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
            <ContextView />
          </motion.div>
        )}
      </main>
    </div>
  );
}
