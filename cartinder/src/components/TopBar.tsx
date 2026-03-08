import { CircleUser, SlidersHorizontal, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import './styles/TopBar.css';

interface TopBarProps {
  onFilterClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onFilterClick }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="top-bar">
      <button className="icon-btn" onClick={onFilterClick}>
        <SlidersHorizontal size={24} />
      </button>

      <div className="brand-logo">
        <img src="/logo.png" alt="CarTinder" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
        <span>CarTinder</span>
      </div>

      <div className="top-bar-right">
        <div className="notif-wrapper">
          <button className="icon-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <div className="badge-container">
              <Bell size={24} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </div>
          </button>
          {isNotifOpen && <NotificationDropdown onClose={() => setIsNotifOpen(false)} />}
        </div>

        <Link to="/profile" className="icon-btn profile-link">
          <CircleUser size={24} />
        </Link>
      </div>
    </div>
  );
}

export default TopBar;
