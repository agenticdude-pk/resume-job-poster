import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import FileUpload from './FileUpload';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Briefcase } from 'lucide-react';

const ResumeUploadForm = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const webhookUrl = 'https://n8n.dev.aioapp.com/webhook-test/9b30f1bc-4df0-40da-afa8-095877ee71aa';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0 || !jobTitle.trim() || !jobDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields and upload at least one resume.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Add each resume file with a unique name
      selectedFiles.forEach((file, index) => {
        formData.append(`resume_${index + 1}`, file);
        console.log(`Added resume_${index + 1}:`, file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      });
      
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);
      formData.append('resumeCount', selectedFiles.length.toString());

      console.log('Sending to webhook:', {
        url: webhookUrl,
        jobTitle,
        jobDescription,
        resumeCount: selectedFiles.length,
        files: selectedFiles.map(f => f.name)
      });

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Webhook response status:', response.status);
      const responseText = await response.text();
      console.log('Webhook response:', responseText);

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your application has been submitted successfully.",
        });
        
        // Reset form
        setJobTitle('');
        setJobDescription('');
        setSelectedFiles([]);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
            <Briefcase className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Job Application</h1>
          <p className="text-lg text-muted-foreground">
            Submit your resume and job details to get started
          </p>
        </div>

        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium">
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g., Senior Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="h-12 border-border/50 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription" className="text-sm font-medium">
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Describe the job requirements, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px] border-border/50 focus:border-primary transition-colors resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Resume Upload</Label>
                <FileUpload 
                  onFileSelect={setSelectedFiles}
                  selectedFiles={selectedFiles}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-elegant"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeUploadForm;