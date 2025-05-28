import { Bell } from 'lucide-react';

export function NotificationBell() {

  return (
    <div className="relative">
      <button
        className="p-2.5 rounded-full hover:bg-indigo-50 transition-colors relative group"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
        {3 > 0 && (
          <div className="absolute -top-2 -right-1 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-indigo-500 text-[10px] font-bold text-white border-2 border-white">
              {4}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}