import { Fragment, useMemo, useState } from 'react';
import { FileCode2, Play, Shield, Terminal, Folder, ChevronDown, AlertCircle, PanelLeftOpen, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  contentKey?: keyof typeof fileContents;
};

type FeedbackTone = 'info' | 'warning' | 'success';
type PanelTab = 'terminal' | 'problems' | 'output';
type FileContentKey = keyof typeof fileContents;

type ContextViewProps = {
  onFeedback?: (title: string, message: string, tone?: FeedbackTone) => void;
};

const fileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'Context',
        type: 'folder',
        children: [
          { name: 'ArchitectureRules.php', type: 'file', contentKey: 'ArchitectureRules.php' },
          { name: 'rule-catalog.php', type: 'file', contentKey: 'rule-catalog.php' },
        ]
      },
      {
        name: 'Payment',
        type: 'folder',
        children: [
          { name: 'PaymentGateway.php', type: 'file', contentKey: 'PaymentGateway.php' },
        ]
      }
    ]
  }
];

const fileContents = {
  'ArchitectureRules.php': `<?php\n\ndeclare(strict_types=1);\n\nnamespace Acme\\Context;\n\nuse ItpContext\\Contract\\RuleIdentifier;\n\nenum ArchitectureRules implements RuleIdentifier\n{\n    case ExternalApiBoundary;\n}`,
  'rule-catalog.php': `<?php\n\ndeclare(strict_types=1);\n\nnamespace Acme\\Context;\n\nuse ItpContext\\Enum\\Tier;\nuse ItpContext\\Model\\RuleDef;\n\nreturn [\n    'ExternalApiBoundary' => new RuleDef(\n        statement: 'Keep external API communication behind adapter boundaries.',\n        tier: Tier::Required,\n        owner: 'Team-Backend',\n        rationale: 'Domain and application code must not depend on HTTP clients, transport errors, or provider-specific response formats.',\n        verifiedBy: [\n            'tests/Architecture/ExternalApiBoundaryTest.php',\n        ],\n        refs: [\n            'docs/adr/external-api-boundaries.md',\n        ],\n    ),\n];`,
  'PaymentGateway.php': `<?php\n\ndeclare(strict_types=1);\n\nnamespace Acme\\Payment;\n\nuse Acme\\Context\\ArchitectureRules;\nuse ItpContext\\Attribute\\Rule;\n\n#[Rule(ArchitectureRules::ExternalApiBoundary)]\ninterface PaymentGateway\n{\n    public function authorize(PaymentRequest $request): PaymentResult;\n}`
};

const terminalTabs: Array<{ id: PanelTab; label: string }> = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'problems', label: 'Problems' },
  { id: 'output', label: 'Output' },
];

