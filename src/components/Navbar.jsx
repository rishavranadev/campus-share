import React from 'react';
import { BookOpen, PlusCircle, Search, LayoutDashboard, Compass } from 'lucide-react';

export default function Navbar({
  search,
  setSearch,
  activeTab,
  setActiveTab,
  onOpenPostModal
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('browse')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">CampusShare</h1>
            <span className="text-[11px] font-medium text-slate-500">Academic Resource Hub</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books, mini-drafters, Arduino kits..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'browse'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass size={17} />
            <span className="hidden sm:inline">Browse</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard size={17} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={onOpenPostModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <PlusCircle size={17} />
            <span>List Item</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus equipment..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}