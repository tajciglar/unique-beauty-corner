'use client';
import { useState } from 'react';
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  isActive: boolean;
  createdAt: Date;
}

interface AdminNotificationBannerProps {
  notifications?: Notification[];
  onDismiss?: (id: string) => void;
}

export default function AdminNotificationBanner({ 
  notifications = [], 
  onDismiss 
}: AdminNotificationBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'alert':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed(new Set(dismissed).add(id));
    if (onDismiss) {
      onDismiss(id);
    }
  };

  const activeNotifications = notifications.filter(
    n => n.isActive && !dismissed.has(n.id)
  );

  if (activeNotifications.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      {activeNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border-2 ${getStyles(notification.type)} animate-in slide-in-from-top-2 duration-300`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <p className="text-sm md:text-base font-medium break-words">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => handleDismiss(notification.id)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Zapri obvestilo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}