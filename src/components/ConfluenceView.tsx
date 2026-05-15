import type { ReactNode } from 'react';
import { AlertCircle, Clock, Search, ChevronRight, Menu, Home, Book, FileText, Settings, Users } from 'lucide-react';
import { BlogPostContent } from './BlogPostContent';

export function ConfluenceView({ onSwitch }: { onSwitch?: () => void }) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Fake Confluence Header */}
      <header className="h-12 bg-[#0052CC] text-white flex items-center px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Menu className="w-5 h-5 opacity-80" />
          <div className="font-bold text-lg tracking-tight hover:opacity-80 cursor-pointer">
            <span className="opacity-90">Atlassian</span> Confluence
          </div>
          <div className="hidden md:flex ml-4 gap-4 text-sm font-medium">
            <span className="hover:bg-white/20 px-3 py-1 rounded cursor-pointer transition-colors">Spaces</span>
            <span className="hover:bg-white/20 px-3 py-1 rounded cursor-pointer transition-colors">People</span>
            <span className="hover:bg-white/20 px-3 py-1 rounded cursor-pointer transition-colors">Apps</span>
            <span className="hover:bg-white/20 px-3 py-1 rounded cursor-pointer transition-colors">Templates</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="bg-white/20 hover:bg-white/30 transition-colors flex items-center px-3 py-1.5 rounded-full text-sm">
            <Search className="w-4 h-4 mr-2" />
            <span className="opacity-80">Search... (Ctrl+K)</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-bold text-sm border border-white/20">
            VK
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Fake Confluence Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-[#FAFBFC] flex-col hidden lg:flex shrink-0">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm" />
              <div>
                <div className="font-semibold text-gray-800 leading-tight">Engineering Dept</div>
                <div className="text-xs text-gray-500">Space Directory</div>
              </div>
            </div>
          </div>
          
          <div className="p-2 space-y-1 overflow-y-auto">
            <SidebarItem icon={<Home size={16}/>} label="Overview" />
            <SidebarItem icon={<Book size={16}/>} label="Architecture Decisions" active />
            <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-2 mt-1 mb-2">
              <SidebarItem label="Network Topology 2021" small />
              <SidebarItem label="Database Migration Plan" small />
              <SidebarItem label="Architecture Rules" active small />
              <SidebarItem label="Deprecated: Old Payment API" small />
            </div>
            <SidebarItem icon={<Users size={16}/>} label="Team Guidelines" />
            <SidebarItem icon={<FileText size={16}/>} label="Release Notes" />
            <SidebarItem icon={<Settings size={16}/>} label="Space Settings" />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-8 py-8">
            
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="hover:underline cursor-pointer">Engineering Dept</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="hover:underline cursor-pointer">Pages</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="hover:underline cursor-pointer">Architecture Decisions</span>
            </div>

            {/* Outdated Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8 flex items-start shadow-sm mix-blend-multiply">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-yellow-800">This page may be out of date</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Last updated 14 months ago by <span className="font-medium text-yellow-800 cursor-pointer hover:underline">Someone Who Left</span>. 
                  Some information regarding the Payment API boundaries might no longer reflect the codebase.
                </p>
              </div>
            </div>

            {/* Page Header */}
            <h1 className="text-4xl font-bold text-[#172B4D] mb-4 tracking-tight leading-tight">
              Architecture Decision: External API Boundaries
            </h1>
            
            <div className="flex flex-wrap text-sm text-gray-500 items-center gap-x-4 gap-y-2 mb-10 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-xs">
                  VK
                </div>
                Created by <span className="font-medium text-[#0052CC] cursor-pointer hover:underline">voku</span>
              </div>
              <div className="flex items-center gap-1.5 border-l border-gray-300 pl-4">
                <Clock className="w-4 h-4" />
                <span>Last modified on Oct 24, 2024</span>
              </div>
            </div>

            {/* Content Payload */}
            <div className="prose prose-blue max-w-none text-[#172B4D] prose-headings:text-[#172B4D] prose-a:text-[#0052CC] hover:prose-a:underline">
              <BlogPostContent onSwitch={onSwitch} />
            </div>

            {/* Fake Comments Section */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-[#172B4D] mb-6">Comments (2)</h3>
              
              <div className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 mt-1 flex items-center justify-center text-sm font-semibold text-gray-600">JD</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[#172B4D]">Junior Dev</span>
                    <span className="text-xs text-gray-500">2 months ago</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">The code in <code>StripePaymentGateway</code> is throwing <code>GuzzleException</code>s right now. Does this rule still apply?</p>
                  <div className="flex gap-3 text-xs font-semibold text-gray-500 mt-2">
                    <span className="hover:underline cursor-pointer">Reply</span>
                    <span className="hover:underline cursor-pointer">Like</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 ml-12">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 shrink-0 mt-1 flex items-center justify-center text-sm font-semibold">SA</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[#172B4D]">Senior Architect</span>
                    <span className="text-xs text-gray-500">2 months ago</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">Ah, we decided to make an exception for Stripe to rush the checkout feature last quarter. I forgot to update this page.</p>
                  <div className="flex gap-3 text-xs font-semibold text-gray-500 mt-2">
                    <span className="hover:underline cursor-pointer">Reply</span>
                    <span className="hover:underline cursor-pointer">Like</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-semibold shrink-0">VK</div>
                <div className="flex-1">
                  <div className="border border-gray-300 rounded-md p-3 text-sm text-gray-400 bg-gray-50 cursor-text">
                    Write a comment...
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, small }: { icon?: ReactNode, label: string, active?: boolean, small?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
      active ? 'bg-[#EBECF0] text-[#0052CC] font-medium' : 'text-[#42526E] hover:bg-gray-100'
    } ${small ? 'text-sm' : 'text-sm'}`}>
      {icon && <span className="opacity-70">{icon}</span>}
      <span className="truncate">{label}</span>
    </div>
  )
}
