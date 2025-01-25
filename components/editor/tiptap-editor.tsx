"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import DOMPurify from "dompurify"; // For sanitizing content
import { EditorToolbar } from "./editor-toolbar";
import { ImageUploader } from "./image-uploader";

export function TiptapEditor() {
  const [editorError, setEditorError] = React.useState<string | null>(null);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline decoration-primary cursor-pointer",
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert min-h-[300px]",
      },
    },
    onCreate({ editor }) {
      try {
        console.log("Editor initialized successfully.");
      } catch (error) {
        setEditorError("Failed to initialize the editor.");
        console.error(error);
      }
    },
  });

  // Handle content sanitization before saving
  const handleSave = () => {
    if (!editor) return;
    const rawContent = editor.getHTML();
    const sanitizedContent = DOMPurify.sanitize(rawContent); // Sanitize content
    console.log("Sanitized Content:", sanitizedContent);

    // Save the sanitized content (e.g., to a database or API)
    // saveToDatabase(sanitizedContent);
  };

  if (editorError) {
    return (
      <div className="w-full max-w-4xl mx-auto text-red-500">
        <p>Error: {editorError}</p>
        <p>Please refresh the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Content */}
      <div className="min-h-[500px] w-full border rounded-lg p-4 mt-2">
        <EditorContent editor={editor} />
      </div>

      {/* Image Uploader */}
      <ImageUploader editor={editor} />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!editor}
      >
        Save Content
      </button>
    </div>
  );
}
