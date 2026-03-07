import React from 'react';
import { FileText, Download, CheckCircle } from 'lucide-react';
import './styles/ReceiptModal.css';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const total = booking.pricing_snapshot.subtotal + booking.pricing_snapshot.platform_fee;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-content">
          <div className="receipt-header">
            <FileText size={48} color="var(--primary-color)" />
            <h2>Payment Receipt</h2>
            <div className="receipt-id">ID: {booking._id.substring(0, 12).toUpperCase()}</div>
            <div className="payment-badge">
              <CheckCircle size={14} /> Paid via {booking.payment?.method === 'credit_card' ? 'Credit Card' : 'Digital Wallet'}
            </div>
          </div>

          <div className="receipt-section">
            <h3>Vehicle Details</h3>
            <div className="receipt-row">
              <span className="label">Car</span>
              <span className="value">{booking.car_id?.specs?.make} {booking.car_id?.specs?.model}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Plate Number</span>
              <span className="value">{booking.car_id?.license_plate}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h3>Rental Period</h3>
            <div className="receipt-row">
              <span className="label">From</span>
              <span className="value">{formatDate(booking.time_slot.start)}</span>
            </div>
            <div className="receipt-row">
              <span className="label">To</span>
              <span className="value">{formatDate(booking.time_slot.end)}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h3>Payment Summary</h3>
            <div className="receipt-row">
              <span className="label">Base Fare (₹{booking.pricing_snapshot.unit_price} x {booking.pricing_snapshot.units_booked})</span>
              <span className="value">₹{booking.pricing_snapshot.subtotal}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Platform Fee</span>
              <span className="value">₹{booking.pricing_snapshot.platform_fee}</span>
            </div>
            <div className="receipt-total-box">
              <div className="total-row">
                <span>Total Paid</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="receipt-footer">
          <button className="download-btn" onClick={() => window.print()}>
            <Download size={18} /> Download PDF
          </button>
          <button className="download-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
