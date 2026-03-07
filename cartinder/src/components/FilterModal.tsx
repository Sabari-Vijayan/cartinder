import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import './styles/FilterModal.css';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [make, setMake] = useState(currentFilters.make || '');
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');
  const [year, setYear] = useState(currentFilters.year || '');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      make,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      year: year ? parseInt(year) : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setMake('');
    setMinPrice('');
    setMaxPrice('');
    setYear('');
  };

  return (
    <div className="filter-modal-overlay fade-in" onClick={onClose}>
      <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="filter-header">
          <h2>Filters</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="filter-body">
          <div className="filter-group">
            <label>Brand / Make</label>
            <input 
              type="text" 
              placeholder="e.g. BMW, Tesla, Toyota" 
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Price Range (per day)</label>
            <div className="range-inputs">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>to</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Year</label>
            <input 
              type="number" 
              placeholder="e.g. 2024" 
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-footer">
          <button className="reset-btn" onClick={handleReset}>Reset All</button>
          <button className="apply-btn" onClick={handleApply}>
            <Check size={20} /> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
