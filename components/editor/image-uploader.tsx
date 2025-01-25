"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Editor } from "@tiptap/react";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  editor: Editor | null;
}

export function ImageUploader({ editor }: ImageUploaderProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setErrorMessage(null); // Clear any previous errors
      acceptedFiles.forEach((file) => {
        // Validate file size (e.g., max 5MB)
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxFileSize) {
          setErrorMessage(`File "${file.name}" exceeds the 5MB size limit.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          if (editor) {
            editor.chain().focus().setImage({ src: dataUrl }).run();
          }
        };
        reader.onerror = () => {
          setErrorMessage(`Failed to load file "${file.name}".`);
        };
        reader.readAsDataURL(file);
      });
    },
    [editor]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: true,
  });

  return (
    <div className="mt-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop images here..."
            : "Drag & drop images here, or click to select files"}
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
