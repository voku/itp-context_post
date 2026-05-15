import { Fragment, useState } from 'react';
import { FileCode2, Play, Search, Shield, Info, Terminal, Folder, File, ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  contentKey?: keyof typeof fileContents;
};

type FileContentKey = keyof typeof fileContents;

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

export function ContextView() {
  const [activeFile, setActiveFile] = useState<FileContentKey>('PaymentGateway.php');
  const [activeRule, setActiveRule] = useState<string | null>(null);

  const handleFileChange = (file: FileContentKey) => {
    setActiveFile(file);
    setActiveRule(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#0e1117] text-[#c9d1d9] font-sans">
      
      {/* Main IDE area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* File Explorer Sidebar */}
        <aside className="w-64 border-r border-gray-700/50 bg-[#0d1117] flex flex-col shrink-0">
          <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase px-4 py-3 border-b border-gray-700/50">
            Explorer
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <Tree node={fileTree[0]} depth={0} activeFile={activeFile} onSelect={handleFileChange} />
          </div>
        </aside>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          {/* Tabs */}
          <div className="flex items-center bg-[#010409] overflow-x-auto no-scrollbar shrink-0 border-b border-gray-700/50">
            {(Object.keys(fileContents) as Array<keyof typeof fileContents>).map(filename => (
              <div 
                key={filename}
                onClick={() => handleFileChange(filename)}
                className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-gray-700/50 cursor-pointer min-w-max transition-colors ${
                  activeFile === filename 
                    ? 'bg-[#0d1117] text-white border-t-2 border-t-[#2f81f7]' 
                    : 'bg-[#010409] text-gray-500 hover:bg-[#0d1117]/50 border-t-2 border-t-transparent'
                }`}
              >
                <FileCode2 className={`w-4 h-4 ${filename.endsWith('.php') ? 'text-[#8892bf]' : ''}`} />
                {filename}
              </div>
            ))}
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto p-4 md:p-6 pb-20 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFile}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[13px] md:text-sm leading-relaxed whitespace-pre"
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

            {/* Instruction tooltip overlay */}
            {activeFile === 'PaymentGateway.php' && !activeRule && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1f242c] border border-[#30363d] px-4 py-3 rounded-xl shadow-2xl animate-pulse cursor-pointer" onClick={() => setActiveRule('ExternalApiBoundary')}>
                <div className="flex items-center gap-2 text-blue-400 font-medium">
                  <Play className="w-4 h-4 fill-current" />
                  Click the #[Rule(...)] attribute to resolve context
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Context Panel (The "Agent" / Resolution View) */}
        <AnimatePresence>
          {activeRule && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-700/50 bg-[#161b22] flex flex-col shrink-0 overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-4 border-b border-gray-700/50 flex items-center justify-between shrink-0 bg-[#0d1117]">
                <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                  <Shield className="w-4 h-4" />
                  Context Resolved
                </div>
                <button onClick={() => setActiveRule(null)} className="text-gray-500 hover:text-white text-xs px-2 py-1 bg-gray-800 rounded">
                  Close
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-6 w-[320px]">
                
                <div>
                  <div className="text-xs text-gray-400 font-mono mb-1">Rule Identifier</div>
                  <div className="font-mono text-[#79c0ff] bg-[#1f242c] border border-[#30363d] px-3 py-1.5 rounded-md inline-block shadow-inner">
                    {activeRule}
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all rounded-full -mr-8 -mt-8" />
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Statement</div>
                  <p className="text-sm text-gray-200 leading-snug">
                    Keep external API communication behind adapter boundaries.
                  </p>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Rationale</div>
                  <p className="text-sm text-gray-400 italic">
                    "Domain and application code must not depend on HTTP clients, transport errors, or provider-specific response formats."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Owner</div>
                    <div className="text-[#a5d6ff] text-sm">Team-Backend</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Tier</div>
                    <div className="flex items-center gap-1.5 text-orange-400 text-sm font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Required
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#30363d]">
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" />
                    Agent Readout
                  </div>
                  <div className="bg-black/50 border border-gray-800 rounded-md p-3 font-mono text-xs text-[#8b9eb5] leading-relaxed relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500/50 rounded-l-md" />
                    <strong>Agent:</strong> Found <code>#[Rule]</code> annotation. Checking catalog... Rule is Tier::Required. I will not implement HTTP logic here.
                  </div>
                </div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Terminal Area */}
      <div className="h-48 border-t border-gray-700/50 bg-[#010409] flex flex-col shrink-0 relative z-20">
        <div className="flex items-center px-4 py-2 border-b border-gray-700/30 gap-4 text-xs font-mono">
          <div className="text-gray-400 hover:text-white cursor-pointer uppercase tracking-wider">Terminal</div>
          <div className="text-gray-600 hover:text-white cursor-pointer uppercase tracking-wider border-b-2 border-transparent hover:border-gray-500">Problems</div>
          <div className="text-gray-600 hover:text-white cursor-pointer uppercase tracking-wider border-b-2 border-transparent hover:border-gray-500">Output</div>
          
          <div className="ml-auto text-green-400/80 flex items-center gap-2 bg-green-500/10 px-2 py-1 rounded">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Validation Passed
          </div>
        </div>
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto">
          <div className="text-gray-500 mb-1">$ vendor/bin/itp-context-validate 'Acme\Context\ArchitectureRules'</div>
          <div className="text-gray-300">Loading catalog from default path...</div>
          <div className="text-gray-300">Scanning enum Acme\Context\ArchitectureRules...</div>
          <div className="text-[#3fb950] mt-2 flex items-center gap-2">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>
            1 rule validated successfully.
          </div>
          <div className="text-[#3fb950] flex items-center gap-2">
             <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>
             Catalog and AST are in sync.
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for syntax highlighting

function PaymentGatewayCode({ activeRule, onRuleClick }: { activeRule: string | null, onRuleClick: (r: string) => void }) {
  const isRuleActive = activeRule === 'ExternalApiBoundary';
  
  return (
    <>
      <span className="text-[#ff7b72]">{'<?php\n\n'}</span>
      <span className="text-[#ff7b72]">declare</span>(strict_types=<span className="text-[#79c0ff]">1</span>);{'\n\n'}
      <span className="text-[#ff7b72]">namespace</span> <span className="text-[#d2a8ff]">Acme\Payment</span>;{'\n\n'}
      <span className="text-[#ff7b72]">use</span> <span className="text-[#c9d1d9]">Acme\Context\ArchitectureRules</span>;{'\n'}
      <span className="text-[#ff7b72]">use</span> <span className="text-[#c9d1d9]">ItpContext\Attribute\Rule</span>;{'\n\n'}
      
      {/* The interactive rule attribute */}
      <span className="text-[#8b949e]">#[</span>
      <span className="text-[#d2a8ff]">Rule</span>(
      <span 
        onClick={() => onRuleClick('ExternalApiBoundary')}
        className={`cursor-pointer rounded transition-all duration-300 relative inline-block group ${
          isRuleActive 
            ? 'bg-[#1f6feb]/30 text-[#a5d6ff] ring-1 ring-[#1f6feb] scale-[1.02] z-10' 
            : 'text-[#a5d6ff] hover:bg-[#1f6feb]/20 hover:text-[#c9d1d9]'
        }`}
      >
        <span className="px-1">ArchitectureRules::ExternalApiBoundary</span>
        {/* Glow effect when active */}
        {isRuleActive && (
          <div className="absolute inset-0 bg-blue-500/20 blur-sm rounded" />
        )}
      </span>
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
      
      <div className={`transition-all duration-300 pl-4 py-2 my-1 -ml-4 border-l-2 rounded-r-lg ${isRuleActive ? 'bg-[#1f6feb]/10 border-blue-500 shadow-inner' : 'border-transparent'}`}>
        {'    '}<span 
            onClick={() => onRuleClick('ExternalApiBoundary')}
            className="text-[#a5d6ff] cursor-pointer hover:underline"
          >'ExternalApiBoundary'</span> <span className="text-[#ff7b72]">=&gt; new</span> <span className="text-[#d2a8ff]">RuleDef</span>({'\n'}
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
        <div className={`transition-all duration-300 pl-4 py-1 my-1 -ml-4 border-l-2 rounded-r-lg ${isRuleActive ? 'bg-[#1f6feb]/10 border-blue-500 shadow-inner' : 'border-transparent'}`}>
          {'    '}<span className="text-[#ff7b72]">case</span> <span 
            className="text-[#c9d1d9] cursor-pointer hover:text-blue-400"
            onClick={() => onRuleClick('ExternalApiBoundary')}
          >ExternalApiBoundary</span>;
        </div>
        {'}'}
    </>
  );
}

// Tree view helper
function Tree({ node, depth, activeFile, onSelect }: { node: FileNode, depth: number, activeFile: string, onSelect: (f: FileContentKey) => void }) {
  const [isOpen, setIsOpen] = useState(true);
  
  if (node.type === 'file') {
    if (!node.contentKey) {
      return null;
    }

    const contentKey = node.contentKey;

    return (
      <div 
        onClick={() => onSelect(contentKey)}
        className={`flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-colors ${activeFile === contentKey ? 'bg-[#1f6feb]/20 text-[#a5d6ff]' : 'text-gray-400 hover:bg-[#161b22] hover:text-gray-300'}`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        <FileCode2 className={`w-3.5 h-3.5 ${activeFile === contentKey ? 'text-[#a5d6ff]' : 'text-gray-500'}`} />
        <span className="text-sm truncate">{node.name}</span>
      </div>
    )
  }
  
  return (
    <div>
      <div 
        className="flex items-center gap-1 px-2 py-1 cursor-pointer text-gray-300 hover:bg-[#161b22]"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
        <Folder className="w-3.5 h-3.5 text-[#8b949e]" />
        <span className="text-sm">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <Fragment key={child.name}>
              <Tree node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
