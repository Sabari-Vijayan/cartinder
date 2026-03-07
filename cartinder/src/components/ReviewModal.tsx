import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send } from 'lucide-react';
import api from '../services/api';
import './styles/ReviewModal.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, booking, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/reviews', {
        car_id: booking.car_id._id,
        rating,
        comment
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

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
            style={{ zIndex: 2000 }}
          />
          <motion.div 
            className="review-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ zIndex: 2001 }}
          >
            <div className="review-modal-header">
              <h2>Rate your ride</h2>
              <button className="close-btn" onClick={onClose}><X size={24} /></button>
            </div>

            <div className="review-car-summary">
               <div 
                 className="review-car-img"
                 style={{ backgroundImage: `url(${booking.car_id.image_url})` }}
               ></div>
               <div className="review-car-info">
                 <h3>{booking.car_id.specs.make} {booking.car_id.specs.model}</h3>
                 <p>Trip completed on {new Date(booking.time_slot.end).toLocaleDateString()}</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="review-form">
              {error && <div className="review-error">{error}</div>}
              
              <div className="rating-input-group">
                <label>How was your experience?</label>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="comment-input-group">
                <label>Write a comment</label>
                <textarea
                  placeholder="Tell us more about the car condition, performance, or dealer experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-review-btn" disabled={loading}>
                {loading ? 'Submitting...' : <><Send size={18} /> Submit Review</>}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
