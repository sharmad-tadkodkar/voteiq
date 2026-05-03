import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { createCivicChat } from '../services/gemini';
import { Chat as GenAIChat } from '@google/genai';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
};

const SUGGESTED_PROMPTS = [
  "How do EVMs actually work?",
  "What is a political manifesto?",
  "How do I register to vote if I moved?",
  "What's the difference between a state and national election?"
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hey there! 👋 I'm CivicBot. I'm here to answer any questions you have about Indian national elections, voting, or how the process works. No jargon, no bias. What's on your mind?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatRef = useRef<GenAIChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session once
  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = createCivicChat();
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || !chatRef.current || isLoading) return;

    const userMsgId = Date.now().toString();
    const modelMsgId = (Date.now() + 1).toString();

    // Add user message and a placeholder for the model's response
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', text: textToSubmit },
      { id: modelMsgId, role: 'model', text: '', isStreaming: true }
    ]);
    
    setInput('');
    setIsLoading(true);

    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: textToSubmit });
      
      for await (const chunk of responseStream) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].id === modelMsgId) {
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              text: newMessages[lastIndex].text + chunk.text
            };
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex].id === modelMsgId) {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            text: "Oops! Something went wrong on my end. Could you try asking that again?",
            isStreaming: false
          };
        }
        return newMessages;
      });
    } finally {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex].id === modelMsgId) {
          newMessages[lastIndex].isStreaming = false;
        }
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  // Simple markdown-like rendering for bold text
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} class="font-bold text-black">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div class="flex flex-col h-[calc(100vh-90px)] max-w-4xl mx-auto w-full p-4">
      
      {/* Chat Area */}
      <div class="flex-1 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col mb-6">
        
        {/* Header */}
        <div class="bg-vote-green p-4 border-b-4 border-black flex items-center gap-3">
          <div class="bg-white p-2 rounded-full border-2 border-black">
            <Bot size={24} class="text-vote-green-dark" />
          </div>
          <div>
            <h2 class="font-bold text-xl text-white">CivicBot</h2>
            <p class="text-green-100 text-sm font-medium">Always unbiased, always ready.</p>
          </div>
        </div>

        {/* Messages */}
        <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#FDFBF7]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              class={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div class={`flex-shrink-0 w-10 h-10 rounded-full border-2 border-black flex items-center justify-center ${msg.role === 'user' ? 'bg-vote-orange' : 'bg-vote-green'}`}>
                {msg.role === 'user' ? <User size={20} class="text-white" /> : <Bot size={20} class="text-white" />}
              </div>
              
              {/* Bubble */}
              <div class={`max-w-[80%] p-4 rounded-2xl border-2 border-black text-lg font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-orange-100 rounded-tr-none' 
                  : 'bg-white rounded-tl-none shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)]'
              }`}>
                {msg.text ? renderText(msg.text) : (
                  <div class="flex gap-1 items-center h-6">
                    <div class="w-2 h-2 bg-vote-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div class="w-2 h-2 bg-vote-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div class="w-2 h-2 bg-vote-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (only show if few messages) */}
        {messages.length < 3 && (
          <div class="p-4 bg-gray-50 border-t-2 border-gray-200 flex flex-wrap gap-2">
            <div class="w-full text-sm font-bold text-gray-500 mb-1 flex items-center gap-1">
              <Sparkles size={14} /> Try asking:
            </div>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                class="text-sm bg-white border-2 border-vote-orange text-vote-orange-dark px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors font-bold disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div class="p-4 bg-white border-t-4 border-black">
          <form onSubmit={onSubmit} class="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Indian elections, EVMs, etc..."
              disabled={isLoading}
              class="flex-1 border-4 border-gray-200 rounded-full px-6 py-3 text-lg font-medium focus:outline-none focus:border-vote-green transition-colors disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              class="bg-vote-green hover:bg-vote-green-dark text-white p-3 rounded-full border-4 border-black btn-3d disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-16 h-16 flex-shrink-0"
            >
              {isLoading ? <Loader2 class="animate-spin" size={24} /> : <Send size={24} class="ml-1" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
