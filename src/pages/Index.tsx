import ResumeUploadForm from "@/components/ResumeUploadForm";
import ResultForm from "@/components/ResultForm";
import JobPostForm from "@/components/JobPostForm";

const Index = () => {
  return (
    <div className="space-y-8 p-6">
      <JobPostForm />
      <ResumeUploadForm />
      <ResultForm />
    </div>
  );
};

export default Index;
