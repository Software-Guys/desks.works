"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your post title"
              className="text-4xl font-bold border-none shadow-none focus-visible:ring-0 px-0"
            />
            <Input
              type="text"
              placeholder="Enter a brief description"
              className="text-lg text-muted-foreground border-none shadow-none focus-visible:ring-0 px-0"
            />
          </div>
          <TiptapEditor />
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Save as Draft</Button>
            <Button>Publish</Button>
          </div>
        </div>
      </main>
    </div>
  );
}