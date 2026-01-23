'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  isActive: boolean;
  createdAt: Date;
}

interface NotificationManagerProps {
  notifications: Notification[];
  onAdd: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, notification: Partial<Notification>) => void;
  onDelete: (id: string) => void;
}

export default function NotificationManager({
  notifications,
  onAdd,
  onUpdate,
  onDelete
}: NotificationManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'alert',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData);
      setIsAdding(false);
    }

    setFormData({ message: '', type: 'info', isActive: true });
  };

  const handleEdit = (notification: Notification) => {
    setEditingId(notification.id);
    setFormData({
      message: notification.message,
      type: notification.type,
      isActive: notification.isActive
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ message: '', type: 'info', isActive: true });
  };

  return (
    <div className="w-full bg-[var(--warm-gray)] rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--terracotta)]">
          Obvestila
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="button px-3 py-2 flex items-center gap-2 text-sm md:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo obvestilo</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg border-2 border-[var(--terracotta)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sporočilo</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]"
                rows={3}
                placeholder="Vnesite obvestilo..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tip</label>
                <select
                  value={formData.type}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]"
                >
                  <option value="info">Informacija</option>
                  <option value="success">Uspeh</option>
                  <option value="warning">Opozorilo</option>
                  <option value="alert">Opomba</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[var(--terracotta)] focus:ring-[var(--terracotta)] rounded"
                  />
                  <span className="text-sm font-medium">Aktivno</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Prekliči
              </button>
              <button
                type="submit"
                className="button px-4 py-2 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Posodobi' : 'Shrani'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Ni obvestil</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-2 ${
                notification.isActive 
                  ? 'bg-white border-gray-200' 
                  : 'bg-gray-100 border-gray-300 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'success' ? 'bg-green-100 text-green-800' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {notification.type === 'info' ? 'INFO' :
                       notification.type === 'success' ? 'USPEH' :
                       notification.type === 'warning' ? 'OPOZORILO' :
                       'OPOMBA'}
                    </span>
                    {!notification.isActive && (
                      <span className="text-xs text-gray-500">(Neaktivno)</span>
                    )}
                  </div>
                  <p className="text-sm md:text-base break-words">{notification.message}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(notification)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Uredi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Izbriši"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}