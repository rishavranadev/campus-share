import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function RequestModal({ item, onClose, onConfirm }) {
  const [borrowerName, setBorrowerName] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [borrowerNote, setBorrowerNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onConfirm(item.id, {
      borrower_name: borrowerName,
      return_date: returnDate,
      borrower_note: borrowerNote
    });
    setSubmitting(false);
    setBorrowerName('');
    setReturnDate('');
    setBorrowerNote('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Request Equipment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-xs font-medium text-indigo-600">{item.department}</p>
            <p className="text-sm font-bold text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-600 mt-0.5">Owner: {item.owner_name}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name & Enrollment/Year *</label>
            <input
              required
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="e.g., Ankit Sharma (ME 1st Yr)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Return Date *</label>
            <input
              required
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Message to Owner</label>
            <textarea
              rows="2"
              value={borrowerNote}
              onChange={(e) => setBorrowerNote(e.target.value)}
              placeholder="Needed for semester lab exams..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}