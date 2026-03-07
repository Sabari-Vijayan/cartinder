import './styles/BottomBar.css';
import { Flame, Star, MessageCircle, User, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isDealer = user?.roles.includes('dealer');

  return (
    <div className='bottom-bar-container'>
      <nav className='div-nav'>
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <Flame size={28} />
            </Link>
          </li>
          <li>
            <Link to="/likes" className={location.pathname === '/likes' ? 'active' : ''}>
              <Star size={28} />
            </Link>
          </li>
          {isDealer && (
            <li>
              <Link to="/dealer" className={location.pathname === '/dealer' ? 'active' : ''}>
                <LayoutDashboard size={28} />
              </Link>
            </li>
          )}
          <li>
            <Link to="/messages" className={location.pathname === '/messages' || location.pathname.startsWith('/chat/') ? 'active' : ''}>
              <MessageCircle size={28} />
            </Link>
          </li>
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              <User size={28} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default BottomBar;
