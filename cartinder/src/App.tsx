import { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar.tsx';
import HomePage from './pages/HomePage.tsx';
import BottomBar from './components/BottomBar.tsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TopBar />
      <HomePage />
      <BottomBar />
    </>
  )
}

export default App
