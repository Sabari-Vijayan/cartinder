import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, LogOut, ArrowLeft, Calendar, Star, CreditCard, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './styles/ProfilePage.css';
import ReviewModal from '../components/ReviewModal';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal';

const ProfilePage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picUrl, setPicUrl] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/bookings/my')
      ]);
      setProfile(profileRes.data);
      setBookings(bookingsRes.data);
      setName(profileRes.data.name);
      setEmail(profileRes.data.email);
      setPicUrl(profileRes.data.profile?.pic_url || '');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenReview = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handlePayNow = (booking: any) => {
    setSelectedBooking(booking);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (paymentDetails: any) => {
    try {
      await api.put(`/bookings/${selectedBooking._id}/status`, { 
        status: 'confirmed',
        payment: { ...paymentDetails, status: 'captured' }
      });
      setIsPaymentOpen(false);
      setMessage('Payment successful! Booking confirmed.');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment status');
    }
  };

  const handleViewReceipt = (booking: any) => {
    setSelectedBooking(booking);
    setIsReceiptOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await api.put('/users/profile', {
        name,
        email,
        profile_pic: picUrl
      });
      setProfile(response.data);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Update failed');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      setMessage('Booking cancelled successfully.');
      fetchData();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setMessage('Failed to cancel booking.');
    }
  };

  if (loading) return <div className="loading-screen">Loading Profile...</div>;

  const activeBookings = bookings.filter(b => ['pending_payment', 'confirmed', 'active'].includes(b.status));
  const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1>My Profile</h1>
        <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-pic-container">
          <div 
            className="profile-pic" 
            style={{ backgroundImage: `url(${picUrl || 'https://via.placeholder.com/150'})` }}
          >
            {editing && (
              <div className="pic-overlay">
                <Camera size={24} />
              </div>
            )}
          </div>
        </div>

        {message && <div className={`profile-message ${message.includes('success') || message.includes('cancelled') ? 'success' : 'error'}`}>{message}</div>}

        {!editing ? (
          <div className="profile-details">
            <div className="detail-item">
              <User size={20} />
              <div>
                <label>Name</label>
                <p>{profile.name}</p>
              </div>
            </div>
            <div className="detail-item">
              <Mail size={20} />
              <div>
                <label>Email</label>
                <p>{profile.email}</p>
              </div>
            </div>
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>

            <div className="profile-bookings-section">
              <div className="bookings-tabs-header">
                <h3>My Trips</h3>
              </div>
              
              {bookings.length > 0 ? (
                <div className="bookings-groups">
                  {activeBookings.length > 0 && (
                    <div className="booking-group">
                      <h4>Active & Upcoming</h4>
                      <div className="bookings-list">
                        {activeBookings.map((booking) => (
                          <div key={booking._id} className="booking-full-card">
                            <div className="booking-card-top">
                              <div 
                                className="booking-car-thumb"
                                style={{ backgroundImage: `url(${booking.car_id?.image_url})` }}
                              ></div>
                              <div className="booking-main-info">
                                <h5>{booking.car_id?.specs?.make} {booking.car_id?.specs?.model}</h5>
                                <p className="dealer-name">Dealer: {booking.dealer_id?.name}</p>
                                <div className={`booking-status-pill ${booking.status}`}>
                                  {booking.status.replace('_', ' ')}
                                </div>
                              </div>
                            </div>
                            <div className="booking-card-mid">
                              <div className="booking-date-range">
                                <div>
                                  <label>From</label>
                                  <span>{new Date(booking.time_slot.start).toLocaleDateString()}</span>
                                </div>
                                <div className="date-arrow">→</div>
                                <div>
                                  <label>To</label>
                                  <span>{new Date(booking.time_slot.end).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="booking-card-bottom">
                               <div className="booking-total-price">
                                 Total: <strong>₹{(booking.pricing_snapshot?.subtotal + booking.pricing_snapshot?.platform_fee).toLocaleString()}</strong>
                               </div>
                               <div className="booking-actions-row">
                                 {booking.status === 'pending_payment' && (
                                   <>
                                     <button 
                                       className="pay-now-btn"
                                       onClick={() => handlePayNow(booking)}
                                     >
                                       <CreditCard size={14} /> Pay Now
                                     </button>
                                     <button 
                                       className="cancel-trip-btn"
                                       onClick={() => handleCancelBooking(booking._id)}
                                     >
                                       Cancel
                                     </button>
                                   </>
                                 )}
                                 {['confirmed', 'active', 'completed'].includes(booking.status) && (
                                   <button 
                                     className="receipt-btn"
                                     onClick={() => handleViewReceipt(booking)}
                                   >
                                     <FileText size={14} /> Receipt
                                   </button>
                                 )}
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pastBookings.length > 0 && (
                    <div className="booking-group">
                      <h4>Past Trips</h4>
                      <div className="bookings-list">
                        {pastBookings.map((booking) => (
                          <div key={booking._id} className="booking-full-card past">
                            <div className="booking-card-top">
                              <div 
                                className="booking-car-thumb"
                                style={{ backgroundImage: `url(${booking.car_id?.image_url})` }}
                              ></div>
                              <div className="booking-main-info">
                                <h5>{booking.car_id?.specs?.make} {booking.car_id?.specs?.model}</h5>
                                <p className="trip-dates">{new Date(booking.time_slot.start).toLocaleDateString()} - {new Date(booking.time_slot.end).toLocaleDateString()}</p>
                                <div className="past-booking-actions">
                                  {booking.status === 'completed' && (
                                    <button 
                                      className="rate-trip-btn"
                                      onClick={() => handleOpenReview(booking)}
                                    >
                                      <Star size={12} fill="currentColor" /> Rate Ride
                                    </button>
                                  )}
                                  {booking.payment && (
                                    <button 
                                      className="receipt-btn small"
                                      onClick={() => handleViewReceipt(booking)}
                                    >
                                      <FileText size={12} /> Receipt
                                    </button>
                                  )}
                                  {booking.status === 'cancelled' && (
                                    <div className="booking-status-pill cancelled">Cancelled</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-bookings-state">
                  <Calendar size={48} />
                  <p>You haven't booked any rides yet.</p>
                  <button onClick={() => navigate('/')}>Find a Ride</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Profile Picture URL</label>
              <input value={picUrl} onChange={(e) => setPicUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="save-btn">Save Changes</button>
            </div>
          </form>
        )}
      </div>

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBooking}
        onSuccess={fetchData}
      />

      {selectedBooking && (
        <>
          <PaymentModal 
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            amount={selectedBooking.pricing_snapshot.subtotal + selectedBooking.pricing_snapshot.platform_fee}
            onPaymentSuccess={handlePaymentSuccess}
          />
          <ReceiptModal 
            isOpen={isReceiptOpen}
            onClose={() => setIsReceiptOpen(false)}
            booking={selectedBooking}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
