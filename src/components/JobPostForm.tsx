import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const jobTitles = [
  "Software Engineer",
  "Frontend Developer", 
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "Mobile Developer",
  "QA Engineer"
];

const JobPostForm = () => {
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJobTitle || !jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please select a job title and provide a description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://n8n.dev.aioapp.com/webhook-test/post-job-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: selectedJobTitle,
          jobDescription: jobDescription,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job posting has been submitted successfully!",
        });
        setSelectedJobTitle("");
        setJobDescription("");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting job posting:", error);
      toast({
        title: "Error",
        description: "Failed to submit job posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>
          Select a job title and provide a detailed description
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title</Label>
            <Input
              id="job-title"
              placeholder="Enter job title"
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
            />
          </div>

          {selectedJobTitle && (
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Enter detailed job description, requirements, responsibilities..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !selectedJobTitle || !jobDescription.trim()}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;