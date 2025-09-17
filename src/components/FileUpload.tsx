import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles?: File[];
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFiles = [], className }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // Add new files to existing files
      onFileSelect([...selectedFiles, ...acceptedFiles]);
    }
    setIsDragActive(false);
  }, [onFileSelect, selectedFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    onFileSelect(updatedFiles);
  };

  const clearAllFiles = () => {
    onFileSelect([]);
  };

  return (
    <div className={cn("w-full", className)}>
      {selectedFiles.length > 0 ? (
        <div className="space-y-4">
          {/* Uploaded files list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                Uploaded Resumes ({selectedFiles.length})
              </h4>
              <button
                onClick={clearAllFiles}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                type="button"
              >
                Clear All
              </button>
            </div>
            
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="border border-success/20 bg-success/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-6 w-6 text-success flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="h-7 w-7 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-colors flex-shrink-0"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add more files dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
              isDragActive 
                ? "border-primary bg-primary/5 shadow-elegant" 
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-3">
              <div className={cn(
                "rounded-full p-3 transition-colors",
                isDragActive ? "bg-primary/10" : "bg-muted"
              )}>
                <Upload className={cn(
                  "h-6 w-6",
                  isDragActive ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium">
                  {isDragActive ? "Drop additional resumes here" : "Add more resumes"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or click to add more files
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive 
              ? "border-primary bg-primary/5 shadow-elegant" 
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "rounded-full p-4 transition-colors",
              isDragActive ? "bg-primary/10" : "bg-muted"
            )}>
              <Upload className={cn(
                "h-8 w-8",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragActive ? "Drop your resumes here" : "Upload resumes"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag & drop resumes or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOC, DOCX, TXT • Multiple files allowed (Max 10MB each)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;