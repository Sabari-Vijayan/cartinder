import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit3, Car as CarIcon, IndianRupee, Calendar, Settings, Check, X, Clock, User as UserIcon } from 'lucide-react';
import './styles/DealerDashboard.css';
import EditCarModal from '../components/EditCarModal';

const DealerDashboard: React.FC = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'bookings'>('inventory');

  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [transmission, setTransmission] = useState('Automatic');
  const [perDay, setPerDay] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carsRes, bookingsRes] = await Promise.all([
        api.get('/cars/dealer'),
        api.get('/bookings/dealer')
      ]);
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/cars', {
        license_plate: licensePlate,
        specs: { make, model, year, transmission },
        rates: { per_day: Number(perDay), currency: 'INR' },
        image_url: imageUrl,
        location: { type: 'Point', coordinates: [72.8777, 19.0760] } // Default Mumbai
      });
      setMessage('Car listed successfully!');
      setIsAdding(false);
      fetchData();
      resetForm();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to add car');
    }
  };

  const deleteCar = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    try {
      await api.delete(`/cars/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      setMessage(`Booking ${status} successfully!`);
      fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setMessage('Failed to update booking status');
    }
  };

  const handleEditClick = (car: any) => {
    setSelectedCar(car);
    setIsEditing(true);
  };

  const resetForm = () => {
    setMake(''); setModel(''); setYear(new Date().getFullYear());
    setTransmission('Automatic'); setPerDay(''); setImageUrl('');
    setLicensePlate('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'var(--success)';
      case 'pending_payment': return 'var(--warning)';
      case 'cancelled': return 'var(--error)';
      case 'active': return '#34aadc';
      case 'completed': return 'var(--text-secondary)';
      default: return 'var(--text-secondary)';
    }
  };

  if (loading) return <div className="loading-screen">Loading your dashboard...</div>;

  return (
    <div className="dealer-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dealer Dashboard</h1>
          <p>Manage your fleet and bookings</p>
        </div>
        <button className="add-car-btn" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : <><Plus size={20} /> List New Car</>}
        </button>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory ({cars.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {message && <div className="dashboard-message">{message}</div>}

      {isAdding && (
        <div className="add-car-form-container fade-in">
          <form onSubmit={handleAddCar} className="add-car-form">
            <h2>List a New Vehicle</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Make</label>
                <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Toyota" required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Fortuner" required />
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
                <input type="number" value={perDay} onChange={(e) => setPerDay(e.target.value)} placeholder="4000" required />
              </div>
              <div className="form-group">
                <label>License Plate</label>
                <input value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="MH-12-AB-1234" required />
              </div>
              <div className="form-group full-width">
                <label>Image URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." required />
              </div>
            </div>
            <button type="submit" className="submit-btn">Publish Listing</button>
          </form>
        </div>
      )}

      {activeTab === 'inventory' ? (
        <div className="inventory-section">
          <div className="inventory-grid">
            {cars.map((car) => (
              <div key={car._id} className="inventory-card">
                <div className="car-preview-img" style={{ backgroundImage: `url(${car.image_url})` }}>
                  <div className="status-badge">{car.status}</div>
                </div>
                <div className="car-details">
                  <h3>{car.specs.make} {car.specs.model}</h3>
                  <div className="stats-row">
                    <span><Calendar size={14} /> {car.specs.year}</span>
                    <span><Settings size={14} /> {car.specs.transmission}</span>
                  </div>
                  <div className="price-row">
                    <IndianRupee size={16} /> <strong>{car.rates.per_day}</strong> / day
                  </div>
                  <div className="card-actions">
                    <button className="edit-icon-btn" onClick={() => handleEditClick(car)}><Edit3 size={18} /></button>
                    <button className="delete-icon-btn" onClick={() => deleteCar(car._id)}><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
            {cars.length === 0 && !isAdding && (
              <div className="empty-inventory">
                <CarIcon size={48} />
                <p>You haven't listed any cars yet.</p>
                <button onClick={() => setIsAdding(true)}>Get Started</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bookings-section">
          {bookings.length > 0 ? (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-card-header">
                    <div className="renter-info">
                      <div className="renter-avatar">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <h4>{booking.renter_id?.name || 'Unknown Renter'}</h4>
                        <p>{booking.renter_id?.email}</p>
                      </div>
                    </div>
                    <div 
                      className="booking-status" 
                      style={{ color: getStatusColor(booking.status), borderColor: getStatusColor(booking.status) }}
                    >
                      {booking.status.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="booking-card-body">
                    <div className="booked-car-info">
                      <CarIcon size={16} />
                      <span>{booking.car_id?.specs?.make} {booking.car_id?.specs?.model} ({booking.car_id?.license_plate})</span>
                    </div>
                    <div className="booking-dates">
                      <div className="date-item">
                        <Clock size={16} />
                        <div>
                          <label>From</label>
                          <span>{new Date(booking.time_slot.start).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="date-item">
                        <Clock size={16} />
                        <div>
                          <label>To</label>
                          <span>{new Date(booking.time_slot.end).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="booking-price">
                      <span>Total Amount:</span>
                      <strong>₹{booking.pricing_snapshot.subtotal + booking.pricing_snapshot.platform_fee}</strong>
                    </div>
                  </div>

                  {booking.status === 'pending_payment' && (
                    <div className="booking-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                      >
                        <Check size={18} /> Confirm Booking
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                      >
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-inventory">
              <Clock size={48} />
              <p>No booking requests yet.</p>
            </div>
          )}
        </div>
      )}

      <EditCarModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        car={selectedCar} 
        onSuccess={() => {
          fetchData();
          setMessage('Car updated successfully!');
          setTimeout(() => setMessage(''), 3000);
        }}
      />
    </div>
  );
};

export default DealerDashboard;
