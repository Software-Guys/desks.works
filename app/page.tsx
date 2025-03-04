import { MainNav } from "@/components/main-nav";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "@/components/footer";

export default function Home() {
  const emptyCards = Array(16).fill(null).map((_, index) => ({
    title: "Create New Blog Post",
    excerpt: "Click to start writing your next blog post",
    author: {
      name: "New Post",
      avatar: "",
    },
    category: "Start Writing",
    date: "Create Now",
    slug: "new",
    isEmpty: true,
  }));

  return (
    <main className="min-h-screen bg-background">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emptyCards.map((card, i) => (
            <BlogCard
              key={i}
              {...card}
              className="border-2 hover:border-primary"
            />
          ))}
        </div>

        <div className="fixed bottom-8 right-8 flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="bg-primary text-primary-foreground rounded-full px-4 py-2">
            More posts
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}