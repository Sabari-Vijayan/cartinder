import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { Bell, MessageSquare, Calendar, Info } from 'lucide-react';
import './styles/NotificationDropdown.css';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotifClick = (notif: any) => {
    markAsRead(notif._id);
    if (notif.link) {
      navigate(notif.link);
    }
    onClose();
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking_update': return <Calendar size={18} />;
      case 'new_message': return <MessageSquare size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="notif-header">
        <h3>Notifications</h3>
        <button className="mark-all-btn" onClick={markAllAsRead}>Mark all read</button>
      </div>

      <div className="notif-list">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`notif-item ${notif.is_read ? '' : 'unread'} ${notif.type}`}
              onClick={() => handleNotifClick(notif)}
            >
              <div className="notif-icon">
                {getIcon(notif.type)}
              </div>
              <div className="notif-info">
                <div className="notif-title">
                  {notif.title}
                  {!notif.is_read && <div className="unread-dot"></div>}
                </div>
                <div className="notif-message">{notif.message}</div>
                <div className="notif-time">{getTimeAgo(notif.createdAt)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="notif-empty">
            <Bell size={40} opacity={0.3} />
            <p>Your notification tray is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
