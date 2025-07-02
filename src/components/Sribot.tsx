
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Minimize2, MessageCircle, User, Bot } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { sendMessageToSribot } from '@/lib/sribot-api';
import TypingText from '@/components/TypingText';
import ApiKeyDialog from '@/components/ApiKeyDialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Sribot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "🙏 Namaste! I'm Sribot, your divine assistant for Sri Balaji Temple. I can help you with events, services, donations, temple history, and guide you through our digital platform. How may I assist you today?",
    isUser: false,
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Fetch real-time events data
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch real-time services data
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check for /api-key command
    if (inputValue.trim().toLowerCase() === '/api-key') {
      setShowApiKeyDialog(true);
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Include real-time data context
      const contextualMessage = `${inputValue}

      Current temple data context:
      - Upcoming events: ${events?.slice(0, 5).map(e => `${e.name} on ${e.date} at ${e.time} (${e.location})`).join(', ') || 'No upcoming events'}
      - Available services: ${services?.slice(0, 10).map(s => `${s.name} - ₹${s.price || 0}`).join(', ') || 'No services available'}
      `;

      const response = await sendMessageToSribot(contextualMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "🙏 I apologize, but I'm experiencing some technical difficulties. Please try again in a moment or contact our temple directly for assistance.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Show upcoming events",
    "Temple services and costs", 
    "How to make donations",
    "Temple history",
    "Gallery highlights",
    "Contact information"
  ];

  return (
    <>
      {/* Floating Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`${isOpen ? 'hidden' : 'flex'} w-16 h-16 rounded-full temple-gradient hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl group ${isMobile ? 'w-14 h-14' : ''}`}
        >
          <div className="relative">
            <Sparkles className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-white group-hover:rotate-12 transition-transform`} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </Button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed z-50 ${isMobile ? 'inset-4 top-8' : 'bottom-24 right-6 w-96 max-h-[600px]'}`}>
          <Card className={`${isMobile ? 'h-full' : 'h-full max-h-[600px]'} flex flex-col shadow-2xl border-2 border-primary/20 animate-scale-in bg-gradient-to-br from-yellow-50 via-white to-orange-100 backdrop-blur-lg`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 temple-gradient text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Sribot</CardTitle>
                  <p className="text-xs opacity-90">Temple AI Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <ScrollArea 
                className="flex-1 p-4 bg-neutral-300 overflow-y-auto max-h-[400px]" 
                ref={scrollAreaRef}
              >
                <div className="space-y-4">
                  {messages.map((message, idx) => {
                    const isLatestBotMsg = !message.isUser && idx === messages.length - 1;
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.isUser 
                            ? 'bg-primary text-white' 
                            : 'temple-gradient text-white'
                        } ${isLatestBotMsg ? 'shadow-lg animate-pop' : ''}`}>
                          {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.isUser 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white'
                        } ${isLatestBotMsg ? 'shadow-lg animate-fade-in border border-yellow-300' : ''}`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {isLatestBotMsg ? (
                              <TypingText text={message.text} />
                            ) : (
                              message.text
                            )}
                          </p>
                          <p className={`text-xs mt-1 opacity-70 ${
                            message.isUser ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full temple-gradient text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-slate-100 flex-shrink-0">
                  <p className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-300">
                    Quick Actions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-xs"
                        onClick={() => setInputValue(action)}
                      >
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-accent-foreground flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about temple services, events, or type /api-key..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="temple-gradient hover:scale-105 transition-transform"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Gemini AI • Temple Assistant • Type /api-key for settings
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Key Dialog */}
      <ApiKeyDialog 
        isOpen={showApiKeyDialog} 
        onClose={() => setShowApiKeyDialog(false)} 
      />
    </>
  );
};

export default Sribot;
