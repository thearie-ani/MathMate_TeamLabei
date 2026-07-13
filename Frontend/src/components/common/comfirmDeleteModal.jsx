import { AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from './Card';
import Button from './Button';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-[#1a1535]">Delete {itemName}?</h3>
            <p className="text-xs text-gray-500">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
            bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors
            disabled:opacity-50"
          >
            {isLoading && <Loader2 size={13} className="animate-spin" />}
            Delete
          </button>
        </div>
      </Card>
    </div>
  );
}
