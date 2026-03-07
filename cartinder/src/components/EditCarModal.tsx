import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';
import './styles/EditCarModal.css';

interface EditCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
  onSuccess: () => void;
}

const EditCarModal: React.FC<EditCarModalProps> = ({ isOpen, onClose, car, onSuccess }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [transmission, setTransmission] = useState('Automatic');
  const [perDay, setPerDay] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [status, setStatus] = useState('available');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (car) {
      setMake(car.specs?.make || '');
      setModel(car.specs?.model || '');
      setYear(car.specs?.year || new Date().getFullYear());
      setTransmission(car.specs?.transmission || 'Automatic');
      setPerDay(car.rates?.per_day || '');
      setImageUrl(car.image_url || '');
      setLicensePlate(car.license_plate || '');
      setStatus(car.status || 'available');
    }
  }, [car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/cars/${car._id}`, {
        license_plate: licensePlate,
        specs: { make, model, year, transmission },
        rates: { per_day: Number(perDay), currency: 'INR' },
        image_url: imageUrl,
        status: status
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Failed to update car details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-car-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Car Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <form id="edit-car-form" className="edit-car-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Make</label>
                <input value={make} onChange={(e) => setMake(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input value={model} onChange={(e) => setModel(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} required />
              </div>
              <div className="form-group">
                <label>Transmission</label>
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="form-group">
                <label>Daily Rate (₹)</label>
                <input type="number" value={perDay} onChange={(e) => setPerDay(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>License Plate</label>
                <input value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} required />
              </div>
              <div className="form-group full-width">
                <label>Image URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            type="submit" 
            form="edit-car-form" 
            className="save-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCarModal;
