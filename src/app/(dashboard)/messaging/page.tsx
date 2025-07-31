"use client";
import React, { useState, useRef, useEffect } from 'react';


import { useClient } from '@/context/ClientContext';
import { 

  Send,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  Shield,
  User,
  Clock,
  CheckCheck,
  Plus,
  Filter,
  Star
} from 'lucide-react';
import { Button, Input } from '@/components/ui';

// Mock conversations data
const conversationsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Portfolio Manager',
    avatar: null,
    lastMessage: 'Your Q2 report is ready for review. The portfolio performance exceeded expectations.',
    timestamp: '2025-05-29T15:30:00Z',
    unread: 2,
    online: true,
    type: 'advisor'
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Senior Advisor',
    avatar: null,
    lastMessage: 'Let\'s schedule a call to discuss the new investment opportunities.',
    timestamp: '2025-05-29T10:15:00Z',
    unread: 0,
    online: false,
    type: 'advisor'
  },
  {
    id: 3,
    name: 'Blue Marina Support',
    role: 'Customer Support',
    avatar: null,
    lastMessage: 'Thank you for contacting us. Your document request has been processed.',
    timestamp: '2025-05-28T16:45:00Z',
    unread: 0,
    online: true,
    type: 'support'
  },
  {
    id: 4,
    name: 'Emma Davis',
    role: 'Tax Specialist',
    avatar: null,
    lastMessage: 'I\'ve updated your tax optimization strategy. Please review at your convenience.',
    timestamp: '2025-05-28T09:20:00Z',
    unread: 1,
    online: false,
    type: 'advisor'
  }
];

// Mock messages for selected conversation
type Message = {
  id: number;
  senderId: number | string;
  senderName: string;
  content: string;
  timestamp: string;
  type: string;
};

const messagesData: { [key: string]: Message[] } = {
  1: [
    {
      id: 1,
      senderId: 1,
      senderName: 'Sarah Johnson',
      content: 'Good afternoon, John! I hope you\'re having a great day.',
      timestamp: '2025-05-29T14:00:00Z',
      type: 'received'
    },
    {
      id: 2,
      senderId: 'user',
      senderName: '',
      content: 'Hello Sarah! Yes, thank you. How are things on your end?',
      timestamp: '2025-05-29T14:05:00Z',
      type: 'sent'
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Sarah Johnson',
      content: 'Great! I wanted to update you on your portfolio performance. We\'ve seen some excellent returns this quarter.',
      timestamp: '2025-05-29T14:10:00Z',
      type: 'received'
    },
    {
      id: 4,
      senderId: 'user',
      senderName: '',
      content: 'That sounds wonderful! Can you share the details?',
      timestamp: '2025-05-29T14:15:00Z',
      type: 'sent'
    },
    {
      id: 5,
      senderId: 1,
      senderName: 'Sarah Johnson',
      content: 'Absolutely! Your Q2 report is ready for review. The portfolio performance exceeded expectations with a 12.4% YTD return. I\'ll send over the detailed analysis shortly.',
      timestamp: '2025-05-29T15:30:00Z',
      type: 'received'
    }
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      senderName: 'Mike Chen',
      content: 'Hi John, I hope you\'re doing well. I wanted to reach out about some new investment opportunities.',
      timestamp: '2025-05-29T09:30:00Z',
      type: 'received'
    },
    {
      id: 2,
      senderId: 'user',
      senderName: '',
      content: 'Hi Mike! I\'m interested to hear about them.',
      timestamp: '2025-05-29T09:45:00Z',
      type: 'sent'
    },
    {
      id: 3,
      senderId: 2,
      senderName: 'Mike Chen',
      content: 'Let\'s schedule a call to discuss the new investment opportunities.',
      timestamp: '2025-05-29T10:15:00Z',
      type: 'received'
    }
  ]
};

export default function SecureMessagingPage() {
  const { clientName } = useClient();
  const [selectedConversation, setSelectedConversation] = useState(conversationsData[0]);
  const [messages, setMessages] = useState(messagesData[conversationsData[0].id] || []);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
    const convMsgs = (messagesData[String(selectedConversation.id)] || []).map(m =>
      m.senderId === 'user' ? { ...m, senderName: clientName } : m
    );
    setMessages(convMsgs);
  }, [selectedConversation, clientName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: 'user',
        senderName: clientName,
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'sent'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');

      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: selectedConversation.id, message: newMessage })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            const response = {
              id: message.id + 1,
              senderId: selectedConversation.id,
              senderName: selectedConversation.name,
              content: data.reply,
              timestamp: new Date().toISOString(),
              type: 'received'
            } as Message;
            setMessages(prev => [...prev, response]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  interface FormatTime {
    (timestamp: string): string;
  }

  const formatTime: FormatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  interface FormatMessageTime {
    (timestamp: string): string;
  }

  const formatMessageTime: FormatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const filteredConversations = conversationsData.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                selectedConversation.id === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-slate-900 truncate">{conversation.name}</h4>
                    <div className="flex items-center space-x-1">
                      {conversation.type === 'support' && (
                        <Shield className="h-3 w-3 text-blue-500" />
                      )}
                      <span className="text-xs text-slate-500">
                        {formatMessageTime(conversation.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{conversation.role}</p>
                  <p className="text-sm text-slate-600 truncate">{conversation.lastMessage}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      {conversation.type === 'advisor' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Advisor
                        </span>
                      )}
                      {conversation.type === 'support' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Support
                        </span>
                      )}
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                {selectedConversation.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{selectedConversation.name}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-slate-500">{selectedConversation.role}</p>
                  {selectedConversation.online && (
                    <span className="text-xs text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {/* Security Notice */}
          <div className="flex items-center justify-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">This conversation is end-to-end encrypted</span>
            </div>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.type === 'sent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-900 border border-slate-200'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                  message.type === 'sent' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{formatTime(message.timestamp)}</span>
                  {message.type === 'sent' && (
                    <CheckCheck className="h-3 w-3" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-end space-x-3">
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                rows={1}
              />
            </div>
            
            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
              <Smile className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


