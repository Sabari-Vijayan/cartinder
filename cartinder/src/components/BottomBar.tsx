import './styles/BottomBar.css';
import {Download, BookOpenText, MessageSquareText, Heart, Handshake} from 'lucide-react';

export default () => {
  return (
  <div className='bottom-bar-container'>

    <nav className='div-nav'>

      <ul>
        <li>
          <Download />
        </li>
        <li>
          <BookOpenText />
        </li>
        <li>
          <MessageSquareText />
        </li>
        <li>
          <Heart />
        </li>
         <li>
          <Handshake />
        </li>
      </ul>

    </nav>

  </div>
  )
}
