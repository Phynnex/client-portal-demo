"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useClient } from '@/context/ClientContext';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import type { Conversation, Message } from '@/types';

export default function SecureMessagingPage() {
  const { clientName } = useClient();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: conversations = [], isLoading: convLoading, isError: convError } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await fetch('/api/conversations');
      if (!res.ok) {
        throw new Error('Failed to fetch conversations');
      }
      return res.json();
    },
  });

  const { data: messagesQueryData = [], isLoading: msgLoading, isError: msgError } = useQuery<Message[]>({
    queryKey: ['messages', selectedConversation?.id],
    queryFn: async () => {
      const res = await fetch(`/api/messages?conversationId=${selectedConversation?.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }
      return res.json();
    },
    enabled: !!selectedConversation?.id,
  });

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    const convMsgs = messagesQueryData.map(m =>
      m.senderId === 'user' ? { ...m, senderName: clientName } : m
    );
    setMessages(convMsgs);
  }, [messagesQueryData, clientName]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (convLoading || msgLoading) {
    return <div className="p-4 sm:p-6 lg:p-8">Loading messages...</div>;
  }

  if (convError || msgError) {
    return <div className="p-4 sm:p-6 lg:p-8">Error loading messages.</div>;
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      const message = {
        id: messages.length + 1,
        senderId: 'user',
        senderName: clientName,
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'sent',
      };

      setMessages([...messages, message]);
      setNewMessage('');

      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: selectedConversation.id, message: newMessage }),
        });
        if (res.ok) {
          await res.json();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 ${
                selectedConversation?.id === conv.id ? 'bg-slate-50' : ''
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-slate-900">{conv.name}</h3>
                <span className="text-xs text-slate-500">
                  {new Date(conv.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
            </div>
          ))}
        </div>
      </aside>
      <section className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="font-semibold text-slate-900">{selectedConversation?.name}</h2>
            <p className="text-sm text-slate-500">{selectedConversation?.role}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-slate-500" />
            <Video className="h-5 w-5 text-slate-500" />
            <MoreVertical className="h-5 w-5 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg p-3 rounded-lg ${
                  message.type === 'sent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <p className="text-sm mb-1">{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="px-4">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
