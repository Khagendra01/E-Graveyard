import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Import Lucide icons

interface ImgDrapDropProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function ImgDrapDrop({ files, setFiles }: ImgDrapDropProps) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const imageFiles = droppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles(imageFiles);
  };

  const handleFileImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = "image/*";
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        setFiles(Array.from(target.files));
      }
    };
    fileInput.click();
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="w-full p-6 border-2 border-dashed border-primary rounded-lg bg-background"
      >
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadIcon className="w-8 h-8 text-primary" />
            <p className="text-muted-foreground text-center">
              Drag and drop your images here, or click to import
            </p>
            <Button onClick={handleFileImport} variant="secondary">
              Import Files
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative w-full overflow-hidden bg-muted rounded-lg"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className={`w-full h-auto transition-transform duration-300`}
                  style={{ aspectRatio: "1/1", objectFit: "cover" }}
                />
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* {files.length > 0 && (
        <Button onClick={handleFileImport} variant="outline" className="mt-4">
          Add More Images
        </Button>
      )} */}
      {files.some((file) => !file.type.startsWith("image/")) && (
        <div className="mt-4 text-red-500">
          Only image files are allowed. Please remove any non-image files.
        </div>
      )}
    </div>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
