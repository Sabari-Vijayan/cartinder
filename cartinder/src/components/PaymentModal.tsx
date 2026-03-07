import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import './styles/PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (paymentDetails: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      const mockPaymentDetails = {
        transaction_id: 'txn_' + Math.random().toString(36).substr(2, 9),
        method: 'credit_card',
        amount_paid: amount,
        currency: 'INR',
        timestamp: new Date()
      };
      setIsProcessing(false);
      onPaymentSuccess(mockPaymentDetails);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-header">
          <h2><CreditCard size={24} color="var(--primary-color)" /> Secure Payment</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        {isProcessing ? (
          <div className="processing-overlay">
            <div className="spinner"></div>
            <h3>Processing Payment...</h3>
            <p>Please do not close this window or refresh the page.</p>
          </div>
        ) : (
          <div className="payment-body">
            <div className="amount-display">
              <label>Total to Pay</label>
              <div className="value">₹{amount.toLocaleString()}</div>
            </div>

            <form className="card-form" onSubmit={handlePay}>
              <div className="input-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="JOHN DOE" 
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    placeholder="***" 
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="pay-btn">
                <Lock size={18} /> Pay ₹{amount.toLocaleString()}
              </button>
            </form>

            <div className="secure-footer">
              <ShieldCheck size={16} /> 256-bit SSL Secure Payment
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
