import { CircleUser, SlidersHorizontal, Search, Funnel } from 'lucide-react';
import './styles/TopBar.css';

const TopBar = () => {
  return (
  <div className="top-bar">

    {/* This will contain the option to open left sidebat and also filter maybe? */}
    <div className="left-section">
      
      <SlidersHorizontal />

    </div>

    {/* This will contain the search bar and profile icon */}
    <div className="right-section">

      <span className="search-box">

          <Funnel />

          <input className="search-bar"/>

          <Search />

      </span>

      <CircleUser />

    </div>

  </div>
  )
}

export default TopBar;
