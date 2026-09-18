import React from 'react';
import { ToastMessage } from '../types';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let borderClass = 'border-[#4fc3f7] bg-[#142332]/95 text-white';
        let Icon = Info;
        let iconColor = 'text-[#4fc3f7]';

        if (toast.type === 'critical') {
          borderClass = 'border-[#ef5350] bg-[#221518]/95 text-white';
          Icon = XCircle;
          iconColor = 'text-[#ef5350]';
        } else if (toast.type === 'warning') {
          borderClass = 'border-[#ffa726] bg-[#241c12]/95 text-white';
          Icon = AlertTriangle;
          iconColor = 'text-[#ffa726]';
        } else if (toast.type === 'success') {
          borderClass = 'border-[#4caf50] bg-[#122319]/95 text-white';
          Icon = CheckCircle;
          iconColor = 'text-[#4caf50]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-right-5 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider">{toast.title}</h4>
              <p className="text-xs text-[#b0bec5] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#90a4ae] hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
