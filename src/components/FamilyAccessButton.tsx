import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Sparkles, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FamilyAccessButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [isFamily, setIsFamily] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      if (roles?.some((r: any) => r.role === 'family')) {
        setIsFamily(true);
        setStatus('approved');
        return;
      }
      const { data: req } = await supabase
        .from('family_requests' as any)
        .select('status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (req) setStatus((req as any).status);
    })();
  }, [user]);

  const handleApply = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: request, error } = await (supabase
        .from('family_requests' as any)
        .insert({
          user_id: user.id,
          user_email: user.email!,
          user_name: user.user_metadata?.full_name || user.email!.split('@')[0],
        }) as any)
        .select()
        .single();

      if (error) throw error;

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/family-request-action`;
      const token = '552010';
      const approveUrl = `${baseUrl}?id=${(request as any).id}&action=approve&token=${token}`;
      const rejectUrl = `${baseUrl}?id=${(request as any).id}&action=reject&token=${token}`;

      await supabase.functions.invoke('send-notification-email', {
        body: {
          to: 'krakenkk54@gmail.com',
          name: 'Admin',
          type: 'family_request_admin',
          data: {
            applicantName: user.user_metadata?.full_name || user.email!.split('@')[0],
            applicantEmail: user.email,
            requestId: (request as any).id,
            approveUrl,
            rejectUrl,
          },
        },
      });

      setStatus('pending');
      toast({ title: '🙏 Application Submitted', description: 'You will be notified once reviewed.' });
      setOpen(false);
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Family Access
            {isFamily && <span className="ml-auto text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full">Family Member</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFamily ? (
            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200/50">
              <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">You are a Family member ✨</p>
                <p className="text-xs text-muted-foreground mt-1">Enjoy 20% off all temple services and a special profile ring.</p>
              </div>
            </div>
          ) : status === 'pending' ? (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-semibold text-sm">Application Pending</p>
                <p className="text-xs text-muted-foreground">Awaiting admin review.</p>
              </div>
            </div>
          ) : status === 'rejected' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <XCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm">Previous application was not approved.</p>
              </div>
              <Button onClick={() => setOpen(true)} className="w-full">Apply Again</Button>
            </div>
          ) : (
            <Button onClick={() => setOpen(true)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white border-0">
              <Users className="w-4 h-4 mr-2" /> Family
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Family Access
            </DialogTitle>
            <DialogDescription>
              Are you part of the Sree Balaji Mandir family?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-xl border border-amber-200/40">
              <p className="text-sm font-semibold mb-2">Family benefits include:</p>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 20% discount on all services</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Special Family profile ring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Priority access to events</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">An admin will review your request and notify you by email.</p>
            <Button onClick={handleApply} disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              {loading ? 'Submitting...' : 'Apply for Family Access'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FamilyAccessButton;
