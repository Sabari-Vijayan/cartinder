import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { X, Calendar, Settings, Fuel, Gauge, MapPin, Star, Mail, ShieldCheck, IndianRupee, MessageSquare } from 'lucide-react';
import './styles/CarDetailModal.css';

interface CarDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
}

const CarDetailModal: React.FC<CarDetailModalProps> = ({ isOpen, onClose, car }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (isOpen && car) {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const response = await api.get(`/reviews/car/${car._id}`);
          setReviews(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [isOpen, car]);

  if (!car) return null;

  const dealer = car.dealer_id;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="car-detail-modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="modal-header">
              <button className="close-modal-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-scroll-content">
              <div className="detail-image-section">
                <img src={car.image_url || 'https://via.placeholder.com/800x500'} alt={`${car.specs.make} ${car.specs.model}`} />
                <div className="detail-price-badge">
                  <IndianRupee size={18} /> <strong>{car.rates.per_day}</strong> / day
                </div>
              </div>

              <div className="detail-info-body">
                <div className="title-row">
                  <h1>{car.specs.make} {car.specs.model} <span className="year-tag">{car.specs.year}</span></h1>
                  <div className="rating-badge">
                    <Star size={14} fill="#ffcc00" color="#ffcc00" />
                    <span>{car.stats.avg_rating || '5.0'}</span>
                    <span className="review-count">({car.stats.review_count || 0})</span>
                  </div>
                </div>

                <div className="location-row">
                  <MapPin size={16} />
                  <span>Available in Mumbai, MH</span>
                </div>

                <div className="specs-grid">
                  <div className="spec-item">
                    <Calendar size={20} />
                    <div className="spec-label">Year</div>
                    <div className="spec-value">{car.specs.year}</div>
                  </div>
                  <div className="spec-item">
                    <Settings size={20} />
                    <div className="spec-label">Transmission</div>
                    <div className="spec-value">{car.specs.transmission}</div>
                  </div>
                  <div className="spec-item">
                    <Fuel size={20} />
                    <div className="spec-label">Fuel</div>
                    <div className="spec-value">Petrol / Diesel</div>
                  </div>
                  <div className="spec-item">
                    <Gauge size={20} />
                    <div className="spec-label">Mileage</div>
                    <div className="spec-value">{car.stats.total_kms ? Math.round(car.stats.total_kms / 1000) : 12}k kms</div>
                  </div>
                </div>

                <div className="description-section">
                  <h3>Description</h3>
                  <p>{car.description || `Experience the ultimate comfort and performance with this ${car.specs.year} ${car.specs.make} ${car.specs.model}. Well-maintained and perfect for city drives or long weekend trips.`}</p>
                </div>

                <div className="reviews-section">
                  <div className="section-header">
                    <h3>Reviews ({car.stats.review_count || 0})</h3>
                    {car.stats.review_count > 0 && (
                      <div className="avg-rating-pill">
                        <Star size={14} fill="currentColor" /> {car.stats.avg_rating}
                      </div>
                    )}
                  </div>
                  
                  {loadingReviews ? (
                    <div className="reviews-loading">Loading reviews...</div>
                  ) : reviews.length > 0 ? (
                    <div className="reviews-list-vertical">
                      {reviews.map((review) => (
                        <div key={review._id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div 
                                className="reviewer-avatar-small"
                                style={{ backgroundImage: `url(${review.reviewer_id?.profile?.pic_url || 'https://via.placeholder.com/50'})` }}
                              ></div>
                              <div>
                                <h4>{review.reviewer_id?.name}</h4>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  fill={i < review.rating ? "#ffcc00" : "none"} 
                                  color={i < review.rating ? "#ffcc00" : "rgba(255,255,255,0.1)"} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-reviews">
                      <MessageSquare size={32} />
                      <p>No reviews yet for this ride.</p>
                    </div>
                  )}
                </div>

                <div className="dealer-profile-section">
                  <h3>Managed by</h3>
                  <div className="dealer-card">
                    <div 
                      className="dealer-avatar"
                      style={{ backgroundImage: `url(${dealer?.profile?.pic_url || 'https://via.placeholder.com/100'})` }}
                    ></div>
                    <div className="dealer-info">
                      <h4>{dealer?.name || 'Authorized Dealer'}</h4>
                      <div className="dealer-meta">
                        <span><ShieldCheck size={14} /> Verified Dealer</span>
                        <span><Mail size={14} /> {dealer?.email || 'Contact through app'}</span>
                      </div>
                      <p className="dealer-bio">"Providing premium car rental experiences since 2022. Customer satisfaction is our top priority."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
               <button className="modal-book-btn" onClick={() => window.location.href = `/book/${car._id}`}>
                 Check Availability
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CarDetailModal;
