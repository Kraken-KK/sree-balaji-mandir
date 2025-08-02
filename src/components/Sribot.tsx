
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Sribot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Om Namaha Shivaya! 🙏 I am Sribot, your divine spiritual assistant. I am here to help you with temple services, rituals, events, and spiritual guidance. How may I serve you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [isOpen, isMobile]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('sribot-chat', {
        body: { message: text.trim() }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, but I encountered an issue. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'My apologies, divine soul. I am experiencing some technical difficulties in connecting to the spiritual realm. Please try again in a moment. May Lord Balaji bless our connection. 🙏',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Divine Connection Issue",
        description: "Unable to connect to Sribot's spiritual guidance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Voice Input Error",
        description: "Unable to process voice input. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size={isMobile ? "default" : "lg"}
        className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full ${isMobile ? 'h-12 w-12' : 'h-14 w-14'} hover:scale-110`}
        aria-label="Open Sribot Chat"
      >
        <MessageCircle className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
      </Button>
    );
  }

  return (
    <Card className={`fixed ${isMobile ? 'inset-4 top-16' : 'bottom-6 right-6 w-96 h-[500px]'} z-50 shadow-2xl border-2 border-orange-200/30 bg-card dark:bg-gray-800 animate-scale-in flex flex-col overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-t-lg relative overflow-hidden">
        {/* Divine decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-amber-400/20"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        
        <CardTitle className="text-lg font-semibold flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <span className="text-white font-bold text-sm">🙏</span>
          </div>
          <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent font-bold">
            Sribot
          </span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 h-8 w-8 p-0 relative z-10 backdrop-blur-sm"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 p-4 max-h-none overflow-y-auto"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm transition-all duration-200 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white ml-4 shadow-md'
                      : 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 text-foreground dark:text-white mr-4 border border-orange-200/30 dark:border-gray-600'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl px-4 py-3 mr-4 flex items-center gap-2 border border-orange-200/30 dark:border-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                  <span className="text-sm text-muted-foreground dark:text-gray-300">Sribot is seeking divine wisdom...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-orange-200/30 dark:border-gray-600 p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-gray-800 dark:to-gray-700">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Sribot about temple services, rituals, or spiritual guidance..."
                disabled={isLoading}
                className="pr-12 bg-white dark:bg-gray-700 border-orange-200 dark:border-gray-600 focus:border-orange-400 focus:ring-orange-400/20 transition-colors duration-200 rounded-xl"
                maxLength={500}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={`absolute right-1 top-1 h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-gray-600 transition-colors duration-200 ${
                  isListening ? 'text-orange-500 animate-pulse' : 'text-muted-foreground hover:text-orange-600'
                }`}
                aria-label={isListening ? "Listening..." : "Voice input"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md rounded-xl"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="text-orange-500">🙏</span>
              Blessed by Divine AI
            </span>
            <span>{inputText.length}/500</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Sribot;
