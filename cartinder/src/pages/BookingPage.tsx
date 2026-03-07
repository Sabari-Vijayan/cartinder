import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';
import './styles/BookingPage.css';
import PaymentModal from '../components/PaymentModal';

const BookingPage: React.FC = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // Selection state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get('/cars');
        const foundCar = response.data.find((c: any) => c._id === carId);
        setCar(foundCar);
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      alert("End date must be after start date");
      return;
    }
    
    setIsPaymentOpen(true);
  };

  const handleBooking = async (paymentDetails: any) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      const subtotal = days * car.rates.per_day;
      const platform_fee = Math.round(subtotal * 0.05);

      await api.post('/bookings', {
        car_id: carId,
        time_slot: { start, end },
        pricing_snapshot: {
          rate_type: 'per_day',
          unit_price: car.rates.per_day,
          units_booked: days,
          subtotal,
          platform_fee
        },
        payment: {
          ...paymentDetails,
          status: 'captured'
        }
      });

      setBookingSuccess(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsPaymentOpen(false);
    }
  };

  if (loading) return <div className="loading-screen">Preparing your booking...</div>;
  if (!car) return <div className="loading-screen">Car not found.</div>;

  if (bookingSuccess) {
    return (
      <div className="booking-success-page">
        <div className="success-icon-container">
          <CheckCircle size={80} color="#4cd964" />
        </div>
        <h1>Booking Confirmed!</h1>
        <p>Payment of <strong>₹{Math.round(car.rates.per_day * (Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))) * 1.05).toLocaleString()}</strong> was successful.</p>
        <p>The dealer has been notified. You can track the status in your profile.</p>
        <button className="done-btn" onClick={() => navigate('/messages')}>Back to Messages</button>
      </div>
    );
  }

  const days = startDate && endDate 
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalAmount = days > 0 ? Math.round(car.rates.per_day * days * 1.05) : 0;

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Complete Booking</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="booking-container">
        <div className="booking-summary-card">
          <div 
            className="summary-image" 
            style={{ backgroundImage: `url(${car.image_url})` }}
          ></div>
          <div className="summary-details">
            <h2>{car.specs.make} {car.specs.model}</h2>
            <p className="summary-price">₹{car.rates.per_day} / day</p>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleOpenPayment}>
          <div className="date-selection">
            <div className="form-group">
              <label><Calendar size={16} /> Pickup Date</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label><Calendar size={16} /> Return Date</label>
              <input 
                type="date" 
                min={startDate || new Date().toISOString().split('T')[0]}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="price-breakdown">
            <h3>Price Details</h3>
            <div className="price-row">
              <span>₹{car.rates.per_day} x {days > 0 ? days : 0} days</span>
              <span>₹{days > 0 ? car.rates.per_day * days : 0}</span>
            </div>
            <div className="price-row">
              <span>Platform Fee (5%)</span>
              <span>₹{days > 0 ? Math.round(car.rates.per_day * days * 0.05) : 0}</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" className="confirm-booking-btn" disabled={days <= 0}>
            <ShieldCheck size={20} /> Checkout & Pay
          </button>
        </form>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={totalAmount}
        onPaymentSuccess={handleBooking}
      />
    </div>
  );
};

export default BookingPage;
