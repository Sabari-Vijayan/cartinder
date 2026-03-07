import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, MessageSquare } from 'lucide-react';
import './styles/MessagesPage.css';

const MessagesPage: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get('/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const getRecipient = (chat: any) => {
    return chat.participants.find((p: any) => p._id !== user?.id);
  };

  if (loading) return <div className="loading-screen">Loading messages...</div>;

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1>Messages</h1>
        <div className="search-bar-container">
          <Search size={18} />
          <input type="text" placeholder="Search matches" />
        </div>
      </div>

      <div className="chats-list">
        {chats.length > 0 ? (
          chats.map((chat) => {
            const recipient = getRecipient(chat);
            return (
              <div 
                key={chat._id} 
                className="chat-item"
                onClick={() => navigate(`/chat/${chat._id}`)}
              >
                <div 
                  className="chat-avatar"
                  style={{ backgroundImage: `url(${recipient?.profile?.pic_url || 'https://via.placeholder.com/150'})` }}
                ></div>
                <div className="chat-info">
                  <div className="chat-top-row">
                    <h3>{recipient?.name}</h3>
                    <span className="chat-time">
                      {new Date(chat.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="last-message">{chat.last_message || 'Start a conversation!'}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-messages">
            <div className="empty-icon-circle">
              <MessageSquare size={40} />
            </div>
            <h2>No messages yet</h2>
            <p>Once you match with a ride, you can chat with the dealer here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
