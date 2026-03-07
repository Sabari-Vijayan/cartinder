import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, MoreVertical, IndianRupee } from 'lucide-react';
import './styles/ChatDetail.css';

const ChatDetail: React.FC = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch messages
        const msgRes = await api.get(`/chats/${chatId}/messages`);
        setMessages(msgRes.data);

        // Fetch chat to get recipient info
        const chatRes = await api.get('/chats');
        const currentChat = chatRes.data.find((c: any) => c._id === chatId);
        if (currentChat) {
          setRecipient(currentChat.participants.find((p: any) => p._id !== user?.id));
        }
      } catch (error) {
        console.error('Error fetching chat detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
    
    // Poll for new messages every 3 seconds (simple way for a weekend project instead of WebSockets)
    const interval = setInterval(fetchChatData, 3000);
    return () => clearInterval(interval);
  }, [chatId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await api.post('/chats/message', {
        chatId,
        content
      });
      setMessages([...messages, response.data]);
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div className="loading-screen">Opening chat...</div>;

  return (
    <div className="chat-detail-page">
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="back-btn" onClick={() => navigate('/messages')}>
            <ArrowLeft size={24} />
          </button>
          <div 
            className="header-avatar"
            style={{ backgroundImage: `url(${recipient?.profile?.pic_url || 'https://via.placeholder.com/150'})` }}
          ></div>
          <div className="header-info">
            <h3>{recipient?.name}</h3>
            <span className="status-indicator">Online</span>
          </div>
        </div>
        <div className="chat-header-right">
          {/* In a real app we'd link to the specific car this chat is about */}
          <button className="deal-btn" onClick={() => navigate('/likes')}>
            <IndianRupee size={18} /> Deal
          </button>
          <MoreVertical size={20} />
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`message-bubble ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
          >
            <div className="bubble-content">
              {msg.content}
            </div>
            <span className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={!content.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatDetail;
