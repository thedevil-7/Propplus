import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--status-positive)';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--status-negative)';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--accent-blue)';
        }

        return (
          <div key={toast.id} className="toast-card">
            <Icon size={18} color={iconColor} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
