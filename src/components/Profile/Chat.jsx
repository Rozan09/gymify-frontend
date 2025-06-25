import React, { useEffect, useState, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContextProvider';

const Chat = ({ selectedUserId, onClose }) => {
  const { token, user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect to socket
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      auth: { token },
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token]);

  // Fetch contacts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/chat/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/chat/history/${selectedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    if (selectedUserId && token) fetchMessages();
  }, [selectedUserId, token]);

  // Receive messages and typing
  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message) => {
      if (message.from === selectedUserId || message.to === selectedUserId) {
        setMessages((prev) => [...prev, message]);
      }
      setIsTyping(false);
    });

    socket.on('userTyping', (userId) => {
      if (userId === selectedUserId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });
  }, [socket, selectedUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      to: selectedUserId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      fromTrainer: user?.role === 'trainer',
    };

    socket?.emit('message', message);
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const handleTyping = () => {
    socket?.emit('typing', selectedUserId);
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentContact = contacts.find((u) => u._id === selectedUserId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="relative w-full max-w-2xl h-[85vh] bg-white/80 backdrop-blur-lg border border-gray-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#ff4857] to-[#ffb404] text-white shadow">
          <h2 className="text-xl font-semibold truncate">
            {currentContact?.name || 'Chat'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:scale-110 transform transition duration-200"
          >
            &times;
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white bg-opacity-60 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.fromTrainer === (user?.role === 'trainer');
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-xl shadow ${
                    isCurrentUser
                      ? 'bg-gradient-to-br from-[#ff4857] to-[#ffb404] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-[10px] text-right mt-1 opacity-70">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="text-sm italic text-gray-500 animate-pulse">
              {currentContact?.name || 'User'} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="px-4 py-3 border-t bg-white flex items-center gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 text-sm border rounded-full shadow-sm focus:ring-2 focus:ring-[#ff4857] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-[#ff4857] to-[#ffb404] px-5 py-2 rounded-full text-white font-semibold text-sm shadow hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
