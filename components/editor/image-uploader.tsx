import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Editor } from "@tiptap/react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ImageUploaderProps {
  editor: Editor | null;
}

export function ImageUploader({ editor }: ImageUploaderProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      return data.imageUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      throw error;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setErrorMessage(null);
      setIsUploading(true);

      try {
        for (const file of acceptedFiles) {
          const imageUrl = await uploadToCloudinary(file);

          if (editor && imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            toast.success("Image uploaded successfully!");
          }
        }
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [editor]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: true,
    disabled: isUploading,
  });

  return (
    <div className="mt-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground animate-spin" />
        ) : (
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground">
          {isUploading
            ? "Uploading..."
            : isDragActive
            ? "Drop images here..."
            : "Drag & drop images here, or click to select files"}
        </p>
      </div>

      {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
