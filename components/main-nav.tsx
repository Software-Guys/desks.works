"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";
import { useState, useEffect } from "react";

export function MainNav() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication by verifying the token with the server
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user"); // Verifies token from HttpOnly cookie
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="font-semibold text-lg">
          desks.works
        </Link>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 flex-1">
          {["Technology", "Design", "Business", "Lifestyle"].map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === `/category/${category.toLowerCase()}`
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {category}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? <UserNav /> : (
            <Button variant="default" size="sm" onClick={() => window.location.href = "/login"}>
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
