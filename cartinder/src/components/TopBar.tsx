import { CircleUser, SlidersHorizontal, Flame, Bell } from 'lucide-react';
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
        <Flame size={28} className="flame-icon" fill="url(#tinder-grad)" />
        <span>CarTinder</span>
        
        {/* SVG Gradient for the flame icon */}
        <svg width="0" height="0">
          <linearGradient id="tinder-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop stopColor="#fd297b" offset="0%" />
            <stop stopColor="#ff655b" offset="100%" />
          </linearGradient>
        </svg>
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
