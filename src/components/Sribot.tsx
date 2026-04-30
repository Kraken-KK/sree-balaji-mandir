import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Minimize2, X, Bot, User, ArrowLeft, Sparkles, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sribot-chat`;

const suggestedPrompts = [
  { icon: '🎉', text: 'Upcoming events' },
  { icon: '🪔', text: 'Temple services' },
  { icon: '💝', text: 'Make a donation' },
  { icon: '📖', text: 'Temple history' },
];

const detectLanguage = (text: string): string => {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  return 'en';
};

/* ====== Mesh Gradient Background ====== */
const MeshBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
    <motion.div
      className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-40"
      style={{ background: 'radial-gradient(circle, hsl(var(--saffron)) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-1/3 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30"
      style={{ background: 'radial-gradient(circle, hsl(var(--lotus)) 0%, transparent 70%)' }}
      animate={{ scale: [1.2, 1, 1.2], x: [0, -25, 0], y: [0, 30, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-35"
      style={{ background: 'radial-gradient(circle, hsl(var(--gold)) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.4, 1], x: [0, 20, 0], y: [0, -20, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-25"
      style={{ background: 'radial-gradient(circle, hsl(var(--vermillion)) 0%, transparent 70%)' }}
      animate={{ scale: [1.1, 1.3, 1.1], x: [-20, 20, -20], y: [-15, 15, -15] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
    />
  </div>
);

const Sribot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🙏 **Namaste!** I am Sribot, your divine assistant at Sree Balaji Mandir.\n\nHow may I serve you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const MessageBubble = ({ message, index }: { message: Message; index: number }) => {
    const isUser = message.role === 'user';
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: index * 0.02 }}
        className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron via-vermillion to-lotus flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/30"
            style={{ boxShadow: '0 4px 20px hsla(28, 90%, 55%, 0.4)' }}
          >
            <Bot className="w-4 h-4 text-white" />
          </motion.div>
        )}
        <div
          className={`max-w-[78%] px-4 py-2.5 backdrop-blur-xl border transition-all ${
            isUser
              ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground border-white/20 rounded-[20px] rounded-tr-md shadow-lg'
              : 'bg-white/70 dark:bg-card/70 border-white/40 dark:border-white/10 text-foreground rounded-[20px] rounded-tl-md shadow-md'
          }`}
          style={{
            boxShadow: isUser
              ? '0 8px 24px hsla(28, 80%, 50%, 0.25), inset 0 1px 0 hsla(0,0%,100%,0.2)'
              : '0 4px 20px hsla(28, 40%, 40%, 0.08), inset 0 1px 0 hsla(0,0%,100%,0.5)',
          }}
        >
          {!isUser ? (
            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1.5 [&>ul]:mb-1.5 [&>ol]:mb-1.5 [&>p:last-child]:mb-0 [&_a]:text-primary [&_a]:font-medium">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
          <p className={`text-[10px] mt-1 ${isUser ? 'opacity-70' : 'opacity-50'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {isUser && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white/30"
          >
            <User className="w-4 h-4 text-foreground" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  const ChatBody = ({ fullHeight }: { fullHeight?: boolean }) => (
    <div className={`relative flex flex-col ${fullHeight ? 'flex-1' : 'h-[440px]'}`}>
      <MeshBackground />
      <div className="relative flex-1 overflow-y-auto p-4 space-y-3 z-10">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <MessageBubble key={m.id} message={m} index={i} />
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron via-vermillion to-lotus flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/30">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div
              className="bg-white/70 dark:bg-card/70 backdrop-blur-xl border border-white/40 dark:border-white/10 px-4 py-3 rounded-[20px] rounded-tl-md shadow-md"
              style={{ boxShadow: '0 4px 20px hsla(28, 40%, 40%, 0.08)' }}
            >
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {messages.length === 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2 pt-2"
          >
            {suggestedPrompts.map((p, i) => (
              <motion.button
                key={p.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage(p.text)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-white/50 dark:border-white/10 text-xs text-foreground hover:bg-white/80 hover:border-primary/30 transition-all shadow-sm text-left"
              >
                <span className="text-base">{p.icon}</span>
                <span className="font-medium truncate">{p.text}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Prompt Bar */}
      <div className="relative z-10 p-3 pt-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative flex items-end gap-2 p-1.5 rounded-3xl bg-white/80 dark:bg-card/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl"
          style={{ boxShadow: '0 10px 40px hsla(28, 60%, 40%, 0.15), inset 0 1px 0 hsla(0,0%,100%,0.5)' }}
        >
          {/* Animated gradient border glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
            <motion.div
              className="absolute inset-[-2px] rounded-3xl opacity-40"
              style={{
                background: 'conic-gradient(from 0deg, hsl(var(--saffron)), hsl(var(--lotus)), hsl(var(--gold)), hsl(var(--vermillion)), hsl(var(--saffron)))',
                filter: 'blur(8px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <textarea
            ref={inputRef}
            placeholder="Ask Sribot anything..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            rows={1}
            className="relative flex-1 resize-none bg-transparent border-0 outline-none px-3 py-2.5 text-sm placeholder:text-muted-foreground max-h-32 min-h-[40px]"
            style={{
              scrollbarWidth: 'thin',
            }}
          />

          <motion.div className="relative flex gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-saffron via-vermillion to-lotus flex items-center justify-center text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-xl"
              style={{ boxShadow: '0 4px 16px hsla(5, 80%, 50%, 0.4)' }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> Powered by AI · Live temple data
        </p>
      </div>
    </div>
  );

  const Header = ({ onClose, showMinimize }: { onClose: () => void; showMinimize?: boolean }) => (
    <div className="relative bg-gradient-to-r from-saffron via-vermillion to-lotus text-white p-3 flex items-center justify-between rounded-t-2xl overflow-hidden">
      {/* Animated shimmer */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(0,0%,100%,0.3), transparent)' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative flex items-center gap-2.5">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ring-2 ring-white/30"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <div>
          <h3 className="font-semibold text-sm leading-tight">Sribot</h3>
          <p className="text-[10px] opacity-90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            Online · Temple AI
          </p>
        </div>
      </div>
      <div className="relative flex gap-1">
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
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron to-lotus blur-xl opacity-60"
          />
          <Button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-saffron via-vermillion to-lotus text-white shadow-2xl hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <Header onClose={() => setIsOpen(false)} />
            <ChatBody fullHeight />
          </motion.div>
        )}

        {isOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className={`fixed bottom-6 right-6 w-[400px] z-50 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden bg-background ${isMinimized ? 'h-[60px]' : 'h-[560px]'}`}
            style={{ boxShadow: '0 25px 80px hsla(28, 60%, 30%, 0.25)' }}
          >
            <Header onClose={() => setIsOpen(false)} showMinimize />
            {!isMinimized && <ChatBody />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sribot;
