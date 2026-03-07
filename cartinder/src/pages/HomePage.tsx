import { useState, useEffect } from 'react';
import MainBox from '../components/MainBox.tsx';
import TopBar from '../components/TopBar.tsx';
import FilterModal from '../components/FilterModal.tsx';

interface HomePageProps {
  filterTrigger?: number;
}

const HomePage = ({ filterTrigger = 0 }: HomePageProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (filterTrigger > 0) {
      setIsFilterOpen(true);
    }
  }, [filterTrigger]);

  return (
    <>
      <TopBar onFilterClick={() => setIsFilterOpen(true)} />
      <MainBox filters={filters} />
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={setFilters}
        currentFilters={filters}
      />
    </>
  );
};

export default HomePage;
