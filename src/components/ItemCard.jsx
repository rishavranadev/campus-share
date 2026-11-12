import React from 'react';
import { User, Mail, Tag, CheckCircle, Clock, Trash2, RotateCcw } from 'lucide-react';

export default function ItemCard({ 
  item, 
  onRequest, 
  isDashboard = false, 
  onApprove, 
  onMarkReturned, 
  onDelete 
}) {
  const statusStyles = {
    Available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Requested: 'bg-amber-100 text-amber-800 border-amber-200',
    Borrowed: 'bg-slate-200 text-slate-700 border-slate-300',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
            {item.department}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[item.status] || statusStyles.Available}`}>
            {item.status}
          </span>
        </div>

        {/* Title & Category */}
        <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1"><Tag size={13} /> {item.category}</span>
          <span>•</span>
          <span>Condition: <strong className="text-slate-700">{item.condition}</strong></span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {item.description || 'No additional description provided.'}
        </p>
      </div>

      <div>
        {/* Terms Pill */}
        <div className="mb-3 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">{item.transaction_type}</span>
          <span className="font-bold text-indigo-700">{item.price}</span>
        </div>

        {/* Owner Info */}
        <div className="text-xs text-slate-600 space-y-1 mb-4 border-t border-slate-100 pt-3">
          <p className="flex items-center gap-1.5 truncate"><User size={14} className="text-slate-400 shrink-0" /> {item.owner_name}</p>
          <p className="flex items-center gap-1.5 truncate"><Mail size={14} className="text-slate-400 shrink-0" /> {item.contact_email}</p>
        </div>

        {/* Request Details if Requested/Borrowed */}
        {isDashboard && item.status !== 'Available' && item.borrower_name && (
          <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <p><strong>Requested by:</strong> {item.borrower_name}</p>
            {item.return_date && <p><strong>Return by:</strong> {item.return_date}</p>}
            {item.borrower_note && <p className="italic">"{item.borrower_note}"</p>}
          </div>
        )}

        {/* Action Buttons */}
        {!isDashboard ? (
          <button
            disabled={item.status !== 'Available'}
            onClick={() => onRequest(item)}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
              item.status === 'Available'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {item.status === 'Available' ? 'Request Resource' : `Currently ${item.status}`}
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {item.status === 'Requested' && (
              <button
                onClick={() => onApprove(item.id)}
                className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-semibold transition"
              >
                <CheckCircle size={14} /> Approve Handover
              </button>
            )}
            {(item.status === 'Requested' || item.status === 'Borrowed') && (
              <button
                onClick={() => onMarkReturned(item.id)}
                className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-xs font-semibold transition"
              >
                <RotateCcw size={14} /> Mark Returned
              </button>
            )}
            <button
              onClick={() => onDelete(item.id)}
              title="Delete Listing"
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}