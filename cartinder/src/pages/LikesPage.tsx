import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Star, MapPin, MessageCircle, CreditCard, Trash2 } from 'lucide-react';
import './styles/LikesPage.css';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";

const LikesPage: React.FC = () => {
  const [likedCars, setLikedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await api.get('/swipes/likes');
        setLikedCars(response.data);
      } catch (error) {
        console.error('Error fetching liked cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, []);

  const handleStartChat = async (dealerId: string) => {
    try {
      const response = await api.post('/chats/start', { recipientId: dealerId });
      navigate(`/chat/${response.data._id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleRemoveLike = async (carId: string) => {
    if (!window.confirm('Remove this car from your saved rides?')) return;
    try {
      await api.delete(`/swipes/${carId}`);
      setLikedCars(prev => prev.filter(car => car._id !== carId));
    } catch (error) {
      console.error('Error removing like:', error);
    }
  };

  if (loading) return <div className="loading-screen">Loading your matches...</div>;

  return (
    <div className="likes-page">
      <div className="likes-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Saved Rides</h1>
        <div style={{ width: 24 }}></div> {/* Spacer for alignment */}
      </div>

      {likedCars.length > 0 ? (
        <div className="likes-grid">
          {likedCars.map((car, index) => {
            if (!car) return null;
            return (
              <div key={`${car._id}-${index}`} className="liked-card">
                <div 
                  className="liked-image" 
                  style={{ backgroundImage: `url(${car.image_url || DEFAULT_IMAGE})` }}
                >
                  <div className="liked-overlay">
                    <Star className="like-badge" size={18} fill="#34aadc" stroke="none" />
                  </div>
                </div>
                <div className="liked-info">
                  <div className="title-row">
                    <h3>{car.specs?.make} {car.specs?.model} <span className="year">{car.specs?.year}</span></h3>
                    <button 
                      className="remove-like-btn"
                      onClick={() => handleRemoveLike(car._id)}
                      title="Remove from saved"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="location">
                    <MapPin size={12} /> {car.location?.type === 'Point' ? 'Nearby' : 'Global'}
                  </p>
                  <div className="rating-row">
                    <Star size={12} fill="#ffcc00" color="#ffcc00" />
                    <span>{car.stats?.avg_rating || '5.0'} ({car.stats?.review_count || 0})</span>
                  </div>
                  <p className="price">₹{car.rates?.per_day}/day</p>
                  
                  <div className="card-action-buttons">
                    <button 
                      className="message-dealer-btn"
                      onClick={() => handleStartChat(car.dealer_id)}
                    >
                      <MessageCircle size={16} /> Message
                    </button>
                    
                    <button 
                      className="book-now-btn"
                      onClick={() => navigate(`/book/${car._id}`)}
                    >
                      <CreditCard size={16} /> Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: '100px' }}>
          <div className="empty-pulse" style={{ background: '#393e46' }}>
             <Star size={40} fill="#aaaaaa" stroke="none" />
          </div>
          <h2>No saved rides yet!</h2>
          <p>Get back to swiping to find your dream car.</p>
          <button className="swipe-more-btn" onClick={() => navigate('/')}>Start Swiping</button>
        </div>
      )}
    </div>
  );
};

export default LikesPage;
