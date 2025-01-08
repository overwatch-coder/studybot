import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
      <label className="text-sm font-medium">
        {language === "French" ? "Documents du cours (PDFs)" : "Course Materials (PDFs)"}
      </label>
      <Input
        type="file"
        accept=".pdf"
        multiple
        className="input-field"
        onChange={onFileChange}
      />
      {pdfs.length > 0 && (
        <div className="mt-2 space-y-2">
          {pdfs.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-accent/10 rounded-lg"
            >
              <span className="text-sm truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                {language === "French" ? "Supprimer" : "Remove"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;