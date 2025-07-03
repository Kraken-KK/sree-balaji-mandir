
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Sparkles, Users, Mail, Plus, X } from 'lucide-react';

const AdminBroadcastManager = () => {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_users_admin');
      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const generateEmailContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt for email generation.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('sribot-chat', {
        body: {
          message: `Generate a professional email for Sri Balaji Temple broadcast with this requirement: "${prompt}". 
          
          Please provide:
          1. A compelling subject line
          2. HTML content that matches our temple email format with warm, devotional tone
          
          Format your response as:
          SUBJECT: [subject line here]
          
          CONTENT: [HTML content here - make it engaging and include temple-appropriate emojis and styling]
          
          Make it professional yet warm, and suitable for a Hindu temple community.`
        }
      });

      if (error) throw error;

      const response = data.response;
      
      // Parse the AI response
      const subjectMatch = response.match(/SUBJECT:\s*(.+?)(?=\n|CONTENT:)/);
      const contentMatch = response.match(/CONTENT:\s*([\s\S]+)/);
      
      if (subjectMatch) {
        setSubject(subjectMatch[1].trim());
      }
      
      if (contentMatch) {
        setContent(contentMatch[1].trim());
      }

      toast({
        title: "Email Generated",
        description: "AI has generated your email content. You can edit it before sending.",
      });
    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate email content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const addCustomEmail = () => {
    if (newEmail.trim() && newEmail.includes('@')) {
      setCustomEmails([...customEmails, newEmail.trim()]);
      setNewEmail('');
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  const removeCustomEmail = (index: number) => {
    setCustomEmails(customEmails.filter((_, i) => i !== index));
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const sendBroadcastEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide subject and content for the email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let recipients: string[] = [...customEmails];

      if (sendToAll) {
        // Get all user emails from auth.users via edge function
        const { data: authData, error: authError } = await supabase.functions.invoke('get-user-emails', {
          body: { getAllUsers: true }
        });

        if (!authError && authData?.emails) {
          recipients = [...recipients, ...authData.emails];
        }
      } else {
        // Get selected user emails
        const { data: authData, error: authError } = await supabase.functions.invoke('get-user-emails', {
          body: { userIds: selectedUsers }
        });

        if (!authError && authData?.emails) {
          recipients = [...recipients, ...authData.emails];
        }
      }

      if (recipients.length === 0) {
        toast({
          title: "No Recipients",
          description: "Please add email addresses or select users to send to.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to: recipients,
          name: 'Temple Community',
          type: 'broadcast',
          data: {
            subject,
            content
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Broadcast Sent",
        description: `Email sent successfully to ${recipients.length} recipients.`,
      });

      // Reset form
      setPrompt('');
      setSubject('');
      setContent('');
      setCustomEmails([]);
      setSelectedUsers([]);

    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send broadcast email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="w-5 h-5" />
            Email Broadcast Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Generation Section */}
          <div className="space-y-4">
            <Label className="text-white">Generate Email with AI</Label>
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe what you want to communicate (e.g. 'Announce new Diwali celebration event on October 25th with special puja timings')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-white/10 border border-white/20 text-white placeholder-gray-400"
                rows={3}
              />
              <Button
                onClick={generateEmailContent}
                disabled={generating}
                className="bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>

          {/* Email Content Section */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-white">Email Subject</Label>
              <Input
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-white/10 border border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label className="text-white">Email Content (HTML)</Label>
              <Textarea
                placeholder="Enter HTML email content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-white/10 border border-white/20 text-white placeholder-gray-400"
                rows={10}
              />
            </div>
          </div>

          {/* Recipients Section */}
          <div className="space-y-4">
            <Label className="text-white">Recipients</Label>
            
            {/* Send to All Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendToAll"
                checked={sendToAll}
                onChange={(e) => setSendToAll(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="sendToAll" className="text-white">
                Send to all registered users
              </Label>
              <Badge variant="secondary">
                <Users className="w-3 h-3 mr-1" />
                {allUsers.length} users
              </Badge>
            </div>

            {/* Custom Emails */}
            <div className="space-y-2">
              <Label className="text-white">Additional Email Addresses</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomEmail()}
                />
                <Button onClick={addCustomEmail} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {customEmails.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {email}
                    <button onClick={() => removeCustomEmail(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={sendBroadcastEmail}
            disabled={loading || !subject.trim() || !content.trim()}
            className="w-full bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Sending...' : 'Send Broadcast Email'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBroadcastManager;