export function ContextView({ onFeedback }: ContextViewProps) {
  const [activeFile, setActiveFile] = useState<FileContentKey>('PaymentGateway.php');
  const [activeRule, setActiveRule] = useState<string | null>(null);
  const [footerTab, setFooterTab] = useState<PanelTab>('terminal');
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const handleFileChange = (file: FileContentKey) => {
    setActiveFile(file);
    setActiveRule(null);
    setIsExplorerOpen(false);
  };

  const footerDetails = useMemo(() => {
    switch (footerTab) {
      case 'problems':
        return {
          status: '0 issues in the selected slice',
          tone: 'success' as const,
          lines: [
            { className: 'text-gray-500', text: 'No unresolved Problems in the current context.' },
            { className: 'text-[#3fb950]', text: '✓ Rule metadata, enum, and adapter interface are aligned.' },
            { className: 'text-gray-400', text: 'Tip: open the catalog or enum file to inspect the resolved rule sources.' },
          ],
        };
      case 'output':
        return {
          status: 'Context resolver trace available',
          tone: 'info' as const,
          lines: [
            { className: 'text-gray-500', text: '> Context resolver booted with inline metadata enabled' },
            { className: 'text-gray-300', text: 'Resolved ArchitectureRules::ExternalApiBoundary from PaymentGateway.php' },
            { className: 'text-[#79c0ff]', text: 'Expanded rule details from rule-catalog.php and ArchitectureRules.php' },
          ],
        };
      case 'terminal':
      default:
        return {
          status: 'Validation Passed',
          tone: 'success' as const,
          lines: [
            { className: 'text-gray-500', text: "$ vendor/bin/itp-context-validate 'Acme\\Context\\ArchitectureRules'" },
            { className: 'text-gray-300', text: 'Loading catalog from default path...' },
            { className: 'text-gray-300', text: 'Scanning enum Acme\\Context\\ArchitectureRules...' },
            { className: 'text-[#3fb950]', text: '✓ 1 rule validated successfully.' },
            { className: 'text-[#3fb950]', text: '✓ Catalog and AST are in sync.' },
          ],
        };
    }
  }, [footerTab]);

  const footerStatusClass =
    footerDetails.tone === 'success'
      ? 'bg-green-500/10 text-green-400/80'
      : 'bg-blue-500/10 text-blue-300';

  return (
    <div className="flex h-full flex-col bg-[#0e1117] font-sans text-[#c9d1d9]">
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <AnimatePresence>
          {isExplorerOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close explorer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExplorerOpen(false)}
                className="absolute inset-0 z-20 bg-black/60 md:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.2 }}
                className="absolute inset-y-0 left-0 z-30 flex w-[85vw] max-w-xs flex-col border-r border-gray-700/50 bg-[#0d1117] md:hidden"
              >
                <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Explorer</div>
                  <button
                    type="button"
                    onClick={() => setIsExplorerOpen(false)}
                    className="rounded p-1 text-gray-400 transition hover:bg-[#161b22] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  <Tree node={fileTree[0]} depth={0} activeFile={activeFile} onSelect={handleFileChange} />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-700/50 bg-[#0d1117] md:flex">
          <div className="border-b border-gray-700/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Explorer
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <Tree node={fileTree[0]} depth={0} activeFile={activeFile} onSelect={handleFileChange} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-[#0d1117]">
          <div className="flex items-center justify-between gap-2 border-b border-gray-700/50 bg-[#010409] px-3 py-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsExplorerOpen(true)}
              className="flex items-center gap-2 rounded-md border border-gray-700/70 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-[#161b22]"
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
              Explorer
            </button>
            <div className="min-w-0 truncate text-xs text-gray-400">{activeFile}</div>
            <button
              type="button"
              onClick={() =>
                activeRule
                  ? setActiveRule(null)
                  : onFeedback?.('Resolve a rule first', 'Tap the highlighted #[Rule(...)] attribute to open the context panel.', 'info')
              }
              className="rounded-md border border-gray-700/70 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-[#161b22]"
            >
              {activeRule ? 'Hide context' : 'Show context'}
            </button>
          </div>

          <div className="flex items-center bg-[#010409] overflow-x-auto no-scrollbar shrink-0 border-b border-gray-700/50">
            {(Object.keys(fileContents) as Array<FileContentKey>).map((filename) => (
              <button
                type="button"
                key={filename}
                onClick={() => handleFileChange(filename)}
                className={`flex min-w-max items-center gap-2 border-r border-gray-700/50 px-4 py-2 text-sm transition-colors ${
                  activeFile === filename
                    ? 'border-t-2 border-t-[#2f81f7] bg-[#0d1117] text-white'
                    : 'border-t-2 border-t-transparent bg-[#010409] text-gray-500 hover:bg-[#0d1117]/50'
                }`}
              >
                <FileCode2 className={`h-4 w-4 ${filename.endsWith('.php') ? 'text-[#8892bf]' : ''}`} />
                {filename}
              </button>
            ))}
          </div>

          <div className="relative flex-1 overflow-auto px-4 pb-20 pt-4 md:px-6 md:pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFile}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[13px] leading-relaxed whitespace-pre md:text-sm"
              >
                {activeFile === 'PaymentGateway.php' && (
                  <PaymentGatewayCode activeRule={activeRule} onRuleClick={setActiveRule} />
                )}
                {activeFile === 'rule-catalog.php' && (
                  <CatalogCode activeRule={activeRule} onRuleClick={setActiveRule} />
                )}
                {activeFile === 'ArchitectureRules.php' && (
                  <RulesEnumCode activeRule={activeRule} onRuleClick={setActiveRule} />
                )}
              </motion.div>
            </AnimatePresence>

            {activeFile === 'PaymentGateway.php' && !activeRule && (
              <button
                type="button"
                onClick={() => setActiveRule('ExternalApiBoundary')}
                className="absolute left-1/2 top-1/2 w-[min(90%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#30363d] bg-[#1f242c] px-4 py-3 text-left shadow-2xl transition hover:border-[#2f81f7]"
              >
                <div className="flex items-center gap-2 font-medium text-blue-400">
                  <Play className="h-4 w-4 fill-current" />
                  Click the #[Rule(...)] attribute to resolve context
                </div>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {activeRule && (
            <>
              <motion.button
                type="button"
                aria-label="Close context panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveRule(null)}
                className="fixed inset-0 z-30 bg-black/50 xl:hidden"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.22 }}
                className="fixed inset-x-0 bottom-0 z-40 max-h-[70vh] xl:hidden"
              >
                <div className="mx-auto flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-gray-700/60 bg-[#161b22] shadow-2xl">
                  <ContextDetailsPanel activeRule={activeRule} onClose={() => setActiveRule(null)} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeRule && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="relative z-10 hidden shrink-0 overflow-hidden border-l border-gray-700/50 bg-[#161b22] shadow-2xl xl:flex"
            >
              <ContextDetailsPanel activeRule={activeRule} onClose={() => setActiveRule(null)} widthClassName="w-[320px]" />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-20 flex h-40 shrink-0 flex-col border-t border-gray-700/50 bg-[#010409] sm:h-44 md:h-48">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-700/30 px-4 py-2 font-mono text-xs">
          {terminalTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFooterTab(tab.id)}
              className={`rounded px-2 py-1 uppercase tracking-wider transition ${
                footerTab === tab.id
                  ? 'bg-[#161b22] text-white'
                  : 'text-gray-500 hover:bg-[#161b22] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              onFeedback?.(
                'Static demo shell',
                'The footer now has working tabs, but it still represents a simplified IDE and not a full editor.',
                'info',
              )
            }
            className="rounded-full p-1 text-gray-500 transition hover:bg-[#161b22] hover:text-white"
            aria-label="Explain footer status"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          <div className={`ml-auto flex items-center gap-2 rounded px-2 py-1 ${footerStatusClass}`}>
            <div className={`h-2 w-2 rounded-full ${footerDetails.tone === 'success' ? 'bg-green-500' : 'bg-blue-400'}`} />
            {footerDetails.status}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
          {footerDetails.lines.map((line) => (
            <div key={line.text} className={`${line.className} mb-1`}>
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContextDetailsPanel({
  activeRule,
  onClose,
  widthClassName,
}: {
  activeRule: string;
  onClose: () => void;
  widthClassName?: string;
}) {
  return (
    <div className={`flex h-full flex-col ${widthClassName ?? ''}`}>
      <div className="flex shrink-0 items-center justify-between border-b border-gray-700/50 bg-[#0d1117] p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-green-400">
          <Shield className="h-4 w-4" />
          Context Resolved
        </div>
        <button onClick={onClose} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-500 hover:text-white">
          Close
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <div>
          <div className="mb-1 font-mono text-xs text-gray-400">Rule Identifier</div>
          <div className="inline-block rounded-md border border-[#30363d] bg-[#1f242c] px-3 py-1.5 font-mono text-[#79c0ff] shadow-inner">
            {activeRule}
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117] p-4 shadow-sm">
          <div className="absolute -mr-8 -mt-8 right-0 top-0 h-16 w-16 rounded-full bg-blue-500/10 blur-xl transition-all group-hover:bg-blue-500/20" />
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">Statement</div>
          <p className="text-sm leading-snug text-gray-200">
            Keep external API communication behind adapter boundaries.
          </p>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">Rationale</div>
          <p className="text-sm italic text-gray-400">
            "Domain and application code must not depend on HTTP clients, transport errors, or provider-specific response formats."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">Owner</div>
            <div className="text-sm text-[#a5d6ff]">Team-Backend</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">Tier</div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-orange-400">
              <AlertCircle className="h-3 w-3" />
              Required
            </div>
          </div>
        </div>

        <div className="border-t border-[#30363d] pt-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
            <Terminal className="h-3.5 w-3.5" />
            Agent Readout
          </div>
          <div className="relative rounded-md border border-gray-800 bg-black/50 p-3 font-mono text-xs leading-relaxed text-[#8b9eb5]">
            <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-md bg-green-500/50" />
            <strong>Agent:</strong> Found <code>#[Rule]</code> annotation. Checking catalog... Rule is Tier::Required. I will not implement HTTP logic here.
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentGatewayCode({ activeRule, onRuleClick }: { activeRule: string | null, onRuleClick: (r: string) => void }) {
  const isRuleActive = activeRule === 'ExternalApiBoundary';

  return (
    <>
      <span className="text-[#ff7b72]">{'<?php\n\n'}</span>
      <span className="text-[#ff7b72]">declare</span>(strict_types=<span className="text-[#79c0ff]">1</span>);{'\n\n'}
      <span className="text-[#ff7b72]">namespace</span> <span className="text-[#d2a8ff]">Acme\Payment</span>;{'\n\n'}
      <span className="text-[#ff7b72]">use</span> <span className="text-[#c9d1d9]">Acme\Context\ArchitectureRules</span>;{'\n'}
      <span className="text-[#ff7b72]">use</span> <span className="text-[#c9d1d9]">ItpContext\Attribute\Rule</span>;{'\n\n'}

      <span className="text-[#8b949e]">#[</span>
      <span className="text-[#d2a8ff]">Rule</span>(
      <button
        type="button"
        onClick={() => onRuleClick('ExternalApiBoundary')}
        className={`group relative inline-block rounded transition-all duration-300 ${
          isRuleActive
            ? 'z-10 scale-[1.02] text-[#a5d6ff] ring-1 ring-[#1f6feb] bg-[#1f6feb]/30'
            : 'text-[#a5d6ff] hover:bg-[#1f6feb]/20 hover:text-[#c9d1d9]'
        }`}
      >
        <span className="px-1">ArchitectureRules::ExternalApiBoundary</span>
        {isRuleActive && (
          <div className="absolute inset-0 rounded bg-blue-500/20 blur-sm" />
        )}
      </button>
      )<span className="text-[#8b949e]">]</span>{'\n'}

      <span className="text-[#ff7b72]">interface</span> <span className="text-[#d2a8ff]">PaymentGateway</span>{'\n'}
      {'{'}{'\n'}
      {'    '}<span className="text-[#ff7b72]">public function</span> <span className="text-[#d2a8ff]">authorize</span>(<span className="text-[#c9d1d9]">PaymentRequest</span> <span className="text-[#a5d6ff]">$request</span>): <span className="text-[#c9d1d9]">PaymentResult</span>;{'\n'}
      {'}'}
    </>
  );
}

function CatalogCode({ activeRule, onRuleClick }: { activeRule: string | null, onRuleClick: (r: string) => void }) {
  const isRuleActive = activeRule === 'ExternalApiBoundary';
  return (
    <>
      <span className="text-[#ff7b72]">{'<?php\n\n'}</span>
      <span className="text-[#ff7b72]">declare</span>(strict_types=<span className="text-[#79c0ff]">1</span>);{'\n\n'}
      <span className="text-[#ff7b72]">namespace</span> <span className="text-[#d2a8ff]">Acme\Context</span>;{'\n\n'}
      <span className="text-[#ff7b72]">use</span> <span className="text-[#c9d1d9]">ItpContext\Enum\Tier</span>;{'\n'}
      <span className="text-[#ff7b72]">use</span> <span className="text-[#c9d1d9]">ItpContext\Model\RuleDef</span>;{'\n\n'}
      <span className="text-[#ff7b72]">return</span> [{'\n'}

      <div className={`-ml-4 my-1 rounded-r-lg border-l-2 py-2 pl-4 transition-all duration-300 ${isRuleActive ? 'border-blue-500 bg-[#1f6feb]/10 shadow-inner' : 'border-transparent'}`}>
        {'    '}<button
          type="button"
          onClick={() => onRuleClick('ExternalApiBoundary')}
          className="text-[#a5d6ff] hover:underline"
        >'ExternalApiBoundary'</button> <span className="text-[#ff7b72]">=&gt; new</span> <span className="text-[#d2a8ff]">RuleDef</span>({'\n'}
        {'        '}statement: <span className="text-[#a5d6ff]">'Keep external API communication behind adapter boundaries.'</span>,{'\n'}
        {'        '}tier: <span className="text-[#c9d1d9]">Tier::Required</span>,{'\n'}
        {'        '}owner: <span className="text-[#a5d6ff]">'Team-Backend'</span>,{'\n'}
        {'        '}rationale: <span className="text-[#a5d6ff]">'Domain and application code must not depend on HTTP clients, transport errors, or provider-specific response formats.'</span>,{'\n'}
        {'        '}verifiedBy: [{'\n'}
        {'            '}<span className="text-[#a5d6ff]">'tests/Architecture/ExternalApiBoundaryTest.php'</span>,{'\n'}
        {'        '}],{'\n'}
        {'        '}refs: [{'\n'}
        {'            '}<span className="text-[#a5d6ff]">'docs/adr/external-api-boundaries.md'</span>,{'\n'}
        {'        '}],{'\n'}
        {'    '}),{'\n'}
      </div>

      ];
    </>
  );
}

function RulesEnumCode({ activeRule, onRuleClick }: { activeRule: string | null, onRuleClick: (r: string) => void }) {
  const isRuleActive = activeRule === 'ExternalApiBoundary';
  return (
    <>
      <span className="text-[#ff7b72]">{'<?php\n\n'}</span>
      <span className="text-[#ff7b72]">declare</span>(strict_types=<span className="text-[#79c0ff]">1</span>);{'\n\n'}
      <span className="text-[#ff7b72]">namespace</span> <span className="text-[#d2a8ff]">Acme\Context</span>;{'\n\n'}
      <span className="text-[#ff7b72]">use</span> <span className="text-[#c9d1d9]">ItpContext\Contract\RuleIdentifier</span>;{'\n\n'}
      <span className="text-[#ff7b72]">enum</span> <span className="text-[#d2a8ff]">ArchitectureRules</span> <span className="text-[#ff7b72]">implements</span> <span className="text-[#c9d1d9]">RuleIdentifier</span>{'\n'}
      {'{'}{'\n'}
      <div className={`-ml-4 my-1 rounded-r-lg border-l-2 py-1 pl-4 transition-all duration-300 ${isRuleActive ? 'border-blue-500 bg-[#1f6feb]/10 shadow-inner' : 'border-transparent'}`}>
        {'    '}<span className="text-[#ff7b72]">case</span> <button
          type="button"
          className="text-[#c9d1d9] hover:text-blue-400"
          onClick={() => onRuleClick('ExternalApiBoundary')}
        >ExternalApiBoundary</button>;
      </div>
      {'}'}
    </>
  );
}

function Tree({ node, depth, activeFile, onSelect }: { node: FileNode, depth: number, activeFile: string, onSelect: (f: FileContentKey) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'file') {
    if (!node.contentKey) {
      return null;
    }

    const contentKey = node.contentKey;

    return (
      <button
        type="button"
        onClick={() => onSelect(contentKey)}
        className={`flex w-full items-center gap-1.5 px-2 py-1 text-left transition-colors ${activeFile === contentKey ? 'bg-[#1f6feb]/20 text-[#a5d6ff]' : 'text-gray-400 hover:bg-[#161b22] hover:text-gray-300'}`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        <FileCode2 className={`h-3.5 w-3.5 ${activeFile === contentKey ? 'text-[#a5d6ff]' : 'text-gray-500'}`} />
        <span className="truncate text-sm">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center gap-1 px-2 py-1 text-left text-gray-300 hover:bg-[#161b22]"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
        <Folder className="h-3.5 w-3.5 text-[#8b949e]" />
        <span className="text-sm">{node.name}</span>
      </button>
      {isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <Fragment key={child.name}>
              <Tree node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
