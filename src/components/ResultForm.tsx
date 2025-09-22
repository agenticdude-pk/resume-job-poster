import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Mail } from 'lucide-react';

const ResultForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const webhookUrl = 'https://n8n.dev.aioapp.com/webhook-test/9b30f1bc-4df0-40da-afa8-095877ee71aa';

  const handleGetResults = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = `${webhookUrl}?email=${encodeURIComponent(email)}`;
      
      console.log('Making GET request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json',
        },
      });

      console.log('Get results response status:', response.status);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          // Handle Excel file download
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `results-${email.split('@')[0]}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          
          toast({
            title: "Success!",
            description: "Results have been downloaded as Excel file.",
          });
        } else {
          // Handle JSON response or send email
          const responseText = await response.text();
          console.log('Get results response:', responseText);
          
          toast({
            title: "Results Sent!",
            description: `Results have been sent to ${email}. Please check your inbox.`,
          });
        }
        
        setEmail('');
      } else {
        const errorText = await response.text();
        console.error('Get results error response:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Get results error:', error);
      
      let errorMessage = "There was an error retrieving your results. Please try again.";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Network error: Please check your connection and try again.";
      } else if (error instanceof Error) {
        errorMessage = `Failed to get results: ${error.message}`;
      }
      
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            Get Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGetResults} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email to receive results"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-border/50 focus:border-primary transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-elegant"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Results...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Get Results
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultForm;