
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Key, Shield, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ isOpen, onClose }) => {
  const [apiKeySource, setApiKeySource] = useState<'temple' | 'personal'>('temple');
  const [personalApiKey, setPersonalApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      if (apiKeySource === 'personal') {
        if (!personalApiKey.trim()) {
          toast({
            title: "Error",
            description: "Please enter your personal API key",
            variant: "destructive",
          });
          return;
        }
        // Store personal API key in localStorage
        localStorage.setItem('personal_gemini_api_key', personalApiKey.trim());
        localStorage.setItem('api_key_source', 'personal');
        toast({
          title: "Success",
          description: "Your personal API key has been saved securely",
        });
      } else {
        // Use temple's API key
        localStorage.removeItem('personal_gemini_api_key');
        localStorage.setItem('api_key_source', 'temple');
        toast({
          title: "Success",
          description: "Switched to temple's API key",
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentSource = () => {
    return localStorage.getItem('api_key_source') || 'temple';
  };

  React.useEffect(() => {
    if (isOpen) {
      const currentSource = getCurrentSource();
      setApiKeySource(currentSource as 'temple' | 'personal');
      if (currentSource === 'personal') {
        setPersonalApiKey(localStorage.getItem('personal_gemini_api_key') || '');
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5" />
            API Key Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <RadioGroup value={apiKeySource} onValueChange={(value) => setApiKeySource(value as 'temple' | 'personal')}>
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="temple" id="temple" className="border-white/30" />
                  <Label htmlFor="temple" className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-orange-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Temple API Key</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Use the temple's shared API key (recommended for most users)
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="personal" id="personal" className="border-white/30" />
                  <Label htmlFor="personal" className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Personal API Key</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Use your own Gemini API key for private conversations
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>

          {apiKeySource === 'personal' && (
            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-white">Your Gemini API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Gemini API key..."
                value={personalApiKey}
                onChange={(e) => setPersonalApiKey(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400">
                Get your API key from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
