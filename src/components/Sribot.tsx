
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Minimize2, X, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToGemini } from '@/lib/gemini-fallback';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Sribot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🙏 Namaste! I am Sribot, your divine assistant at Sri Balaji Temple. How may I help you today? You can ask me about temple services, upcoming events, donation information, or any spiritual guidance you need.',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any>({
    events: [],
    services: [],
    lastUpdated: null
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Hide Sribot on authentication and landing pages
  const hiddenRoutes = ['/auth', '/landing', '/signup'];
  const shouldHide = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Fetch real-time data every 30 seconds
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const [eventsResponse, servicesResponse] = await Promise.all([
          supabase.from('events').select('*').order('date', { ascending: true }).limit(10),
          supabase.from('services').select('*').order('created_at', { ascending: false }).limit(10)
        ]);

        setRealTimeData({
          events: eventsResponse.data || [],
          services: servicesResponse.data || [],
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const enhanceMessageWithRealTimeData = (message: string) => {
    const currentEvents = realTimeData.events
      .filter((event: any) => new Date(event.date) >= new Date())
      .slice(0, 5);
    
    const availableServices = realTimeData.services.slice(0, 8);

    const contextData = `
    Current Real-Time Temple Information (Last Updated: ${realTimeData.lastUpdated?.toLocaleTimeString()}):

    UPCOMING EVENTS:
    ${currentEvents.map((event: any) => 
      `- ${event.name}: ${new Date(event.date).toLocaleDateString()} at ${event.time} (Location: ${event.location})`
    ).join('\n')}

    AVAILABLE SERVICES:
    ${availableServices.map((service: any) => 
      `- ${service.name}: ₹${service.price} ${service.description ? `(${service.description})` : ''}`
    ).join('\n')}

    User Question: ${message}
    
    Please provide specific, accurate information based on the real-time data above. If asked about events or services, use the exact information provided.
    `;

    return contextData;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const enhancedMessage = enhanceMessageWithRealTimeData(inputMessage.trim());
      
      // Try Supabase function first
      let botResponse: string;
      try {
        const { data, error } = await supabase.functions.invoke('sribot-chat', {
          body: { message: enhancedMessage }
        });

        if (error) throw error;
        botResponse = data.response;
      } catch (supabaseError) {
        console.log('Supabase failed, using Gemini fallback:', supabaseError);
        botResponse = await sendMessageToGemini(enhancedMessage);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '🙏 I apologize for the technical difficulty. Please try again or contact our temple directly for assistance.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Issue",
        description: "Unable to connect to Sribot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (shouldHide) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full temple-gradient text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)'
          }}
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-96 transition-all duration-300 z-50 shadow-2xl border-2 border-orange-200/50 ${
          isMinimized ? 'h-16' : 'h-[500px]'
        }`}>
          <CardHeader className="temple-gradient text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                Sribot - Temple Assistant
                {realTimeData.lastUpdated && (
                  <span className="text-xs opacity-75">
                    (Live Data)
                  </span>
                )}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 w-8 h-8 p-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[436px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-orange-50 to-yellow-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isBot && (
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[280px] p-3 rounded-2xl shadow-md ${
                        message.isBot
                          ? 'bg-white border border-orange-100 text-gray-800'
                          : 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-2 opacity-70 ${message.isBot ? 'text-gray-500' : 'text-orange-100'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!message.isBot && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-orange-100 p-3 rounded-2xl shadow-md">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        <span className="text-sm text-gray-600">Sribot is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask me about temple services, events, or guidance..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 border border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="temple-gradient text-white hover:shadow-lg transition-all duration-200 px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  🙏 Powered by divine AI • Real-time temple data
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default Sribot;
