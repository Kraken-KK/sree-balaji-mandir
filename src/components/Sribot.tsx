import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Minimize2, X, Bot, User, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sribot-chat`;

const suggestedPrompts = [
  "What events are coming up?",
  "Show me available services",
  "How can I make a donation?",
  "Tell me about the temple history",
];

const detectLanguage = (text: string): string => {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  return 'en';
};

const Sribot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🙏 **Namaste!** I am Sribot, your divine assistant at Sree Balaji Mandir.\n\nI can help you with:\n- 🎉 **Upcoming events** & festivals\n- 🪔 **Temple services** & bookings\n- 💝 **Donations** & contributions\n- 📖 **Temple history** & guidance\n\nHow may I serve you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const hiddenRoutes = ['/auth', '/landing'];
  const shouldHide = hiddenRoutes.includes(location.pathname);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  const streamChat = async (allMessages: Message[]) => {
    const lang = allMessages.length > 1 ? detectLanguage(allMessages[allMessages.length - 1].content) : 'en';

    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        language: lang,
      }),
    });

    if (!resp.ok || !resp.body) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || `Error ${resp.status}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let assistantContent = '';

    const updateAssistant = (content: string) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.id === 'streaming') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
        }
        return [...prev, { id: 'streaming', role: 'assistant', content, timestamp: new Date() }];
      });
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            assistantContent += delta;
            updateAssistant(assistantContent);
          }
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    // Finalize the message with a real ID
    setMessages((prev) =>
      prev.map((m) => (m.id === 'streaming' ? { ...m, id: Date.now().toString() } : m))
    );
  };

  const sendMessage = async (text?: string) => {
    const msg = (text || inputMessage).trim();
    if (!msg || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      await streamChat(updatedMessages);
    } catch (error: any) {
      console.error('Sribot error:', error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: '🙏 I apologize for the difficulty. Please try again.', timestamp: new Date() },
      ]);
      toast({ title: 'Connection Issue', description: error.message, variant: 'destructive' });
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

  if (shouldHide) return null;

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
          message.role === 'assistant'
            ? 'bg-card border border-border text-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {message.role === 'assistant' ? (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1.5 [&>ul]:mb-1.5 [&>ol]:mb-1.5 [&>p:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
        <p className={`text-[10px] mt-1.5 opacity-60`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="w-4 h-4 text-foreground" />
        </div>
      )}
    </div>
  );

  const ChatBody = ({ fullHeight }: { fullHeight?: boolean }) => (
    <div className={`flex flex-col ${fullHeight ? 'flex-1' : 'h-[420px]'}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/30">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card border border-border p-3 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        {/* Suggested prompts for first message */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t bg-background/95 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask about services, events, donations..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1 rounded-full border-border"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          🙏 Powered by AI • Live temple data
        </p>
      </div>
    </div>
  );

  const Header = ({ onClose, showMinimize }: { onClose: () => void; showMinimize?: boolean }) => (
    <div className="bg-gradient-to-r from-primary to-accent text-white p-3 flex items-center justify-between rounded-t-2xl">
      <div className="flex items-center gap-2.5">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-sm leading-tight">Sribot</h3>
          <p className="text-[10px] opacity-80">Temple AI Assistant</p>
        </div>
      </div>
      <div className="flex gap-1">
        {showMinimize && (
          <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="text-white hover:bg-white/20 h-7 w-7">
            <Minimize2 className="w-3.5 h-3.5" />
          </Button>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-7 w-7">
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && isMobile && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <Header onClose={() => setIsOpen(false)} />
          <ChatBody fullHeight />
        </div>
      )}

      {isOpen && !isMobile && (
        <div className={`fixed bottom-6 right-6 w-[380px] z-50 rounded-2xl shadow-2xl border border-border overflow-hidden bg-background transition-all duration-300 ${isMinimized ? 'h-[52px]' : 'h-[500px]'}`}>
          <Header onClose={() => setIsOpen(false)} showMinimize />
          {!isMinimized && <ChatBody />}
        </div>
      )}
    </>
  );
};

export default Sribot;
