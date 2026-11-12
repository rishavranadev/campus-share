import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import ItemCard from './components/ItemCard';
import PostItemModal from './components/PostItemModal';
import RequestModal from './components/RequestModal';
import { Filter, RefreshCw, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Mechanical',
  'Electronics & Comm',
  'Civil',
  'Electrical',
  'Applied Sciences'
];

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'dashboard'

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [requestItem, setRequestItem] = useState(null);

  // Fetch all records from Supabase
  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg('Failed to load database records. Check your .env Supabase credentials.');
      console.error(error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Create new item
  const handleAddItem = async (newItemData) => {
    const { error } = await supabase.from('items').insert([newItemData]);
    if (!error) {
      setIsPostModalOpen(false);
      fetchItems();
    } else {
      alert('Error adding listing: ' + error.message);
    }
  };

  // Submit borrow request
  const handleConfirmRequest = async (itemId, requestDetails) => {
    const { error } = await supabase
      .from('items')
      .update({
        status: 'Requested',
        ...requestDetails
      })
      .eq('id', itemId);

    if (!error) {
      setRequestItem(null);
      fetchItems();
    }
  };

  // Approve handover (Requested -> Borrowed)
  const handleApproveHandover = async (itemId) => {
    const { error } = await supabase
      .from('items')
      .update({ status: 'Borrowed' })
      .eq('id', itemId);
    if (!error) fetchItems();
  };

  // Mark item as returned (Borrowed/Requested -> Available)
  const handleMarkReturned = async (itemId) => {
    const { error } = await supabase
      .from('items')
      .update({
        status: 'Available',
        borrower_name: null,
        borrower_note: null,
        return_date: null
      })
      .eq('id', itemId);
    if (!error) fetchItems();
  };

  // Delete listing
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    const { error } = await supabase.from('items').delete().eq('id', itemId);
    if (!error) fetchItems();
  };

  // Filter items for browse view
  const filteredItems = items.filter((item) => {
    const matchesDept = selectedDept === 'All' || item.department === selectedDept;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !onlyAvailable || item.status === 'Available';
    return matchesDept && matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        search={search}
        setSearch={setSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Banner if Supabase connection fails */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'browse' ? (
          <>
            {/* Department Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Filter size={16} className="text-slate-400 shrink-0 mr-1" />
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      selectedDept === dept
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Available Only
              </label>
            </div>

            {/* Catalog Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Campus Equipment Catalog ({filteredItems.length})
              </h2>
              <button
                onClick={fetchItems}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="text-center py-20 text-slate-500 text-sm">Loading campus resources...</div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
                <p className="text-slate-600 font-medium mb-1">No matching resources found</p>
                <p className="text-xs text-slate-400">Try clearing your search filters or post a new item.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onRequest={(selected) => setRequestItem(selected)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Management Dashboard View */
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Resource Management Dashboard</h2>
              <p className="text-sm text-slate-500">Approve incoming borrow requests, track active handovers, or mark returned items.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isDashboard={true}
                  onApprove={handleApproveHandover}
                  onMarkReturned={handleMarkReturned}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleAddItem}
      />

      <RequestModal
        item={requestItem}
        onClose={() => setRequestItem(null)}
        onConfirm={handleConfirmRequest}
      />
    </div>
  );
}