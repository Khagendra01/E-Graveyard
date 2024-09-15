import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Import Lucide icons

interface ImgDrapDropProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export function ImgDrapDrop({ file, setFile }: ImgDrapDropProps) {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleFileImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setFile(target.files[0]);
      }
    };
    fileInput.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="w-full p-6 border-2 border-dashed border-primary rounded-lg bg-background"
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadIcon className="w-8 h-8 text-primary" />
            <p className="text-muted-foreground text-center">
              Drag and drop your image here, or click to import
            </p>
            <Button onClick={handleFileImport} variant="secondary">
              Import File
            </Button>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden bg-muted rounded-lg">
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
                onClick={handleRemoveFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {file && !file.type.startsWith("image/") && (
        <div className="mt-4 text-red-500">
          Only image files are allowed. Please remove the non-image file.
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