import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Sparkles, Users, Mail, Plus, X, Newspaper } from 'lucide-react';

const AdminBroadcastManager = () => {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  const [sendToAll, setSendToAll] = useState(true);
  const [includeNewsletterSubs, setIncludeNewsletterSubs] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllUsers();
    fetchNewsletterSubscribers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*');
      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNewsletterSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers' as any)
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      setNewsletterSubscribers((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
    }
  };

  const generateEmailContent = async () => {
    if (!prompt.trim()) {
      toast({ title: "Prompt Required", description: "Please enter a prompt.", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('sribot-chat', {
        body: {
          message: `Generate a professional email for Sri Balaji Temple broadcast with this requirement: "${prompt}". 
          
          Please provide:
          1. A compelling subject line
          2. HTML content with warm, devotional tone
          
          Format your response as:
          SUBJECT: [subject line here]
          
          CONTENT: [HTML content here]
          
          Make it professional yet warm, suitable for a Hindu temple community.`
        }
      });

      if (error) throw error;

      const response = data.response;
      const subjectMatch = response.match(/SUBJECT:\s*(.+?)(?=\n|CONTENT:)/);
      const contentMatch = response.match(/CONTENT:\s*([\s\S]+)/);
      
      if (subjectMatch) setSubject(subjectMatch[1].trim());
      if (contentMatch) setContent(contentMatch[1].trim());

      toast({ title: "Email Generated", description: "You can edit it before sending." });
    } catch (error) {
      console.error('Error generating email:', error);
      toast({ title: "Generation Failed", description: "Failed to generate. Please write content manually.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const addCustomEmail = () => {
    if (newEmail.trim() && newEmail.includes('@') && !customEmails.includes(newEmail.trim())) {
      setCustomEmails([...customEmails, newEmail.trim()]);
      setNewEmail('');
    } else {
      toast({ title: "Invalid or duplicate email", variant: "destructive" });
    }
  };

  const sendBroadcastEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({ title: "Missing Content", description: "Please provide subject and content.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let recipients = new Set<string>(customEmails);

      // Add newsletter subscribers
      if (includeNewsletterSubs) {
        newsletterSubscribers.forEach((sub: any) => recipients.add(sub.email));
      }

      if (sendToAll) {
        const { data: authData, error: authError } = await supabase.functions.invoke('get-user-emails', {
          body: { getAllUsers: true }
        });
        if (!authError && authData?.emails) {
          authData.emails.forEach((e: string) => recipients.add(e));
        }
      }

      const recipientList = Array.from(recipients);

      if (recipientList.length === 0) {
        toast({ title: "No Recipients", description: "Add emails or select user groups.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to: recipientList,
          name: 'Temple Community',
          type: 'broadcast',
          data: { subject, content }
        }
      });

      if (error) throw error;

      toast({ title: "Broadcast Sent", description: `Email sent to ${recipientList.length} recipients.` });
      setPrompt(''); setSubject(''); setContent(''); setCustomEmails([]);
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({ title: "Send Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Generation */}
      <div className="space-y-3">
        <Label className="text-white text-sm font-medium">Generate with AI</Label>
        <div className="flex gap-2">
          <Textarea
            placeholder="Describe what to communicate (e.g. 'Announce Diwali celebration on Oct 25 with puja timings')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl"
            rows={2}
          />
          <Button onClick={generateEmailContent} disabled={generating} className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl shrink-0">
            <Sparkles className="w-4 h-4 mr-1" />
            {generating ? '...' : 'Generate'}
          </Button>
        </div>
      </div>

      {/* Email Content */}
      <div className="space-y-3">
        <div>
          <Label className="text-white text-sm">Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl" />
        </div>
        <div>
          <Label className="text-white text-sm">Content (HTML)</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="HTML email content" className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl" rows={8} />
        </div>
      </div>

      {/* Recipients */}
      <div className="space-y-3">
        <Label className="text-white text-sm font-medium">Recipients</Label>
        
        <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm">All registered users</span>
            <Badge variant="secondary" className="text-xs">{allUsers.length}</Badge>
          </div>
          <Switch checked={sendToAll} onCheckedChange={setSendToAll} />
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm">Newsletter subscribers</span>
            <Badge variant="secondary" className="text-xs">{newsletterSubscribers.length}</Badge>
          </div>
          <Switch checked={includeNewsletterSubs} onCheckedChange={setIncludeNewsletterSubs} />
        </div>

        {/* Custom Emails */}
        <div className="space-y-2">
          <Label className="text-white text-xs">Additional emails</Label>
          <div className="flex gap-2">
            <Input
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl"
              onKeyDown={(e) => e.key === 'Enter' && addCustomEmail()}
            />
            <Button onClick={addCustomEmail} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white rounded-xl">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {customEmails.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {customEmails.map((email, i) => (
                <Badge key={i} variant="secondary" className="text-xs flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {email}
                  <button onClick={() => setCustomEmails(customEmails.filter((_, idx) => idx !== i))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send */}
      <Button
        onClick={sendBroadcastEmail}
        disabled={loading || !subject.trim() || !content.trim()}
        className="w-full bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl py-3"
      >
        <Send className="w-4 h-4 mr-2" />
        {loading ? 'Sending...' : 'Send Broadcast'}
      </Button>
    </div>
  );
};

export default AdminBroadcastManager;
