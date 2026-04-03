import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FileText, X } from "lucide-react";

interface FileUploadProps {
  pdfs: File[];
  language: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  pdfs,
  language,
  onFileChange,
  onRemoveFile,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {language === "French" ? "Documents du cours (PDFs)" : "Course Materials (PDFs)"}
      </label>
      <Input
        type="file"
        accept=".pdf"
        multiple
        className="input-field file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        onChange={onFileChange}
      />
      {pdfs.length > 0 && (
        <div className="mt-2 space-y-2">
          {pdfs.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 bg-muted/50 border border-border/60 rounded-lg"
            >
              <span className="flex items-center gap-2 text-sm text-foreground truncate">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-muted-foreground hover:text-red-500 h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
