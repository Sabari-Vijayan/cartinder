import './styles/SideBar.css';
import { Flame, Star, MessageCircle, User, LayoutDashboard, SlidersHorizontal, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import './styles/SideBar.css';

interface SideBarProps {
  onFilterClick?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ onFilterClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const isDealer = user?.roles.includes('dealer');

  return (
    <div className='sidebar-container'>
      <div className="sidebar-brand">
        <img src="/logo.png" alt="CarTinder" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <span>CarTinder</span>
      </div>

      <nav className='sidebar-nav'>
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <Flame size={24} />
              <span>Discover</span>
            </Link>
          </li>
          <li>
            <div className="notif-wrapper">
              <button className={`sidebar-link-btn ${isNotifOpen ? 'active' : ''}`} onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <div className="badge-container">
                  <Bell size={24} />
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </div>
                <span>Notifications</span>
              </button>
              {isNotifOpen && <NotificationDropdown onClose={() => setIsNotifOpen(false)} />}
            </div>
          </li>
          <li>
            <Link to="/likes" className={location.pathname === '/likes' ? 'active' : ''}>
              <Star size={24} />
              <span>Interested</span>
            </Link>
          </li>

          {isDealer && (
            <li>
              <Link to="/dealer" className={location.pathname === '/dealer' ? 'active' : ''}>
                <LayoutDashboard size={24} />
                <span>Dashboard</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/messages" className={location.pathname === '/messages' || location.pathname.startsWith('/chat/') ? 'active' : ''}>
              <MessageCircle size={24} />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              <User size={24} />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      {onFilterClick && location.pathname === '/' && (
        <button className="sidebar-filter-btn" onClick={onFilterClick}>
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>
      )}

      <div className="sidebar-footer">
        <p>© 2026 CarTinder</p>
      </div>
    </div>
  )
}

export default SideBar;
